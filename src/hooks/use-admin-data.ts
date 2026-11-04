import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapProduct, productsQueryKey, type Product } from "@/hooks/use-products";

export interface AdminOrderItem {
  id: string;
  product_name: string | null;
  unit: string | null;
  state: string;
  quantity: number;
  estimated_qty: number | null;
  unit_price: number | null;
  final_qty: number | null;
  line_total: number | null;
  customer_note: string | null;
}

export interface AdminOrder {
  id: string;
  status: string;
  created_at: string;
  user_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  guest_email: string | null;
  delivery_address: { name?: string; street?: string; city?: string; postalCode?: string; phone?: string } | null;
  delivery_time_slot: string | null;
  notes: string | null;
  quote_token: string | null;
  quote_sent_at: string | null;
  quote_valid_until: string | null;
  accepted_at: string | null;
  delivery_date: string | null;
  payment_options: string[] | null;
  payment_method: string | null;
  payment_status: string | null;
  weight_tolerance_pct: number | null;
  delivery_fee: number | null;
  final_total: number | null;
  total_amount: number;
  order_items: AdminOrderItem[];
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
        .select(
          "id, status, created_at, user_id, customer_name, customer_phone, guest_email, delivery_address, delivery_time_slot, notes, quote_token, quote_sent_at, quote_valid_until, accepted_at, delivery_date, payment_options, payment_method, payment_status, weight_tolerance_pct, delivery_fee, final_total, total_amount, order_items (id, product_name, unit, state, quantity, estimated_qty, unit_price, final_qty, line_total, customer_note)",
        )
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
        .from("partnership_requests")
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
