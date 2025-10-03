import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schemaMarkup?: object;
}

export function SEO({
  title = "Marisca - Da Maré para a Sua Mesa",
  description = "Marisco fresco da lota para a sua mesa em poucas horas. Frescura, autenticidade e qualidade diretamente do mar.",
  canonical,
  ogImage = "/icon-512.png",
  ogType = "website",
  schemaMarkup,
}: SEOProps) {
  const fullTitle = title.includes('Marisca') ? title : `${title} | Marisca`;
  const url = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_PT" />
      <meta property="og:site_name" content="Marisca" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Marisca" />
      
      {/* Schema.org Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
      
      {/* Organization Schema - Always present */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Marisca",
          "url": "https://marisca.pt",
          "logo": "https://marisca.pt/icon-512.png",
          "description": "Marisco fresco da lota para a sua mesa em poucas horas",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "PT"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@marisca.pt"
          }
        })}
      </script>
    </Helmet>
  );
}