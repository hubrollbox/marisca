import type { Product } from "../hooks/use-products";

/** Dados estruturados do produto. Sem preço: a Marisca vende sob orçamento. */
export function generateProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} fresco da costa portuguesa`,
    ...(product.image_url ? { "image": product.image_url } : {}),
    "sku": product.id,
    "url": `https://marisca.pt/produtos/${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Marisca"
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://marisca.pt${item.url}`
    }))
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Marisca",
    "url": "https://marisca.pt",
    "description": "Marisco fresco da lota para a sua mesa em poucas horas",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://marisca.pt/produtos?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}