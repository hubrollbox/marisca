import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  weight?: string;
  available: boolean;
  states: Array<"CRU" | "COZIDO">;
  prep_time?: string;
  description?: string;
  stock?: number;
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

      return data.map((product): Product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        image_url: product.image_url,
        weight: product.weight,
        available: product.available,
        states: (product.states || []) as Array<"CRU" | "COZIDO">,
        prep_time: product.prep_time,
        description: product.description,
        stock: product.stock || 0,
      }));
    },
  });
}