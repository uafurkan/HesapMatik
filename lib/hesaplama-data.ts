export interface HesaplamaInput {
  id: string
  label: string                    // Turkish label
  type: 'number' | 'select' | 'range' | 'radio'
  defaultValue?: number | string
  min?: number
  max?: number
  step?: number
  unit?: string                    // "TL", "ay", "km", "%", "m²"
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
  formulaKey?: string               // formulas.ts'deki fonksiyon adı
  inputs: HesaplamaInput[]
  grafik?: 'bar' | 'pie' | 'line' | 'gauge'
  kaynaklar?: string[]             // Yasal dayanak metinleri
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
        description: "2024 TÜFE oranına göre yasal kira artış miktarını hesaplayın.",
        seoTitle: "Kira Artış Hesaplama 2024 | TÜFE Oranıyla Kira Zammı",
        inputs: [
          { id:"mevcutKira", label:"Mevcut Aylık Kira (TL)", type:"number", min:0, step:100, unit:"TL", required:true },
          { id:"tufeOran", label:"TÜFE 12 Aylık Ort. (%)", type:"number", defaultValue:69.80, min:0, max:200, step:0.01, unit:"%", helpText:"TÜİK tarafından aylık açıklanan 12 aylık ortalama TÜFE değeri", required:true }
        ],
        grafik: "bar", kaynaklar: ["TBK Madde 344"] },
      { slug: "kidem-tazminati", title: "Kıdem Tazminatı Hesaplama",
        description: "Çalışma sürenize ve brüt ücretinize göre kıdem tazminatı hesaplayın.",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", min:0, step:500, unit:"TL", required:true },
          { id:"calismaSuresiAy", label:"Çalışma Süresi (Ay)", type:"number", min:1, max:600, unit:"ay", required:true }
        ],
        grafik: "pie", kaynaklar: ["İş Kanunu Madde 14"] },
      { slug: "ihbar-tazminati", title: "İhbar Tazminatı Hesaplama",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"calismaSuresiAy", label:"Çalışma Süresi (Ay)", type:"number", min:1, unit:"ay", required:true }
        ], grafik: "bar" },
      { slug: "net-maas-hesaplama", title: "Net Maaş Hesaplama",
        description: "2024 vergi ve SGK kesintileriyle brütten nete veya netten brüte maaş hesaplayın.",
        inputs: [
          { id:"brutMaas", label:"Brüt Maaş (TL)", type:"number", min:0, step:500, unit:"TL", required:true },
          { id:"yon", label:"Hesaplama Yönü", type:"radio",
            options:[{value:"bruttenNet",label:"Brütten Nete"},{value:"nettenBrut",label:"Netten Brüte"}],
            defaultValue:"bruttenNet", required:true }
        ], grafik: "pie" },
      { slug: "konut-kredisi", title: "Konut Kredisi Hesaplama",
        inputs: [
          { id:"anapara", label:"Kredi Miktarı (TL)", type:"number", min:0, step:10000, unit:"TL", required:true },
          { id:"aylikFaizYuzde", label:"Aylık Faiz Oranı (%)", type:"number", min:0, max:10, step:0.01, unit:"%", defaultValue:2.89, required:true },
          { id:"vadeSuresiAy", label:"Vade Süresi", type:"select",
            options:[{value:60,label:"5 Yıl (60 Ay)"},{value:84,label:"7 Yıl (84 Ay)"},{value:120,label:"10 Yıl (120 Ay)"},{value:180,label:"15 Yıl (180 Ay)"},{value:240,label:"20 Yıl (240 Ay)"}],
            defaultValue:120, required:true }
        ], grafik: "line" },
      { slug: "kdv-hesaplama", title: "KDV Hesaplama",
        inputs: [
          { id:"tutar", label:"Tutar (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"oran", label:"KDV Oranı (%)", type:"select", options:[{value:1,label:"%1"},{value:10,label:"%10"},{value:20,label:"%20"}], defaultValue:20, required:true },
          { id:"dahilMi", label:"KDV Durumu", type:"radio", options:[{value:"dahil",label:"Fiyata Dahil"},{value:"haric",label:"Fiyata Dahil Değil"}], required:true }
        ] },
      { slug: "faiz-hesaplama", title: "Bileşik Faiz Hesaplama",
        inputs: [
          { id:"anapara", label:"Anapara (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"yillikFaiz", label:"Yıllık Faiz (%)", type:"number", min:0, max:500, step:0.1, unit:"%", required:true },
          { id:"sure", label:"Süre", type:"number", min:1, required:true },
          { id:"periyot", label:"Süre Birimi", type:"select", options:[{value:"yillik",label:"Yıl"},{value:"aylik",label:"Ay"},{value:"gunluk",label:"Gün"}], required:true }
        ], grafik: "line" }
    ]
  },
  {
    slug: "is-hukuku",
    name: "İş Hukuku",
    icon: "⚖️",
    color: "blue",
    hesaplamalar: [
      { slug: "fazla-mesai-ucreti", title: "Fazla Mesai Ücreti Hesaplama",
        inputs: [
          { id:"brutAylikUcret", label:"Brüt Aylık Ücret (TL)", type:"number", unit:"TL", required:true },
          { id:"fazlaMesaiSaati", label:"Fazla Mesai Saati", type:"number", min:1, max:270, unit:"saat", required:true },
          { id:"tur", label:"Mesai Türü", type:"radio", options:[{value:"normal",label:"Normal (%50 zamlı)"},{value:"gecegunduz",label:"Gece/Hafta Sonu (%100 zamlı)"}], required:true }
        ], kaynaklar: ["İş Kanunu Madde 41"] },
      { slug: "brut-net-cevirici", title: "Brüt-Net Maaş Çevirici 2024",
        description: "Güncel SGK ve vergi oranlarıyla anında maaş dönüşümü.",
        inputs: [
          { id:"miktar", label:"Maaş (TL)", type:"number", unit:"TL", required:true },
          { id:"yon", label:"Yön", type:"radio", options:[{value:"b2n",label:"Brüt → Net"},{value:"n2b",label:"Net → Brüt"}], required:true }
        ], grafik: "pie" }
    ]
  },
  {
    slug: "egitim",
    name: "Eğitim & Sınav",
    icon: "🎓",
    color: "green",
    hesaplamalar: [
      { slug: "tyt-net-hesaplama", title: "TYT Net Hesaplama 2024",
        description: "TYT Türkçe, Matematik, Sosyal ve Fen branşları için net hesaplayın.",
        inputs: [
          { id:"turkce_d", label:"Türkçe Doğru", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"turkce_y", label:"Türkçe Yanlış", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"mat_d", label:"Matematik Doğru", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"mat_y", label:"Matematik Yanlış", type:"number", min:0, max:40, defaultValue:0, required:true },
          { id:"sosyal_d", label:"Sosyal Bilimler Doğru", type:"number", min:0, max:20, defaultValue:0, required:true },
          { id:"sosyal_y", label:"Sosyal Bilimler Yanlış", type:"number", min:0, max:20, defaultValue:0, required:true },
          { id:"fen_d", label:"Fen Bilimleri Doğru", type:"number", min:0, max:20, defaultValue:0, required:true },
          { id:"fen_y", label:"Fen Bilimleri Yanlış", type:"number", min:0, max:20, defaultValue:0, required:true }
        ], grafik: "bar" },
      { slug: "not-ortalamasi", title: "Not Ortalaması Hesaplama",
        description: "4'lük ve 100'lük sistemde ağırlıklı not ortalaması hesaplayın.",
        inputs: [
          { id:"sistem", label:"Not Sistemi", type:"radio", options:[{value:"100",label:"100'lük"},{value:"4",label:"4'lük"}], required:true }
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
        inputs: [
          { id:"agirlik", label:"Ağırlık (kg)", type:"number", min:20, max:300, step:0.1, unit:"kg", required:true },
          { id:"boy", label:"Boy (cm)", type:"number", min:100, max:250, unit:"cm", required:true }
        ], grafik: "gauge" },
      { slug: "kalori-ihtiyaci", title: "Günlük Kalori İhtiyacı Hesaplama",
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
        ], grafik: "bar" }
    ]
  },
  {
    slug: "faturalar",
    name: "Faturalar",
    icon: "⚡",
    color: "yellow",
    hesaplamalar: [
      { slug: "elektrik-faturasi", title: "Elektrik Faturası Hesaplama 2024",
        description: "EPDK tarifelerine göre aylık elektrik fatura tahmini.",
        inputs: [{ id:"aylikKwh", label:"Aylık Tüketim (kWh)", type:"number", min:0, max:5000, unit:"kWh", helpText:"Sayacınızdan veya geçmiş faturanızdan öğrenebilirsiniz", required:true }],
        grafik: "pie" },
      { slug: "dogalgaz-faturasi", title: "Doğalgaz Faturası Hesaplama 2024",
        inputs: [{ id:"aylikM3", label:"Aylık Tüketim (m³)", type:"number", min:0, unit:"m³", required:true }],
        grafik: "pie" },
      { slug: "yakit-masrafi", title: "Yakıt Masrafı Hesaplama",
        inputs: [
          { id:"km", label:"Mesafe (km)", type:"number", min:1, unit:"km", required:true },
          { id:"tuketim", label:"Araç Tüketimi (L/100km)", type:"number", min:1, max:30, defaultValue:8, step:0.1, unit:"L/100km", required:true },
          { id:"litreFiyat", label:"Yakıt Fiyatı (TL/L)", type:"number", min:1, defaultValue:43, unit:"TL/L", required:true }
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
        inputs: [
          { id:"uzunluk", label:"Oda Uzunluğu (m)", type:"number", min:1, max:50, step:0.1, unit:"m", required:true },
          { id:"genislik", label:"Oda Genişliği (m)", type:"number", min:1, max:50, step:0.1, unit:"m", required:true },
          { id:"tavan", label:"Tavan Dahil", type:"radio", options:[{value:"evet",label:"Evet"},{value:"hayir",label:"Hayır"}], required:true },
          { id:"kapiSayisi", label:"Kapı Sayısı", type:"number", min:0, max:10, defaultValue:1, required:true },
          { id:"pencereSayisi", label:"Pencere Sayısı", type:"number", min:0, max:20, defaultValue:2, required:true }
        ] },
      { slug: "fayans-hesaplama", title: "Fayans & Zemin Kaplama Hesaplama",
        inputs: [
          { id:"uzunluk", label:"Alan Uzunluğu (m)", type:"number", step:0.1, unit:"m", required:true },
          { id:"genislik", label:"Alan Genişliği (m)", type:"number", step:0.1, unit:"m", required:true },
          { id:"firingaYuzdesi", label:"Fire Payı (%)", type:"select", options:[{value:5,label:"%5 (düz zemin)"},{value:10,label:"%10 (köşeli oda)"},{value:15,label:"%15 (çapraz döşeme)"}], defaultValue:10, required:true },
          { id:"boyutu", label:"Fayans Boyutu (cm)", type:"select", options:[{value:30,label:"30×30"},{value:45,label:"45×45"},{value:60,label:"60×60"},{value:80,label:"80×80"}], defaultValue:60, required:true }
        ] }
    ]
  },
  {
    slug: "matematik",
    name: "Matematik & Çevirici",
    icon: "📐",
    color: "purple",
    hesaplamalar: [
      { slug: "kdv-hesaplama", title: "KDV Hesaplama", inputs: [
          { id:"tutar", label:"Tutar (TL)", type:"number", min:0, unit:"TL", required:true },
          { id:"oran", label:"KDV Oranı (%)", type:"select", options:[{value:1,label:"%1"},{value:10,label:"%10"},{value:20,label:"%20"}], defaultValue:20, required:true },
          { id:"dahilMi", label:"KDV Durumu", type:"radio", options:[{value:"dahil",label:"Fiyata Dahil"},{value:"haric",label:"Fiyata Dahil Değil"}], required:true }
        ] },
      { slug: "yuzde-hesaplama", title: "Yüzde Hesaplama",
        inputs: [
          { id:"mod", label:"İşlem Türü", type:"select",
            options:[
              {value:"ne_kadar",label:"X'in Y%'i ne kadar?"},
              {value:"yuzde_kac",label:"X, Y'nin yüzde kaçı?"},
              {value:"artis",label:"X'ten Y'ye artış/azalış yüzdesi"}
            ], required:true },
          { id:"deger1", label:"1. Değer", type:"number", required:true },
          { id:"deger2", label:"2. Değer (% veya hedef)", type:"number", required:true }
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
