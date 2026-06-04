import { findHesaplama, getAllSlugs, HESAPLAMA_DATA } from '@/lib/hesaplama-data'
import { notFound } from 'next/navigation'
import HesaplamaClient from '@/components/HesaplamaClient'

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string, hesaplama: string }> }) {
  const { kategori, hesaplama } = await params;
  const data = findHesaplama(kategori, hesaplama)
  if (!data) return {}

  const title = data.seoTitle || `${data.title} 2026 | Hesaplama Merkezi`
  const desc = data.seoDesc || `${data.title} hesaplama aracı: Güncel mevzuatla hızlı ve ücretsiz hesaplayın. ${data.description || ''}`

  return {
    title,
    description: desc,
    keywords: [data.title.toLowerCase(), `${data.title.toLowerCase()} hesaplama`, `${data.title.toLowerCase()} 2026`, "hesaplama"],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${kategori}/${hesaplama}`
    }
  }
}

export default async function HesaplamaPage({ params }: { params: Promise<{ kategori: string, hesaplama: string }> }) {
  const { kategori, hesaplama } = await params;
  const data = findHesaplama(kategori, hesaplama)
  if (!data) notFound()

  // SSS Generation: use custom FAQs if defined, fallback to templates
  const faqs = data.customFaqs && data.customFaqs.length > 0 
    ? data.customFaqs 
    : [
        { q: `${data.title} güncel mevzuata uygun mu?`, a: "Evet. Tüm parametreler 2026 resmi verileri kullanılarak güncellenmiştir." },
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

  // Get related calculators in the same category
  const categoryData = HESAPLAMA_DATA.find(k => k.slug === kategori)
  const relatedTools = categoryData
    ? categoryData.hesaplamalar
        .filter(h => h.slug !== hesaplama)
        .slice(0, 4)
        .map(h => ({
          slug: h.slug,
          title: h.title,
          description: h.description,
          icon: categoryData.icon
        }))
    : []

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HesaplamaClient 
        data={data} 
        kategori={kategori} 
        faqs={faqs} 
        relatedTools={relatedTools} 
      />
    </>
  )
}
