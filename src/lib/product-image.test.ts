import { describe, it, expect } from "vitest";
import { validateImage, buildImagePath, pathFromPublicUrl, IMAGE_ERROR } from "./product-image";

describe("product image", () => {
  it("aceita webp/jpeg/png até 1 MB", () => {
    expect(validateImage({ type: "image/webp", size: 1024 * 1024 })).toBeNull();
    expect(validateImage({ type: "image/jpeg", size: 10 })).toBeNull();
    expect(validateImage({ type: "image/png", size: 10 })).toBeNull();
  });
  it("rejeita outros tipos e > 1 MB", () => {
    expect(validateImage({ type: "image/gif", size: 10 })).toBe(IMAGE_ERROR);
    expect(validateImage({ type: "image/png", size: 1024 * 1024 + 1 })).toBe(IMAGE_ERROR);
  });
  it("caminho em minúsculas sem acentos nem espaços", () => {
    expect(buildImagePath("Camarão da Costa", "image/jpeg", 123)).toBe("camarao-da-costa-123.jpg");
    expect(buildImagePath("", "image/png", 1)).toMatch(/^[0-9a-f-]{36}-1\.png$/);
  });
  it("só reconhece URLs deste bucket", () => {
    expect(pathFromPublicUrl("https://x.supabase.co/storage/v1/object/public/product-images/a-1.png")).toBe("a-1.png");
    expect(pathFromPublicUrl("https://outro.com/a.png")).toBeNull();
  });
});
