import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calcDeliveryFee, calcTotals, isInClosedSeason, saleBlock, isValidState } from "./pricing";
import * as serverPricing from "../../supabase/functions/_shared/pricing";

const product = { available: true, stock: 5, closed_season_start: null, closed_season_end: null };
const day = (iso: string) => new Date(`${iso}T12:00:00`);

describe("taxa de entrega", () => {
  it("cobra €4,99 abaixo de €30", () => {
    expect(calcDeliveryFee(29.99)).toBe(4.99);
  });
  it("é grátis a partir de €30", () => {
    expect(calcDeliveryFee(30)).toBe(0);
  });
  it("não cobra entrega num carrinho vazio", () => {
    expect(calcDeliveryFee(0)).toBe(0);
  });
});

describe("totais", () => {
  it("soma produtos + entrega e arredonda aos cêntimos", () => {
    // 2 x Ameijoa €14,50 = €29,00 -> + €4,99
    expect(calcTotals([{ price: 14.5, quantity: 2 }])).toEqual({ subtotal: 29, deliveryFee: 4.99, total: 33.99 });
  });
  it("Lagostim €42 tem entrega grátis", () => {
    expect(calcTotals([{ price: 42, quantity: 1 }]).total).toBe(42);
  });
  it("evita erros de vírgula flutuante", () => {
    expect(calcTotals([{ price: 0.1, quantity: 3 }]).subtotal).toBe(0.3);
  });
});

describe("stock", () => {
  it("permite comprar até ao stock disponível", () => {
    expect(saleBlock(product, 5)).toBeNull();
  });
  it("bloqueia acima do stock", () => {
    expect(saleBlock(product, 6)).toBe("insufficient_stock");
  });
  it("stock 0 = esgotado", () => {
    expect(saleBlock({ ...product, stock: 0 }, 1)).toBe("out_of_stock");
  });
  it("stock vazio = sem limite", () => {
    expect(saleBlock({ ...product, stock: null }, 99)).toBeNull();
  });
  it("produto escondido não se vende", () => {
    expect(saleBlock({ ...product, available: false }, 1)).toBe("unavailable");
  });
});

describe("defeso", () => {
  it("bloqueia a venda dentro do período", () => {
    expect(isInClosedSeason("05-01", "06-30", day("2026-05-15"))).toBe(true);
    expect(saleBlock({ ...product, closed_season_start: "05-01", closed_season_end: "06-30" }, 1, day("2026-05-15"))).toBe(
      "closed_season",
    );
  });
  it("inclui o primeiro e o último dia", () => {
    expect(isInClosedSeason("05-01", "06-30", day("2026-05-01"))).toBe(true);
    expect(isInClosedSeason("05-01", "06-30", day("2026-06-30"))).toBe(true);
  });
  it("permite vender fora do período", () => {
    expect(isInClosedSeason("05-01", "06-30", day("2026-07-01"))).toBe(false);
  });
  it("suporta períodos que passam o fim do ano", () => {
    expect(isInClosedSeason("12-15", "01-31", day("2026-01-10"))).toBe(true);
    expect(isInClosedSeason("12-15", "01-31", day("2026-03-01"))).toBe(false);
  });
  it("datas inválidas não bloqueiam", () => {
    expect(isInClosedSeason("13-01", "06-30", day("2026-05-15"))).toBe(false);
  });
});

describe("estados de preparação", () => {
  it("só aceita Cru e Cozido", () => {
    expect(isValidState("CRU")).toBe(true);
    expect(isValidState("COZIDO")).toBe(true);
    expect(isValidState("GRELHADO")).toBe(false);
  });
});

describe("loja e pagamento usam as mesmas regras", () => {
  it("a cópia do servidor é idêntica (exceto o comentário inicial)", () => {
    const strip = (f: string) =>
      readFileSync(resolve(__dirname, f), "utf8")
        .split("\n")
        .filter((l) => !l.startsWith("//"))
        .join("\n");
    expect(strip("../../supabase/functions/_shared/pricing.ts")).toBe(strip("./pricing.ts"));
  });
  it("o servidor calcula os mesmos totais", () => {
    const lines = [{ price: 18.5, quantity: 1 }];
    expect(serverPricing.calcTotals(lines)).toEqual(calcTotals(lines));
  });
});
