import Link from 'next/link';
import { HESAPLAMA_DATA } from '@/lib/hesaplama-data';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {HESAPLAMA_DATA.map(cat => (
        <Link 
          key={cat.slug} 
          href={`/${cat.slug}`} 
          className="glass-card rounded-2xl p-6 group hover:-translate-y-1.5 hover:shadow-[0_10px_25px_var(--glass-card-shadow)] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          
          <div className="w-14 h-14 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
            {cat.icon}
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg group-hover:text-black dark:group-hover:text-white transition-colors relative z-10 font-syne">{cat.name}</h3>
          <p className="text-xs text-gray-500 mt-2 font-mono group-hover:text-amber-400 transition-colors relative z-10 flex items-center gap-1">
            {cat.hesaplamalar.length} Araç <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </p>
        </Link>
      ))}
    </div>
  );
}
