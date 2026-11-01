// Regras de apresentação do catálogo público (lista por categoria, sem preços).
import { saleBlock, SALE_BLOCK_LABELS, type ProductState } from "@/lib/pricing";

export const STATE_LABELS: Record<ProductState, string> = { CRU: "Cru", COZIDO: "Cozido" };

/** Texto mostrado em vez de qualquer preço nas páginas públicas. */
export const PRICE_ON_QUOTE = "Preço sob orçamento";

/** Ordem fixa das categorias; as restantes aparecem depois, por ordem alfabética. */
export const CATEGORY_ORDER = ["Crustáceos", "Moluscos", "Bivalves", "Peixes"] as const;

/** Grupo para produtos sem categoria (vai sempre para o fim). */
export const NO_CATEGORY = "Outros";

export type ProductUnit = "kg" | "un";

export function parseUnit(value: unknown): ProductUnit | undefined {
  return value === "kg" || value === "un" ? value : undefined;
}

export interface CategoryGroup<T> {
  category: string;
  products: T[];
}

/** Agrupa produtos por categoria, pela ordem da marca; categorias vazias não aparecem. */
export function groupByCategory<T extends { category?: string | null; name: string }>(
  products: T[],
): CategoryGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const p of products) {
    const key = p.category?.trim() || NO_CATEGORY;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  const rank = (c: string) => {
    if (c === NO_CATEGORY) return CATEGORY_ORDER.length + 1;
    const i = (CATEGORY_ORDER as readonly string[]).indexOf(c);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  return [...map.keys()]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "pt"))
    .map((category) => ({
      category,
      products: map.get(category)!.slice().sort((a, b) => a.name.localeCompare(b.name, "pt")),
    }));
}

/** Etiqueta de disponibilidade: "Disponível hoje", "Esgotado", "Em defeso" ou "Indisponível". */
export function availabilityLabel(product: Parameters<typeof saleBlock>[0], day: Date = new Date()): string {
  const block = saleBlock(product, 1, day);
  return block ? SALE_BLOCK_LABELS[block] : "Disponível hoje";
}
