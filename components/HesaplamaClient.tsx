"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hesaplama } from '@/lib/hesaplama-data';
import * as formulas from '@/lib/formulas';
import GrafikWrapper, { CHART_COLORS } from './GrafikWrapper';
import AdSlot from './AdSlot';

export default function HesaplamaClient({ 
  data, 
  kategori, 
  faqs, 
  relatedTools = [] 
}: { 
  data: Hesaplama, 
  kategori: string, 
  faqs: { q: string, a: string }[], 
  relatedTools?: { slug: string, title: string, description?: string, icon: string }[] 
}) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const defaults: Record<string, any> = {};
    data.inputs.forEach(input => {
      if (input.defaultValue !== undefined) {
        defaults[input.id] = input.defaultValue;
      }
    });
    setInputs(defaults);
  }, [data]);

  const handleChange = (id: string, value: any) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const missingRequired = data.inputs.filter(i => i.required && (inputs[i.id] === undefined || inputs[i.id] === ''));
    if (missingRequired.length > 0) {
      setResult(null);
      return;
    }

    setIsCalculating(true);
    const timer = setTimeout(() => {
      try {
        let res = null;
        const formulaKey = data.formulaKey;
        if (formulaKey && typeof (formulas as any)[formulaKey] === 'function') {
          const args: Record<string, any> = {};
          data.inputs.forEach(input => {
            const raw = inputs[input.id];
            if (input.type === 'number' || input.type === 'range') {
              args[input.id] = raw !== undefined && raw !== '' ? Number(raw) : undefined;
            } else {
              args[input.id] = raw;
            }
          });
          res = (formulas as any)[formulaKey](args);
        }
        setResult(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCalculating(false);
      }
    }, 150); // slight delay for micro-animation feel
    
    return () => clearTimeout(timer);
  }, [inputs, data.formulaKey, data.slug]);

  let chartData: any[] = [];
  if (result && data.grafik) {
    if (data.grafikElesmesi && Array.isArray(data.grafikElesmesi)) {
      chartData = (data.grafikElesmesi as { name: string; key: string }[]).map(item => ({
        name: item.name,
        value: result[item.key]
      }));
    } else if (data.grafikElesmesi === 'amortisman') {
      chartData = result.amortismanTablosu?.map((r: any) => ({ name: `Ay ${r.ay}`, Anapara: r.anapara, Faiz: r.faiz })) || [];
    } else if (data.grafikElesmesi === 'tyt') {
      chartData = result.tyt?.map((r: any) => ({ name: r.ad, value: r.net })) || [];
    } else {
      // Default fallback: extract up to 5 numeric keys
      chartData = Object.entries(result)
        .filter(([k, v]) => typeof v === 'number' && k !== 'anapara' && k !== 'mevcutKira' && k !== 'brutMaas')
        .slice(0, 5)
        .map(([k, v]) => ({ name: k.replace(/([A-Z])/g, ' $1').trim(), value: v }));
    }
  }

  const categoryColor = Object.keys(CHART_COLORS).find(k => kategori.includes(k) || k.includes(kategori)) || 'finans';
  const colors = (CHART_COLORS as any)[categoryColor] || CHART_COLORS.finans;

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 overflow-hidden">
      <div className="mb-8 sm:mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 font-syne tracking-tight text-gray-900 dark:text-white drop-shadow-md break-words">{data.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 font-mono text-xs sm:text-sm md:text-base max-w-2xl">{data.description}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
        {/* INPUTS (40%) */}
        <div className="w-full lg:w-[45%] h-fit animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="flex flex-col gap-6 relative z-10">
              {data.inputs.map(input => (
                <div key={input.id} className="flex flex-col gap-2 group">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 group-focus-within:text-amber-400 transition-colors font-syne">
                    {input.label}
                    {input.helpText && <span className="text-xs text-black bg-amber-500/80 w-5 h-5 flex items-center justify-center rounded-full cursor-help hover:bg-amber-400 transition-colors font-bold" title={input.helpText}>?</span>}
                  </label>
                  
                  {input.type === 'number' && (
                    <div className="relative">
                      <input 
                        type="number" min={input.min} max={input.max} step={input.step}
                        value={inputs[input.id] || ''}
                        onChange={e => handleChange(input.id, e.target.value)}
                        className="w-full bg-white/80 dark:bg-[#030305]/80 border border-black/10 dark:border-white/10 rounded-xl p-3 sm:p-3.5 text-gray-900 dark:text-white font-mono text-base sm:text-sm focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:outline-none transition-all shadow-inner"
                        placeholder={input.defaultValue?.toString()}
                      />
                      {input.unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm font-bold">{input.unit}</span>}
                    </div>
                  )}

                  {input.type === 'select' && (
                    <select 
                      value={inputs[input.id] || ''}
                      onChange={e => handleChange(input.id, e.target.value)}
                      className="w-full bg-white/80 dark:bg-[#030305]/80 border border-black/10 dark:border-white/10 rounded-xl p-3 sm:p-3.5 text-gray-900 dark:text-white focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:outline-none transition-all shadow-inner font-mono text-base sm:text-sm appearance-none"
                    >
                      <option value="">Seçiniz...</option>
                      {input.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}

                  {input.type === 'radio' && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mt-1 bg-white/50 dark:bg-[#030305]/50 p-2 rounded-xl border border-black/5 dark:border-white/5">
                      {input.options?.map(opt => (
                        <label key={opt.value} className="flex-1 min-w-[100px] flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 py-2 px-3 rounded-lg border border-transparent has-[:checked]:border-amber-500/50 has-[:checked]:bg-amber-500/10 has-[:checked]:text-amber-400 transition-all font-mono">
                          <input 
                            type="radio" name={input.id} value={opt.value}
                            checked={inputs[input.id] === opt.value}
                            onChange={e => handleChange(input.id, e.target.value)}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS (55%) */}
        <div className="w-full lg:w-[55%] animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <AdSlot format="rectangle" slot="1234567890" />
          
          {isCalculating ? (
            <div className="h-64 glass-card rounded-3xl flex items-center justify-center border border-black/5 dark:border-white/5 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="text-gray-600 dark:text-gray-400 font-mono text-sm animate-pulse">Hesaplanıyor...</div>
              </div>
            </div>
          ) : result ? (
            <div className="glass-card rounded-3xl p-8 border border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
              
              <h2 className="text-2xl font-black mb-6 font-syne border-b border-black/10 dark:border-white/10 pb-4 text-gray-900 dark:text-white drop-shadow-md flex items-center gap-3">
                <span className="text-amber-500">❖</span> Hesaplama Sonucu
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {Object.entries(result).filter(([k,v]) => typeof v === 'number' || typeof v === 'string').map(([key, value]) => {
                  const isNumber = typeof value === 'number';
                  const valueStr = isNumber ? value.toLocaleString('tr-TR') : (value as string);
                  const isLongText = !isNumber && valueStr.length > 25;
                  
                  // Dynamic font size depending on character length
                  let fontSizeClass = "text-xl sm:text-2xl md:text-3xl";
                  if (valueStr.length > 25) {
                    fontSizeClass = "text-xs sm:text-sm md:text-base";
                  } else if (valueStr.length > 18) {
                    fontSizeClass = "text-sm sm:text-base md:text-lg";
                  } else if (valueStr.length > 12) {
                    fontSizeClass = "text-base sm:text-lg md:text-xl";
                  } else if (valueStr.length > 8) {
                    fontSizeClass = "text-lg sm:text-xl md:text-2xl";
                  }

                  return (
                    <div 
                      key={key} 
                      className={`bg-white/40 dark:bg-black/40 p-4 sm:p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner hover:border-amber-500/30 transition-colors group ${isLongText ? 'sm:col-span-2' : ''}`}
                    >
                      <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1.5 sm:mb-2 font-mono group-hover:text-gray-600 dark:text-gray-400 transition-colors">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className={`font-black text-gray-900 dark:text-white font-syne drop-shadow-sm group-hover:text-amber-400 transition-colors ${fontSizeClass} ${isNumber ? 'whitespace-nowrap overflow-x-auto scrollbar-none' : 'break-words'}`}>
                        {valueStr}
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.grafik && chartData.length > 0 && (
                <div className="mt-10 bg-white/40 dark:bg-black/40 p-6 rounded-2xl border border-black/5 dark:border-white/5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 font-mono border-b border-black/5 dark:border-white/5 pb-2">Görsel Analiz</h3>
                  <GrafikWrapper type={data.grafik} data={chartData} colors={colors} />
                </div>
              )}

              {data.kaynaklar && data.kaynaklar.length > 0 && (
                <div className="mt-8 pt-5 border-t border-black/10 dark:border-white/10">
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono flex items-center gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                    <span className="text-amber-500 border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 rounded-md font-bold shadow-sm">Kanun Dayanağı</span>
                    {data.kaynaklar.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 glass-card rounded-3xl flex items-center justify-center border border-black/5 dark:border-white/5 border-dashed shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-4 opacity-50">✨</div>
                <div className="text-gray-600 dark:text-gray-400 font-mono max-w-[200px] mx-auto text-sm leading-relaxed">
                  Hesaplama sonucunu görmek için sol taraftaki formu doldurun.
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <AdSlot format="in-article" slot="0987654321" />
          </div>
        </div>
      </div>

      {/* SEO Content Article Block */}
      {data.seoContent && (
        <div className="mt-16 max-w-4xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-6 font-syne text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-amber-500">ℹ</span> Detaylı Bilgi ve Hesaplama Metodolojisi
          </h2>
          <div 
            className="glass-card rounded-2xl p-6 sm:p-8 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed max-w-none shadow-md overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: data.seoContent }}
          />
        </div>
      )}

      {/* FAQs Section */}
      <div className="mt-16 max-w-4xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl sm:text-3xl font-black mb-8 font-syne text-gray-900 dark:text-white">Sıkça Sorulan Sorular</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card border border-black/5 dark:border-white/5 rounded-2xl p-6 hover:border-black/10 dark:border-white/10 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg font-syne flex items-start gap-3">
                <span className="text-amber-500 font-black">S.</span> {faq.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-mono pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tools suggestions */}
      {relatedTools && relatedTools.length > 0 && (
        <div className="mt-20 border-t border-black/10 dark:border-white/10 pt-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-8 font-syne text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-amber-500">✨</span> İlginizi Çekebilecek Diğer Hesaplamalar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedTools.map((tool) => (
              <Link 
                key={tool.slug} 
                href={`/${kategori}/${tool.slug}`} 
                className="glass-card rounded-xl p-5 border border-black/5 dark:border-white/5 hover:border-amber-500/30 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">{tool.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white font-syne text-sm group-hover:text-amber-400 transition-colors mb-2">{tool.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono line-clamp-2">{tool.description}</p>
                </div>
                <div className="text-amber-500 font-bold font-mono text-xs mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Hemen Hesapla →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
