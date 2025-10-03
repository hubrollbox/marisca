import type { Product } from "@/hooks/use-products";

export function generateProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} fresco da costa portuguesa`,
    "image": product.image_url || "/placeholder.svg",
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "EUR",
      "availability": product.available && (product.stock || 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "url": `https://marisca.pt/produtos/${product.slug || product.id}`,
      "seller": {
        "@type": "Organization",
        "name": "Marisca"
      }
    },
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