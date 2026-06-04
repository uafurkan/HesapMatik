import Link from 'next/link';
import { HESAPLAMA_DATA } from '@/lib/hesaplama-data';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {HESAPLAMA_DATA.map(cat => (
        <Link key={cat.slug} href={`/${cat.slug}`} className="bg-[#0e0e1a] border border-[#1e1e30] rounded-xl p-5 hover:border-gray-500 transition-colors">
          <div className="text-4xl mb-3">{cat.icon}</div>
          <h3 className="font-bold text-gray-100">{cat.name}</h3>
          <p className="text-xs text-gray-500 mt-2 font-mono">{cat.hesaplamalar.length} Araç</p>
        </Link>
      ))}
    </div>
  );
}
