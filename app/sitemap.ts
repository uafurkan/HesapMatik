import { HESAPLAMA_DATA } from '@/lib/hesaplama-data'
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hesapmatik.site'

export default function sitemap() {
  const staticRoutes = [{ url: BASE, priority: 1.0, changeFrequency: 'weekly' as const }]
  const catRoutes = HESAPLAMA_DATA.map(k => ({
    url: `${BASE}/${k.slug}`, priority: 0.8, changeFrequency: 'monthly' as const
  }))
  const toolRoutes = HESAPLAMA_DATA.flatMap(k =>
    k.hesaplamalar.map(h => ({
      url: `${BASE}/${k.slug}/${h.slug}`,
      priority: 0.9,
      changeFrequency: 'monthly' as const
    }))
  )
  return [...staticRoutes, ...catRoutes, ...toolRoutes]
}
