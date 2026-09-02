export interface HesaplamaInput {
  id: string
  label: string                    // Turkish label
  type: 'number' | 'select' | 'range' | 'radio'
  defaultValue?: number | string
  min?: number
  max?: number
  step?: number
  unit?: string                    // "TL", "ay", "km", "%", "m²", etc.
  options?: { value: string | number; label: string }[]
  helpText?: string                // tooltip açıklaması
  required: boolean
}

export interface Hesaplama {
  slug: string
  title: string
  description?: string              // 1 cümle, SEO-friendly
  seoTitle?: string                 // meta title şablonu
  seoDesc?: string                  // meta description şablonu
  formulaKey: string                // formulas.ts'deki fonksiyon adı
  inputs: HesaplamaInput[]
  grafik?: 'bar' | 'pie' | 'line' | 'gauge'
  grafikElesmesi?: { name: string; key: string }[] | string // Grafik eşleştirme şablonu
  kaynaklar?: string[]             // Yasal dayanak metinleri
  seoContent?: string              // HTML formatında zengin SEO makalesi
  customFaqs?: { q: string; a: string }[] // Araca özel Soru-Cevap ikilileri
}

export interface Kategori {
  slug: string
  name: string
  icon: string
  description?: string
  color: string                    // Tailwind color class (e.g. "amber", "blue")
  hesaplamalar: Hesaplama[]
}

export const HESAPLAMA_DATA: Kategori[] = [
  {
    slug: "finans",
    name: "Finans & Para",
    icon: "💰",
    color: "amber",
    hesaplamalar: [
      { slug: "kira-artis-hesaplama", title: "Kira Artış Hesaplama",
        description: "2026 TÜFE oranına göre yasal kira artış miktarını hesaplayın.",
        seoTitle: "2026 Yasal Kira Artış Hesaplama (TÜFE Güncel Oranları)",
        seoDesc: "2026 yılı güncel yasal kira artış oranı hesaplama aracı. TÜİK 12 aylık ortalama TÜFE oranlarına göre kira artışınızı kanuna uygun şekilde hesaplayın.",
        formulaKey: "hesaplaKiraArtis",
        inputs: [
          { id:"mevcutKira", label:"Mevcut Aylık Kira (TL)", type:"number", min:0, step:100, unit:"TL", required:true },
          { id:"tufeOran", label:"TÜFE 12 Aylık Ort. (%)", type:"number", defaultValue:32.43, min:0, max:200, step:0.01, unit:"%", helpText:"TÜİK tarafından aylık açıklanan en güncel 12 aylık ortalama TÜFE değeri", required:true }
        ],
        grafik: "bar",
        grafikElesmesi: [{ name: "Mevcut Kira", key: "mevcutKira" }, { name: "Artış", key: "artis" }],
        kaynaklar: ["TBK Madde 344"],
        customFaqs: [
          { q: "2026 kira artış oranı neye göre hesaplanır?", a: "2026 yılı itibarıyla konut ve iş yeri kiralarındaki yasal artış oranı, Borçlar Kanunu Madde 344 gereğince TÜİK tarafından açıklanan 12 aylık ortalama TÜFE (Tüketici Fiyat Endeksi) değişim oranına göre belirlenir. Bu oran yasal üst sınırdır; taraflar bu oranın altında bir artışta anlaşabilir ancak üzerinde artış yapamazlar." },
          { q: "Konut kiralarında %25 sınırı devam ediyor mu?", a: "Hayır. Konut kiralarındaki %25'lik yasal artış sınırı 1 Temmuz 2024 tarihi itibarıyla sona ermiştir. 2025 ve 2026 yıllarında yapılan ve yapılacak olan tüm kira sözleşmesi yenilemelerinde yasal üst sınır olarak yeniden TÜFE 12 aylık ortalaması baz alınmaktadır." },
          { q: "İşyeri kiralarında kira artış sınırı nedir?", a: "İşyeri (çatılı işyeri) kiralarında da yasal kira artış üst sınırı konutlarda olduğu gibi TÜİK 12 aylık ortalama TÜFE oranıdır. Sözleşmede daha düşük bir oran kararlaştırılmadıysa, yasal olarak bu oranın üzerinde artış talep edilemez." },
          { q: "Kira artış oranı yasal sınırın üzerinde yapılırsa ne olur?", a: "Borçlar Kanunu gereğince yasal üst sınır olan 12 aylık ortalama TÜFE'nin üzerinde yapılan artış anlaşmaları geçersizdir. Kiracı, yasal sınırın üzerindeki kısmı ödememe hakkına sahiptir. Ödenmişse, geriye dönük olarak sebepsiz zenginleşme hükümlerine göre iadesi talep edilebilir." }
        ],
        seoContent: `<div class="space-y-4">
  <p>2026 yılı güncel mevzuat kurallarına göre konut ve işyeri kira artış oranları, Türk Borçlar Kanunu'nun (TBK) 344. maddesi uyarınca belirlenmektedir. Bu maddeye göre kira sözleşmelerinin yenilenmesinde uygulanacak artış oranı, bir önceki kira yılındaki <strong>Tüketici Fiyat Endeksi'nin (TÜFE) 12 aylık ortalamasını</strong> geçemez.</p>
  
  <h4 class="text-base font-bold text-amber-500 mt-4 mb-2 font-syne">Yasal Kira Artışı Formülü</h4>
  <div class="bg-black/10 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 font-mono text-xs sm:text-sm my-3 text-gray-900 dark:text-white">
    Yeni Kira = Mevcut Kira + (Mevcut Kira x Yasal TÜFE Oranı / 100)<br>
    Artış Miktarı = Mevcut Kira x Yasal TÜFE Oranı / 100
  </div>
  
  <h4 class="text-base font-bold text-amber-500 mt-4 mb-2 font-syne">2026 Yılı Kira Artış Kuralları ve Sınırları</h4>
  <ul class="list-disc pl-5 space-y-2">
    <li><strong>%25 Sınırının Durumu:</strong> Konut kiralarında uygulanan %25'lik sabit kira artış tavanı 1 Temmuz 2024'te resmen sona ermiştir. Güncel dönemde yasal tavan yeniden TÜFE 12 aylık ortalaması olmuştur.</li>
    <li><strong>Yasal Üst Sınır:</strong> Sözleşmede TÜFE oranından daha yüksek bir artış oranı yazsa dahi, kanunen TÜİK'in 12 aylık ortalama TÜFE oranının üzerinde kira artışı yapılamaz. Fazla kısım yasal olarak geçersiz sayılır.</li>
    <li><strong>İşyeri Kiraları:</strong> İşyerleri için de konutlar gibi 12 aylık ortalama TÜFE sınırı geçerlidir.</li>
    <li><strong>5 Yıllık Kira Tespit Davası:</strong> Kira sözleşmesinin başlangıcından itibaren 5 yıl geçtikten sonra, yeni kira döneminde uygulanacak kira bedelinin belirlenmesi için taraflar "Kira Tespit Davası" açabilir. Bu davada hakim, TÜFE oranına bağlı kalmaksızın emsal kira bedellerine göre hakkaniyete uygun yeni bir kira belirler.</li>
  </ul>
</div>` },
      { slug: "kidem-tazminati", title: "Kıdem Tazminatı Hesaplama",
        description: "Çalışma sürenize ve brüt ücretinize göre kıdem tazminatı hesaplayın.",
        seoTitle: "2026 Kıdem Tazminatı Hesaplama (Güncel Tavan ve Limitler)",
        seoDesc: "2026 yılı H2 dönemine ait güncel kıdem tazminatı tavanı (64.948,77 TL) ve yasal kesintilerle brütten nete kıdem tazminatı hesaplama aracı.",
        formulaKey: "hesaplaKidemTazminati",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", min:0, step:500, unit:"TL", required:true },
          { id:"calismaSuresiAy", label:"Çalışma Süresi (Ay)", type:"number", min:1, max:600, unit:"ay", required:true }
        ],
        grafik: "pie",
        grafikElesmesi: [{ name: "Net Tazminat", key: "netTazminat" }, { name: "Damga Vergisi", key: "damgaVergisi" }],
        kaynaklar: ["İş Kanunu Madde 14"],
        customFaqs: [
          { q: "Kıdem tazminatı alma şartları nelerdir?", a: "Kıdem tazminatına hak kazanabilmek için; aynı işverene bağlı işyerinde en az 1 tam yıl çalışmış olmak ve iş sözleşmesinin haklı nedenlerle (sağlık sorunları, mobbing vb.), askerlik, emeklilik, kadının evlenmesi (1 yıl içinde) veya işveren tarafından ahlak dışı haller haricinde feshedilmesi gerekir." },
          { q: "2026 kıdem tazminatı tavanı ne kadar?", a: "2026 yılı H2 dönemi itibarıyla kıdem tazminatının yıllık yasal tavanı 64.948,77 TL'dir. Brüt maaşınız ne kadar yüksek olursa olsun, her bir çalışma yılı için ödenecek brüt kıdem tazminatı bu tutarı aşamaz." },
          { q: "Kıdem tazminatından hangi vergiler kesilir?", a: "Kıdem tazminatı, Gelir Vergisi'nden muaftır. Kıdem tazminatı ödemesinden yasal olarak sadece %0.759 (binde 7,59) oranında Damga Vergisi kesintisi yapılır." },
          { q: "Evlilik nedeniyle istifa eden kadin kidem tazminati alabilir mi?", a: "Evet. Kadın çalışanlar, resmi evlilik tarihinden itibaren 1 yıl içerisinde iş sözleşmesini tek taraflı feshederek kıdem tazminatını talep etme hakkına sahiptir. Bu durumda 1 yıllık kıdem şartının sağlanmış olması gereklidir." }
        ],
        seoContent: `<div class="space-y-4">
  <p>Kıdem tazminatı, 1475 sayılı İş Kanunu'nun yürürlükte kalan 14. maddesine göre düzenlenen, işçinin yıpranma payı ve geleceğe yönelik güvencesidir. En az 1 yıl çalışmış olan işçinin, kanunda belirtilen haklı gerekçelerle işten ayrılması veya işveren tarafından haksız yere işten çıkarılması durumunda her yıl için 30 günlük brüt ücreti tutarında kıdem tazminatı ödenir.</p>
  
  <h4 class="text-base font-bold text-amber-500 mt-4 mb-2 font-syne">Kıdem Tazminatı Hesaplama Formülü</h4>
  <div class="bg-black/10 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 font-mono text-xs sm:text-sm my-3 text-gray-900 dark:text-white">
    Brüt Kıdem Tazminatı = (Brüt Aylık Maaş + Düzenli Yan Haklar) x Çalışılan Yıl Sayısı<br>
    Net Kıdem Tazminatı = Brüt Kıdem Tazminatı - (%0.759 Damga Vergisi Kesintisi)
  </div>
  
  <h4 class="text-base font-bold text-amber-500 mt-4 mb-2 font-syne">2026 Yılı Kıdem Tazminatı Kuralları</h4>
  <ul class="list-disc pl-5 space-y-2">
    <li><strong>2026 Kıdem Tazminatı Tavanı:</strong> 2026 yılı H2 dönemi itibarıyla yasal kıdem tavanı <strong>64.948,77 TL</strong>'dir. Maaşınız bu tutardan yüksek olsa bile hesaplamada bu tavan uygulanır.</li>
    <li><strong>Gelir Vergisi Muafiyeti:</strong> Kıdem tazminatından Gelir Vergisi alınmaz.</li>
    <li><strong>Damga Vergisi Kesintisi:</strong> Tazminat tutarından sadece binde 7,59 oranında damga vergisi kesilir.</li>
    <li><strong>Giydirilmiş Ücret Baz Alınır:</strong> Hesaplamada sadece çıplak brüt maaş değil; yol, yemek, yakacak yardımı, ikramiye, prim gibi düzenli ödenen tüm sosyal yardımlar (giydirilmiş ücret) hesaba katılır.</li>
  </ul>
</div>` },
      { slug: "ihbar-tazminati", title: "İhbar Tazminatı Hesaplama",
        description: "Çalışma sürenize göre ihbar tazminatı haklarınızı ve kesintileri hesaplayın.",
        formulaKey: "hesaplaIhbarTazminati",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"calismaSuresiAy", label:"Çalışma Süresi (Ay)", type:"number", min:1, unit:"ay", required:true }
        ],
        grafik: "bar",
        grafikElesmesi: [{ name: "Net Tazminat", key: "netTazminat" }, { name: "Damga Vergisi", key: "damgaVergisi" }],
        kaynaklar: ["İş Kanunu Madde 17"] },
      { slug: "net-maas-hesaplama", title: "Net Maaş Hesaplama",
        description: "2026 vergi ve SGK kesintileriyle brütten nete veya netten brüte maaş hesaplayın.",
        seoTitle: "2026 Net Maaş Hesaplama (Brütten Nete & Kesintiler)",
        seoDesc: "2026 yılı güncel vergi dilimleri (%15 - %40) ve SGK işçi kesintileri ile brütten nete veya netten brüte maaş hesaplama aracı.",
        formulaKey: "hesaplaNetMaas",
        inputs: [
          { id:"brutMaas", label:"Maaş Miktarı (TL)", type:"number", min:0, step:500, unit:"TL", required:true },
          { id:"yon", label:"Hesaplama Yönü", type:"radio",
            options:[{value:"bruttenNet",label:"Brütten Nete"},{value:"nettenBrut",label:"Netten Brüte"}],
            defaultValue:"bruttenNet", required:true }
        ],
        grafik: "pie",
        grafikElesmesi: [{ name: "Net Maaş", key: "netMaas" }, { name: "SGK İşçi", key: "sgkIssci" }, { name: "İşsizlik", key: "issizlikIssci" }, { name: "Gelir Vergisi", key: "gelirVergisi" }, { name: "Damga Vergisi", key: "damgaVergisi" }],
        customFaqs: [
          { q: "2026 asgari ücret tutarı ne kadardır?", a: "2026 yılı için belirlenen resmi Net Asgari Ücret 28.075,50 TL, Brüt Asgari Ücret ise 33.030,00 TL'dir. Bu tutarlar tüm Türkiye genelinde asgari sınır olarak uygulanmaktadır." },
          { q: "Maaştan yapılan yasal kesintiler nelerdir?", a: "Brüt maaştan; %14 oranında SGK İşçi Payı, %1 oranında İşsizlik Sigortası İşçi Payı, gelir miktarına göre kademeli Gelir Vergisi (%15, %20, %27, %35, %40) ve %0.759 oranında Damga Vergisi kesilerek Net Maaş bulunur. Ancak 2026 yılı asgari ücret istisnası gereği, brüt asgari ücrete denk gelen gelir ve damga vergisi kısımları maaşlardan düşülmez (vergi istisnası uygulanır)." },
          { q: "2026 yılı gelir vergisi dilimleri nasıldır?", a: "2026 yılı kümülatif vergi matrahı dilimleri sırasıyla %15, %20, %27, %35 ve %40 olarak uygulanır. Matrahınız arttıkça kesilen vergi oranı yükselir ve net maaşınız yıl ortasında düşüş gösterebilir." },
          { q: "Asgari ücret vergi istisnası nedir?", a: "Tüm ücretlilerin aylık brüt asgari ücrete (33.030,00 TL) kadar olan kazançları Gelir Vergisi ve Damga Vergisi'nden muaftır. Bu istisna sayesinde tüm çalışanların net maaşı aylık bazda yasal vergi muafiyeti oranında korunur." }
        ],
        seoContent: `<div class="space-y-4">
  <p>Maaş hesaplaması, işveren tarafından ödenen brüt ücretin, devlet tarafından belirlenen yasal kesintiler düşüldükten sonra çalışanın eline geçen net ücret haline getirilmesi işlemidir. 2026 yılı vergi mevzuatına göre tüm ücretliler için kademeli vergi dilimleri ve asgari ücret vergi istisnası uygulanmaktadır.</p>
  
  <h4 class="text-base font-bold text-amber-500 mt-4 mb-2 font-syne">Brütten Nete Maaş Hesaplama Formülü</h4>
  <div class="bg-black/10 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 font-mono text-xs sm:text-sm my-3 text-gray-900 dark:text-white">
    SGK İşçi Payı = Brüt Maaş x %14<br>
    İşsizlik Sigortası Payı = Brüt Maaş x %1<br>
    Gelir Vergisi Matrahı = Brüt Maaş - (SGK İşçi + İşsizlik Payı)<br>
    Brüt Gelir Vergisi = Gelir Vergisi Matrahı x Vergi Dilimi Oranı (%15 - %40)<br>
    Asgari Ücret Gelir Vergisi İstisnası = Brüt Asgari Ücret Vergi Payı (Maks. İstisna)<br>
    Ödenecek Gelir Vergisi = Brüt Gelir Vergisi - İstisna Tutarı<br>
    Net Maaş = Brüt Maaş - SGK İşçi - İşsizlik Payı - Ödenecek Gelir Vergisi - Ödenecek Damga Vergisi
  </div>
  
  <h4 class="text-base font-bold text-amber-500 mt-4 mb-2 font-syne">2026 Maaş Parametreleri ve Kesintiler</h4>
  <ul class="list-disc pl-5 space-y-2">
    <li><strong>2026 Brüt Asgari Ücret:</strong> 33.030,00 TL</li>
    <li><strong>2026 Net Asgari Ücret:</strong> 28.075,50 TL</li>
    <li><strong>Gelir Vergisi Dilimleri:</strong> Kümülatif matraha göre %15'ten başlayıp %40'a kadar yükselen vergi dilimleri maaşınızın aylar geçtikçe düşmesine neden olabilir.</li>
    <li><strong>Asgari Ücret İstisnası:</strong> Tüm çalışanların aylık maaşlarında asgari ücret tutarındaki kısımdan gelir ve damga vergisi kesintisi yapılmaz.</li>
  </ul>
</div>` },
      { slug: "konut-kredisi", title: "Konut Kredisi Hesaplama",
        description: "Konut kredisi faiz oranlarına ve vadeye göre ödeme planı çıkarın.",
        formulaKey: "hesaplaKonutKredisi",
        inputs: [
          { id:"anapara", label:"Kredi Miktarı (TL)", type:"number", min:0, step:10000, unit:"TL", required:true },
          { id:"aylikFaizYuzde", label:"Aylık Faiz Oranı (%)", type:"number", min:0, max:10, step:0.01, unit:"%", defaultValue:2.89, required:true },
          { id:"vadeSuresiAy", label:"Vade Süresi", type:"select",
            options:[{value:60,label:"5 Yıl (60 Ay)"},{value:84,label:"7 Yıl (84 Ay)"},{value:120,label:"10 Yıl (120 Ay)"},{value:180,label:"15 Yıl (180 Ay)"},{value:240,label:"20 Yıl (240 Ay)"}],
            defaultValue:120, required:true }
        ],
        grafik: "line",
        grafikElesmesi: "amortisman" },
      { slug: "kdv-hesaplama-finans", title: "KDV Hesaplama (Finans)",
        description: "KDV dahil ve hariç fiyatları hızlıca hesaplayın.",
        formulaKey: "hesaplaKDV",
        inputs: [
          { id:"tutar", label:"Tutar (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"oran", label:"KDV Oranı (%)", type:"select", options:[{value:1,label:"%1"},{value:10,label:"%10"},{value:20,label:"%20"}], defaultValue:20, required:true },
          { id:"dahilMi", label:"KDV Durumu", type:"radio", options:[{value:"dahil",label:"Fiyata Dahil"},{value:"haric",label:"Fiyata Dahil Değil"}], required:true }
        ],
        grafik: "pie",
        grafikElesmesi: [{ name: "KDV Hariç Tutar", key: "kdvsizFiyat" }, { name: "KDV Tutarı", key: "kdvTutar" }] },
      { slug: "faiz-hesaplama", title: "Bileşik Faiz Hesaplama",
        description: "Anaparanın vade sonundaki bileşik faiz getirisini hesaplayın.",
        formulaKey: "hesaplaBilesikFaiz",
        inputs: [
          { id:"anapara", label:"Anapara (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"yillikFaiz", label:"Yıllık Faiz (%)", type:"number", min:0, max:500, step:0.1, unit:"%", required:true },
          { id:"sure", label:"Süre", type:"number", min:1, required:true },
          { id:"periyot", label:"Süre Birimi", type:"select", options:[{value:"yillik",label:"Yıl"},{value:"aylik",label:"Ay"},{value:"gunluk",label:"Gün"}], required:true }
        ],
        grafik: "line",
        grafikElesmesi: [{ name: "Anapara", key: "anapara" }, { name: "Kazanç", key: "kazanc" }] },
      { slug: "mevduat-faizi", title: "Mevduat Faizi Hesaplama",
        description: "2026 stopaj oranlarına göre mevduat faiz getirinizi hesaplayın.",
        formulaKey: "hesaplaMevduatFaizi",
        inputs: [
          { id:"anapara", label:"Anapara (TL)", type:"number", required:true },
          { id:"yillikFaiz", label:"Yıllık Faiz Oranı (%)", type:"number", defaultValue:45, required:true },
          { id:"vadeGun", label:"Vade (Gün)", type:"number", defaultValue:32, required:true }
        ],
        grafik: "pie",
        grafikElesmesi: [{ name: "Anapara", key: "anapara" }, { name: "Net Kazanç", key: "netKazanc" }, { name: "Stopaj", key: "stopajTutar" }] },
      { slug: "kredi-kartı-asgari", title: "Kredi Kartı Asgari Ödeme",
        description: "Kredi kartı borcunuzun asgari ödeme tutarını ve gecikme faizini hesaplayın.",
        formulaKey: "hesaplaKrediKartıAsgari",
        inputs: [
          { id:"toplamBorc", label:"Toplam Kart Borcu (TL)", type:"number", required:true }
        ] },
      { slug: "ihtiyac-kredisi", title: "İhtiyaç Kredisi Hesaplama",
        description: "%15 KKDF ve %15 BSMV dahil ihtiyaç kredisi ödeme planı.",
        formulaKey: "hesaplaKrediGenel",
        inputs: [
          { id:"anapara", label:"Kredi Miktarı (TL)", type:"number", required:true },
          { id:"yillikFaiz", label:"Yıllık Faiz Oranı (%)", type:"number", defaultValue:45, required:true },
          { id:"vadeAy", label:"Vade (Ay)", type:"number", defaultValue:12, required:true },
          { id:"kkdfYuzde", label:"KKDF Oranı (%)", type:"number", defaultValue:15, required:true },
          { id:"bsmvYuzde", label:"BSMV Oranı (%)", type:"number", defaultValue:15, required:true }
        ] },
      { slug: "tasit-kredisi", title: "Taşıt Kredisi Hesaplama",
        description: "%15 KKDF ve %5 BSMV dahil taşıt kredisi ödeme planı.",
        formulaKey: "hesaplaKrediGenel",
        inputs: [
          { id:"anapara", label:"Kredi Miktarı (TL)", type:"number", min:0, required:true },
          { id:"yillikFaiz", label:"Yıllık Faiz Oranı (%)", type:"number", defaultValue:40, min:0, max:150, required:true },
          { id:"vadeAy", label:"Vade (Ay)", type:"number", defaultValue:36, min:1, max:60, required:true },
          { id:"kkdfYuzde", label:"KKDF Oranı (%)", type:"number", defaultValue:15, min:0, max:50, required:true },
          { id:"bsmvYuzde", label:"BSMV Oranı (%)", type:"number", defaultValue:5, min:0, max:50, required:true }
        ] },
      { slug: "enflasyon-etkisi", title: "Enflasyon Satın Alma Gücü",
        description: "Enflasyonun yıllar içindeki paranızın değerine olan etkisini hesaplayın.",
        formulaKey: "hesaplaEnflasyonEtkisi",
        inputs: [
          { id:"tutar", label:"Tutar (TL)", type:"number", required:true },
          { id:"baslangicYili", label:"Başlangıç Yılı", type:"number", defaultValue:2020, required:true },
          { id:"hedefYil", label:"Hedef Yıl", type:"number", defaultValue:2026, required:true }
        ] },
      { slug: "gelir-vergisi", title: "Gelir Vergisi Dilimleri 2026",
        description: "2026 resmi gelir vergisi dilimlerine göre ödeyeceğiniz vergiyi hesaplayın.",
        formulaKey: "hesaplaGelirVergisi",
        inputs: [
          { id:"yillikGelir", label:"Yıllık Net Matrah (TL)", type:"number", required:true }
        ] },
      { slug: "mtv-hesaplama", title: "MTV Hesaplama 2026",
        description: "2026 güncel Motorlu Taşıtlar Vergisi (MTV) tutarlarını hesaplayın.",
        formulaKey: "hesaplaMTV",
        inputs: [
          { id:"aracTuru", label:"Araç Türü", type:"select", options:[{value:"binek",label:"Binek Otomobil"},{value:"motosiklet",label:"Motosiklet"},{value:"ticari",label:"Hafif Ticari"}], defaultValue:"binek", required:true },
          { id:"motorHacmi", label:"Motor Hacmi (cc)", type:"number", defaultValue:1600, required:true },
          { id:"aracYasi", label:"Araç Yaşı", type:"number", defaultValue:3, required:true }
        ] },
      { slug: "altin-degeri", title: "Altın Değeri Hesaplama",
        description: "Gram miktarına ve birim fiyata göre altın portföy değerinizi hesaplayın.",
        formulaKey: "hesaplaAltinDegeri",
        inputs: [
          { id:"gramFiyati", label:"Gram Altın Fiyatı (TL)", type:"number", defaultValue:3150, required:true },
          { id:"miktar", label:"Miktar (Gram)", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "doviz-cevirici", title: "Döviz Çevirici",
        description: "Döviz miktarını güncel kur üzerinden Türk Lirasına çevirin.",
        formulaKey: "hesaplaDovizCevirici",
        inputs: [
          { id:"miktar", label:"Döviz Miktarı", type:"number", defaultValue:100, required:true },
          { id:"kur", label:"Döviz Kuru (TL)", type:"number", defaultValue:34.50, required:true }
        ] },
      { slug: "doviz-arbitraj", title: "Döviz Arbitraj Hesaplama",
        description: "İki farklı yabancı para birimi arasındaki çapraz kur dönüşümü.",
        formulaKey: "hesaplaDovizArbitraj",
        inputs: [
          { id:"miktar", label:"Kaynak Döviz Miktarı", type:"number", defaultValue:1000, required:true },
          { id:"parite", label:"Çapraz Kur Paritesi (Örn: EUR/USD)", type:"number", defaultValue:1.08, required:true }
        ] },
      { slug: "bes-devlet-katkisi", title: "BES %30 Devlet Katkısı",
        description: "Bireysel Emeklilik Sisteminde %30 devlet katkılı birikim simülasyonu.",
        formulaKey: "hesaplaBES",
        inputs: [
          { id:"aylikKatki", label:"Aylık Katkı Payı (TL)", type:"number", defaultValue:2000, min:0, required:true },
          { id:"sureYil", label:"Sistemde Kalış Süresi (Yıl)", type:"number", defaultValue:10, min:1, max:60, required:true },
          { id:"fonGetirisi", label:"Beklenen Yıllık Fon Getirisi (%)", type:"number", defaultValue:25, min:0, max:100, required:true }
        ] },
      { slug: "temettu-hesaplama", title: "Temettü (Kâr Payı) Net Getiri",
        description: "Brüt temettü gelirinden %10 stopaj kesintisi sonrası net kazancı hesaplayın.",
        formulaKey: "hesaplaTemettu",
        inputs: [
          { id:"brutTemettu", label:"Brüt Temettü Geliri (TL)", type:"number", required:true },
          { id:"stopajOrani", label:"Stopaj Oranı (%)", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "repo-getirisi", title: "Repo Getirisi Hesaplama",
        description: "Repo yatırımlarının stopaj kesintisi sonrası net getirisini hesaplayın.",
        formulaKey: "hesaplaRepo",
        inputs: [
          { id:"anapara", label:"Anapara (TL)", type:"number", required:true },
          { id:"gunlukFaiz", label:"Günlük Faiz Oranı (%)", type:"number", defaultValue:0.12, required:true },
          { id:"vadeGun", label:"Vade (Gün)", type:"number", defaultValue:7, required:true }
        ] },
      { slug: "hisse-ortalama", title: "Hisse Senedi Maliyet Ortalama",
        description: "Farklı fiyatlardan alınan hisse senetlerinin ortalama maliyetini hesaplayın.",
        formulaKey: "hesaplaHisseOrtalama",
        inputs: [
          { id:"adet1", label:"1. Alım Adedi", type:"number", required:true },
          { id:"fiyat1", label:"1. Alım Fiyatı (TL)", type:"number", required:true },
          { id:"adet2", label:"2. Alım Adedi", type:"number", required:true },
          { id:"fiyat2", label:"2. Alım Fiyatı (TL)", type:"number", required:true }
        ] },
      { slug: "kripto-kar-zarar", title: "Kripto Kar/Zarar Hesaplama",
        description: "Alış-satış komisyonları dahil net kripto para kâr veya zararınızı hesaplayın.",
        formulaKey: "hesaplaKriptoKarZarar",
        inputs: [
          { id:"alisFiyati", label:"Alış Fiyatı (USD)", type:"number", required:true },
          { id:"satisFiyati", label:"Satış Fiyatı (USD)", type:"number", required:true },
          { id:"adet", label:"Adet", type:"number", required:true },
          { id:"komisyonOrani", label:"Komisyon Oranı (%)", type:"number", defaultValue:0.1, required:true }
        ] },
      { slug: "reel-faiz", title: "Reel Faiz Getirisi",
        description: "Nominal faiz getirisini enflasyondan arındırarak net kazancı bulun.",
        formulaKey: "hesaplaReelFaiz",
        inputs: [
          { id:"nominalFaiz", label:"Nominal Faiz Oranı (%)", type:"number", required:true },
          { id:"enflasyonOrani", label:"Beklenen Enflasyon Oranı (%)", type:"number", required:true }
        ] },
      { slug: "roi-hesaplama", title: "ROI (Yatırım Geri Dönüşü)",
        description: "Girişim veya gayrimenkul yatırımlarının geri dönüş süresini ve ROI oranını hesaplayın.",
        formulaKey: "hesaplaROI",
        inputs: [
          { id:"yatirimMaliyeti", label:"Yatırım Maliyeti (TL)", type:"number", required:true },
          { id:"yillikGetiri", label:"Yıllık Net Getiri (TL)", type:"number", required:true }
        ] },
      { slug: "damga-vergisi-hesaplama", title: "Damga Vergisi Hesaplama",
        description: "Resmi belgelerin ve sözleşmelerin 2026 damga vergisi tutarlarını hesaplayın.",
        formulaKey: "hesaplaDamgaVergisi",
        inputs: [
          { id:"tutar", label:"Sözleşme/Belge Tutarı (TL)", type:"number", required:true },
          { id:"belgeTuru", label:"Belge Türü", type:"select", options:[{value:"sozlesme",label:"Genel Sözleşme (%0.948)"},{value:"kira",label:"Kira Sözleşmesi (%0.189)"},{value:"ihale",label:"İhale Kararı (%0.569)"}], defaultValue:"sozlesme", required:true }
        ] }
    ]
  },
  {
    slug: "is-hukuku",
    name: "İş Hukuku",
    icon: "⚖️",
    color: "blue",
    hesaplamalar: [
      { slug: "fazla-mesai-ucreti", title: "Fazla Mesai Ücreti Hesaplama",
        description: "İş Kanununa göre normal ve resmi tatil mesai alacaklarınızı hesaplayın.",
        formulaKey: "hesaplaFazlaMesai",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", unit:"TL", required:true },
          { id:"fazlaMesaiSaati", label:"Fazla Mesai Saati", type:"number", min:1, max:270, unit:"saat", required:true },
          { id:"tur", label:"Mesai Türü", type:"radio", options:[{value:"normal",label:"Normal (%50 zamlı)"},{value:"gecegunduz",label:"Gece/Hafta Sonu (%100 zamlı)"}], required:true }
        ],
        grafik: "bar",
        grafikElesmesi: [{ name: "Standart Saatlik", key: "saatlikUcret" }, { name: "Zamlı Saatlik", key: "zamliSaatlik" }],
        kaynaklar: ["İş Kanunu Madde 41"] },
      { slug: "brut-net-cevirici", title: "Brüt-Net Maaş Çevirici 2026",
        description: "Güncel SGK ve vergi oranlarıyla anında maaş dönüşümü.",
        formulaKey: "hesaplaBrutNetCevirici",
        inputs: [
          { id:"miktar", label:"Maaş (TL)", type:"number", unit:"TL", required:true },
          { id:"yon", label:"Yön", type:"radio", options:[{value:"b2n",label:"Brüt → Net"},{value:"n2b",label:"Net → Brüt"}], required:true }
        ],
        grafik: "pie",
        grafikElesmesi: [{ name: "Net Maaş", key: "netMaas" }, { name: "SGK Kesintisi", key: "sgkIssci" }, { name: "Vergiler", key: "gelirVergisi" }] },
      { slug: "yillik-izin-ucreti", title: "Yıllık İzin Ücreti Hesaplama",
        description: "Kullanılmayan yıllık izin günlerinin çıkışta hak edilen net ücretini hesaplayın.",
        formulaKey: "hesaplaYillikIzinUcreti",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"calismaSuresiYil", label:"Kıdem (Yıl)", type:"number", required:true },
          { id:"kullanilmayanGun", label:"Kullanılmayan İzin Günü", type:"number", required:true }
        ],
        kaynaklar: ["İş Kanunu Madde 53-57"] },
      { slug: "issizlik-maasi-hesapla", title: "İşsizlik Maaşı Hesaplama",
        description: "2026 yılı asgari ve azami sınırları doğrultusunda işsizlik maaşı tutarı hesaplayın.",
        formulaKey: "hesaplaIssizlikMaasi",
        inputs: [
          { id:"primGunSayisi", label:"Son 3 Yıldaki Toplam Prim Günü", type:"number", defaultValue:900, required:true },
          { id:"sonDortAyOrtalamaBrut", label:"Son 4 Aylık Ortalama Brüt Maaş (TL)", type:"number", required:true }
        ],
        kaynaklar: ["4447 Sayılı Kanun Madde 50"] },
      { slug: "part-time-sgk", title: "Part-Time SGK Gün Hesaplama",
        description: "Kısmi zamanlı çalışma saatlerine göre SGK prim günü ve eksik gün hesabı.",
        formulaKey: "hesaplaPartTimeSGK",
        inputs: [
          { id:"aylikCalismaSaati", label:"Aylık Toplam Çalışma Saati", type:"number", defaultValue:90, required:true }
        ] },
      { slug: "ise-iade-tazminati", title: "İşe İade Tazminatı Hesaplama",
        description: "İşe iade davası sonucu hak kazanılan boşta geçen süre ve başlatmama tazminatları.",
        formulaKey: "hesaplaIseIadeTazminati",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"bosSureAy", label:"Boşta Geçen Süre (Maks 4 Ay)", type:"number", defaultValue:4, required:true },
          { id:"tazminatAy", label:"İşe Başlatmama Tazminatı (4-8 Ay)", type:"number", defaultValue:5, required:true }
        ] },
      { slug: "kotuniyet-tazminati", title: "Kötüniyet Tazminatı Hesaplama",
        description: "Güvencesiz fesih durumunda ihbar süresinin 3 katı tutarındaki tazminat hesabı.",
        formulaKey: "hesaplaKotuniyetTazminati",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"calismaSuresiAy", label:"Çalışma Süresi (Ay)", type:"number", required:true }
        ],
        kaynaklar: ["İş Kanunu Madde 18"] },
      { slug: "askerlik-borclanmasi", title: "Askerlik Borçlanması 2026",
        description: "Askerlikte geçen süreleri borçlanarak emekliliğe saydırmanın 2026 maliyeti.",
        formulaKey: "hesaplaAskerlikBorclanmasi",
        inputs: [
          { id:"borclanilanGun", label:"Borçlanılacak Gün Sayısı", type:"number", defaultValue:540, required:true }
        ] },
      { slug: "dogum-borclanmasi", title: "Doğum Borçlanması 2026",
        description: "Doğum borçlanması ile kazanılan günlerin 2026 yılı asgari prim maliyetleri.",
        formulaKey: "hesaplaDogumBorclanmasi",
        inputs: [
          { id:"çocukSayisi", label:"Çocuk Sayısı (Maks 3)", type:"number", defaultValue:1, required:true },
          { id:"borclanilanGun", label:"Borçlanılacak Toplam Gün", type:"number", defaultValue:720, required:true }
        ] },
      { slug: "yurtdisi-borclanmasi", title: "Yurtdışı Borçlanması 2026",
        description: "Yurtdışı çalışma sürelerini borçlanmanın 2026 yılı güncel yasal maliyeti.",
        formulaKey: "hesaplaYurtdisiBorclanmasi",
        inputs: [
          { id:"borclanilanGun", label:"Borçlanılacak Gün Sayısı", type:"number", required:true }
        ] },
      { slug: "malulen-emeklilik", title: "Malulen Emeklilik Şartları",
        description: "İş gücü kaybı ve prim gün sayısına göre malulen emeklilik durum değerlendirmesi.",
        formulaKey: "hesaplaMalulenEmeklilik",
        inputs: [
          { id:"sgkGirisYili", label:"İlk SGK Giriş Yılı", type:"number", defaultValue:2010, required:true },
          { id:"primGunSayisi", label:"Toplam Prim Gün Sayısı", type:"number", defaultValue:1800, required:true },
          { id:"engelOrani", label:"İş Gücü Kaybı / Engel Oranı (%)", type:"number", defaultValue:60, required:true }
        ] },
      { slug: "engelli-emeklilik", title: "Engelli Emeklilik & Vergi İndirimi",
        description: "Engellilik derecesine göre erken emeklilik prim gün şartları.",
        formulaKey: "hesaplaEngelliEmeklilik",
        inputs: [
          { id:"engelOrani", label:"Engel Oranı (%)", type:"number", required:true },
          { id:"primGunSayisi", label:"Mevcut Prim Gün Sayısı", type:"number", required:true }
        ] },
      { slug: "sgdp-maliyeti", title: "Emekli Çalışan (SGDP) Maliyeti",
        description: "Emekli olup 4A kapsamında çalışanların işverene olan 2026 yılı prim maliyeti.",
        formulaKey: "hesaplaSGDPMaliyeti",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true }
        ] },
      { slug: "giydirilmis-ucret", title: "Giydirilmiş Ücret Hesaplama",
        description: "Tazminat hesaplamalarında kullanılan giydirilmiş aylık/günlük ücret hesabı.",
        formulaKey: "hesaplaGiydirilmisUcret",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Çıplak Aylık Ücret (TL)", type:"number", required:true },
          { id:"aylikYemekYardimi", label:"Aylık Yemek Yardımı (TL/ay)", type:"number", defaultValue:0, required:true },
          { id:"aylikYolYardimi", label:"Aylık Yol Yardımı (TL/ay)", type:"number", defaultValue:0, required:true },
          { id:"yillikIkramiyeTutari", label:"Yıllık Toplam İkramiye (TL/yıl)", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "is-kazasi-odenegi", title: "İş Kazası Geçici İş Göremezlik",
        description: "İş kazası raporlu günlerinde SGK'dan alınacak geçici iş göremezlik ödenekleri.",
        formulaKey: "hesaplaIsKazasiOdenegi",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"gunSayisi", label:"Raporlu Gün Sayısı", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "hafta-tatili-ucreti", title: "Hafta Tatili Çalışma Ücreti",
        description: "Haftalık izin (Pazar) günlerinde yapılan çalışmalar için hak edilen %150 zamlı ücret.",
        formulaKey: "hesaplaHaftaTatiliUcreti",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"pazarCalisilanGun", label:"Çalışılan Pazar Günü Sayısı", type:"number", defaultValue:1, required:true }
        ] },
      { slug: "ubgt-hesaplama", title: "Resmi Tatil (UBGT) Çalışma Ücreti",
        description: "Resmi tatil ve bayram günlerinde yapılan çalışmaların çift yevmiye alacak hesabı.",
        formulaKey: "hesaplaUBGT",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"calisilanResmiTatilGunu", label:"Çalışılan Resmi Tatil Gün Sayısı", type:"number", defaultValue:1, required:true }
        ] },
      { slug: "sendika-aidati", title: "Sendika Aidat Kesintisi",
        description: "Brüt maaştan kesilecek sendikal üyelik aidatı tutarını hesaplayın.",
        formulaKey: "hesaplaSendikaAidati",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"aidatYevmiyeAdet", label:"Aidat Yevmiye Miktarı (Gün)", type:"number", defaultValue:1, required:true }
        ] },
      { slug: "asgari-ucret-istisnasi", title: "Asgari Ücret Vergi İstisnası",
        description: "2026 yılı asgari ücret tutarına isabet eden gelir ve damga vergisi muafiyetleri.",
        formulaKey: "hesaplaAsgariUcretVergiIstisnasi",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true }
        ] },
      { slug: "isci-ibraname", title: "İşçi İbraname Alacak Hesaplama",
        description: "İşten ayrılan personelin hak ettiği tüm kalemlerin (kıdem, ihbar, izin) toplam net dökümü.",
        formulaKey: "hesaplaIsciIbraname",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"calismaSuresiAy", label:"Toplam Çalışma Süresi (Ay)", type:"number", required:true },
          { id:"kullanilmayanIzinGun", label:"Kullanılmayan Yıllık İzin (Gün)", type:"number", defaultValue:0, required:true },
          { id:"fazlaMesaiSaati", label:"Ödenmemiş Fazla Mesai (Saat)", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "hakli-nedenle-istifa", title: "Haklı Nedenle İstifa Hakkı",
        description: "İşçinin haklı fesih (istifa) durumunda tazminat hak edip edemeyeceğini sorgulayın.",
        formulaKey: "hesaplaHakliNedenleIstifa",
        inputs: [
          { id:"mobbingVarMi", label:"İşyerinde Mobbing (Psikolojik Baskı) Var mı?", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], defaultValue:"hayir", required:true },
          { id:"maasGecikmesiVarMi", label:"Maaş Ödemelerinde Düzenli Gecikme Var mı?", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], defaultValue:"hayir", required:true },
          { id:"sigortaEksikMi", label:"SGK Primleri Eksik veya Düşük mü Yatıyor?", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], defaultValue:"hayir", required:true }
        ],
        kaynaklar: ["İş Kanunu Madde 24/II"] },
      { slug: "stajyer-maasi", title: "Stajyer Maaşı Hesaplama 2026",
        description: "2026 yılı asgari ücreti üzerinden güncel stajyer ve çırak aylık ücretleri.",
        formulaKey: "hesaplaStajyerMaasi",
        inputs: [
          { id:"stajTuru", label:"Staj/Çıraklık Türü", type:"select", options:[{value:"lise_universite",label:"Lise/Üniversite Stajı (%30)"},{value:"muhendislik",label:"Mühendislik Stajyerliği (%60)"},{value:"aday_cirak",label:"Aday Çırak / Çırak (%30)"}], defaultValue:"lise_universite", required:true }
        ],
        kaynaklar: ["3308 Sayılı Kanun Madde 25"] },
      { slug: "isveren-tehsivikleri", title: "İşveren SGK Teşvik Hesaplama",
        description: "2026 yılı 5 puanlık imalat indirimi ve 2 puanlık genel teşvik hesaplaması.",
        formulaKey: "hesaplaIsverenSGKTehvikleri",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", required:true },
          { id:"sektor", label:"Sektör Türü", type:"radio", options:[{value:"imalat",label:"İmalat Sanayi (5 Puan Teşvik)"},{value:"diger",label:"Diğer Sektörler (2 Puan Teşvik)"}], defaultValue:"diger", required:true }
        ] },
      { slug: "kumulatif-vergi-takibi", title: "Kümülatif Vergi Dilimi Takibi",
        description: "Aylık kazançların birikerek sonraki aylarda maaş vergi kesintisine olan etkisini hesaplayın.",
        formulaKey: "hesaplaKumulatifVergiTakibi",
        inputs: [
          { id:"aylikBrutMaas", label:"Aylık Brüt Maaş (TL)", type:"number", required:true },
          { id:"baslangicAyAdet", label:"Yıl İçinde Geçen Çalışılan Ay Adedi", type:"number", defaultValue:6, required:true }
        ] },
      { slug: "tazminat-zaman-asimi", title: "Tazminat Zaman Aşımı Sorgusu",
        description: "Kıdem ve ihbar tazminatı alacaklarının zaman aşımına uğrayıp uğramadığını kontrol edin.",
        formulaKey: "hesaplaTazminatZamanAsimi",
        inputs: [
          { id:"tazminatMiktarı", label:"Alacak Miktarı (TL)", type:"number", required:true },
          { id:"hakEdisYili", label:"İşten Çıkış Yılı", type:"number", defaultValue:2025, required:true }
        ],
        kaynaklar: ["7036 Sayılı Kanun Madde 15"] }
    ]
  },
  {
    slug: "egitim",
    name: "Eğitim & Sınav",
    icon: "🎓",
    color: "green",
    hesaplamalar: [
      { slug: "tyt-net-hesaplama", title: "TYT Net Hesaplama 2026",
        description: "TYT Türkçe, Matematik, Sosyal ve Fen branşları için net hesaplayın.",
        formulaKey: "hesaplaTYTNet",
        inputs: [
          { id:"turkce_d", label:"Türkçe Doğru", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"turkce_y", label:"Türkçe Yanlış", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"mat_d", label:"Matematik Doğru", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"mat_y", label:"Matematik Yanlış", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"sosyal_d", label:"Sosyal Bilimler Doğru", type:"number", min:0, max:20, defaultValue:0, required:true },
          { id:"sosyal_y", label:"Sosyal Bilimler Yanlış", type:"number", min:0, max:20, defaultValue:0, required:true },
          { id:"fen_d", label:"Fen Bilimleri Doğru", type:"number", min:0, max:20, defaultValue:0, required:true },
          { id:"fen_y", label:"Fen Bilimleri Yanlış", type:"number", min:0, max:20, defaultValue:0, required:true }
        ],
        grafik: "bar",
        grafikElesmesi: "tyt" },
      { slug: "not-ortalamasi", title: "Not Ortalaması Hesaplama",
        description: "4'lük ve 100'lük sistemde ağırlıklı not ortalaması hesaplayın.",
        formulaKey: "hesaplaNotOrtalamasi",
        inputs: [
          { id:"sistem", label:"Not Sistemi", type:"radio", options:[{value:"100",label:"100'lük"},{value:"4",label:"4'lük"}], defaultValue:"100", required:true },
          { id:"ders1_not", label:"1. Ders Notu", type:"number", required:true },
          { id:"ders1_kredi", label:"1. Ders Kredisi", type:"number", defaultValue:3, required:true },
          { id:"ders2_not", label:"2. Ders Notu", type:"number", required:false },
          { id:"ders2_kredi", label:"2. Ders Kredisi", type:"number", defaultValue:3, required:false },
          { id:"ders3_not", label:"3. Ders Notu", type:"number", required:false },
          { id:"ders3_kredi", label:"3. Ders Kredisi", type:"number", defaultValue:3, required:false },
          { id:"ders4_not", label:"4. Ders Notu", type:"number", required:false },
          { id:"ders4_kredi", label:"4. Ders Kredisi", type:"number", defaultValue:3, required:false },
          { id:"ders5_not", label:"5. Ders Notu", type:"number", required:false },
          { id:"ders5_kredi", label:"5. Ders Kredisi", type:"number", defaultValue:3, required:false }
        ] },
      { slug: "ayt-puan-hesaplama", title: "AYT Puan Hesaplama",
        description: "2026 katsayıları ve OBP puanınız ile AYT puanınızı hesaplayın.",
        formulaKey: "hesaplaAYTPuan",
        inputs: [
          { id:"say_d", label:"Sayısal Doğru", type:"number", defaultValue:0, required:true },
          { id:"say_y", label:"Sayısal Yanlış", type:"number", defaultValue:0, required:true },
          { id:"soz_d", label:"Sözel Doğru", type:"number", defaultValue:0, required:true },
          { id:"soz_y", label:"Sözel Yanlış", type:"number", defaultValue:0, required:true },
          { id:"ea_d", label:"Eşit Ağırlık Doğru", type:"number", defaultValue:0, required:true },
          { id:"ea_y", label:"Eşit Ağırlık Yanlış", type:"number", defaultValue:0, required:true },
          { id:"obp", label:"OBP (Ortaöğretim Başarı Puanı)", type:"number", defaultValue:70, required:true }
        ] },
      { slug: "yks-obp-yerlestirme", title: "YKS Yerleştirme Puanı (OBP)",
        description: "OBP katsayı etkisi eklenmiş YKS yerleştirme puanı hesaplayın.",
        formulaKey: "hesaplaYKSYerlestirme",
        inputs: [
          { id:"hamPuan", label:"YKS Ham Puanı", type:"number", required:true },
          { id:"obp", label:"OBP (Diploma Notu × 5)", type:"number", defaultValue:350, required:true },
          { id:"okulBirincisi", label:"Okul Birincisi misiniz?", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], defaultValue:"hayir", required:true }
        ] },
      { slug: "kpss-lisans", title: "KPSS Lisans Puan Hesaplama",
        description: "GK-GY netlerine göre tahmini KPSS Lisans P3 puanı.",
        formulaKey: "hesaplaKPSS",
        inputs: [
          { id:"gy_d", label:"Genel Yetenek Doğru", type:"number", defaultValue:0, required:true },
          { id:"gy_y", label:"Genel Yetenek Yanlış", type:"number", defaultValue:0, required:true },
          { id:"gk_d", label:"Genel Kültür Doğru", type:"number", defaultValue:0, required:true },
          { id:"gk_y", label:"Genel Kültür Yanlış", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "kpss-onlisans-ortaogretim", title: "KPSS Ön Lisans / Ortaöğretim",
        description: "Ön lisans ve lise düzeyi KPSS puan hesaplama aracı.",
        formulaKey: "hesaplaKPSS",
        inputs: [
          { id:"gy_d", label:"Genel Yetenek Doğru", type:"number", defaultValue:0, required:true },
          { id:"gy_y", label:"Genel Yetenek Yanlış", type:"number", defaultValue:0, required:true },
          { id:"gk_d", label:"Genel Kültür Doğru", type:"number", defaultValue:0, required:true },
          { id:"gk_y", label:"Genel Kültür Yanlış", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "kpss-oabt", title: "KPSS ÖABT Puan Hesaplama",
        description: "Alan sınavı ağırlığı dahil öğretmenlik KPSS puanı.",
        formulaKey: "hesaplaKPSS",
        inputs: [
          { id:"gy_d", label:"Genel Yetenek Doğru", type:"number", defaultValue:0, required:true },
          { id:"gk_d", label:"Genel Kültür Doğru", type:"number", defaultValue:0, required:true },
          { id:"egitim_d", label:"Eğitim Bilimleri Doğru", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "lgs-puan-hesaplama", title: "LGS Puan Hesaplama",
        description: "2026 katsayıları ve 3 yanlış 1 doğruyu götürür kuralıyla standart LGS puanı.",
        formulaKey: "hesaplaLGS",
        inputs: [
          { id:"turkce_d", label:"Türkçe Doğru", type:"number", defaultValue:0, required:true },
          { id:"turkce_y", label:"Türkçe Yanlış", type:"number", defaultValue:0, required:true },
          { id:"mat_d", label:"Matematik Doğru", type:"number", defaultValue:0, required:true },
          { id:"mat_y", label:"Matematik Yanlış", type:"number", defaultValue:0, required:true },
          { id:"fen_d", label:"Fen Doğru", type:"number", defaultValue:0, required:true },
          { id:"fen_y", label:"Fen Yanlış", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "ales-puan", title: "ALES Puan Hesaplama",
        description: "ALES sayısal, sözel ve eşit ağırlık tahmini puan hesabı.",
        formulaKey: "hesaplaALES",
        inputs: [
          { id:"say_d", label:"Sayısal Doğru", type:"number", defaultValue:0, required:true },
          { id:"say_y", label:"Sayısal Yanlış", type:"number", defaultValue:0, required:true },
          { id:"soz_d", label:"Sözel Doğru", type:"number", defaultValue:0, required:true },
          { id:"soz_y", label:"Sözel Yanlış", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "dgs-puan", title: "DGS Puan Hesaplama",
        description: "Dikey Geçiş Sınavı puanı ve ön lisans OBP katkısı.",
        formulaKey: "hesaplaDGS",
        inputs: [
          { id:"say_d", label:"Sayısal Doğru", type:"number", defaultValue:0, required:true },
          { id:"say_y", label:"Sayısal Yanlış", type:"number", defaultValue:0, required:true },
          { id:"soz_d", label:"Sözel Doğru", type:"number", defaultValue:0, required:true },
          { id:"soz_y", label:"Sözel Yanlış", type:"number", defaultValue:0, required:true },
          { id:"onlisansBasariPuani", label:"Önlisans Başarı Puanı (ÖBP)", type:"number", defaultValue:60, required:true }
        ] },
      { slug: "yds-seviye", title: "YDS Seviye & Puan Hesaplama",
        description: "YDS ve e-YDS doğru sayısına göre puan ve harf seviyesi tespiti.",
        formulaKey: "hesaplaYDS",
        inputs: [
          { id:"dogruSayisi", label:"Doğru Sayısı (Maks 80)", type:"number", required:true }
        ] },
      { slug: "yokdil-puan", title: "YÖKDİL Puan Hesaplama",
        description: "YÖKDİL doğru sayısına göre tahmini yabancı dil sınav puanı.",
        formulaKey: "hesaplaYOKDIL",
        inputs: [
          { id:"dogruSayisi", label:"Doğru Sayısı (Maks 80)", type:"number", required:true }
        ] },
      { slug: "not-sistemi-cevirici", title: "Not Sistemi Çevirici",
        description: "100'lük ve 4'lük not sistemleri arası YÖK standart dönüşümü.",
        formulaKey: "hesaplaNotSistemiCevirici",
        inputs: [
          { id:"notu", label:"Not Değeri", type:"number", required:true },
          { id:"kaynakSistem", label:"Kaynak Not Sistemi", type:"radio", options:[{value:"100",label:"100'lük Sistem"},{value:"4",label:"4'lük Sistem"}], defaultValue:"100", required:true }
        ] },
      { slug: "can-egrisi-hesaplama", title: "Çan Eğrisi Not Hesaplama",
        description: "Sınıf ortalaması ve standart sapmaya göre çan eğrisi harf notu tahmini.",
        formulaKey: "hesaplaCanEgrisi",
        inputs: [
          { id:"ogrenciNotu", label:"Öğrenci Sınav Notu", type:"number", required:true },
          { id:"sinifOrtalamasi", label:"Sınıf Ortalaması", type:"number", defaultValue:50, required:true },
          { id:"standartSapma", label:"Sınıf Standart Sapması", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "takdir-tesekkur", title: "Takdir & Teşekkür Belgesi",
        description: "MEB yönetmeliğine uygun ders saati ağırlıklı takdir-teşekkür sorgulama.",
        formulaKey: "hesaplaTakdirTesekkur",
        inputs: [
          { id:"donemOrtalamasi", label:"Dönem Ortalaması", type:"number", required:true },
          { id:"zayıfDersSayisi", label:"Zayıf Ders Sayısı", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "lise-sinif-gecme", title: "Lise Sınıf Geçme / Kalma",
        description: "Zayıf sayısı ve ortalamaya göre sınıf geçme/sorumluluk tespiti.",
        formulaKey: "hesaplaLiseSinifGecme",
        inputs: [
          { id:"donemOrtalamasi", label:"Dönem Ortalaması", type:"number", required:true },
          { id:"zayıfDersSayisi", label:"Zayıf Ders Sayısı", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "tus-puan", title: "TUS Puan Hesaplama",
        description: "Tıpta Uzmanlık Sınavı temel tıp ve klinik tıp puan hesabı.",
        formulaKey: "hesaplaTUS",
        inputs: [
          { id:"tıp_d", label:"Temel Tıp Doğru", type:"number", defaultValue:0, required:true },
          { id:"tıp_y", label:"Temel Tıp Yanlış", type:"number", defaultValue:0, required:true },
          { id:"klinik_d", label:"Klinik Tıp Doğru", type:"number", defaultValue:0, required:true },
          { id:"klinik_y", label:"Klinik Tıp Yanlış", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "dus-puan", title: "DUS Puan Hesaplama",
        description: "Diş Hekimliğinde Uzmanlık Sınavı (DUS) puan hesabı.",
        formulaKey: "hesaplaDUS",
        inputs: [
          { id:"d_d", label:"Doğru Sayısı", type:"number", defaultValue:0, required:true },
          { id:"d_y", label:"Yanlış Sayısı", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "eus-puan", title: "EUS Puan Hesaplama",
        description: "Eczacılıkta Uzmanlık Sınavı (EUS) puan hesabı.",
        formulaKey: "hesaplaEUS",
        inputs: [
          { id:"e_d", label:"Doğru Sayısı", type:"number", defaultValue:0, required:true },
          { id:"e_y", label:"Yanlış Sayısı", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "universite-harclari", title: "Üniversite Harç Ücretleri",
        description: "Fakülte türüne ve okul uzama durumuna göre harç bedeli hesaplayın.",
        formulaKey: "hesaplaUniversiteHarclari",
        inputs: [
          { id:"fakulteTuru", label:"Fakülte Türü", type:"select", options:[{value:"tip",label:"Tıp Fakültesi"},{value:"muhendislik",label:"Mühendislik"},{value:"hukuk",label:"Hukuk"},{value:"edebiyat",label:"Edebiyat/Fen"}], defaultValue:"muhendislik", required:true },
          { id:"uzatilanDonemAdet", label:"Uzatılan Dönem Sayısı", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "gpa-ects-cevirici", title: "GPA & ECTS Not Çevirici",
        description: "Yerel GPA not ortalamanızı ECTS harf karşılıklarına dönüştürün.",
        formulaKey: "hesaplaGPADonusturuci",
        inputs: [
          { id:"gpa", label:"Not Ortalaması (4'lük sistem)", type:"number", required:true },
          { id:"ulke", label:"Hedef Bölge", type:"radio", options:[{value:"US",label:"Amerika (US GPA)"},{value:"EU",label:"Avrupa (ECTS Grade)"}], defaultValue:"EU", required:true }
        ] },
      { slug: "lisansustu-kabul", title: "Yüksek Lisans Kabul Puanı",
        description: "ALES, YDS ve lisans mezuniyet notunun ağırlıklı akademik kabul puan hesabı.",
        formulaKey: "hesaplaLisansustuKabul",
        inputs: [
          { id:"alesPuani", label:"ALES Puanı", type:"number", required:true },
          { id:"ydsPuani", label:"YDS / Yabancı Dil Puanı", type:"number", required:true },
          { id:"mezuniyetNotu", label:"Lisans Mezuniyet Notu (4'lük)", type:"number", required:true }
        ] },
      { slug: "sinav-geri-sayim", title: "Sınav Geri Sayım Sayacı",
        description: "2026 yılı merkezi sınavlarına (YKS, KPSS vb.) kalan gün sayısı.",
        formulaKey: "hesaplaSinavGeriSayim",
        inputs: [
          { id:"sinavTuru", label:"Sınav Seçin", type:"select", options:[{value:"YKS",label:"YKS 2026 (Haziran)"},{value:"KPSS",label:"KPSS 2026 (Temmuz)"},{value:"LGS",label:"LGS 2026 (Haziran)"},{value:"ALES",label:"ALES 2026 (Nisan)"}], defaultValue:"YKS", required:true }
        ] },
      { slug: "pomodoro-zamanlayici", title: "Pomodoro Çalışma Döngüsü",
        description: "Çalışma ve mola döngü sürelerinizi planlayın.",
        formulaKey: "hesaplaPomodoro",
        inputs: [
          { id:"calismaTur", label:"Pomodoro Modu", type:"radio", options:[{value:"klasik",label:"Klasik (25 dk çalışma, 5 dk mola)"},{value:"uzun",label:"Uzun Odak (50 dk çalışma, 10 dk mola)"}], defaultValue:"klasik", required:true }
        ] },
      { slug: "soru-basina-sure", title: "Soru Başına Süre Ölçer",
        description: "Sınavlarda soru başına düşen saniye ve dakika miktarını ölçün.",
        formulaKey: "hesaplaSoruBasinaSure",
        inputs: [
          { id:"toplamSoru", label:"Toplam Soru Sayısı", type:"number", required:true },
          { id:"toplamSureDk", label:"Toplam Sınav Süresi (Dakika)", type:"number", required:true }
        ] }
    ]
  },
  {
    slug: "saglik",
    name: "Sağlık",
    icon: "🏥",
    color: "red",
    hesaplamalar: [
      { slug: "bmi-hesaplama", title: "Vücut Kitle İndeksi (BMI) Hesaplama",
        description: "Kilo ve boy değerlerinize göre vücut kitle indeksinizi (BMI) hesaplayın.",
        formulaKey: "hesaplaBMI",
        inputs: [
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", min:20, max:300, step:0.1, unit:"kg", required:true },
          { id:"boy", label:"Boy (cm)", type:"number", min:100, max:250, unit:"cm", required:true }
        ],
        grafik: "gauge",
        grafikElesmesi: [{ name: "BMI", key: "bmi" }] },
      { slug: "kalori-ihtiyaci", title: "Günlük Kalori İhtiyacı Hesaplama",
        description: "BMR ve fiziksel aktivite seviyenize göre günlük kalori ihtiyacınızı hesaplayın.",
        formulaKey: "hesaplaKalori",
        inputs: [
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", unit:"kg", required:true },
          { id:"boy", label:"Boy (cm)", type:"number", unit:"cm", required:true },
          { id:"yas", label:"Yaş", type:"number", min:15, max:100, unit:"yaş", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true },
          { id:"aktivite", label:"Aktivite Düzeyi", type:"select",
            options:[
              {value:1.2,label:"Sedanter (masa başı, az hareket)"},
              {value:1.375,label:"Hafif Aktif (haftada 1-3 gün spor)"},
              {value:1.55,label:"Orta Aktif (haftada 3-5 gün spor)"},
              {value:1.725,label:"Çok Aktif (haftada 6-7 gün spor)"},
              {value:1.9,label:"Aşırı Aktif (günde 2 kez antrenman)"}
            ], required:true }
        ],
        grafik: "bar",
        grafikElesmesi: [{ name: "Bazal Hız", key: "bmh" }, { name: "Kilo Koruma", key: "tdee" }, { name: "Zayıflama", key: "zayiflama" }, { name: "Hızlı Zayıflama", key: "hizliZayiflama" }, { name: "Kilo Alma", key: "kilo_alma" }] },
      { slug: "vucut-yag-orani", title: "Vücut Yağ Oranı Hesaplama",
        description: "US Navy yöntemiyle bel, boyun ve kalça ölçülerinden vücut yağ yüzdesi hesabı.",
        formulaKey: "hesaplaVucutYagOrani",
        inputs: [
          { id:"boy", label:"Boy (cm)", type:"number", required:true },
          { id:"bel", label:"Bel Çevresi (cm)", type:"number", required:true },
          { id:"boyun", label:"Boyun Çevresi (cm)", type:"number", required:true },
          { id:"kalca", label:"Kalça Çevresi (Sadece Kadınlar İçin)", type:"number", defaultValue:0, required:false },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], defaultValue:"erkek", required:true }
        ] },
      { slug: "ideal-kilo", title: "İdeal Kilo Hesaplama",
        description: "Boyunuza ve cinsiyetinize göre yasal ideal kilonuzu hesaplayın.",
        formulaKey: "hesaplaIdealKilo",
        inputs: [
          { id:"boy", label:"Boy (cm)", type:"number", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true }
        ] },
      { slug: "gebelik-haftasi", title: "Gebelik (Hamilelik) Hesaplama",
        description: "Son adet tarihinize göre tahmini doğum tarihi ve gebelik haftasını hesaplayın.",
        formulaKey: "hesaplaGebelikHaftasi",
        inputs: [
          { id:"sonAdetTarihi", label:"Son Adet Tarihi (İlk Günü)", type:"radio", options:[{value:"2025-10-01",label:"Ekim 2025 (Örnek)"}], defaultValue:"2025-10-01", required:false } // radio to simple date template or input pattern representation
        ] },
      { slug: "su-ihtiyaci", title: "Günlük Su İhtiyacı Hesaplama",
        description: "Kilonuza ve günlük egzersiz sürenize göre içmeniz gereken su miktarı.",
        formulaKey: "hesaplaSuIhtiyaci",
        inputs: [
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", required:true },
          { id:"günlükEgzersizDk", label:"Günlük Egzersiz Süresi (Dakika)", type:"number", defaultValue:30, required:true }
        ] },
      { slug: "hedef-nabiz", title: "Hedef Kalp Atış Nabız Bölgeleri",
        description: "Karvonen formülüyle yağ yakımı ve kondisyon antrenman nabız aralıkları.",
        formulaKey: "hesaplaHedefNabiz",
        inputs: [
          { id:"yas", label:"Yaş", type:"number", required:true },
          { id:"dinlenikNabiz", label:"Dinlenik Nabız (Nabız/dk)", type:"number", defaultValue:70, required:true },
          { id:"hedefYogunlukYuzde", label:"Hedef Antrenman Yoğunluğu (%)", type:"number", defaultValue:65, required:true }
        ] },
      { slug: "yagsiz-vucut-kutlesi", title: "Yağsız Vücut Kütlesi (LBM)",
        description: "Vücudun yağ dışındaki kas ve kemik ağırlığı yüzdesini hesaplayın.",
        formulaKey: "hesaplaYagsizVucutKutlesi",
        inputs: [
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", required:true },
          { id:"boy", label:"Boy (cm)", type:"number", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true }
        ] },
      { slug: "bmr-hesaplama", title: "Bazal Metabolizma Hızı (BMR)",
        description: "Dinlenme durumunda organların çalışması için gereken minimum kalori.",
        formulaKey: "hesaplaBMR",
        inputs: [
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", required:true },
          { id:"boy", label:"Boy (cm)", type:"number", required:true },
          { id:"yas", label:"Yaş", type:"number", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true }
        ] },
      { slug: "bebek-persentil", title: "Bebek Boy & Kilo Gelişimi",
        description: "Sağlık Bakanlığı standartlarına göre bebeğin gelişim persentili.",
        formulaKey: "hesaplaBebekPersentil",
        inputs: [
          { id:"cinsiyet", label:"Bebek Cinsiyeti", type:"radio", options:[{value:"erkek",label:"Erkek Bebek"},{value:"kadin",label:"Kız Bebek"}], required:true },
          { id:"yasAy", label:"Bebeğin Yaşı (Ay)", type:"number", defaultValue:6, required:true },
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", step:0.1, required:true },
          { id:"boy", label:"Boy (cm)", type:"number", step:0.1, required:true }
        ] },
      { slug: "ovulasyon-takvimi", title: "Yumurtlama (Ovülasyon) Takvimi",
        description: "Doğurganlık şansının en yüksek olduğu yumurtlama dönemlerini hesaplayın.",
        formulaKey: "hesaplaOvulasyonTakvimi",
        inputs: [
          { id:"adetDongusuGunu", label:"Adet Döngüsü Süresi (Gün)", type:"number", defaultValue:28, required:true }
        ] },
      { slug: "alkol-orani-bac", title: "Kan Alkol Oranı (BAC) Promil",
        description: "Widmark formülü ile içilen miktar ve süreye göre kan alkol promil hesabı.",
        formulaKey: "hesaplaAlkolOraniBAC",
        inputs: [
          { id:"miktarMl", label:"Tüketilen Hacim (ml)", type:"number", defaultValue:500, required:true },
          { id:"alkolYuzdesi", label:"Alkol Derecesi (%)", type:"number", defaultValue:5, required:true },
          { id:"agirlikKg", label:"Vücut Ağırlığı (kg)", type:"number", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true },
          { id:"gecenSureSaat", label:"Alkol Alımından Sonra Geçen Süre (Saat)", type:"number", defaultValue:1, required:true }
        ] },
      { slug: "vucut-yuzey-alani", title: "Vücut Yüzey Alanı (BSA)",
        description: "Klinik ilaç dozajlamalarında kullanılan vücut yüzey alanı hesabı.",
        formulaKey: "hesaplaVucutYuzeyAlani",
        inputs: [
          { id:"boy", label:"Boy (cm)", type:"number", required:true },
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", required:true }
        ] },
      { slug: "bel-kalca-orani", title: "Bel-Kalça Oranı & Sağlık Riski",
        description: "Bölgesel yağlanma durumuna göre kardiyovasküler hastalık riski tespiti.",
        formulaKey: "hesaplaBelKalcaOrani",
        inputs: [
          { id:"bel", label:"Bel Çevresi (cm)", type:"number", required:true },
          { id:"kalca", label:"Kalça Çevresi (cm)", type:"number", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true }
        ] },
      { slug: "aktivite-kalori", title: "Aktivite Kalori Yakım Ölçer",
        description: "Spor türüne ve süresine göre tahmini harcanan kalori miktarı.",
        formulaKey: "hesaplaAktiviteKalori",
        inputs: [
          { id:"agirlik", label:"Vücut Ağırlığı (kg)", type:"number", required:true },
          { id:"sureDk", label:"Aktivite Süresi (Dakika)", type:"number", defaultValue:45, required:true },
          { id:"aktiviteMET", label:"Egzersiz Türü (MET)", type:"select", options:[{value:8,label:"Koşu (8 km/s)"},{value:4,label:"Tempolu Yürüyüş"},{value:6,label:"Yüzme (Orta)"},{value:7.5,label:"Bisiklet Sürme"}], defaultValue:8, required:true }
        ] },
      { slug: "sigara-birakma-kazanci", title: "Sigara Bırakma Kazanç Analizi",
        description: "Sigarayı bıraktığınız andan itibaren biriken para ve akciğer yenilenme oranı.",
        formulaKey: "hesaplaSigaraBirakmaKazanci",
        inputs: [
          { id:"gunlukPaketAdet", label:"Günlük Tüketilen Paket", type:"number", defaultValue:1, required:true },
          { id:"paketFiyati", label:"Paket Fiyatı (TL)", type:"number", defaultValue:65, required:true },
          { id:"birakilanGun", label:"Sigarayı Bıraktığınız Gün Sayısı", type:"number", defaultValue:30, required:true }
        ] },
      { slug: "kafein-takipci", title: "Kafein Alım Takipçisi",
        description: "Günlük alınan çay ve kahve miktarlarına göre güvenli kafein sınırı.",
        formulaKey: "hesaplaKafeinTakipci",
        inputs: [
          { id:"kahveAdet", label:"Tüketilen Kahve (Fincan)", type:"number", defaultValue:2, required:true },
          { id:"cayAdet", label:"Tüketilen Çay (Bardak)", type:"number", defaultValue:4, required:true }
        ] },
      { slug: "gozluk-aks-cevirici", title: "Gözlük Aks Transpozisyonu",
        description: "Gözlük optik reçetelerindeki silindir ve aks transpoze hesabı.",
        formulaKey: "hesaplaGozlukAks",
        inputs: [
          { id:"kure", label:"Küresel Değer (SPH)", type:"number", step:0.25, required:true },
          { id:"silindir", label:"Silindirik Değer (CYL)", type:"number", step:0.25, required:true },
          { id:"aks", label:"Aks (Derece)", type:"number", min:0, max:180, defaultValue:90, required:true }
        ] },
      { slug: "bioritim-hesaplama", title: "Biyolojik Bioritim Grafiği",
        description: "Doğum tarihinize göre fiziksel, duygusal ve zihinsel bioritim ritimleriniz.",
        formulaKey: "hesaplaBioritim",
        inputs: [
          { id:"dogumTarihi", label:"Doğum Tarihi", type:"radio", options:[{value:"1995-05-15",label:"1995 (Örnek)"}], defaultValue:"1995-05-15", required:false }
        ] },
      { slug: "tansiyon-degerlendirici", title: "Tansiyon Sınıflandırma Analizi",
        description: "Büyük ve küçük tansiyon değerlerinize göre kalp basınç seviyenizi değerlendirin.",
        formulaKey: "hesaplaTansiyonDegerlendirici",
        inputs: [
          { id:"buyuk", label:"Sistolik (Büyük Tansiyon)", type:"number", defaultValue:120, required:true },
          { id:"kucuk", label:"Diyastolik (Küçük Tansiyon)", type:"number", defaultValue:80, required:true }
        ] },
      { slug: "makro-besin", title: "Makro Besin Dağılımı",
        description: "Diyet türünüze göre günlük protein, yağ ve karbonhidrat gramajlarını hesaplayın.",
        formulaKey: "hesaplaMakroBesin",
        inputs: [
          { id:"gunlukKalori", label:"Günlük Kalori Hedefi", type:"number", defaultValue:2000, required:true },
          { id:"diyetTuru", label:"Diyet Türü", type:"select", options:[{value:"dengeli",label:"Dengeli (%30P, %30Y, %40K)"},{value:"keto",label:"Ketojenik (%20P, %70Y, %10K)"},{value:"yuksek_protein",label:"Yüksek Protein (%40P, %20Y, %40K)"}], defaultValue:"dengeli", required:true }
        ] },
      { slug: "akciğer-kapasitesi", title: "Vital Akciğer Kapasitesi",
        description: "Baldwin formülü ile boy ve yaş kriterlerine göre akciğer hacmi tahmini.",
        formulaKey: "hesaplaAkcigerKapasitesi",
        inputs: [
          { id:"boyCm", label:"Boy (cm)", type:"number", required:true },
          { id:"yas", label:"Yaş", type:"number", required:true },
          { id:"cinsiyet", label:"Cinsiyet", type:"radio", options:[{value:"erkek",label:"Erkek"},{value:"kadin",label:"Kadın"}], required:true }
        ] },
      { slug: "biyolojik-yas", title: "Biyolojik Yaş Testi",
        description: "Yaşam tarzı ve spor sıklığına göre biyolojik yaşınızı hesaplayın.",
        formulaKey: "hesaplaBiyolojikYas",
        inputs: [
          { id:"gercekYas", label:"Gerçek Yaşınız", type:"number", required:true },
          { id:"haftalikSporSaat", label:"Haftalık Spor Süresi (Saat)", type:"number", defaultValue:2, required:true },
          { id:"sigaraAdedi", label:"Günlük İçilen Sigara Adedi", type:"number", defaultValue:0, required:true }
        ] },
      { slug: "dehidrasyon-riski", title: "Dehidrasyon (Su Kaybı) Riski",
        description: "Egzersiz ve ortam sıcaklığına göre vücudun günlük net su ihtiyacını hesaplayın.",
        formulaKey: "hesaplaDehidrasyonRiski",
        inputs: [
          { id:"agirlikKg", label:"Vücut Ağırlığı (kg)", type:"number", required:true },
          { id:"egzersizSureDk", label:"Egzersiz Süresi (Dakika)", type:"number", defaultValue:60, required:true },
          { id:"sicaklikDerece", label:"Ortam Sıcaklığı (°C)", type:"number", defaultValue:25, required:true }
        ] },
      { slug: "uyku-dongusu", title: "Zinde Uyanma (Uyku Döngüsü)",
        description: "Sabah en zinde uyanabileceğiniz optimum yatış saatlerinizi hesaplayın.",
        formulaKey: "hesaplaUykuDongusu",
        inputs: [
          { id:"kalkisSaati", label:"Uyanmak İstediğiniz Saat", type:"select", options:[{value:"07:00",label:"07:00"},{value:"08:00",label:"08:00"},{value:"09:00",label:"09:00"}], defaultValue:"07:00", required:true }
        ] }
    ]
  },
  {
    slug: "faturalar",
    name: "Faturalar",
    icon: "⚡",
    color: "yellow",
    hesaplamalar: [
      { slug: "elektrik-faturasi", title: "Elektrik Faturası Hesaplama 2026",
        description: "EPDK kademeli tarifelerine göre aylık elektrik fatura tahmini.",
        formulaKey: "hesaplaElektrikFaturasi",
        inputs: [{ id:"aylikKwh", label:"Aylık Tüketim (kWh)", type:"number", min:0, max:5000, unit:"kWh", helpText:"Sayacınızdan veya geçmiş faturanızdan öğrenebilirsiniz", required:true }],
        grafik: "pie",
        grafikElesmesi: [{ name: "Enerji", key: "enerjiTutar" }, { name: "Dağıtım Bedeli", key: "dagitimBedeli" }, { name: "KDV", key: "kdv" }],
        kaynaklar: ["EPDK, kademeli tarifeleri Ocak/Nisan/Temmuz/Ekim aylarında güncelleyebilir; buradaki birim fiyatlar tahminidir, faturanızdaki güncel kademe fiyatlarıyla farklılık gösterebilir"] },
      { slug: "dogalgaz-faturasi", title: "Doğalgaz Faturası Hesaplama 2026",
        description: "2026 yılı güncel doğalgaz birim fiyatlarıyla fatura tahmini yapın.",
        formulaKey: "hesaplaDogalgazFaturasi",
        inputs: [{ id:"aylikM3", label:"Aylık Tüketim (m³)", type:"number", min:0, unit:"m³", required:true }],
        grafik: "pie",
        grafikElesmesi: [{ name: "Enerji", key: "enerjiTutar" }, { name: "Dağıtım Bedeli", key: "dagitimBedeli" }, { name: "KDV", key: "kdv" }],
        kaynaklar: ["Doğalgaz birim fiyatı bölgeye ve dağıtım şirketine göre değişir; buradaki değer ülke ortalaması bir tahmindir, faturanızdaki güncel birim fiyatla farklılık gösterebilir"] },
      { slug: "su-faturasi", title: "Su Faturası Hesaplama 2026",
        description: "2026 yılı kademeli büyükşehir belediyesi su tarifeleriyle fatura hesaplama.",
        formulaKey: "hesaplaSuFaturasi",
        inputs: [{ id:"aylikM3", label:"Aylık Tüketim (m³)", type:"number", required:true }] },
      { slug: "taahhut-cayma", title: "Abonelik Cayma Bedeli",
        description: "İnternet ve telefon taahhüt caymalarındaki yasal cayma bedeli limit hesabı.",
        formulaKey: "hesaplaTaahhutCayma",
        inputs: [
          { id:"aylikPaketBedeli", label:"Aylık Taahhüt Bedeli (TL)", type:"number", required:true },
          { id:"toplamTaahhutAyi", label:"Taahhüt Süresi (Ay)", type:"number", defaultValue:24, required:true },
          { id:"kalanAy", label:"Kalan Ay Sayısı", type:"number", required:true }
        ] },
      { slug: "yakit-masrafi", title: "Yakıt Masrafı Hesaplama",
        description: "Mesafe ve ortalama tüketim değerlerine göre seyahat yakıt bütçesi hesabı.",
        formulaKey: "hesaplaYakitMasrafi",
        inputs: [
          { id:"km", label:"Mesafe (km)", type:"number", min:1, unit:"km", required:true },
          { id:"tuketim", label:"Araç Tüketimi (L/100km)", type:"number", min:1, max:30, defaultValue:8, step:0.1, unit:"L/100km", required:true },
          { id:"litreFiyat", label:"Yakıt Litre Fiyatı (TL/L)", type:"number", min:1, defaultValue:43, unit:"TL/L", required:true }
        ] },
      { slug: "ortak-gider-paylastirma", title: "Ortak Gider (Aidat) Paylaşımı",
        description: "Apartman veya ofis ortak faturalarını daire sayısına göre adil paylaştırın.",
        formulaKey: "hesaplaOrtakGiderPaylastirma",
        inputs: [
          { id:"toplamGider", label:"Toplam Gider Tutarı (TL)", type:"number", required:true },
          { id:"daireSayisi", label:"Daire Sayısı", type:"number", required:true }
        ] },
      { slug: "abonelik-sepeti", title: "Abonelik Sepeti Maliyet Analizi",
        description: "Dijital aboneliklerinizin (Netflix, Spotify vb.) yıllık toplam maliyet grafiği.",
        formulaKey: "hesaplaAbonelikSepeti",
        inputs: [
          { id:"netflix", label:"Netflix Aylık Ücreti (TL)", type:"number", defaultValue:150, required:true },
          { id:"spotify", label:"Spotify Aylık Ücreti (TL)", type:"number", defaultValue:60, required:true },
          { id:"youtube", label:"YouTube Premium Aylık (TL)", type:"number", defaultValue:80, required:true },
          { id:"diger", label:"Diğer Dijital Servisler Aylık (TL)", type:"number", defaultValue:0, required:false }
        ] },
      { slug: "elektrikli-arac-sarj", title: "Elektrikli Araç Şarj Maliyeti",
        description: "Evden şarj ile DC istasyon şarj maliyetlerinin 2026 karşılaştırması.",
        formulaKey: "hesaplaElektrikliAracSarj",
        inputs: [
          { id:"bataryaKapasiteKwh", label:"Batarya Kapasitesi (kWh)", type:"number", defaultValue:60, required:true },
          { id:"evdenSarjMi", label:"Şarj Yeri", type:"radio", options:[{value:"ev",label:"Evden Şarj"},{value:"dc_istasyon",label:"DC Hızlı İstasyon"}], defaultValue:"ev", required:true }
        ] },
      { slug: "kombi-tasarruf", title: "Kombi Isı Tasarrufu Ölçer",
        description: "Termostat derecesini düşürerek sağlayacağınız yıllık fatura tasarruf oranı.",
        formulaKey: "hesaplaKombiTasarruf",
        inputs: [
          { id:"dereceFarki", label:"Düşürülecek Derece Miktarı (°C)", type:"number", defaultValue:1, required:true }
        ] },
      { slug: "ges-amortisman", title: "Güneş Paneli (GES) Amortisman",
        description: "Çatı güneş paneli sisteminin yıllık üretim kazancı ve amortisman süresi.",
        formulaKey: "hesaplaGESAmortisman",
        inputs: [
          { id:"panelGucuKw", label:"GES Sistem Gücü (kW)", type:"number", defaultValue:10, required:true },
          { id:"kurulumMaliyetiTL", label:"Toplam Kurulum Maliyeti (TL)", type:"number", required:true }
        ] },
      { slug: "ticarethane-elektrik", title: "Ticarethane Elektrik Faturası",
        description: "2026 yılı güncel ticarethane tarifeleriyle elektrik faturası hesaplayın.",
        formulaKey: "hesaplaTicarethaneElektrik",
        inputs: [
          { id:"aylikKwh", label:"Aylık Tüketim (kWh)", type:"number", required:true }
        ] },
      { slug: "santiye-fatura", title: "Şantiye Su & Elektrik Maliyeti",
        description: "İnşaat ve şantiye tarifeleri üzerinden fatura bedeli hesaplayıcı.",
        formulaKey: "hesaplaSantiyeFatura",
        inputs: [
          { id:"elektrikKwh", label:"Elektrik Tüketimi (kWh)", type:"number", required:true },
          { id:"suM3", label:"Su Tüketimi (m³)", type:"number", required:true }
        ] },
      { slug: "fatura-gecikme-zammi", title: "Fatura Gecikme Zammı",
        description: "2026 gecikme faiziyle gün bazında fatura gecikme bedeli.",
        formulaKey: "hesaplaFaturaGecikmeZammi",
        inputs: [
          { id:"faturaTutarı", label:"Fatura Tutarı (TL)", type:"number", required:true },
          { id:"gecikenGunSayisi", label:"Geciken Gün Sayısı", type:"number", required:true }
        ] },
      { slug: "yıllık-fatura-analizi", title: "Yıllık Fatura Analizi",
        description: "Tüm faturalarınızın yıllık toplam tutar ve bütçe döküm grafiği.",
        formulaKey: "hesaplaYillikFaturaAnalizi",
        inputs: [
          { id:"elektrik", label:"Aylık Elektrik (TL)", type:"number", required:true },
          { id:"dogalgaz", label:"Aylık Doğalgaz (TL)", type:"number", required:true },
          { id:"su", label:"Aylık Su (TL)", type:"number", required:true },
          { id:"internet", label:"Aylık İnternet (TL)", type:"number", required:true }
        ] },
      { slug: "su-tasarrufu", title: "Su Tasarrufu Kazanım Ölçer",
        description: "Tasarruflu aparatlar kullanarak sağlayacağınız su faturası kazancı.",
        formulaKey: "hesaplaSuTasarrufu",
        inputs: [
          { id:"tasarrufluMuslukVarMi", label:"Tasarruflu Başlık/Musluk Var mı?", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], defaultValue:"hayir", required:true }
        ] },
      { slug: "led-tasarrufu", title: "LED Ampul Dönüşüm Tasarrufu",
        description: "Akkor ampulleri LED ile değiştirerek elde edeceğiniz elektrik tasarrufu.",
        formulaKey: "hesaplaLedTasarrufu",
        inputs: [
          { id:"akkorAmpulAdedi", label:"Değiştirilecek Akkor Ampul Sayısı", type:"number", defaultValue:5, required:true },
          { id:"wattFarki", label:"Ampul Başına Güç Tasarrufu (Watt)", type:"number", defaultValue:50, required:true }
        ] },
      { slug: "ev-aletleri-tuketim", title: "Ev Aletleri Tüketim Ölçer",
        description: "Beyaz eşyaların watt gücüne göre aylık elektrik faturasına net etkisi.",
        formulaKey: "hesaplaEvAletleriTuketim",
        inputs: [
          { id:"aletWatti", label:"Cihaz Gücü (Watt)", type:"number", defaultValue:2000, required:true },
          { id:"gunlukKullanimSaat", label:"Günlük Çalışma Süresi (Saat)", type:"number", defaultValue:2, required:true }
        ] },
      { slug: "sicak-su-maliyeti", title: "Sıcak Su Isıtma Maliyeti",
        description: "Hane nüfusuna göre sıcak su üretiminin aylık doğalgaz fatura maliyeti.",
        formulaKey: "hesaplaSicakSuMaliyeti",
        inputs: [
          { id:"kisiSayisi", label:"Evde Yaşayan Kişi Sayısı", type:"number", defaultValue:3, required:true }
        ] },
      { slug: "klima-btu-tuketim", title: "Klima BTU & Tüketim Hesabı",
        description: "Oda metrekaresine göre uygun klima gücü ve aylık elektrik tüketimi.",
        formulaKey: "hesaplaKlimaBTUTuketim",
        inputs: [
          { id:"alanM2", label:"Oda Alanı (m²)", type:"number", required:true }
        ] },
      { slug: "geri-donusum-katkisi", title: "Geri Dönüşüm Çevre Katkısı",
        description: "Geri dönüştürülen kağıt ve plastiğin kurtardığı ağaç ve çevre tasarrufları.",
        formulaKey: "hesaplaGeriDonusumKatkisi",
        inputs: [
          { id:"kagitKg", label:"Geri Dönüştürülecek Kağıt (kg)", type:"number", defaultValue:50, required:true },
          { id:"plastikKg", label:"Geri Dönüştürülecek Plastik (kg)", type:"number", defaultValue:20, required:true }
        ] },
      { slug: "merkezi-pay-olcer", title: "Merkezi Sistem Pay Ölçer",
        description: "%30 ortak alan ve %70 bireysel tüketim yasal paylaştırma formülü.",
        formulaKey: "hesaplaMerkeziPayOlcer",
        inputs: [
          { id:"binaToplamFatura", label:"Bina Toplam Doğalgaz Faturası (TL)", type:"number", required:true },
          { id:"daireMetrekare", label:"Daire Alanı (m²)", type:"number", required:true },
          { id:"toplamMetrekare", label:"Bina Toplam Daire Alanı (m²)", type:"number", defaultValue:1000, required:true },
          { id:"bireyselTuketimPayi", label:"Daire Pay Ölçer Tüketim Payı (%)", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "endeks-okuma-fatura", title: "Sayaç Endeks Fatura Tahmini",
        description: "İlk ve son elektrik endeks farkına göre fatura kesilmeden tutar tahmini.",
        formulaKey: "hesaplaEndeksOkumaFatura",
        inputs: [
          { id:"ilkEndeks", label:"İlk Sayaç Endeksi (kWh)", type:"number", required:true },
          { id:"sonEndeks", label:"Son Sayaç Endeksi (kWh)", type:"number", required:true }
        ] },
      { slug: "sanayi-elektrik", title: "Sanayi Tipi Elektrik Faturası",
        description: "2026 yılı sanayi AG/YG elektrik tarifeleriyle fatura hesaplama.",
        formulaKey: "hesaplaSanayiElektrik",
        inputs: [
          { id:"aylikKwh", label:"Aylık Tüketim (kWh)", type:"number", required:true }
        ] },
      { slug: "faturaya-ek-cihaz", title: "Faturaya Ek Cihaz Maliyeti",
        description: "Operatörden faturaya ek alınan telefonların toplam vade farkı maliyeti.",
        formulaKey: "hesaplaFaturayaEkCihaz",
        inputs: [
          { id:"pesinFiyat", label:"Cihaz Peşin Fiyatı (TL)", type:"number", required:true },
          { id:"taksitSuresi", label:"Taksit Ay Sayısı", type:"number", defaultValue:12, required:true },
          { id:"aylikEkFatura", label:"Aylık Faturaya Ek Bedel (TL)", type:"number", required:true }
        ] },
      { slug: "kdv-tevkifati-hesaplama", title: "Fatura KDV Tevkifatı",
        description: "Ticari faturalarda uygulanan yasal KDV tevkifat oranları döküm hesabı.",
        formulaKey: "hesaplaKDVTevkifati",
        inputs: [
          { id:"tutar", label:"Fatura Tutarı KDV Hariç (TL)", type:"number", required:true },
          { id:"oran", label:"KDV Oranı (%)", type:"number", defaultValue:20, required:true },
          { id:"tevkifatTuru", label:"Tevkifat Oranı", type:"select", options:[{value:"5/10",label:"5/10 Oranı"},{value:"9/10",label:"9/10 Oranı"},{value:"2/10",label:"2/10 Oranı"}], defaultValue:"5/10", required:true }
        ] }
    ]
  },
  {
    slug: "konut-insaat",
    name: "Konut & İnşaat",
    icon: "🏠",
    color: "orange",
    hesaplamalar: [
      { slug: "boya-hesaplama", title: "Boya Hesaplama",
        description: "Duvar ve tavan ölçülerine göre gereken astar ve boya miktarını hesaplayın.",
        formulaKey: "hesaplaBoya",
        inputs: [
          { id:"uzunluk", label:"Oda Uzunluğu (m)", type:"number", min:1, max:50, step:0.1, unit:"m", required:true },
          { id:"genislik", label:"Oda Genişliği (m)", type:"number", min:1, max:50, step:0.1, unit:"m", required:true },
          { id:"tavan", label:"Tavan Dahil", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], required:true },
          { id:"kapiSayisi", label:"Kapı Sayısı", type:"number", min:0, max:10, defaultValue:1, required:true },
          { id:"pencereSayisi", label:"Pencere Sayısı", type:"number", min:0, max:20, defaultValue:2, required:true }
        ],
        grafik: "bar",
        grafikElesmesi: [{ name: "Boya Litre", key: "boyaLitre" }, { name: "Boya Ağırlık (kg)", key: "boyaKg" }] },
      { slug: "fayans-hesaplama", title: "Fayans & Zemin Kaplama Hesaplama",
        description: "Alan ölçülerine ve fire payına göre gereken fayans kutu adedini hesaplayın.",
        formulaKey: "hesaplaFayans",
        inputs: [
          { id:"uzunluk", label:"Alan Uzunluğu (m)", type:"number", step:0.1, unit:"m", required:true },
          { id:"genislik", label:"Alan Genişliği (m)", type:"number", step:0.1, unit:"m", required:true },
          { id:"firingaYuzdesi", label:"Fire Payı (%)", type:"select", options:[{value:5,label:"%5 (düz zemin)"},{value:10,label:"%10 (köşeli oda)"},{value:15,label:"%15 (çapraz döşeme)"}], defaultValue:10, required:true },
          { id:"boyutu", label:"Fayans Boyutu (cm)", type:"select", options:[{value:30,label:"30×30"},{value:45,label:"45×45"},{value:60,label:"60×60"},{value:80,label:"80×80"}], defaultValue:60, required:true }
        ],
        grafik: "bar",
        grafikElesmesi: [{ name: "Fayans Adedi", key: "fayansAdedi" }, { name: "Kutucuk Adedi", key: "kutucukAdedi" }] },
      { slug: "insaat-demiri-tonaj", title: "Kaba İnşaat Demir Tonajı",
        description: "Metrekare yapı alanına ve kat sayısına göre kaba inşaat demiri tahmini.",
        formulaKey: "hesaplaInsaatDemiriTonaj",
        inputs: [
          { id:"yapilm2", label:"Kat Alanı (m²)", type:"number", required:true },
          { id:"katSayisi", label:"Kat Sayısı", type:"number", defaultValue:2, required:true }
        ] },
      { slug: "hazır-beton-hacmi", title: "Hazır Beton Hacmi m³",
        description: "Alan ölçüleri ve döküm kalınlığına göre gereken mikser beton hacmi.",
        formulaKey: "hesaplaHazirBetonHacmi",
        inputs: [
          { id:"alanm2", label:"Zemin Alanı (m²)", type:"number", required:true },
          { id:"kalinlikCm", label:"Beton Döküm Kalınlığı (cm)", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "tugla-harc-hesaplama", title: "Duvar Tuğla & Harç Malzemesi",
        description: "Duvar alanına göre gereken tuğla adedi, çimento kum miktarı.",
        formulaKey: "hesaplaTuglaHarcHesaplama",
        inputs: [
          { id:"duvarUzunluguM", label:"Duvar Uzunluğu (Metre)", type:"number", required:true },
          { id:"duvarYuksekligiM", label:"Duvar Yüksekliği (Metre)", type:"number", defaultValue:3, required:true },
          { id:"tuglaEniCm", label:"Tuğla Boyutu (En - cm)", type:"number", defaultValue:13, required:true }
        ] },
      { slug: "tapu-harci-hesaplama", title: "Tapu Harcı Hesaplama 2026",
        description: "2026 yılı güncel %2 alıcı, %2 satıcı tapu harcı ve döner sermaye ödemeleri.",
        formulaKey: "hesaplaTapuHarci",
        inputs: [
          { id:"mülkDegeri", label:"Mülk Satış Beyan Bedeli (TL)", type:"number", required:true }
        ] },
      { slug: "emlakci-komisyonu", title: "Emlakçı Komisyonu 2026",
        description: "Gayrimenkul alım satımındaki yasal %2 emlakçı komisyonu ve KDV.",
        formulaKey: "hesaplaEmlakciKomisyonu",
        inputs: [
          { id:"mülkDegeri", label:"Mülk Toplam Satış Bedeli (TL)", type:"number", required:true }
        ] },
      { slug: "kira-amortisman", title: "Kira Amortisman Süresi",
        description: "Mülk değeri ve kira gelirine göre konut geri dönüş yılı (amortisman).",
        formulaKey: "hesaplaKiraAmortisman",
        inputs: [
          { id:"mülkAlisFiyati", label:"Mülk Satın Alım Bedeli (TL)", type:"number", required:true },
          { id:"aylikKiraGetirisi", label:"Aylık Net Kira Getirisi (TL)", type:"number", required:true }
        ] },
      { slug: "deger-artis-vergisi", title: "Değer Artış Kazancı Vergisi",
        description: "5 yıl dolmadan satılan mülklerin enflasyon endeksli resmi gelir vergisi.",
        formulaKey: "hesaplaDegerArtisVergisi",
        inputs: [
          { id:"satisBedeli", label:"Satış Bedeli (TL)", type:"number", required:true },
          { id:"alisBedeli", label:"Alış Bedeli (TL)", type:"number", required:true },
          { id:"sahiplikAyi", label:"Mülke Sahip Olunan Süre (Ay)", type:"number", defaultValue:36, required:true }
        ] },
      { slug: "hafriyat-kamyon", title: "Hafriyat Hacmi ve Kamyon",
        description: "Temel kazı hacmi ve toprak şişme katsayısına göre gerekli kamyon sefer sayısı.",
        formulaKey: "hesaplaHafriyatKamyon",
        inputs: [
          { id:"alanM2", label:"Temel Kazı Alanı (m²)", type:"number", required:true },
          { id:"derinlikM", label:"Temel Kazı Derinliği (Metre)", type:"number", defaultValue:2, required:true }
        ] },
      { slug: "cati-malzemesi", title: "Çatı Kiremit Miktarı",
        description: "Çatı alanı ve derecesine göre gereken kiremit ve membran adedi.",
        formulaKey: "hesaplaCatiMalzemesi",
        inputs: [
          { id:"catiAlaniM2", label:"Taban Çatı Alanı (m²)", type:"number", required:true },
          { id:"egimDerecesi", label:"Çatı Eğimi (Derece)", type:"number", defaultValue:30, required:true }
        ] },
      { slug: "mantolama-tasarruf", title: "Mantolama Amortisman Analizi",
        description: "Dış cephe mantolama maliyeti ve yıllık faturadan tasarruf oranı.",
        formulaKey: "hesaplaMantolamaTasarruf",
        inputs: [
          { id:"cepheAlaniM2", label:"Dış Cephe Mantolama Alanı (m²)", type:"number", required:true },
          { id:"yillikYakitFaturası", label:"Yıllık Ortalama Yakıt/Doğalgaz Faturası (TL)", type:"number", required:true }
        ] },
      { slug: "alcipan-profil-malzeme", title: "Alçıpan & Profil Hesaplama",
        description: "Asma tavan alanına göre gereken alçıpan plaka ve profil metreleri.",
        formulaKey: "hesaplaAlcipanProfil",
        inputs: [
          { id:"asmaTavanAlaniM2", label:"Asma Tavan Alanı (m²)", type:"number", required:true }
        ] },
      { slug: "harc-karisimi", title: "Çimento Kum Harç Karışımı",
        description: "Hacme göre gerekli çimento torbası, kum m³ ve su oranları.",
        formulaKey: "hesaplaHarcKarisimi",
        inputs: [
          { id:"harcHacmim3", label:"Toplam Harç Hacmi (m³)", type:"number", required:true }
        ] },
      { slug: "emlak-vergisi", title: "Emlak Vergisi Hesaplama",
        description: "2026 yılı binde 1/2 konut emlak vergisi tutarlarını hesaplayın.",
        formulaKey: "hesaplaEmlakVergisi",
        inputs: [
          { id:"mülkRayiçDegeri", label:"Mülk Rayiç/Vergi Değeri (TL)", type:"number", required:true },
          { id:"buyuksehirMi", label:"Mülk Büyükşehir Sınırlarında mı?", type:"radio", options:[{value:"evet",label:"Evet (Büyükşehir)"},{value:"hayir",label:"Hayır (Normal Yöre)"}], defaultValue:"hayir", required:true }
        ] },
      { slug: "dask-prim-hesaplama", title: "DASK Prim Hesaplama Şablonu",
        description: "Deprem bölgesi derecesine göre tahmini zorunlu deprem sigortası primi.",
        formulaKey: "hesaplaDASKPrim",
        inputs: [
          { id:"binaM2", label:"Daire Net Alanı (m²)", type:"number", required:true },
          { id:"depremBolgesi", label:"Deprem Bölgesi Derecesi", type:"select", options:[{value:"1",label:"1. Derece (Yüksek Risk)"},{value:"2",label:"2. Derece"},{value:"3",label:"3. Derece"},{value:"4",label:"4. Derece (Düşük Risk)"}], defaultValue:"1", required:true }
        ] },
      { slug: "parke-supurgelik", title: "Parke & Süpürgelik Miktarı",
        description: "Oda taban alanı ve çevresine göre gereken parke paket sayısı.",
        formulaKey: "hesaplaParkeSupurgelik",
        inputs: [
          { id:"zeminAlaniM2", label:"Zemin Alanı (m²)", type:"number", required:true },
          { id:"odaCevresiM", label:"Oda Çevresi (Metre)", type:"number", required:true }
        ] },
      { slug: "tapu-koordinat-cevirici", title: "Tapu Koordinat Dönüştürücü",
        description: "Kadastro koordinat sistemleri arası ITRF koordinat dönüşüm mantığı.",
        formulaKey: "hesaplaTapuKoordinat",
        inputs: [
          { id:"x", label:"X Koordinatı (Sağa Değer)", type:"number", required:true },
          { id:"y", label:"Y Koordinatı (Yukarı Değer)", type:"number", required:true }
        ] },
      { slug: "deprem-risk-puanlama", title: "Bina Deprem Risk Puanlaması",
        description: "Bina yapım yılı, zemin türü ve kat sayısına göre deprem risk testi.",
        formulaKey: "hesaplaDepremRiskPuanlama",
        inputs: [
          { id:"binaYasamYili", label:"Bina Yapım Yılı", type:"number", defaultValue:2005, required:true },
          { id:"katSayisi", label:"Kat Sayısı", type:"number", defaultValue:5, required:true },
          { id:"zeminTuru", label:"Zemin Yapısı", type:"select", options:[{value:"kaya",label:"Sert Kaya Zemin"},{value:"toprak",label:"Yumuşak Toprak Zemin"},{value:"dolgu",label:"Yapay Dolgu / Alüvyon Zemin"}], defaultValue:"toprak", required:true }
        ] },
      { slug: "insaat-ruhsat-harclari", title: "İnşaat Ruhsat Harçları",
        description: "Yapı alanına göre tahmini resmi belediye imar ve ruhsat harçları.",
        formulaKey: "hesaplaInsaatRuhsatHarclari",
        inputs: [
          { id:"yapim2", label:"Toplam İnşaat Yapı Alanı (m²)", type:"number", required:true }
        ] },
      { slug: "net-brut-alan", title: "Net - Brüt Alan Çevirici",
        description: "Daire iç net metrekaresinden dış duvar dahil brüt alanı tahmin edin.",
        formulaKey: "hesaplaNetBrutAlan",
        inputs: [
          { id:"netAlanM2", label:"Daire Net Alanı (m²)", type:"number", required:true }
        ] },
      { slug: "duvar-kagidi", title: "Duvar Kağıdı Rulo Sayısı",
        description: "Duvar genişliği ve yüksekliğine göre gereken duvar kağıdı rulo adedi.",
        formulaKey: "hesaplaDuvarKagidi",
        inputs: [
          { id:"duvarGenişliğiM", label:"Duvar Toplam Genişliği (Metre)", type:"number", required:true },
          { id:"duvarYuksekligiM", label:"Duvar Yüksekliği (Metre)", type:"number", defaultValue:2.8, required:true },
          { id:"ruloGenisligiCm", label:"Rulo Duvar Kağıdı Eni (cm)", type:"number", defaultValue:53, required:true }
        ] },
      { slug: "kilit-parke-tasi", title: "Kilit Parke Taşı (Bahçe)",
        description: "Bahçe ve otopark kilit taşı adedi ile kum torbası ihtiyaç hesabı.",
        formulaKey: "hesaplaKilitParkeTasi",
        inputs: [
          { id:"alanM2", label:"Döşenecek Zemin Alanı (m²)", type:"number", required:true }
        ] },
      { slug: "merdiven-basamak-riht", title: "Merdiven Basamağı (Rıht)",
        description: "Kat yüksekliğine göre optimum merdiven basamak sayısı ve yüksekliği.",
        formulaKey: "hesaplaMerdivenBasamakRiht",
        inputs: [
          { id:"katYuksekligiCm", label:"Kat Yüksekliği (cm)", type:"number", defaultValue:280, required:true }
        ] },
      { slug: "isi-kaybi-petek", title: "Isı Kaybı & Petek Boyu",
        description: "Oda alanına ve cephesine göre gerekli kalorifer peteği uzunluğu (metre).",
        formulaKey: "hesaplaIsiKaybiPetek",
        inputs: [
          { id:"odaM2", label:"Oda Net Alanı (m²)", type:"number", required:true },
          { id:"cephe", label:"Oda Cephesi", type:"select", options:[{value:"kuzey",label:"Kuzey Cephe (Soğuk)"},{value:"guney",label:"Güney Cephe (Sıcak)"},{value:"dogu",label:"Doğu Cephe"},{value:"bati",label:"Batı Cephe"}], defaultValue:"kuzey", required:true }
        ] }
    ]
  },
  {
    slug: "matematik",
    name: "Matematik & Çevirici",
    icon: "📐",
    color: "purple",
    hesaplamalar: [
      { slug: "kdv-hesaplama-matematik", title: "KDV Hesaplama (Matematik)",
        description: "Dahil/hariç KDV hesabı ve matrah bulucu.",
        formulaKey: "hesaplaKDV",
        inputs: [
          { id:"tutar", label:"Tutar (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"oran", label:"KDV Oranı (%)", type:"select", options:[{value:1,label:"%1"},{value:10,label:"%10"},{value:20,label:"%20"}], defaultValue:20, required:true },
          { id:"dahilMi", label:"KDV Durumu", type:"radio", options:[{value:"dahil",label:"Fiyata Dahil"},{value:"haric",label:"Fiyata Dahil Değil"}], required:true }
        ] },
      { slug: "yuzde-hesaplama-matematik", title: "Yüzde Hesaplama",
        description: "Yüzde artış, azalış, değer bulma ve oranlama işlemlerini yapın.",
        formulaKey: "hesaplaYuzde",
        inputs: [
          { id:"mod", label:"İşlem Türü", type:"select",
            options:[
              {value:"ne_kadar",label:"X'in Y%'i ne kadar?"},
              {value:"yuzde_kac",label:"X, Y'nin yüzde kaçı?"},
              {value:"artis",label:"X'ten Y'ye artış/azalış yüzdesi"}
            ], required:true },
          { id:"deger1", label:"1. Değer (X)", type:"number", required:true },
          { id:"deger2", label:"2. Değer (Y veya %)", type:"number", required:true }
        ] },
      { slug: "ebob-ekok", title: "EBOB - EKOK Hesaplama",
        description: "Girilen iki tam sayının en büyük ortak bölenini (EBOB) ve en küçük ortak katını (EKOK) bulun.",
        formulaKey: "hesaplaEbobEkok",
        inputs: [
          { id:"sayi1", label:"1. Sayı", type:"number", required:true },
          { id:"sayi2", label:"2. Sayı", type:"number", required:true }
        ] },
      { slug: "asal-sayi-carpanlar", title: "Asal Sayı & Çarpanlara Ayırma",
        description: "Sayının asallığını kontrol edin ve asal çarpanlarını listeyin.",
        formulaKey: "hesaplaAsalSayiCarpanlar",
        inputs: [
          { id:"sayi", label:"Sayı Girin", type:"number", required:true }
        ] },
      { slug: "denklem-cozucu", title: "Denklem Çözücü (1. ve 2. Derece)",
        description: "ax² + bx + c = 0 şeklindeki ikinci dereceden denklemlerin köklerini bulun.",
        formulaKey: "hesaplaDenklemCozucu",
        inputs: [
          { id:"a", label:"a Katsayısı (x² katsayısı)", type:"number", defaultValue:1, required:true },
          { id:"b", label:"b Katsayısı (x katsayısı)", type:"number", defaultValue:2, required:true },
          { id:"c", label:"c Katsayısı (Sabit terim)", type:"number", defaultValue:-8, required:true }
        ] },
      { slug: "kombinasyon-permutasyon", title: "Kombinasyon & Permütasyon",
        description: "n elemanlı kümenin r'li kombinasyon ve permütasyon alacak formülleri.",
        formulaKey: "hesaplaKombinasyonPermutasyon",
        inputs: [
          { id:"n", label:"n Değeri (Eleman sayısı)", type:"number", min:0, max:170, required:true },
          { id:"r", label:"r Değeri (Seçim sayısı)", type:"number", min:0, max:170, required:true }
        ] },
      { slug: "hacim-cevirici", title: "Hacim Birimleri Çevirici",
        description: "m³, litre, desilitre, galon ve varil hacim birimleri arası dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"hacim",label:"Hacim Çevrimi"}], defaultValue:"hacim", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"L",label:"Litre (L)"},{value:"m3",label:"Metreküp (m³)"},{value:"desilitre",label:"Desilitre (dL)"},{value:"galon",label:"Galon"},{value:"varil",label:"Varil"}], defaultValue:"L", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"L",label:"Litre (L)"},{value:"m3",label:"Metreküp (m³)"},{value:"desilitre",label:"Desilitre (dL)"},{value:"galon",label:"Galon"},{value:"varil",label:"Varil"}], defaultValue:"m3", required:true }
        ] },
      { slug: "alan-cevirici", title: "Alan Birimleri Çevirici",
        description: "Metrekare, dönüm/dekar, hektar ve fitkare alan birimleri arası dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"alan",label:"Alan Çevrimi"}], defaultValue:"alan", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"m2",label:"Metrekare (m²)"},{value:"donum",label:"Dönüm / Dekar"},{value:"hektar",label:"Hektar"},{value:"fitkare",label:"Fitkare (sq ft)"}], defaultValue:"m2", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"m2",label:"Metrekare (m²)"},{value:"donum",label:"Dönüm / Dekar"},{value:"hektar",label:"Hektar"},{value:"fitkare",label:"Fitkare (sq ft)"}], defaultValue:"donum", required:true }
        ] },
      { slug: "uzunluk-cevirici", title: "Uzunluk Birimleri Çevirici",
        description: "mm, cm, m, km, inç, fit ve mil uzunluk birimleri arası dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"uzunluk",label:"Uzunluk Çevrimi"}], defaultValue:"uzunluk", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"mm",label:"Milimetre (mm)"},{value:"cm",label:"Santimetre (cm)"},{value:"m",label:"Metre (m)"},{value:"km",label:"Kilometre (km)"},{value:"inc",label:"İnç (inch)"},{value:"fit",label:"Fit (feet)"},{value:"mil",label:"Mil (mile)"}], defaultValue:"cm", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"mm",label:"Milimetre (mm)"},{value:"cm",label:"Santimetre (cm)"},{value:"m",label:"Metre (m)"},{value:"km",label:"Kilometre (km)"},{value:"inc",label:"İnç (inch)"},{value:"fit",label:"Fit (feet)"},{value:"mil",label:"Mil (mile)"}], defaultValue:"m", required:true }
        ] },
      { slug: "agirlik-cevirici", title: "Ağırlık Birimleri Çevirici",
        description: "Gram, kg, ton, libre ve ons ağırlık birimleri arası hızlı dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"agirlik",label:"Ağırlık Çevrimi"}], defaultValue:"agirlik", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"gr",label:"Gram (g)"},{value:"kg",label:"Kilogram (kg)"},{value:"ton",label:"Ton"},{value:"libre",label:"Libre (lb)"},{value:"ons",label:"Ons (oz)"}], defaultValue:"kg", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"gr",label:"Gram (g)"},{value:"kg",label:"Kilogram (kg)"},{value:"ton",label:"Ton"},{value:"libre",label:"Libre (lb)"},{value:"ons",label:"Ons (oz)"}], defaultValue:"libre", required:true }
        ] },
      { slug: "sicaklik-cevirici", title: "Sıcaklık Birimleri Çevirici",
        description: "Celsius, Fahrenheit ve Kelvin sıcaklık birimleri arası dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"sicaklik",label:"Sıcaklık Çevrimi"}], defaultValue:"sicaklik", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"C",label:"Celsius (°C)"},{value:"F",label:"Fahrenheit (°F)"},{value:"K",label:"Kelvin (K)"}], defaultValue:"C", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"C",label:"Celsius (°C)"},{value:"F",label:"Fahrenheit (°F)"},{value:"K",label:"Kelvin (K)"}], defaultValue:"F", required:true }
        ] },
      { slug: "hiz-cevirici", title: "Hız Birimleri Çevirici",
        description: "km/s, mph, m/s ve knot hız birimleri arası dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"hiz",label:"Hız Çevrimi"}], defaultValue:"hiz", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"kms",label:"Kilometre/Saat (km/h)"},{value:"mph",label:"Mil/Saat (mph)"},{value:"ms",label:"Metre/Saniye (m/s)"},{value:"knot",label:"Knot"}], defaultValue:"kms", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"kms",label:"Kilometre/Saat (km/h)"},{value:"mph",label:"Mil/Saat (mph)"},{value:"ms",label:"Metre/Saniye (m/s)"},{value:"knot",label:"Knot"}], defaultValue:"mph", required:true }
        ] },
      { slug: "veri-boyutlari", title: "Veri Boyutları Çevirici",
        description: "Byte, KB, MB, GB, TB veri depolama birimleri arası dönüşüm.",
        formulaKey: "hesaplaBirimCevirici",
        inputs: [
          { id:"deger", label:"Değer", type:"number", required:true },
          { id:"cevirimTuru", label:"Çevirim Türü", type:"radio", options:[{value:"veri",label:"Veri Çevrimi"}], defaultValue:"veri", required:true },
          { id:"kaynakBirim", label:"Kaynak Birim", type:"select", options:[{value:"byte",label:"Byte (B)"},{value:"KB",label:"Kilobyte (KB)"},{value:"MB",label:"Megabyte (MB)"},{value:"GB",label:"Gigabyte (GB)"},{value:"TB",label:"Terabyte (TB)"}], defaultValue:"MB", required:true },
          { id:"hedefBirim", label:"Hedef Birim", type:"select", options:[{value:"byte",label:"Byte (B)"},{value:"KB",label:"Kilobyte (KB)"},{value:"MB",label:"Megabyte (MB)"},{value:"GB",label:"Gigabyte (GB)"},{value:"TB",label:"Terabyte (TB)"}], defaultValue:"GB", required:true }
        ] },
      { slug: "roma-rakamlari", title: "Roma Rakamı Çevirici",
        description: "Arap sayılarını Roma rakamlarına, Roma rakamlarını normal sayılara dönüştürün.",
        formulaKey: "hesaplaRomaRakamlari",
        inputs: [
          { id:"sayi", label:"Sayı (1 - 3999)", type:"number", min:1, max:3999, defaultValue:10, required:true }
        ] },
      { slug: "trigonometri", title: "Trigonometrik Hesaplayıcı",
        description: "Derece cinsinden sin, cos, tan ve cot trigonometrik fonksiyon değerleri.",
        formulaKey: "hesaplaTrigonometri",
        inputs: [
          { id:"derece", label:"Açı (Derece)", type:"number", defaultValue:45, required:true }
        ] },
      { slug: "uslu-koklu-sayilar", title: "Üslü ve Köklü Sayı Hesaplama",
        description: "Taban ve üs değerlerine göre üs alma ve karekök bulma işlemleri.",
        formulaKey: "hesaplaUsluKokluSayilar",
        inputs: [
          { id:"taban", label:"Taban Değeri (X)", type:"number", required:true },
          { id:"us", label:"Üs Değeri (Y)", type:"number", defaultValue:2, required:true }
        ] },
      { slug: "logaritma", title: "Logaritma Hesaplayıcı",
        description: "Girilen sayının doğal logaritma (ln) ve log10 değerlerini hesaplayın.",
        formulaKey: "hesaplaLogaritma",
        inputs: [
          { id:"sayi", label:"Sayı (X > 0)", type:"number", min:0.0001, required:true }
        ] },
      { slug: "borc-taksit-bolucu", title: "Borç Taksit Bölüştürücü",
        description: "Toplam borcu taksit sayısına bölerken küsuratları son aya adil dağıtın.",
        formulaKey: "hesaplaBorcTaksitBolucu",
        inputs: [
          { id:"toplamBorc", label:"Toplam Borç Tutarı (TL)", type:"number", required:true },
          { id:"taksitSayisi", label:"Taksit Sayısı (Ay)", type:"number", defaultValue:12, required:true }
        ] },
      { slug: "tarih-zaman-farki", title: "Tarih ve Zaman Farkı",
        description: "İki farklı tarih arasındaki toplam gün ve hafta farkını hesaplayın.",
        formulaKey: "hesaplaTarihZamanFarki",
        inputs: [
          { id:"tarih1", label:"1. Tarih", type:"radio", options:[{value:"2026-01-01",label:"1 Ocak 2026"}], defaultValue:"2026-01-01", required:true },
          { id:"tarih2", label:"2. Tarih", type:"radio", options:[{value:"2026-12-31",label:"31 Aralık 2026"}], defaultValue:"2026-12-31", required:true }
        ] },
      { slug: "standart-sapma", title: "Standart Sapma & Varyans",
        description: "Virgülle ayrılmış sayı dizisinin ortalama, varyans ve standart sapmasını hesaplayın.",
        formulaKey: "hesaplaStandartSapma",
        inputs: [
          { id:"degerlerCsv", label:"Sayıları Virgülle Ayırarak Girin (Örn: 10,20,30,40)", type:"radio", options:[{value:"10,20,30,40,50",label:"10, 20, 30, 40, 50"}], defaultValue:"10,20,30,40,50", required:true }
        ] },
      { slug: "2d-sekiller", title: "2D Şekil Alan & Çevre Hesabı",
        description: "Dikdörtgen ve dairenin alan ve çevre formül dökümlerini hesaplayın.",
        formulaKey: "hesapla2DSekiller",
        inputs: [
          { id:"genislik", label:"Dikdörtgen Genişliği / Eni (m)", type:"number", defaultValue:5, required:true },
          { id:"yukseklik", label:"Dikdörtgen Yüksekliği / Boyu (m)", type:"number", defaultValue:10, required:true },
          { id:"yaricap", label:"Daire Yarıçapı (m)", type:"number", defaultValue:0, required:false }
        ] },
      { slug: "3d-cisimler", title: "3D Cisim Hacim & Yüzey Alanı",
        description: "Dikdörtgen prizma ve kürenin hacim ve yüzey alanlarını hesaplayın.",
        formulaKey: "hesapla3DCisimler",
        inputs: [
          { id:"en", label:"Prizma Eni (m)", type:"number", defaultValue:5, required:true },
          { id:"boy", label:"Prizma Boyu (m)", type:"number", defaultValue:10, required:true },
          { id:"yukseklik", label:"Prizma Yüksekliği (m)", type:"number", defaultValue:4, required:true },
          { id:"yaricap", label:"Küre Yarıçapı (m)", type:"number", defaultValue:0, required:false }
        ] },
      { slug: "sayi-tabanlari", title: "Sayı Tabanları Çevirici",
        description: "Onluk (decimal), ikilik (binary) ve onaltılık (hexadecimal) taban dönüşümleri.",
        formulaKey: "hesaplaSayiTabanlari",
        inputs: [
          { id:"sayi", label:"Sayı", type:"radio", options:[{value:"42",label:"42"}], defaultValue:"42", required:true },
          { id:"kaynakTaban", label:"Kaynak Sayı Tabanı (2-16)", type:"number", defaultValue:10, required:true }
        ] },
      { slug: "calisma-saati-cevirici", title: "Çalışma Saati Çevirici",
        description: "Günlük çalışma saatini haftalık, aylık ve yıllık toplam çalışma saatine çevirin.",
        formulaKey: "hesaplaCalismaSaatiCevirici",
        inputs: [
          { id:"gunlukSaat", label:"Günlük Çalışma Saati", type:"number", defaultValue:8, required:true },
          { id:"haftalikGun", label:"Haftalık Çalışılan Gün", type:"number", defaultValue:5, required:true }
        ] },
      { slug: "altin-oran", title: "Altın Oran Hesaplayıcı",
        description: "Girilen bir uzunluğun altın orana (1.618) uygun küçük ve büyük parçaları.",
        formulaKey: "hesaplaAltinOran",
        inputs: [
          { id:"uzunluk", label:"Toplam Uzunluk Değeri", type:"number", defaultValue:100, required:true }
        ] }
    ]
  }
];

export function findHesaplama(kategoriSlug: string, hesaplamaSlug: string): Hesaplama | undefined {
  const kategori = HESAPLAMA_DATA.find(k => k.slug === kategoriSlug);
  return kategori?.hesaplamalar.find(h => h.slug === hesaplamaSlug);
}

export function getAllSlugs(): {kategori: string, hesaplama: string}[] {
  return HESAPLAMA_DATA.flatMap(k => 
    k.hesaplamalar.map(h => ({ kategori: k.slug, hesaplama: h.slug }))
  );
}
