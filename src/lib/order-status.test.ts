import { describe, it, expect } from "vitest";
import { NEXT_ORDER_STATUS, countsAsRevenue } from "./order-status";
import { dailySales, ordersToCsv, topProducts } from "./admin-reports";

describe("fluxo da encomenda", () => {
  it("segue pendente → confirmado → preparado → em entrega → entregue", () => {
    expect(NEXT_ORDER_STATUS.pendente).toBe("confirmado");
    expect(NEXT_ORDER_STATUS.confirmado).toBe("preparado");
    expect(NEXT_ORDER_STATUS.preparado).toBe("em_entrega");
    expect(NEXT_ORDER_STATUS.em_entrega).toBe("entregue");
  });
  it("entregue e cancelado são finais", () => {
    expect(NEXT_ORDER_STATUS.entregue).toBeNull();
    expect(NEXT_ORDER_STATUS.cancelado).toBeNull();
  });
});

describe("vendas", () => {
  it("só conta encomendas pagas", () => {
    expect(countsAsRevenue({ payment_status: "pending", status: "pendente" })).toBe(false);
    expect(countsAsRevenue({ payment_status: "paid", status: "confirmado" })).toBe(true);
  });
  it("não conta encomendas canceladas", () => {
    expect(countsAsRevenue({ payment_status: "paid", status: "cancelado" })).toBe(false);
  });

  const today = new Date("2026-03-10T15:00:00");
  const item = (name: string, quantity: number, unit_price: number) => ({ quantity, unit_price, products: { name } });
  const orders = [
    { id: "a", status: "confirmado", payment_status: "paid", total_amount: 42, created_at: "2026-03-10T10:00:00", order_items: [item("Lagostim", 1, 42)] },
    { id: "b", status: "pendente", payment_status: "pending", total_amount: 99, created_at: "2026-03-10T11:00:00", order_items: [item("Percebes", 1, 65)] },
    { id: "c", status: "entregue", payment_status: "paid", total_amount: 33.99, created_at: "2026-03-09T11:00:00", order_items: [item("Ameijoa", 2, 14.5)] },
  ];

  it("vendas do dia ignoram encomendas por pagar e de outros dias", () => {
    expect(dailySales(orders, today)).toEqual({ count: 1, revenue: 42 });
  });
  it("top produtos ordena por quantidade vendida", () => {
    expect(topProducts(orders).map((t) => t.name)).toEqual(["Ameijoa", "Lagostim"]);
  });
  it("CSV protege contra fórmulas", () => {
    const csv = ordersToCsv([{ ...orders[0], guest_email: "=HYPERLINK(1)" }]);
    expect(csv).toContain("'=HYPERLINK(1)");
  });
});
