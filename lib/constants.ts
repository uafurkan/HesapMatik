// ============================================================
// ASGARİ ÜCRET (2026 H2 — Temmuz 2026 itibariyle)
// ============================================================
export const ASGARI_UCRET_BRUT = 33030.00  // TL/ay — brüt
export const ASGARI_UCRET_NET = 28075.50   // TL/ay — net
export const GUNLUK_ASGARI_UCRET = 33030.00 / 30  // = 1101.00 TL

// ============================================================
// KIDEM TAZMİNATI (2026 H2)
// ============================================================
export const KIDEM_TAZMINATI_TAVAN = 64948.77  // TL — bir yıl için üst sınır
// Kaynak: Resmi Gazete, her yıl Ocak ve Temmuz güncellenir

// ============================================================
// SGK ORANLARI (%)
// ============================================================
export const SGK_ISSCI_PAYI = 0.14         // İşçi SGK sağlık + emeklilik
export const SGK_ISSIZLIK_ISSCI = 0.01     // İşçi işsizlik sigortası
export const SGK_ISVEREN_PAYI = 0.155      // İşveren SGK payı
export const SGK_ISVEREN_ISSIZLIK = 0.02   // İşveren işsizlik sigortası
export const SGK_TABAN_UCRET = 33030.00    // SGK prim hesabında alt sınır
export const SGK_TAVAN_KATSAYI = 7.5       // Tavan = taban × 7.5
export const SGK_TAVAN_UCRET = 33030.00 * 7.5  // = 247725.00 TL

// ============================================================
// DAMGA VERGİSİ
// ============================================================
export const DAMGA_VERGISI_ORANI = 0.00759  // %0.759 brüt ücret üzerinden

// ============================================================
// GELİR VERGİSİ DİLİMLERİ (2026 — kümülatif)
// ============================================================
export const GELIR_VERGISI_DILIMLERI = [
  { limit: 190000, oran: 0.15 },
  { limit: 400000, oran: 0.20 },
  { limit: 1500000, oran: 0.27 },
  { limit: 5300000, oran: 0.35 },
  { limit: Infinity, oran: 0.40 }
]
// Kaynak: GVK Madde 103 — 2026 yılı için güncellendi

// ============================================================
// İHBAR SÜRELERİ (Hafta)
// ============================================================
export const IHBAR_HAFTALARI = [
  { max_ay: 6,   hafta: 2 },
  { max_ay: 18,  hafta: 4 },
  { max_ay: 36,  hafta: 6 },
  { max_ay: Infinity, hafta: 8 }
]

// ============================================================
// TÜFE / KİRA ARTIŞ VERİLERİ
// ============================================================
// 12 aylık TÜFE ortalaması — TÜİK açıklama tarihleriyle güncelle
// Kaynak: https://data.tuik.gov.tr
export const TUFE_12_AYLIK_ORTALAMA = {
  '2026-05': 32.43,   // Mayıs 2026 Kira Artış Oranı (Nisan enflasyonuna göre)
  '2026-04': 32.82,   // Nisan 2026 Kira Artış Oranı
  '2026-03': 33.15,
  '2026-02': 34.20,
  '2026-01': 35.50,
  '2025-12': 37.10,
  '2025-11': 39.80,
  '2025-10': 41.20,
}
// Son geçerli oran (en güncel değer):
export const TUFE_SON_ORAN = 32.43
export const TUFE_SON_TARIH = 'Mayıs 2026'

// ============================================================
// KONUT KREDİSİ
// ============================================================
export const KONUT_KREDISI_FAIZ_ORNEK = 2.89  // %/ay — örnek değer (kullanıcı değiştirir)

// ============================================================
// ELEKTRİK TARİFELERİ (EPDK — 2026)
// ============================================================
export const ELEKTRIK_TARIFESI = {
  mesken_0_150: 2.8302,    // TL/kWh — ilk 150 kWh
  mesken_151_240: 4.4025,  // TL/kWh — 151-240 kWh
  mesken_241_plus: 6.0567, // TL/kWh — 241+ kWh
  dagitim_bedeli: 0.75,    // TL/kWh
  enerji_fonu: 0.001,      // oransal
}

// ============================================================
// DOĞALGAZ TARİFELERİ (EPDK — 2026 ortalama)
// ============================================================
export const DOGALGAZ_BIRIM_FIYAT = 12.85  // TL/m³ — konut (bölgeye göre değişir)

// ============================================================
// YAKIT FİYATLARI (güncel değil, kullanıcı girer — sadece default)
// ============================================================
export const BENZIN_VARSAYILAN = 43.00   // TL/L
export const DIZEL_VARSAYILAN = 41.50    // TL/L
export const LPG_VARSAYILAN = 23.00      // TL/L

// ============================================================
// BMI SINIFLARI (Türkiye'de kullanılan WHO sınıflandırması)
// ============================================================
export const BMI_SINIFLARI = [
  { max: 18.5, label: 'Zayıf', color: '#4d8bff' },
  { max: 25.0, label: 'Normal', color: '#00e887' },
  { max: 30.0, label: 'Fazla Kilolu', color: '#ffb347' },
  { max: 35.0, label: 'Obez (1. Derece)', color: '#ff8c00' },
  { max: 40.0, label: 'Obez (2. Derece)', color: '#ff4d6d' },
  { max: Infinity, label: 'Morbid Obez (3. Derece)', color: '#c00030' }
]
