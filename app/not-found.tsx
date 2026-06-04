import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fade-in text-center relative z-10">
      <div className="text-[120px] sm:text-[150px] font-black font-syne text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-amber-900 leading-none drop-shadow-lg mb-6">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-syne tracking-tight">Sayfa Bulunamadı</h1>
      <p className="text-gray-400 font-mono max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed">
        Aradığınız hesaplama aracı veya sayfa mevcut değil ya da silinmiş olabilir.
      </p>
      <Link href="/" className="px-8 py-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl font-bold font-mono hover:bg-amber-500 hover:text-[#030305] transition-all duration-300 shadow-[0_0_20px_rgba(255,179,71,0.2)] hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] group flex items-center gap-2">
        Ana Sayfaya Dön <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}
