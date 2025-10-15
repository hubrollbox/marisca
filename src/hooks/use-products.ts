import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        states: (product.states || []) as Array<"CRU" | "COZIDO">,
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