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
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16 overflow-hidden">
      {/* HERO SECTION */}
      <div className="text-center mb-16 md:mb-20 relative animate-slide-up">
        <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(255,179,71,0.2)]">
          <span className="animate-pulse inline-block mr-2 w-2 h-2 rounded-full bg-amber-500"></span> 2026 Güncel Mevzuat
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-syne mb-6 tracking-tighter leading-[1.1] sm:leading-[1.1]">
          Türkiye'nin <br className="hidden sm:block"/>
          <span className="gradient-text">Hesaplama Merkezi</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-mono max-w-2xl mx-auto mb-10 text-sm sm:text-base md:text-lg leading-relaxed px-2">
          Kira artışından net maaş hesabına, YKS netinden kıdem tazminatına kadar 54 farklı aracı ücretsiz kullanın.
        </p>
        
        <SearchBar />
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8 text-[10px] sm:text-xs md:text-sm font-mono text-gray-600 dark:text-gray-400 px-2">
          <div className="glass px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-1.5 sm:gap-2 shadow-lg"><span className="text-amber-500 text-base sm:text-lg">⚡</span> 54 Araç</div>
          <div className="glass px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-1.5 sm:gap-2 shadow-lg"><span className="text-blue-400 text-base sm:text-lg">⚖️</span> %100 Yasal</div>
          <div className="glass px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-1.5 sm:gap-2 shadow-lg"><span className="text-green-400 text-base sm:text-lg">💸</span> Ücretsiz</div>
        </div>
      </div>

      <div className="mt-16 md:mt-24 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-syne text-gray-900 dark:text-white tracking-tight">Tüm Kategoriler</h2>
        </div>
        <CategoryGrid />
      </div>

      <div className="mt-20 md:mt-32 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl sm:text-3xl font-bold font-syne mb-6 sm:mb-8 text-gray-900 dark:text-white tracking-tight">En Çok Kullanılanlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {popularTools.map((t, i) => (
            <Link key={t.slug} href={`/${t.k}/${t.slug}`} className="glass-card rounded-2xl p-6 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(255,179,71,0.15)] hover:border-amber-500/50 transition-all duration-300 group">
              <div className="text-gray-800 dark:text-gray-200 font-bold text-lg group-hover:text-amber-400 transition-colors">{t.name}</div>
              <div className="text-xs text-gray-500 mt-3 font-mono group-hover:text-amber-500/70 transition-colors flex items-center gap-1">Hemen Hesapla <span className="group-hover:translate-x-1 transition-transform">→</span></div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <AdSlot format="leaderboard" slot="1111111111" />
      </div>

      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="glass-card p-8 sm:p-10 rounded-2xl sm:rounded-3xl text-center group hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(77,139,255,0.1)] transition-all duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-5 sm:mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-inner border border-blue-500/20">⚖️</div>
          <h3 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4 text-gray-900 dark:text-white font-syne">Güncel Mevzuat</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono leading-relaxed">2026 yılına ait resmi rakamlar (asgari ücret, TÜFE, SGK vb.) ile kesin hesaplamalar.</p>
        </div>
        <div className="glass-card p-8 sm:p-10 rounded-2xl sm:rounded-3xl text-center group hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(255,179,71,0.1)] transition-all duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-5 sm:mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-inner border border-amber-500/20">⚡</div>
          <h3 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4 text-gray-900 dark:text-white font-syne">Hızlı & Ücretsiz</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono leading-relaxed">Üyelik yok, bekleme yok. Hesaplamalarınızı saniyeler içinde tamamen ücretsiz yapın.</p>
        </div>
        <div className="glass-card p-8 sm:p-10 rounded-2xl sm:rounded-3xl text-center group hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(0,232,135,0.1)] transition-all duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-5 sm:mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-inner border border-green-500/20">📊</div>
          <h3 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4 text-gray-900 dark:text-white font-syne">Detaylı Grafik</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono leading-relaxed">Sonuçları sadece bir rakam olarak değil, detaylı dökümler ve interaktif grafiklerle görün.</p>
        </div>
      </div>

      <div className="mt-20">
        <AdSlot format="rectangle" slot="2222222222" />
      </div>
    </div>
  )
}
