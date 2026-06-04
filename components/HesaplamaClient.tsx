"use client";
import { useState, useEffect } from 'react';
import { Hesaplama } from '@/lib/hesaplama-data';
import * as formulas from '@/lib/formulas';
import GrafikWrapper, { CHART_COLORS } from './GrafikWrapper';
import AdSlot from './AdSlot';

export default function HesaplamaClient({ data, kategori, faqs }: { data: Hesaplama, kategori: string, faqs: {q:string, a:string}[] }) {
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
        if (data.slug === 'kira-artis-hesaplama') res = formulas.hesaplaKiraArtis(Number(inputs.mevcutKira), Number(inputs.tufeOran));
        else if (data.slug === 'kidem-tazminati') res = formulas.hesaplaKidemTazminati(Number(inputs.brutAylikUcret), Number(inputs.calismaSuresiAy));
        else if (data.slug === 'ihbar-tazminati') res = formulas.hesaplaIhbarTazminati(Number(inputs.brutAylikUcret), Number(inputs.calismaSuresiAy));
        else if (data.slug === 'net-maas-hesaplama') {
          if (inputs.yon === 'bruttenNet') res = formulas.hesaplaNetMaas(Number(inputs.brutMaas));
          else res = { targetBrut: formulas.hesaplaBrutMaas(Number(inputs.brutMaas)) };
        }
        else if (data.slug === 'konut-kredisi') res = formulas.hesaplaKonutKredisi(Number(inputs.anapara), Number(inputs.aylikFaizYuzde), Number(inputs.vadeSuresiAy));
        else if (data.slug === 'tyt-net-hesaplama') res = { tyt: formulas.hesaplaTYTNet([{ad:'Türkçe', dogru:Number(inputs.turkce_d), yanlis:Number(inputs.turkce_y)}, {ad:'Mat', dogru:Number(inputs.mat_d), yanlis:Number(inputs.mat_y)}, {ad:'Sosyal', dogru:Number(inputs.sosyal_d), yanlis:Number(inputs.sosyal_y)}, {ad:'Fen', dogru:Number(inputs.fen_d), yanlis:Number(inputs.fen_y)}]) };
        else if (data.slug === 'bmi-hesaplama') res = formulas.hesaplaBMI(Number(inputs.agirlik), Number(inputs.boy) / 100);
        else if (data.slug === 'kalori-ihtiyaci') res = formulas.hesaplaKalori(Number(inputs.agirlik), Number(inputs.boy), Number(inputs.yas), inputs.cinsiyet, Number(inputs.aktivite));
        else if (data.slug === 'fazla-mesai-ucreti') res = formulas.hesaplaFazlaMesai(Number(inputs.brutAylikUcret), Number(inputs.fazlaMesaiSaati), inputs.tur);
        else if (data.slug === 'elektrik-faturasi') res = formulas.hesaplaElektrikFaturasi(Number(inputs.aylikKwh));
        else if (data.slug === 'dogalgaz-faturasi') res = formulas.hesaplaDogalgazFaturasi(Number(inputs.aylikM3));
        else if (data.slug === 'yakit-masrafi') res = formulas.hesaplaYakitMasrafi(Number(inputs.km), Number(inputs.tuketim), Number(inputs.litreFiyat));
        else if (data.slug === 'boya-hesaplama') res = formulas.hesaplaBoya(Number(inputs.uzunluk), Number(inputs.genislik), inputs.tavan === 'evet', Number(inputs.kapiSayisi), Number(inputs.pencereSayisi));
        else if (data.slug === 'fayans-hesaplama') res = formulas.hesaplaFayans(Number(inputs.uzunluk), Number(inputs.genislik), Number(inputs.firingaYuzdesi), Number(inputs.boyutu));
        else if (data.slug === 'kdv-hesaplama') res = formulas.hesaplaKDV(Number(inputs.tutar), Number(inputs.oran), inputs.dahilMi === 'dahil');
        else if (data.slug === 'faiz-hesaplama') res = formulas.hesaplaBilesikFaiz(Number(inputs.anapara), Number(inputs.yillikFaiz), Number(inputs.sure), inputs.periyot);
        
        setResult(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCalculating(false);
      }
    }, 150); // slight delay for micro-animation feel
    
    return () => clearTimeout(timer);
  }, [inputs, data.slug]);

  let chartData: any[] = [];
  if (result && data.grafik) {
    if (data.slug === 'kira-artis-hesaplama') chartData = [{ name: 'Mevcut Kira', value: result.mevcutKira }, { name: 'Artış', value: result.artis }];
    else if (data.slug === 'kidem-tazminati') chartData = [{ name: 'Net Tazminat', value: result.netTazminat }, { name: 'Damga Vergisi', value: result.damgaVergisi }];
    else if (data.slug === 'net-maas-hesaplama' && inputs.yon === 'bruttenNet') chartData = [{ name: 'Net Maaş', value: result.netMaas }, { name: 'SGK İşçi', value: result.sgkIssci }, { name: 'İşsizlik', value: result.issizlikIssci }, { name: 'Gelir Vergisi', value: result.gelirVergisi }, { name: 'Damga Vergisi', value: result.damgaVergisi }];
    else if (data.slug === 'konut-kredisi') chartData = result.amortismanTablosu?.map((r:any) => ({ name: `Ay ${r.ay}`, Anapara: r.anapara, Faiz: r.faiz })) || [];
    else if (data.slug === 'bmi-hesaplama') chartData = [{ name: 'BMI', value: result.bmi }];
    else if (data.slug === 'elektrik-faturasi' || data.slug === 'dogalgaz-faturasi') chartData = [{ name: 'Enerji Tutarı', value: result.enerjiTutar }, { name: 'Dağıtım', value: result.dagitimBedeli }, { name: 'KDV', value: result.kdv }];
    else if (data.slug === 'tyt-net-hesaplama') chartData = result.tyt.map((r:any) => ({ name: r.ad, value: r.net }));
  }

  const categoryColor = Object.keys(CHART_COLORS).find(k => kategori.includes(k) || k.includes(kategori)) || 'finans';
  const colors = (CHART_COLORS as any)[categoryColor] || CHART_COLORS.finans;

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 overflow-hidden">
      <div className="mb-8 sm:mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 font-syne tracking-tight text-white drop-shadow-md break-words">{data.title}</h1>
        <p className="text-gray-400 font-mono text-xs sm:text-sm md:text-base max-w-2xl">{data.description}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
        {/* INPUTS (40%) */}
        <div className="w-full lg:w-[45%] h-fit animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="flex flex-col gap-6 relative z-10">
              {data.inputs.map(input => (
                <div key={input.id} className="flex flex-col gap-2 group">
                  <label className="text-sm font-bold text-gray-300 flex items-center gap-2 group-focus-within:text-amber-400 transition-colors font-syne">
                    {input.label}
                    {input.helpText && <span className="text-xs text-black bg-amber-500/80 w-5 h-5 flex items-center justify-center rounded-full cursor-help hover:bg-amber-400 transition-colors font-bold" title={input.helpText}>?</span>}
                  </label>
                  
                  {input.type === 'number' && (
                    <div className="relative">
                      <input 
                        type="number" min={input.min} max={input.max} step={input.step}
                        value={inputs[input.id] || ''}
                        onChange={e => handleChange(input.id, e.target.value)}
                        className="w-full bg-[#030305]/80 border border-white/10 rounded-xl p-3 sm:p-3.5 text-white font-mono text-base sm:text-sm focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:outline-none transition-all shadow-inner"
                        placeholder={input.defaultValue?.toString()}
                      />
                      {input.unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm font-bold">{input.unit}</span>}
                    </div>
                  )}

                  {input.type === 'select' && (
                    <select 
                      value={inputs[input.id] || ''}
                      onChange={e => handleChange(input.id, e.target.value)}
                      className="w-full bg-[#030305]/80 border border-white/10 rounded-xl p-3 sm:p-3.5 text-white focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 focus:outline-none transition-all shadow-inner font-mono text-base sm:text-sm appearance-none"
                    >
                      <option value="">Seçiniz...</option>
                      {input.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}

                  {input.type === 'radio' && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mt-1 bg-[#030305]/50 p-2 rounded-xl border border-white/5">
                      {input.options?.map(opt => (
                        <label key={opt.value} className="flex-1 min-w-[100px] flex items-center justify-center gap-2 text-sm text-gray-300 cursor-pointer bg-white/5 hover:bg-white/10 py-2 px-3 rounded-lg border border-transparent has-[:checked]:border-amber-500/50 has-[:checked]:bg-amber-500/10 has-[:checked]:text-amber-400 transition-all font-mono">
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
            <div className="h-64 glass-card rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="text-gray-400 font-mono text-sm animate-pulse">Hesaplanıyor...</div>
              </div>
            </div>
          ) : result ? (
            <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
              
              <h2 className="text-2xl font-black mb-6 font-syne border-b border-white/10 pb-4 text-white drop-shadow-md flex items-center gap-3">
                <span className="text-amber-500">❖</span> Hesaplama Sonucu
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {Object.entries(result).filter(([k,v]) => typeof v === 'number' || typeof v === 'string').map(([key, value]) => (
                  <div key={key} className="bg-black/40 p-4 sm:p-5 rounded-2xl border border-white/5 shadow-inner hover:border-amber-500/30 transition-colors group">
                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1.5 sm:mb-2 font-mono group-hover:text-gray-400 transition-colors">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-black text-white font-syne drop-shadow-sm group-hover:text-amber-400 transition-colors break-words">
                      {typeof value === 'number' ? value.toLocaleString('tr-TR') : value as string}
                    </div>
                  </div>
                ))}
              </div>

              {data.grafik && chartData.length > 0 && (
                <div className="mt-10 bg-black/40 p-6 rounded-2xl border border-white/5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 font-mono border-b border-white/5 pb-2">Görsel Analiz</h3>
                  <GrafikWrapper type={data.grafik} data={chartData} colors={colors} />
                </div>
              )}

              {data.kaynaklar && data.kaynaklar.length > 0 && (
                <div className="mt-8 pt-5 border-t border-white/10">
                  <div className="text-xs text-gray-400 font-mono flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                    <span className="text-amber-500 border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 rounded-md font-bold shadow-sm">Kanun Dayanağı</span>
                    {data.kaynaklar.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 glass-card rounded-3xl flex items-center justify-center border border-white/5 border-dashed shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-4 opacity-50">✨</div>
                <div className="text-gray-400 font-mono max-w-[200px] mx-auto text-sm leading-relaxed">
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

      <div className="mt-24 max-w-4xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-black mb-8 font-syne text-white">Sıkça Sorulan Sorular</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h3 className="font-bold text-gray-200 mb-3 text-lg font-syne flex items-start gap-3">
                <span className="text-amber-500 font-black">Q.</span> {faq.q}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-mono pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
