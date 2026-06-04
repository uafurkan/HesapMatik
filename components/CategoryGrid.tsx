import Link from 'next/link';
import { HESAPLAMA_DATA } from '@/lib/hesaplama-data';
import { Coins, Scale, GraduationCap, HeartPulse, Zap, Home, Calculator } from "lucide-react";
import React from 'react';

const CategoryIconMap: Record<string, React.ReactNode> = {
  "💰": <Coins size={28} className="text-amber-500 drop-shadow-md" />,
  "⚖️": <Scale size={28} className="text-blue-500 drop-shadow-md" />,
  "🎓": <GraduationCap size={28} className="text-emerald-500 drop-shadow-md" />,
  "🏥": <HeartPulse size={28} className="text-rose-500 drop-shadow-md" />,
  "⚡": <Zap size={28} className="text-yellow-500 drop-shadow-md" />,
  "🏠": <Home size={28} className="text-teal-500 drop-shadow-md" />,
  "📐": <Calculator size={28} className="text-indigo-500 drop-shadow-md" />
};

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {HESAPLAMA_DATA.map(cat => (
        <Link 
          key={cat.slug} 
          href={`/${cat.slug}`} 
          className="glass-card rounded-2xl p-6 group hover:-translate-y-1.5 hover:shadow-[0_10px_25px_var(--glass-card-shadow)] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 dark:bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          
          <div className="w-14 h-14 rounded-xl bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
            {CategoryIconMap[cat.icon] || <span className="emoji-premium">{cat.icon}</span>}
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg group-hover:text-black dark:group-hover:text-white transition-colors relative z-10 font-syne">{cat.name}</h3>
          <p className="text-xs text-gray-700 dark:text-gray-500 mt-2 font-mono group-hover:text-amber-400 transition-colors relative z-10 flex items-center gap-1">
            {cat.hesaplamalar.length} Araç <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </p>
        </Link>
      ))}
    </div>
  );
}
