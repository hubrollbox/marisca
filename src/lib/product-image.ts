export const PRODUCT_IMAGES_BUCKET = "product-images";
export const MAX_IMAGE_BYTES = 1024 * 1024;
export const IMAGE_ERROR = "A foto deve ser WebP, JPG ou PNG e ter até 1 MB.";

const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

export function validateImage(file: { type: string; size: number }): string | null {
  return EXT[file.type] && file.size <= MAX_IMAGE_BYTES ? null : IMAGE_ERROR;
}

function clean(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildImagePath(base: string, type: string, now = Date.now()): string {
  const name = clean(base) || crypto.randomUUID();
  return `${name}-${now}.${EXT[type] ?? "bin"}`;
}

/** Devolve o caminho no bucket se o URL for deste bucket; senão null. */
export function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return null;
  const path = decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
  return path || null;
}

export function storageErrorPt(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("row-level security") || m.includes("unauthorized") || m.includes("403"))
    return "Sem permissão para carregar fotos. Inicie sessão como administrador.";
  if (m.includes("exists") || m.includes("duplicate")) return "Já existe uma foto com esse nome. Tente novamente.";
  if (m.includes("size") || m.includes("too large")) return IMAGE_ERROR;
  if (m.includes("mime") || m.includes("type")) return IMAGE_ERROR;
  if (m.includes("bucket")) return "O espaço de fotos não está disponível.";
  return "Não foi possível carregar a foto. Tente novamente.";
}
