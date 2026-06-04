"use client";
import { useState } from 'react';
import Link from 'next/link';
import { HESAPLAMA_DATA } from '@/lib/hesaplama-data';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const allTools = HESAPLAMA_DATA.flatMap(k => k.hesaplamalar.map(h => ({ ...h, kategori: k.slug })));
  const results = query.length > 1 
    ? allTools.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || (t.description || '').toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative max-w-2xl mx-auto my-8 z-50">
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isFocused ? 'shadow-[0_0_30px_rgba(255,179,71,0.2)] scale-[1.02]' : 'shadow-xl'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-blue-500/20 opacity-50 blur-xl pointer-events-none"></div>
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Hesaplama aracı ara... (kira, maaş, BMI...)"
          className="w-full glass-card border-black/10 dark:border-white/10 py-4 sm:py-5 px-5 sm:px-6 pl-12 sm:pl-14 text-gray-900 dark:text-white text-base sm:text-lg focus:outline-none focus:border-amber-500/50 transition-colors relative z-10"
        />
        <svg className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      
      {query.length > 1 && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-3 glass-card rounded-2xl overflow-hidden z-50 animate-slide-up border border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((r, i) => (
                <li key={i} className="border-b border-black/5 dark:border-white/5 last:border-none">
                  <Link href={`/${r.kategori}/${r.slug}`} className="block p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <div className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-amber-400 transition-colors">{r.title}</div>
                    <div className="text-sm text-gray-500 font-mono mt-1 group-hover:text-gray-600 dark:group-hover:text-gray-400">{r.description}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500 font-mono">
              <div className="text-3xl mb-2">🔍</div>
              Sonuç bulunamadı. Lütfen başka bir kelime deneyin.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
