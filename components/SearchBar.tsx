"use client";
import { useState } from 'react';
import Link from 'next/link';
import { HESAPLAMA_DATA } from '@/lib/hesaplama-data';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  
  const allTools = HESAPLAMA_DATA.flatMap(k => k.hesaplamalar.map(h => ({ ...h, kategori: k.slug })));
  const results = query.length > 1 
    ? allTools.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || (t.description || '').toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative max-w-2xl mx-auto my-8">
      <input 
        type="text" 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Hesaplama aracı ara... (kira, maaş, BMI...)"
        className="w-full bg-[#13131f] border border-[#1e1e30] rounded-xl py-4 px-6 text-white text-lg focus:outline-none focus:border-amber-500 shadow-xl"
      />
      
      {query.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131f] border border-[#1e1e30] rounded-xl shadow-2xl overflow-hidden z-50">
          {results.length > 0 ? (
            <ul>
              {results.map((r, i) => (
                <li key={i} className="border-b border-[#1e1e30] last:border-none">
                  <Link href={`/${r.kategori}/${r.slug}`} className="block p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="font-semibold text-gray-200">{r.title}</div>
                    <div className="text-sm text-gray-500 font-mono mt-1">{r.description}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">Sonuç bulunamadı.</div>
          )}
        </div>
      )}
    </div>
  );
}
