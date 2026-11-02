import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSubmitOrderBody, quoteFormSchema, quoteSuccessMessage } from "./quote-request";

const form = {
  name: "Ana", email: "ana@exemplo.pt", phone: "912345678",
  street: "Rua A 1", city: "Matosinhos", postalCode: "4450-123",
};

describe("pedido de orçamento", () => {
  it("só envia id, quantidade e estado de cada produto", () => {
    const body = buildSubmitOrderBody(form, [{ productId: "p1", quantity: 2, state: "COZIDO" }], "");
    expect(body.items).toEqual([{ productId: "p1", quantity: 2, state: "COZIDO" }]);
    const json = JSON.stringify(body);
    for (const k of ["price", "total", "payment", "user_id", "name\":\"Lag"]) expect(json).not.toContain(k);
    expect(body.website).toBe("");
  });
  it("quantidade fica entre 1 e 100", () => {
    const body = buildSubmitOrderBody(form, [{ productId: "p", quantity: 250, state: "CRU" }], "");
    expect(body.items[0].quantity).toBe(100);
  });
  it("exige código postal 0000-000", () => {
    expect(quoteFormSchema.safeParse({ ...form, postalCode: "4450123" }).success).toBe(false);
    expect(quoteFormSchema.safeParse(form).success).toBe(true);
  });
  it("horário e notas são opcionais", () => {
    const body = buildSubmitOrderBody(form, [], "");
    expect("deliveryTimeSlot" in body).toBe(false);
    expect("notes" in body).toBe(false);
  });
  it("mensagem de sucesso", () => {
    expect(quoteSuccessMessage("A1B2C3D4")).toBe(
      "Pedido #A1B2C3D4 recebido. Vamos enviar-lhe o orçamento por WhatsApp ou email. Não foi cobrado nada.",
    );
  });
  it("o checkout já não chama o pagamento", () => {
    const src = readFileSync(resolve(__dirname, "../pages/Checkout.tsx"), "utf8");
    expect(src).toContain('"submit-order"');
    for (const s of ["create-payment", "order-status", "Stripe", "calcDeliveryFee", "FREE_DELIVERY_THRESHOLD"])
      expect(src).not.toContain(s);
  });
});
