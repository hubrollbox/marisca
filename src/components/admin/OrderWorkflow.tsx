import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Loader2, MessageCircle, Scale, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { AdminOrder } from "@/hooks/use-admin-data";
import {
  buildSendQuoteArgs,
  canSendQuote,
  canWeigh,
  orderRef,
  parseDecimal,
  quoteLink,
  quoteWhatsappMessage,
  whatsappUrl,
} from "@/lib/admin-quote";

const eur = (n: number | null | undefined) => `€${Number(n ?? 0).toFixed(2).replace(".", ",")}`;
const errMsg = (e: unknown) => (e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Erro inesperado.");
// RPCs do backend externo ainda não constam dos tipos gerados
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rpc = (name: string, args: Record<string, unknown>) => (supabase as any).rpc(name, args);

interface Props {
  order: AdminOrder;
  onChanged: () => void;
}

export function OrderWorkflow({ order, onChanged }: Props) {
  return (
    <div className="space-y-4">
      {canSendQuote(order.status) && <QuoteForm order={order} onChanged={onChanged} />}
      {order.quote_token && <QuoteShare order={order} />}
      {canWeigh(order.status) && <WeighForm order={order} onChanged={onChanged} />}
      {order.final_total != null && (
        <p className="font-semibold">Total final: {eur(order.final_total)}</p>
      )}
      <CloseOrder order={order} onChanged={onChanged} />
    </div>
  );
}

function QuoteForm({ order, onChanged }: Props) {
  const [items, setItems] = useState(
    order.order_items.map((i) => ({
      item_id: i.id,
      unit_price: i.unit_price != null ? String(i.unit_price) : "",
      estimated_qty: i.estimated_qty != null ? String(i.estimated_qty) : "",
    })),
  );
  const [fee, setFee] = useState(order.delivery_fee != null ? String(order.delivery_fee) : "");
  const [date, setDate] = useState(order.delivery_date ?? "");
  const [slot, setSlot] = useState(order.delivery_time_slot ?? "");
  const [options, setOptions] = useState<string[]>(order.payment_options ?? ["online", "entrega"]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const toggle = (v: string) => setOptions((o) => (o.includes(v) ? o.filter((x) => x !== v) : [...o, v]));
  const setItem = (idx: number, key: "unit_price" | "estimated_qty", v: string) =>
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [key]: v } : it)));

  const submit = async () => {
    const built = buildSendQuoteArgs({
      orderId: order.id,
      items,
      deliveryFee: fee,
      deliveryDate: date,
      deliverySlot: slot,
      paymentOptions: options,
      message,
    });
    if (!built.ok) {
      toast({ title: built.error, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await rpc("send_quote", built.args);
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível enviar o orçamento", description: errMsg(error), variant: "destructive" });
      return;
    }
    toast({ title: `Orçamento #${orderRef(order.id)} enviado` });
    onChanged();
  };

  return (
    <section className="rounded-md border p-3 space-y-3" aria-label="Orçamento">
      <h4 className="font-semibold">{order.status === "orcamento_enviado" ? "Rever orçamento" : "Criar orçamento"}</h4>
      {order.order_items.map((it, idx) => {
        const unit = it.unit === "un" ? "un" : "kg";
        return (
          <div key={it.id} className="space-y-1">
            <p className="text-sm font-medium">
              {it.quantity}× {it.product_name ?? "Produto"} ({it.state === "COZIDO" ? "Cozido" : "Cru"})
              {it.customer_note && <span className="text-muted-foreground italic"> · “{it.customer_note}”</span>}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`p-${it.id}`} className="text-xs">Preço por {unit} (€)</Label>
                <Input id={`p-${it.id}`} inputMode="decimal" value={items[idx].unit_price} onChange={(e) => setItem(idx, "unit_price", e.target.value)} />
              </div>
              <div>
                <Label htmlFor={`q-${it.id}`} className="text-xs">Estimado ({unit})</Label>
                <Input id={`q-${it.id}`} inputMode="decimal" value={items[idx].estimated_qty} onChange={(e) => setItem(idx, "estimated_qty", e.target.value)} />
              </div>
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`fee-${order.id}`} className="text-xs">Taxa de entrega (€)</Label>
          <Input id={`fee-${order.id}`} inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} />
        </div>
        <div>
          <Label htmlFor={`date-${order.id}`} className="text-xs">Data de entrega</Label>
          <Input id={`date-${order.id}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor={`slot-${order.id}`} className="text-xs">Horário</Label>
        <Input id={`slot-${order.id}`} placeholder="ex.: 10:00–12:00" value={slot} onChange={(e) => setSlot(e.target.value)} />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-xs font-medium">Formas de pagamento</legend>
        {[
          ["online", "Online"],
          ["entrega", "Na entrega"],
        ].map(([v, l]) => (
          <label key={v} className="flex items-center gap-2 text-sm min-h-11">
            <Checkbox checked={options.includes(v)} onCheckedChange={() => toggle(v)} />
            {l}
          </label>
        ))}
      </fieldset>
      <div>
        <Label htmlFor={`msg-${order.id}`} className="text-xs">Mensagem (opcional)</Label>
        <Textarea id={`msg-${order.id}`} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <Button onClick={submit} disabled={busy} className="w-full min-h-11">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Enviar orçamento
      </Button>
    </section>
  );
}

function QuoteShare({ order }: { order: AdminOrder }) {
  const link = quoteLink(window.location.origin, order.quote_token!);
  const phone = order.customer_phone ?? order.delivery_address?.phone ?? "";
  const name = order.customer_name ?? order.delivery_address?.name ?? "";
  const text = quoteWhatsappMessage({
    name,
    ref: orderRef(order.id),
    link,
    validUntil: order.quote_valid_until ?? new Date().toISOString(),
  });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copiado" });
    } catch {
      toast({ title: "Não foi possível copiar", description: link });
    }
  };
  return (
    <section className="rounded-md border p-3 space-y-2" aria-label="Link do orçamento">
      <p className="text-xs text-muted-foreground">Link do orçamento</p>
      <p className="text-sm break-all">{link}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="min-h-11" onClick={copy}>
          <Copy className="h-4 w-4" /> Copiar
        </Button>
        {phone && (
          <Button size="sm" variant="outline" className="min-h-11" asChild>
            <a href={whatsappUrl(phone, text)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}

function WeighForm({ order, onChanged }: Props) {
  const [weights, setWeights] = useState<Record<string, string>>(
    Object.fromEntries(order.order_items.map((i) => [i.id, i.final_qty != null ? String(i.final_qty) : ""])),
  );
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    for (const it of order.order_items) {
      const v = parseDecimal(weights[it.id] ?? "");
      if (!Number.isFinite(v) || v <= 0) {
        toast({ title: "Indique o peso final de todos os produtos.", variant: "destructive" });
        return;
      }
    }
    setBusy(true);
    try {
      for (const it of order.order_items) {
        const { error } = await supabase
          .from("order_items")
          .update({ final_qty: parseDecimal(weights[it.id]) } as never)
          .eq("id", it.id);
        if (error) throw error;
      }
      const { data, error } = await rpc("finalize_order_weights", { _order_id: order.id });
      if (error) throw error;
      toast({ title: `Total final: ${eur(Number(data))}` });
      onChanged();
    } catch (e) {
      toast({ title: "Não foi possível calcular o total", description: errMsg(e), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-md border p-3 space-y-3" aria-label="Pesagem">
      <h4 className="font-semibold">Pesagem</h4>
      {order.order_items.map((it) => {
        const unit = it.unit === "un" ? "un" : "kg";
        return (
          <div key={it.id}>
            <Label htmlFor={`w-${it.id}`} className="text-xs">
              {it.product_name ?? "Produto"} ({it.state === "COZIDO" ? "Cozido" : "Cru"}) · final ({unit})
              {it.estimated_qty != null && ` · estimado ${it.estimated_qty}`}
            </Label>
            <Input
              id={`w-${it.id}`}
              inputMode="decimal"
              value={weights[it.id] ?? ""}
              onChange={(e) => setWeights((w) => ({ ...w, [it.id]: e.target.value }))}
            />
          </div>
        );
      })}
      <Button onClick={submit} disabled={busy} className="w-full min-h-11">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
        Calcular total final
      </Button>
    </section>
  );
}

function CloseOrder({ order, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  if (order.status === "entregue" || order.status === "cancelado" || order.status === "expirado") return null;
  if (!["pesado", "preparado", "em_entrega"].includes(order.status)) return null;

  if (order.payment_method === "online") {
    return <p className="text-sm text-muted-foreground">Link de pagamento: em breve</p>;
  }

  const close = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: "entregue", payment_status: "paid", payment_method: "entrega" } as never)
      .eq("id", order.id);
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível fechar o pedido", description: errMsg(error), variant: "destructive" });
      return;
    }
    toast({ title: `Pedido #${orderRef(order.id)} entregue e pago` });
    onChanged();
  };

  return (
    <Button onClick={close} disabled={busy} variant="outline" className="w-full min-h-11">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
      Marcar entregue e pago na entrega
    </Button>
  );
}
