import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isInClosedSeason, isValidState, type ProductState } from "@/lib/pricing";

export type { ProductState };

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  price: number;
  image_url?: string;
  weight?: string;
  available: boolean;
  states: ProductState[];
  prep_time?: string;
  description?: string;
  /** null = stock não controlado */
  stock: number | null;
  scientific_name?: string;
  presentation?: string;
  average_weight?: string;
  ideal_conservation?: string;
  quality_checklist?: string;
  closed_season?: string;
  closed_season_start?: string | null;
  closed_season_end?: string | null;
  in_closed_season: boolean;
  origin?: string;
  legal_notes?: string;
  sensory_description?: string;
  consumption_suggestion?: string;
}

const opt = (v: unknown) => (v === null || v === undefined || v === "" ? undefined : String(v));

// A tabela tem colunas opcionais que podem ainda não existir na base de dados,
// por isso lemos a linha de forma genérica.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProduct(row: any): Product {
  const states = Array.isArray(row.states) ? row.states.filter(isValidState) : [];
  return {
    id: row.id,
    name: String(row.name ?? "").replace(/\s+/g, " ").trim(),
    slug: opt(row.slug),
    category: opt(row.category),
    price: Number(row.price) || 0,
    image_url: opt(row.image_url),
    weight: opt(row.weight),
    available: !!row.available,
    states: states.length > 0 ? states : ["CRU"],
    prep_time: opt(row.prep_time),
    description: opt(row.description),
    stock: row.stock === null || row.stock === undefined ? null : Number(row.stock),
    scientific_name: opt(row.scientific_name),
    presentation: opt(row.presentation),
    average_weight: opt(row.average_weight),
    ideal_conservation: opt(row.ideal_conservation),
    quality_checklist: opt(row.quality_checklist),
    closed_season: opt(row.closed_season),
    closed_season_start: row.closed_season_start ?? null,
    closed_season_end: row.closed_season_end ?? null,
    in_closed_season: isInClosedSeason(row.closed_season_start, row.closed_season_end),
    origin: opt(row.origin),
    legal_notes: opt(row.legal_notes),
    sensory_description: opt(row.sensory_description),
    consumption_suggestion: opt(row.consumption_suggestion),
  };
}

export const productsQueryKey = ["products"] as const;

/** Catálogo público (só produtos disponíveis). Atualiza-se sozinho a cada minuto. */
export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("name");
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/** Um só produto (página de detalhe). */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data) : null;
    },
    staleTime: 30_000,
  });
}
