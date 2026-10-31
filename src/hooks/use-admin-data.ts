import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapProduct, productsQueryKey, type Product } from "@/hooks/use-products";

export interface AdminOrder {
  id: string;
  status: string;
  payment_status: string | null;
  total_amount: number;
  delivery_fee: number;
  delivery_time_slot: string | null;
  delivery_address: { name?: string; street?: string; city?: string; postalCode?: string; phone?: string } | null;
  notes: string | null;
  created_at: string;
  guest_email: string | null;
  user_id: string | null;
  order_items: Array<{ quantity: number; unit_price: number; state: string; products: { name: string } | null }>;
}

export interface Complaint {
  id: string;
  complaint_number: string;
  complaint_type: string;
  name: string;
  email: string;
  phone: string | null;
  description: string;
  status: string | null;
  admin_notes: string | null;
  created_at: string | null;
}

export interface Partnership {
  id: string;
  name: string;
  email: string;
  partnership_type: string;
  message: string;
  status?: string | null;
  created_at: string;
}

export const adminKeys = {
  products: ["admin", "products"] as const,
  orders: ["admin", "orders"] as const,
  complaints: ["admin", "complaints"] as const,
  partnerships: ["admin", "partnerships"] as const,
};

export function useAdminProducts(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.products,
    enabled,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });
}

export function useAdminOrders(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.orders,
    enabled,
    refetchInterval: 30_000,
    queryFn: async (): Promise<AdminOrder[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items (quantity, unit_price, state, products (name))")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as AdminOrder[];
    },
  });
}

export function useComplaints(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.complaints,
    enabled,
    queryFn: async (): Promise<Complaint[]> => {
      const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Complaint[];
    },
  });
}

export function usePartnerships(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.partnerships,
    enabled,
    queryFn: async (): Promise<Partnership[]> => {
      // A tabela de parcerias ainda não consta dos tipos gerados
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("partnerships")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Partnership[];
    },
  });
}

/** Atualiza o painel e também o catálogo da loja depois de uma alteração. */
export function useInvalidateAdmin() {
  const qc = useQueryClient();
  return {
    products: () => {
      qc.invalidateQueries({ queryKey: adminKeys.products });
      qc.invalidateQueries({ queryKey: productsQueryKey });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
    orders: () => qc.invalidateQueries({ queryKey: adminKeys.orders }),
    complaints: () => qc.invalidateQueries({ queryKey: adminKeys.complaints }),
    partnerships: () => qc.invalidateQueries({ queryKey: adminKeys.partnerships }),
  };
}
