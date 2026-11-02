import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Regra: nenhum preço nas páginas públicas (catálogo, ficha, carrinho, pedido, modais).
const root = resolve(__dirname, "../..");
const catalogDir = resolve(root, "src/components/catalog");
const publicFiles = [
  ...readdirSync(catalogDir).map((f) => `src/components/catalog/${f}`),
  "src/pages/Index.tsx",
  "src/pages/Products.tsx",
  "src/pages/ProductDetail.tsx",
  "src/pages/Checkout.tsx",
  "src/pages/FAQ.tsx",
  "src/utils/schema-markup.ts",
];

describe("sem preços nas páginas públicas", () => {
  for (const file of publicFiles) {
    it(`${file} não mostra € nem product.price`, () => {
      const src = readFileSync(resolve(root, file), "utf8");
      expect(src).not.toContain("€");
      expect(src).not.toMatch(/\.price\b/);
    });
  }
});
