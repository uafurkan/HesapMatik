import { findHesaplama, getAllSlugs } from '@/lib/hesaplama-data'
import { notFound } from 'next/navigation'
import HesaplamaClient from '@/components/HesaplamaClient'

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string, hesaplama: string }> }) {
  const { kategori, hesaplama } = await params;
  const data = findHesaplama(kategori, hesaplama)
  if (!data) return {}

  const title = data.seoTitle || `${data.title} 2024 | Hesaplama Merkezi`
  const desc = data.seoDesc || `${data.title} hesaplama aracı: Güncel mevzuatla hızlı ve ücretsiz hesaplayın. ${data.description || ''}`

  return {
    title,
    description: desc,
    keywords: [data.title.toLowerCase(), `${data.title.toLowerCase()} hesaplama`, `${data.title.toLowerCase()} 2024`, "hesaplama"],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${kategori}/${hesaplama}`
    }
  }
}

export default async function HesaplamaPage({ params }: { params: Promise<{ kategori: string, hesaplama: string }> }) {
  const { kategori, hesaplama } = await params;
  const data = findHesaplama(kategori, hesaplama)
  if (!data) notFound()

  // SSS Generation based on title
  const faqs = [
    { q: `${data.title} güncel mevzuata uygun mu?`, a: "Evet. Tüm parametreler 2024 H2 (Temmuz 2024 itibariyle) resmi verileri kullanılarak güncellenmiştir." },
    { q: `${data.title} nasıl yapılır?`, a: "Yukarıdaki forma gerekli değerleri girerek anında ve otomatik olarak sonuçları görebilirsiniz. Hesaplamalar tamamen ücretsizdir." },
    { q: `Hesaplama sonuçları ne kadar doğru?`, a: "Hesaplamalar resmi kurumlarca belirlenen güncel formüller kullanılarak yapılmaktadır. Ancak kesin sonuçlar ve yasal işlemler için uzman görüşü almanız önerilir." }
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": data.title,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" }
      },
      {
        "@type": "HowTo",
        "name": `${data.title} Nasıl Hesaplanır?`,
        "step": [
          { "@type": "HowToStep", "text": "İlgili alanlara gerekli değerleri eksiksiz girin." },
          { "@type": "HowToStep", "text": "Girilen değerlere göre hesaplama anında otomatik olarak yapılır." },
          { "@type": "HowToStep", "text": "Detaylı sonuç tablosunu ve varsa grafiği inceleyerek sonuçları değerlendirin." }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HesaplamaClient data={data} kategori={params.kategori} faqs={faqs} />
    </>
  )
}
