import { describe, it, expect } from "vitest";
import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  availablePaymentOptions,
  formatValidUntil,
  lineSubtotal,
  paymentMethodLabel,
  pendingQuoteText,
  shouldReloadAfterAcceptError,
  toQuoteError,
  weightToleranceText,
} from "./quote-view";
import { orderStatusLabel } from "./order-status";

describe("página de orçamento", () => {
  it("mostra a validade na hora de Lisboa como DD/MM HH:mm", () => {
    expect(formatValidUntil("2026-11-02T10:00:00Z")).toBe("Válido até 02/11 10:00");
    expect(formatValidUntil("2026-07-02T10:00:00Z")).toBe("Válido até 02/07 11:00");
  });

  it("texto de tolerância usa a percentagem do servidor", () => {
    expect(weightToleranceText(10)).toContain("±10% face ao estimado");
    expect(weightToleranceText(15)).toContain("±15%");
  });

  it("pedido pendente só diz que está a preparar", () => {
    expect(pendingQuoteText("A1B2C3D4")).toBe("Pedido #A1B2C3D4 recebido. Ainda estamos a preparar o orçamento.");
  });

  it("só oferece as formas de pagamento conhecidas enviadas pelo servidor", () => {
    expect(availablePaymentOptions(["online", "entrega"])).toEqual(["online", "entrega"]);
    expect(availablePaymentOptions(["entrega", "stripe"])).toEqual(["entrega"]);
    expect(availablePaymentOptions(null)).toEqual([]);
  });

  it("forma de pagamento desconhecida mostra-se tal como vem", () => {
    expect(paymentMethodLabel("entrega")).toBe("Na entrega");
    expect(paymentMethodLabel("mbway")).toBe("mbway");
  });

  it("subtotal estimado = preço × quantidade estimada; o final tem prioridade", () => {
    const base = { name: "Lagostim", unit: "kg", state: "CRU", requested: 2, estimatedQty: 1.5, unitPrice: 24.9, finalQty: null, lineTotal: null };
    expect(lineSubtotal(base)).toEqual({ value: 37.35, isFinal: false });
    expect(lineSubtotal({ ...base, lineTotal: 39.84 })).toEqual({ value: 39.84, isFinal: true });
  });

  it("recarrega o orçamento só depois de erro 409 ou 410", () => {
    expect(shouldReloadAfterAcceptError(409)).toBe(true);
    expect(shouldReloadAfterAcceptError(410)).toBe(true);
    expect(shouldReloadAfterAcceptError(400)).toBe(false);
    expect(shouldReloadAfterAcceptError(404)).toBe(false);
  });

  it("lê o código e a mensagem do erro da função", async () => {
    const res = new Response(JSON.stringify({ error: "Orçamento não encontrado." }), { status: 404 });
    const err = await toQuoteError(new FunctionsHttpError(res), "falha");
    expect(err.status).toBe(404);
    expect(err.message).toBe("Orçamento não encontrado.");
  });
});

describe("rótulos dos estados", () => {
  it("usa os rótulos PT-PT definidos", () => {
    expect(orderStatusLabel("pendente")).toBe("Pedido recebido");
    expect(orderStatusLabel("orcamento_enviado")).toBe("Orçamento enviado");
    expect(orderStatusLabel("confirmado")).toBe("Confirmado (legado)");
    expect(orderStatusLabel("expirado")).toBe("Expirado");
  });
  it("estado desconhecido mostra-se tal como vem, nunca como Pendente", () => {
    expect(orderStatusLabel("novo_estado")).toBe("novo_estado");
  });
});
