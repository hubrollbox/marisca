// Regras de preço e venda da Marisca.
// ATENÇÃO: existe uma cópia idêntica em supabase/functions/_shared/pricing.ts
// (usada pela função de pagamento). Um teste garante que as duas dão os mesmos resultados.

export const FREE_DELIVERY_THRESHOLD = 30;
export const DELIVERY_FEE = 4.99;
export const PRODUCT_STATES = ["CRU", "COZIDO"] as const;
export type ProductState = (typeof PRODUCT_STATES)[number];

export function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calcDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function calcTotals(lines: Array<{ price: number; quantity: number }>) {
  const subtotal = roundCents(lines.reduce((sum, l) => sum + l.price * l.quantity, 0));
  const deliveryFee = calcDeliveryFee(subtotal);
  return { subtotal, deliveryFee, total: roundCents(subtotal + deliveryFee) };
}

export function isValidState(state: unknown): state is ProductState {
  return typeof state === "string" && (PRODUCT_STATES as readonly string[]).includes(state);
}

/** Datas no formato "MM-DD", repetidas todos os anos. Suporta períodos que passam o fim do ano. */
export function isInClosedSeason(
  start: string | null | undefined,
  end: string | null | undefined,
  day: Date = new Date(),
): boolean {
  const re = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!start || !end || !re.test(start) || !re.test(end)) return false;
  const mm = String(day.getMonth() + 1).padStart(2, "0");
  const dd = String(day.getDate()).padStart(2, "0");
  const today = `${mm}-${dd}`;
  return start <= end ? today >= start && today <= end : today >= start || today <= end;
}

export type SaleBlock = "unavailable" | "closed_season" | "out_of_stock" | "insufficient_stock" | null;

/** Diz se uma quantidade de um produto pode ser vendida. Stock nulo = não controlado. */
export function saleBlock(
  product: {
    available: boolean;
    stock?: number | null;
    closed_season_start?: string | null;
    closed_season_end?: string | null;
  },
  quantity: number,
  day: Date = new Date(),
): SaleBlock {
  if (!product.available) return "unavailable";
  if (isInClosedSeason(product.closed_season_start, product.closed_season_end, day)) return "closed_season";
  if (product.stock !== null && product.stock !== undefined) {
    if (product.stock <= 0) return "out_of_stock";
    if (quantity > product.stock) return "insufficient_stock";
  }
  return null;
}

export const SALE_BLOCK_LABELS: Record<Exclude<SaleBlock, null>, string> = {
  unavailable: "Indisponível",
  closed_season: "Em defeso",
  out_of_stock: "Esgotado",
  insufficient_stock: "Stock insuficiente",
};
