/** Helpers puros do painel de orçamentos (admin). */

export const orderRef = (id: string) => id.slice(0, 8).toUpperCase();

export const quoteLink = (origin: string, token: string) => `${origin}/orcamento/${token}`;

/** Número PT para wa.me: só dígitos, com 351 uma única vez. */
export function whatsappNumber(phone: string): string {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("351") && d.length > 9) d = d.slice(3);
  return `351${d}`;
}

export function formatValidUntil(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function quoteWhatsappMessage(o: { name: string; ref: string; link: string; validUntil: string }): string {
  return `Olá ${o.name}! O seu orçamento Marisca #${o.ref} está pronto: ${o.link} . Válido até ${formatValidUntil(
    o.validUntil,
  )}. Qualquer dúvida, responda a esta mensagem.`;
}

export const whatsappUrl = (phone: string, text: string) =>
  `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(text)}`;

export const parseDecimal = (v: string) => Number(v.replace(",", ".").trim());

export interface QuoteItemInput {
  item_id: string;
  unit_price: string;
  estimated_qty: string;
}

export interface SendQuoteForm {
  orderId: string;
  items: QuoteItemInput[];
  deliveryFee: string;
  deliveryDate: string;
  deliverySlot: string;
  paymentOptions: string[];
  message: string;
}

/** Valida e monta os argumentos de send_quote; devolve erro PT-PT se faltar algo. */
export function buildSendQuoteArgs(f: SendQuoteForm):
  | { ok: true; args: Record<string, unknown> }
  | { ok: false; error: string } {
  if (f.items.length === 0) return { ok: false, error: "O pedido não tem produtos." };
  const items = [];
  for (const i of f.items) {
    const price = parseDecimal(i.unit_price);
    const qty = parseDecimal(i.estimated_qty);
    if (!i.unit_price.trim() || !Number.isFinite(price) || price <= 0)
      return { ok: false, error: "Indique o preço de todos os produtos." };
    if (!i.estimated_qty.trim() || !Number.isFinite(qty) || qty <= 0)
      return { ok: false, error: "Indique o peso estimado de todos os produtos." };
    items.push({ item_id: i.item_id, unit_price: price, estimated_qty: qty });
  }
  const fee = f.deliveryFee.trim() === "" ? 0 : parseDecimal(f.deliveryFee);
  if (!Number.isFinite(fee) || fee < 0) return { ok: false, error: "Taxa de entrega inválida." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.deliveryDate)) return { ok: false, error: "Escolha a data de entrega." };
  if (!f.deliverySlot.trim()) return { ok: false, error: "Indique o horário de entrega." };
  if (f.paymentOptions.length === 0) return { ok: false, error: "Escolha pelo menos uma forma de pagamento." };
  return {
    ok: true,
    args: {
      _order_id: f.orderId,
      _items: items,
      _delivery_fee: fee,
      _delivery_date: f.deliveryDate,
      _delivery_slot: f.deliverySlot.trim(),
      _payment_options: f.paymentOptions,
      _message: f.message.trim(),
    },
  };
}

export const canSendQuote = (status: string) => status === "pendente" || status === "orcamento_enviado";
export const canWeigh = (status: string) => status === "aceite" || status === "preparado";
