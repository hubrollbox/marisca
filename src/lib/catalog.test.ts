import { describe, it, expect } from "vitest";
import { availabilityLabel, groupByCategory, parseUnit } from "./catalog";

const p = (name: string, category?: string) => ({ name, category });
const product = { available: true, stock: 5, closed_season_start: null, closed_season_end: null };
const day = new Date("2026-06-15T12:00:00");

describe("agrupar catálogo por categoria", () => {
  it("segue a ordem Crustáceos, Moluscos, Bivalves, Peixes", () => {
    const groups = groupByCategory([p("Robalo", "Peixes"), p("Ostras", "Bivalves"), p("Polvo", "Moluscos"), p("Lagosta", "Crustáceos")]);
    expect(groups.map((g) => g.category)).toEqual(["Crustáceos", "Moluscos", "Bivalves", "Peixes"]);
  });

  it("põe outras categorias no fim, e produtos sem categoria por último", () => {
    const groups = groupByCategory([p("Sem nada"), p("Conserva", "Conservas"), p("Lagosta", "Crustáceos")]);
    expect(groups.map((g) => g.category)).toEqual(["Crustáceos", "Conservas", "Outros"]);
  });

  it("não mostra categorias vazias", () => {
    const groups = groupByCategory([p("Ostras", "Bivalves")]);
    expect(groups.map((g) => g.category)).toEqual(["Bivalves"]);
  });
});

describe("etiqueta de disponibilidade", () => {
  it("disponível com stock", () => expect(availabilityLabel(product, day)).toBe("Disponível hoje"));
  it("esgotado com stock 0", () => expect(availabilityLabel({ ...product, stock: 0 }, day)).toBe("Esgotado"));
  it("em defeso dentro do período", () =>
    expect(availabilityLabel({ ...product, closed_season_start: "06-01", closed_season_end: "06-30" }, day)).toBe("Em defeso"));
  it("indisponível quando desativado", () => expect(availabilityLabel({ ...product, available: false }, day)).toBe("Indisponível"));
});

describe("unidade de venda", () => {
  it("aceita só kg ou un", () => {
    expect(parseUnit("kg")).toBe("kg");
    expect(parseUnit("un")).toBe("un");
    expect(parseUnit("caixa")).toBeUndefined();
  });
});
