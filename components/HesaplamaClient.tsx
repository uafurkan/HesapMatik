"use client";
import { useState, useEffect } from 'react';
import { Hesaplama } from '@/lib/hesaplama-data';
import * as formulas from '@/lib/formulas';
import GrafikWrapper, { CHART_COLORS } from './GrafikWrapper';
import AdSlot from './AdSlot';

export default function HesaplamaClient({ data, kategori, faqs }: { data: Hesaplama, kategori: string, faqs: {q:string, a:string}[] }) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

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
    if (missingRequired.length > 0) return;

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
    }
  }, [inputs, data.slug]);

  let chartData: any[] = [];
  if (result && data.grafik) {
    if (data.slug === 'kira-artis-hesaplama') chartData = [{ name: 'Mevcut Kira', value: result.mevcutKira }, { name: 'Artış', value: result.artis }];
    else if (data.slug === 'kidem-tazminati') chartData = [{ name: 'Net Tazminat', value: result.netTazminat }, { name: 'Damga Vergisi', value: result.damgaVergisi }];
    else if (data.slug === 'net-maas-hesaplama' && inputs.yon === 'bruttenNet') chartData = [{ name: 'Net Maaş', value: result.netMaas }, { name: 'SGK İşçi', value: result.sgkIssci }, { name: 'İşsizlik İşçi', value: result.issizlikIssci }, { name: 'Gelir Vergisi', value: result.gelirVergisi }, { name: 'Damga Vergisi', value: result.damgaVergisi }];
    else if (data.slug === 'konut-kredisi') chartData = result.amortismanTablosu?.map((r:any) => ({ name: `Ay ${r.ay}`, Anapara: r.anapara, Faiz: r.faiz })) || [];
    else if (data.slug === 'bmi-hesaplama') chartData = [{ name: 'BMI', value: result.bmi }];
    else if (data.slug === 'elektrik-faturasi' || data.slug === 'dogalgaz-faturasi') chartData = [{ name: 'Enerji Tutarı', value: result.enerjiTutar }, { name: 'Dağıtım Bedeli', value: result.dagitimBedeli }, { name: 'KDV', value: result.kdv }];
    else if (data.slug === 'tyt-net-hesaplama') chartData = result.tyt.map((r:any) => ({ name: r.ad, value: r.net }));
  }

  const categoryColor = Object.keys(CHART_COLORS).find(k => kategori.includes(k) || k.includes(kategori)) || 'finans';
  const colors = (CHART_COLORS as any)[categoryColor] || CHART_COLORS.finans;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 font-syne">{data.title}</h1>
      <p className="text-gray-400 mb-8 font-mono text-sm">{data.description}</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/5 bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-fit">
          <div className="flex flex-col gap-5">
            {data.inputs.map(input => (
              <div key={input.id} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  {input.label}
                  {input.helpText && <span className="text-xs text-gray-500 bg-gray-800 w-4 h-4 flex items-center justify-center rounded-full cursor-help" title={input.helpText}>?</span>}
                </label>
                
                {input.type === 'number' && (
                  <div className="relative">
                    <input 
                      type="number" min={input.min} max={input.max} step={input.step}
                      value={inputs[input.id] || ''}
                      onChange={e => handleChange(input.id, e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white font-mono focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder={input.defaultValue?.toString()}
                    />
                    {input.unit && <span className="absolute right-3 top-3 text-gray-500 font-mono text-sm">{input.unit}</span>}
                  </div>
                )}

                {input.type === 'select' && (
                  <select 
                    value={inputs[input.id] || ''}
                    onChange={e => handleChange(input.id, e.target.value)}
                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seçiniz...</option>
                    {input.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                {input.type === 'radio' && (
                  <div className="flex gap-4 mt-1">
                    {input.options?.map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input 
                          type="radio" name={input.id} value={opt.value}
                          checked={inputs[input.id] === opt.value}
                          onChange={e => handleChange(input.id, e.target.value)}
                          className="w-4 h-4 accent-blue-500"
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

        <div className="w-full lg:w-3/5">
          <AdSlot format="rectangle" slot="1234567890" />
          
          {result ? (
            <div className="bg-[#0e0e1a] border border-[#1e1e30] rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4 font-syne border-b border-gray-800 pb-2">Hesaplama Sonucu</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(result).filter(([k,v]) => typeof v === 'number' || typeof v === 'string').map(([key, value]) => (
                  <div key={key} className="bg-black/50 p-4 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-xl font-bold text-gray-100 font-mono">
                      {typeof value === 'number' ? value.toLocaleString('tr-TR') : value as string}
                    </div>
                  </div>
                ))}
              </div>

              {data.grafik && chartData.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 font-mono">// Grafik Görünümü</h3>
                  <GrafikWrapper type={data.grafik} data={chartData} colors={colors} />
                </div>
              )}

              {data.kaynaklar && data.kaynaklar.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    <span className="text-amber-500 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">Kanun Dayanağı</span>
                    {data.kaynaklar.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-gray-800 rounded-xl bg-[#0e0e1a]/50 border-dashed text-gray-500 font-mono">
              Hesaplama sonucunu görmek için sol taraftaki formu doldurun.
            </div>
          )}

          <AdSlot format="in-article" slot="0987654321" />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6 font-syne border-b border-gray-800 pb-2">Sıkça Sorulan Sorular</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#13131f] border border-[#1e1e30] rounded-lg p-5">
              <h3 className="font-semibold text-gray-200 mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
