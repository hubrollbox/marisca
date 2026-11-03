import { FunctionsHttpError } from "@supabase/supabase-js";

/** Resposta da função get-quote (valores calculados no servidor; o cliente só os mostra). */
export type PaymentMethod = "online" | "entrega";

export interface QuoteItem {
  name: string;
  unit: "kg" | "un" | string;
  state: "CRU" | "COZIDO" | string;
  requested: number;
  estimatedQty: number | null;
  unitPrice: number | null;
  finalQty: number | null;
  lineTotal: number | null;
}

export interface Quote {
  orderRef: string;
  status: string;
  canAccept: boolean;
  validUntil: string | null;
  message: string | null;
  items: QuoteItem[];
  deliveryFee: number | null;
  estimatedTotal: number | null;
  finalTotal: number | null;
  weightTolerancePct: number | null;
  deliveryDate: string | null;
  deliverySlot: string | null;
  paymentOptions: string[];
  paymentMethod: string | null;
  paymentStatus: string | null;
}

export const PAYMENT_OPTION_LABELS: Record<PaymentMethod, string> = {
  online: "Online (enviamos o link de pagamento depois da pesagem)",
  entrega: "Na entrega",
};

export const PAYMENT_METHOD_SHORT: Record<PaymentMethod, string> = {
  online: "Online",
  entrega: "Na entrega",
};

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "online" || value === "entrega";
}

/** Só as formas de pagamento conhecidas que o servidor oferece, sem repetições. */
export function availablePaymentOptions(options: unknown): PaymentMethod[] {
  if (!Array.isArray(options)) return [];
  return [...new Set(options.filter(isPaymentMethod))];
}

/** Rótulo da forma de pagamento; valor desconhecido mostra-se tal como vem. */
export function paymentMethodLabel(method: string | null | undefined): string {
  if (!method) return "por escolher";
  return isPaymentMethod(method) ? PAYMENT_METHOD_SHORT[method] : method;
}

const eur = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
export function formatEur(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? eur.format(value) : "—";
}

export function formatQty(value: number | null | undefined, unit: string): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `${value.toLocaleString("pt-PT", { maximumFractionDigits: 3 })} ${unit}`;
}

/** "Válido até DD/MM HH:mm" na hora de Lisboa. */
export function formatValidUntil(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `Válido até ${get("day")}/${get("month")} ${get("hour")}:${get("minute")}`;
}

/** Data de entrega "AAAA-MM-DD" → "segunda-feira, 2 de novembro" (sem desvio de fuso). */
export function formatDeliveryDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return date;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });
}

/** Subtotal da linha: o final se existir; senão preço × quantidade estimada. */
export function lineSubtotal(item: QuoteItem): { value: number | null; isFinal: boolean } {
  if (typeof item.lineTotal === "number") return { value: item.lineTotal, isFinal: true };
  if (typeof item.unitPrice === "number" && typeof item.estimatedQty === "number") {
    return { value: Math.round(item.unitPrice * item.estimatedQty * 100) / 100, isFinal: false };
  }
  return { value: null, isFinal: false };
}

export const weightToleranceText = (pct: number | null | undefined) =>
  `O valor final é calculado pelo peso real depois de pesarmos (preço por kg × peso pesado). O peso pode variar até ±${pct ?? 10}% face ao estimado. O total acima é uma estimativa.`;

export const pendingQuoteText = (ref: string) =>
  `Pedido #${ref} recebido. Ainda estamos a preparar o orçamento.`;

export const EXPIRED_QUOTE_TEXT = "Este orçamento expirou. Peça um novo.";
export const ACCEPT_WARNING = "Ao aceitar, fica obrigado a pagar o valor final.";

/** Erro de uma função com o código HTTP e a mensagem PT-PT que ela devolve ({ error }). */
export class QuoteError extends Error {
  constructor(message: string, public status: number | null) {
    super(message);
  }
}

export async function toQuoteError(error: unknown, fallback: string): Promise<QuoteError> {
  if (error instanceof FunctionsHttpError) {
    const res = error.context as Response;
    let message = fallback;
    try {
      const body = await res.clone().json();
      if (typeof body?.error === "string") message = body.error;
    } catch {
      // resposta sem JSON
    }
    return new QuoteError(message, typeof res?.status === "number" ? res.status : null);
  }
  return new QuoteError(fallback, null);
}

/** 409/410: o orçamento mudou ou expirou — é preciso recarregá-lo. */
export const shouldReloadAfterAcceptError = (status: number | null) => status === 409 || status === 410;
