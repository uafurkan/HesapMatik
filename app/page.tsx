import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import AdSlot from '@/components/AdSlot'
import Link from 'next/link'

export default function Home() {
  const popularTools = [
    { slug: 'kira-artis-hesaplama', k: 'finans', name: 'Kira Artış' },
    { slug: 'kidem-tazminati', k: 'finans', name: 'Kıdem Tazminatı' },
    { slug: 'net-maas-hesaplama', k: 'finans', name: 'Net Maaş' },
    { slug: 'konut-kredisi', k: 'finans', name: 'Konut Kredisi' },
    { slug: 'tyt-net-hesaplama', k: 'egitim', name: 'TYT Net' },
    { slug: 'bmi-hesaplama', k: 'saglik', name: 'BMI Hesaplama' },
    { slug: 'kdv-hesaplama', k: 'matematik', name: 'KDV Hesaplama' },
    { slug: 'yakit-masrafi', k: 'faturalar', name: 'Yakıt Masrafı' },
    { slug: 'elektrik-faturasi', k: 'faturalar', name: 'Elektrik Faturası' },
    { slug: 'ihbar-tazminati', k: 'finans', name: 'İhbar Tazminatı' },
    { slug: 'faiz-hesaplama', k: 'finans', name: 'Bileşik Faiz' },
    { slug: 'fayans-hesaplama', k: 'konut-insaat', name: 'Fayans Hesaplama' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* HERO */}
      <div className="text-center mb-16 relative">
        <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-mono font-bold tracking-widest uppercase mb-6">
          v1.0.0
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold font-syne mb-6 tracking-tight">
          Türkiye'nin <span className="text-amber-500">Hesaplama Merkezi</span>
        </h1>
        <p className="text-gray-400 font-mono max-w-2xl mx-auto mb-10">
          Kira artışından maaş hesabına, yakıt masrafından sınav netine — 54 ücretsiz araç.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-gray-500">
          <div className="bg-[#13131f] border border-[#1e1e30] px-4 py-2 rounded-lg"><span className="text-white font-bold">54</span> Hesaplama Aracı</div>
          <div className="bg-[#13131f] border border-[#1e1e30] px-4 py-2 rounded-lg"><span className="text-white font-bold">7</span> Kategori</div>
          <div className="bg-[#13131f] border border-[#1e1e30] px-4 py-2 rounded-lg">Tamamen Ücretsiz</div>
          <div className="bg-[#13131f] border border-[#1e1e30] px-4 py-2 rounded-lg">Güncel Mevzuat</div>
        </div>
      </div>

      <SearchBar />

      <div className="mt-16">
        <h2 className="text-2xl font-bold font-syne mb-2">Kategoriler</h2>
        <CategoryGrid />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold font-syne mb-6">En Çok Kullanılanlar</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {popularTools.map(t => (
            <Link key={t.slug} href={`/${t.k}/${t.slug}`} className="bg-[#13131f] border border-[#1e1e30] px-4 py-3 rounded-lg text-sm text-center text-gray-300 hover:text-amber-500 hover:border-amber-500/50 transition-colors">
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      <AdSlot format="leaderboard" slot="1111111111" />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0e0e1a] border border-[#1e1e30] p-6 rounded-xl text-center">
          <div className="text-3xl mb-4">⚖️</div>
          <h3 className="font-bold text-lg mb-2">Güncel Mevzuat</h3>
          <p className="text-sm text-gray-500 font-mono">2024 yılına ait resmi rakamlar (asgari ücret, TÜFE, SGK vb.) ile kesin hesaplamalar.</p>
        </div>
        <div className="bg-[#0e0e1a] border border-[#1e1e30] p-6 rounded-xl text-center">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="font-bold text-lg mb-2">Hızlı & Ücretsiz</h3>
          <p className="text-sm text-gray-500 font-mono">Üyelik yok, bekleme yok. Hesaplamalarınızı saniyeler içinde ücretsiz yapın.</p>
        </div>
        <div className="bg-[#0e0e1a] border border-[#1e1e30] p-6 rounded-xl text-center">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="font-bold text-lg mb-2">Grafik & Detaylı Sonuç</h3>
          <p className="text-sm text-gray-500 font-mono">Sonuçları sadece bir rakam olarak değil, detaylı dökümler ve grafiklerle görün.</p>
        </div>
      </div>

      <AdSlot format="rectangle" slot="2222222222" />

      <div className="mt-16">
        <h2 className="text-2xl font-bold font-syne mb-6">Sıkça Sorulan Sorular</h2>
        <div className="flex flex-col gap-4">
          <div className="bg-[#13131f] border border-[#1e1e30] rounded-lg p-5">
            <h3 className="font-semibold text-gray-200 mb-2">Hesaplamalar güncel mevzuata göre mi?</h3>
            <p className="text-gray-400 text-sm">Evet. Tüm parametreler (asgari ücret, SGK oranları, TÜFE, vergi dilimleri) 2024 H2 için güncellenmiştir.</p>
          </div>
          <div className="bg-[#13131f] border border-[#1e1e30] rounded-lg p-5">
            <h3 className="font-semibold text-gray-200 mb-2">Kira artış hesaplaması nasıl yapılır?</h3>
            <p className="text-gray-400 text-sm">TBK 344 gereği yasal kira artışı TÜFE 12 aylık ortalamasını aşamaz. Hesaplayıcımız otomatik uygular.</p>
          </div>
          <div className="bg-[#13131f] border border-[#1e1e30] rounded-lg p-5">
            <h3 className="font-semibold text-gray-200 mb-2">Maaş hesaplaması ne kadar doğru?</h3>
            <p className="text-gray-400 text-sm">SGK ve Gelir Vergisi hesaplamaları resmi 2024 parametreleri kullanır. ±1 TL hata payı olabilir.</p>
          </div>
          <div className="bg-[#13131f] border border-[#1e1e30] rounded-lg p-5">
            <h3 className="font-semibold text-gray-200 mb-2">Döviz kurları güncel mi?</h3>
            <p className="text-gray-400 text-sm">TCMB resmi günlük kuru otomatik çekilir (saatte bir güncellenir).</p>
          </div>
        </div>
      </div>
    </div>
  )
}
