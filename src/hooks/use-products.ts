import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  price: number;
  image_url?: string;
  weight?: string;
  available: boolean;
  states: Array<"CRU" | "COZIDO" | "GRELHADO">;
  prep_time?: string;
  description?: string;
  stock?: number;
  scientific_name?: string;
  presentation?: string;
  average_weight?: string;
  ideal_conservation?: string;
  quality_checklist?: string;
  closed_season?: string;
  origin?: string;
  legal_notes?: string;
  sensory_description?: string;
  consumption_suggestion?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // 1) Tentar carregar de /public via XLSX
      const tryReadXlsx = async (path: string) => {
        try {
          const res = await fetch(path, { cache: "no-store" });
          if (!res.ok) return null;
          const buf = await res.arrayBuffer();
          const wb = XLSX.read(buf, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows: any[] = XLSX.utils.sheet_to_json(ws, { raw: true });
          const mapped: Product[] = rows.map((row: any, index: number) => ({
            id: (row.id ?? `${row.slug ?? row.name ?? "prod"}-${index}`).toString(),
            name: String(row.name ?? "Produto")
              .replace(/\s+/g, " ")
              .trim(),
            slug: row.slug,
            category: row.category,
            price: parseFloat(String(row.price ?? 0)) || 0,
            image_url: row.image_url ?? row.image ?? undefined,
            weight: row.weight ?? undefined,
            available:
              typeof row.available === "string"
                ? row.available.toLowerCase() === "true"
                : !!row.available,
            // Mantemos um estado único para compatibilidade com o carrinho
            states: ["CRU"],
            prep_time: row.prep_time ?? row.prepTime ?? undefined,
            description: row.description ?? undefined,
            stock: typeof row.stock === "number" ? row.stock : Number(row.stock ?? 0) || 0,
            scientific_name: row.scientific_name ?? row.scientificName ?? undefined,
            presentation: row.presentation ?? undefined,
            average_weight: row.average_weight ?? row.averageWeight ?? undefined,
            ideal_conservation: row.ideal_conservation ?? row.idealConservation ?? undefined,
            quality_checklist: row.quality_checklist ?? row.qualityChecklist ?? undefined,
            closed_season: row.closed_season ?? row.closedSeason ?? undefined,
            origin: row.origin ?? undefined,
            legal_notes: row.legal_notes ?? row.legalNotes ?? undefined,
            sensory_description: row.sensory_description ?? row.sensoryDescription ?? undefined,
            consumption_suggestion: row.consumption_suggestion ?? row.consumptionSuggestion ?? undefined,
          }));
          return mapped;
        } catch {
          return null;
        }
      };

      // Tenta .xlsx depois .xls
      const fromXlsx = (await tryReadXlsx("/products.xlsx")) ?? (await tryReadXlsx("/products.xls"));
      if (fromXlsx && fromXlsx.length > 0) {
        return fromXlsx;
      }

      // 2) Fallback para Supabase se não houver ficheiro
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("name");

      if (error) throw error;

      return data.map((product: any): Product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: parseFloat(product.price.toString()),
        image_url: product.image_url,
        weight: product.weight,
        available: product.available,
        states: ["CRU"], // uniformizar
        prep_time: product.prep_time,
        description: product.description,
        stock: product.stock || 0,
        scientific_name: product.scientific_name,
        presentation: product.presentation,
        average_weight: product.average_weight,
        ideal_conservation: product.ideal_conservation,
        quality_checklist: product.quality_checklist,
        closed_season: product.closed_season,
        origin: product.origin,
        legal_notes: product.legal_notes,
        sensory_description: product.sensory_description,
        consumption_suggestion: product.consumption_suggestion,
      }));
    },
  });
}