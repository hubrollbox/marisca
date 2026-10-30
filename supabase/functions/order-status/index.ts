import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";

// Devolve o resumo de uma encomenda a partir do id da sessão Stripe.
// Só leitura; não devolve morada nem email.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const BodySchema = z.object({ session_id: z.string().regex(/^cs_[A-Za-z0-9_]{10,255}$/) });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Sessão inválida" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false },
  });

  const { data: order, error } = await admin
    .from("orders")
    .select("id, status, payment_status, total_amount, delivery_fee, delivery_time_slot, created_at, order_items(quantity, state, unit_price, products(name))")
    .eq("stripe_session_id", parsed.data.session_id)
    .maybeSingle();

  if (error) {
    console.error("[ORDER_STATUS_ERROR]", error.message);
    return json({ error: "Erro ao obter encomenda" }, 500);
  }
  if (!order) return json({ error: "Encomenda não encontrada" }, 404);

  return json({
    id: order.id,
    reference: order.id.slice(0, 8).toUpperCase(),
    status: order.status,
    payment_status: order.payment_status,
    total_amount: Number(order.total_amount),
    delivery_fee: Number(order.delivery_fee),
    delivery_time_slot: order.delivery_time_slot,
    items: (order.order_items ?? []).map((i: any) => ({
      name: i.products?.name ?? "Produto",
      quantity: i.quantity,
      state: i.state,
      unit_price: Number(i.unit_price),
    })),
  });
});
