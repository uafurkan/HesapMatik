import { HESAPLAMA_DATA } from '@/lib/hesaplama-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hesapmatik.site'

export async function generateStaticParams() {
  return HESAPLAMA_DATA.map(k => ({ kategori: k.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params;
  const cat = HESAPLAMA_DATA.find(k => k.slug === kategori)
  if (!cat) return {}
  return {
    title: `${cat.name} Hesaplamaları | HesapMatik`,
    description: `${cat.name} kategorisindeki ${cat.hesaplamalar.length} hesaplama aracını ücretsiz kullanın. ${cat.description || ''}`,
    alternates: {
      canonical: `/${kategori}`
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params;
  const cat = HESAPLAMA_DATA.find(k => k.slug === kategori)
  if (!cat) notFound()

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": cat.name, "item": `${SITE_URL}/${kategori}` }
    ]
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="text-xs sm:text-sm font-mono text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <Link href="/" className="hover:text-amber-500 transition-colors">Ana Sayfa</Link>
        <span>&gt;</span>
        <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 animate-fade-in">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-black/5 to-transparent dark:from-white/10 dark:to-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-4xl sm:text-5xl shadow-lg shrink-0">
          {cat.icon}
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-syne text-gray-900 dark:text-white tracking-tight">{cat.name} <span className="gradient-text block sm:inline">Hesaplamaları</span></h1>
        </div>
      </div>
      
      <AdSlot format="leaderboard" slot="3333333333" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10">
        {cat.hesaplamalar.map((h, i) => (
          <Link key={h.slug} href={`/${cat.slug}/${h.slug}`} className="glass-card rounded-2xl p-5 sm:p-6 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(255,179,71,0.15)] hover:border-amber-500/50 transition-all duration-300 flex flex-col h-full group animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-syne group-hover:text-amber-400 transition-colors">{h.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono flex-grow leading-relaxed">{h.description || `${h.title} hesaplayıcısını hemen kullanın.`}</p>
            <div className="mt-5 text-amber-500 text-sm font-bold font-mono group-hover:translate-x-1 transition-transform flex items-center gap-1">Hesapla <span>→</span></div>
          </Link>
        ))}
      </div>
    </div>
  )
}
