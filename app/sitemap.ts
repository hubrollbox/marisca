import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dos dados reais da Supabase
  const res = await fetch('https://vodcljbskbxiihxilrwa.supabase.co/rest/v1/produtos', {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`
    }
  })

  const produtos = await res.json()

  const staticRoutes = [
    { url: 'https://marisca.pt', priority: 1 },
    { url: 'https://marisca.pt/sobre', priority: 0.8 },
    { url: 'https://marisca.pt/contacto', priority: 0.6 }
  ]

  const dynamicRoutes = produtos.map((produto: { slug: string }) => ({
    url: `https://marisca.pt/produto/${produto.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }))

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    ...route,
    lastModified: new Date()
  }))
}
