import { HESAPLAMA_DATA } from '@/lib/hesaplama-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'

export async function generateStaticParams() {
  return HESAPLAMA_DATA.map(k => ({ kategori: k.slug }))
}

export async function generateMetadata({ params }: { params: { kategori: string } }) {
  const cat = HESAPLAMA_DATA.find(k => k.slug === params.kategori)
  if (!cat) return {}
  return {
    title: `${cat.name} Hesaplamaları | HesapMatik`,
    description: `${cat.name} kategorisindeki ${cat.hesaplamalar.length} hesaplama aracını ücretsiz kullanın. ${cat.description || ''}`,
  }
}

export default function CategoryPage({ params }: { params: { kategori: string } }) {
  const cat = HESAPLAMA_DATA.find(k => k.slug === params.kategori)
  if (!cat) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-sm font-mono text-gray-500 mb-4 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-500">Ana Sayfa</Link>
        <span>&gt;</span>
        <span className="text-gray-300">{cat.name}</span>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="text-5xl">{cat.icon}</div>
        <h1 className="text-4xl font-bold font-syne">{cat.name} Hesaplamaları</h1>
      </div>
      
      <AdSlot format="leaderboard" slot="3333333333" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {cat.hesaplamalar.map(h => (
          <Link key={h.slug} href={`/${cat.slug}/${h.slug}`} className="bg-[#13131f] border border-[#1e1e30] rounded-xl p-6 hover:border-gray-500 transition-colors flex flex-col h-full group">
            <h3 className="text-lg font-bold text-white mb-2">{h.title}</h3>
            <p className="text-sm text-gray-400 font-mono flex-grow">{h.description || `${h.title} hesaplayıcısını hemen kullanın.`}</p>
            <div className="mt-4 text-amber-500 text-sm font-bold font-syne group-hover:underline">Hesapla →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
