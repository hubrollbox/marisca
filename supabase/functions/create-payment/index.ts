import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";
import { calcTotals, roundCents, saleBlock, SALE_BLOCK_LABELS, PRODUCT_STATES } from "../_shared/pricing.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---------- Rate limiting (memória da instância) ----------
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  for (const [k, v] of rateLimitStore) if (v.resetTime <= now) rateLimitStore.delete(k);
  const entry = rateLimitStore.get(ip);
  if (!entry) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

function getClientIP(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------- Validação: o cliente só envia id, quantidade e estado ----------
const BodySchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
        state: z.enum(PRODUCT_STATES),
      }),
    )
    .min(1)
    .max(50),
  deliveryAddress: z.object({
    name: z.string().trim().min(1).max(100),
    street: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().regex(/^\d{4}-\d{3}$/),
    phone: z.string().trim().regex(/^[0-9\s+\-()]+$/).min(9).max(20),
  }),
  deliveryTimeSlot: z.string().trim().min(1).max(50),
  notes: z.string().trim().max(500).optional(),
  guestEmail: z.string().trim().email().max(255).optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não suportado" }, 405);

  const ip = getClientIP(req);
  if (!checkRateLimit(ip)) {
    return json({ error: "Muitas tentativas. Tente novamente dentro de um minuto." }, 429);
  }

  try {
    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return json({ error: "Dados da encomenda inválidos", details: parsed.error.flatten().fieldErrors }, 400);
    }
    const body = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anon = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "");
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: { persistSession: false },
    });

    // Utilizador autenticado (opcional)
    let user: { id: string; email?: string } | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const { data } = await anon.auth.getUser(authHeader.replace("Bearer ", ""));
      if (data?.user) user = { id: data.user.id, email: data.user.email ?? undefined };
    }

    const customerEmail = user?.email || body.guestEmail;
    if (!customerEmail) return json({ error: "Email é obrigatório" }, 400);

    // Juntar linhas repetidas (mesmo produto + estado)
    const merged = new Map<string, { id: string; state: string; quantity: number }>();
    for (const it of body.items) {
      const key = `${it.id}:${it.state}`;
      const prev = merged.get(key);
      merged.set(key, { ...it, quantity: (prev?.quantity ?? 0) + it.quantity });
    }
    const lines = [...merged.values()];

    // Preço, stock, disponibilidade e defeso vêm SEMPRE da base de dados
    const ids = [...new Set(lines.map((l) => l.id))];
    const { data: products, error: productsError } = await admin.from("products").select("*").in("id", ids);
    if (productsError) throw productsError;

    const byId = new Map((products ?? []).map((p: any) => [p.id, p]));
    const problems: Array<{ id: string; name: string; reason: string }> = [];
    const qtyByProduct = new Map<string, number>();
    for (const l of lines) qtyByProduct.set(l.id, (qtyByProduct.get(l.id) ?? 0) + l.quantity);

    for (const [id, qty] of qtyByProduct) {
      const p = byId.get(id);
      if (!p) {
        problems.push({ id, name: "Produto", reason: "Indisponível" });
        continue;
      }
      const block = saleBlock(p, qty);
      if (block) problems.push({ id, name: p.name, reason: SALE_BLOCK_LABELS[block] });
    }
    for (const l of lines) {
      const p = byId.get(l.id);
      if (p && Array.isArray(p.states) && !p.states.includes(l.state)) {
        problems.push({ id: l.id, name: p.name, reason: `Não disponível ${l.state.toLowerCase()}` });
      }
    }
    if (problems.length > 0) {
      return json({ error: "Alguns produtos já não podem ser comprados", problems }, 409);
    }

    const priced = lines.map((l) => {
      const p = byId.get(l.id)!;
      return { ...l, name: p.name as string, price: roundCents(Number(p.price)) };
    });
    const { subtotal, deliveryFee, total } = calcTotals(priced);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    const customerId =
      customers.data[0]?.id ?? (await stripe.customers.create({ email: customerEmail })).id;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.map((l) => ({
      price_data: {
        currency: "eur",
        product_data: { name: `${l.name} (${l.state === "CRU" ? "Cru" : "Cozido"})` },
        unit_amount: Math.round(l.price * 100),
      },
      quantity: l.quantity,
    }));
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: { currency: "eur", product_data: { name: "Taxa de entrega" }, unit_amount: Math.round(deliveryFee * 100) },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") ?? "https://marisca.lovable.app";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelado=1`,
      payment_method_types: ["card"],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata: { user_id: user?.id ?? "guest" },
    });

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        guest_email: user ? null : body.guestEmail ?? null,
        status: "pendente",
        total_amount: total,
        delivery_fee: deliveryFee,
        delivery_address: body.deliveryAddress,
        delivery_time_slot: body.deliveryTimeSlot,
        notes: body.notes ?? null,
        stripe_session_id: session.id,
        payment_status: "pending",
      })
      .select("id")
      .single();
    if (orderError) throw orderError;

    const { error: itemsError } = await admin.from("order_items").insert(
      priced.map((l) => ({
        order_id: order.id,
        product_id: l.id,
        quantity: l.quantity,
        state: l.state,
        unit_price: l.price,
      })),
    );
    if (itemsError) throw itemsError;

    console.log("[PAYMENT_CREATED]", { orderId: order.id, subtotal, deliveryFee, total });
    return json({ url: session.url, order_id: order.id });
  } catch (error) {
    console.error("[PAYMENT_ERROR]", error instanceof Error ? error.message : error);
    return json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, 500);
  }
});
