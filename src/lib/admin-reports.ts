import { countsAsRevenue, ORDER_STATUS_LABELS, isOrderStatus } from "@/lib/order-status";
import { roundCents } from "@/lib/pricing";

interface ReportOrder {
  id: string;
  status: string;
  payment_status: string | null;
  total_amount: number;
  delivery_fee?: number;
  created_at: string;
  guest_email?: string | null;
  delivery_time_slot?: string | null;
  order_items: Array<{ quantity: number; unit_price: number; products: { name: string } | null }>;
}

export function isSameDay(iso: string, day: Date = new Date()): boolean {
  const d = new Date(iso);
  return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
}

/** Vendas do dia: só encomendas pagas e não canceladas */
export function dailySales(orders: ReportOrder[], day: Date = new Date()) {
  const paid = orders.filter((o) => isSameDay(o.created_at, day) && countsAsRevenue(o));
  return {
    count: paid.length,
    revenue: roundCents(paid.reduce((s, o) => s + Number(o.total_amount), 0)),
  };
}

export function topProducts(orders: ReportOrder[], limit = 5) {
  const totals = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const o of orders.filter(countsAsRevenue)) {
    for (const i of o.order_items) {
      const name = i.products?.name ?? "Produto";
      const t = totals.get(name) ?? { name, quantity: 0, revenue: 0 };
      t.quantity += i.quantity;
      t.revenue = roundCents(t.revenue + i.quantity * Number(i.unit_price));
      totals.set(name, t);
    }
  }
  return [...totals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, limit);
}

function csvCell(value: unknown): string {
  const s = String(value ?? "");
  // Evita fórmulas injetadas ao abrir no Excel
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[";\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function ordersToCsv(orders: ReportOrder[]): string {
  const header = ["Referência", "Data", "Estado", "Pagamento", "Cliente", "Horário", "Itens", "Total (EUR)"];
  const rows = orders.map((o) => [
    o.id.slice(0, 8).toUpperCase(),
    new Date(o.created_at).toLocaleString("pt-PT"),
    isOrderStatus(o.status) ? ORDER_STATUS_LABELS[o.status] : o.status,
    o.payment_status ?? "",
    o.guest_email ?? "Cliente registado",
    o.delivery_time_slot ?? "",
    o.order_items.map((i) => `${i.quantity}x ${i.products?.name ?? "Produto"}`).join(", "),
    Number(o.total_amount).toFixed(2).replace(".", ","),
  ]);
  return [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
