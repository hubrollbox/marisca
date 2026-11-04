import { describe, it, expect } from "vitest";
import { buildSendQuoteArgs, canSendQuote, canWeigh, orderRef, quoteWhatsappMessage, whatsappNumber, whatsappUrl } from "./admin-quote";

const base = {
  orderId: "o1",
  items: [{ item_id: "i1", unit_price: "32,50", estimated_qty: "1,2" }],
  deliveryFee: "4,99",
  deliveryDate: "2026-11-04",
  deliverySlot: "10:00-12:00",
  paymentOptions: ["online", "entrega"],
  message: "",
};

describe("orçamento admin", () => {
  it("referência = 8 primeiros caracteres em maiúsculas", () => {
    expect(orderRef("a1b2c3d4-xxxx")).toBe("A1B2C3D4");
  });
  it("não duplica o 351 no WhatsApp", () => {
    expect(whatsappNumber("912 345 678")).toBe("351912345678");
    expect(whatsappNumber("+351 912 345 678")).toBe("351912345678");
    expect(whatsappNumber("00351912345678")).toBe("351912345678");
    expect(whatsappUrl("912345678", "a b")).toBe("https://wa.me/351912345678?text=a%20b");
  });
  it("mensagem do WhatsApp", () => {
    const m = quoteWhatsappMessage({ name: "Ana", ref: "A1B2C3D4", link: "https://x/orcamento/t", validUntil: "2026-11-04T09:05:00" });
    expect(m).toBe("Olá Ana! O seu orçamento Marisca #A1B2C3D4 está pronto: https://x/orcamento/t . Válido até 04/11 09:05. Qualquer dúvida, responda a esta mensagem.");
  });
  it("monta os argumentos de send_quote", () => {
    const r = buildSendQuoteArgs(base);
    expect(r).toEqual({
      ok: true,
      args: {
        _order_id: "o1",
        _items: [{ item_id: "i1", unit_price: 32.5, estimated_qty: 1.2 }],
        _delivery_fee: 4.99,
        _delivery_date: "2026-11-04",
        _delivery_slot: "10:00-12:00",
        _payment_options: ["online", "entrega"],
        _message: "",
      },
    });
  });
  it("exige pelo menos uma forma de pagamento e preços em todos os itens", () => {
    expect(buildSendQuoteArgs({ ...base, paymentOptions: [] }).ok).toBe(false);
    expect(buildSendQuoteArgs({ ...base, items: [{ item_id: "i1", unit_price: "", estimated_qty: "1" }] }).ok).toBe(false);
  });
  it("estados que permitem orçamento e pesagem", () => {
    expect(canSendQuote("pendente")).toBe(true);
    expect(canSendQuote("orcamento_enviado")).toBe(true);
    expect(canSendQuote("aceite")).toBe(false);
    expect(canWeigh("aceite")).toBe(true);
    expect(canWeigh("preparado")).toBe(true);
    expect(canWeigh("pendente")).toBe(false);
  });
});
