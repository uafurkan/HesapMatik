import * as C from './constants'

// ================================================================
// 1. KİRA ARTIŞ HESAPLAMA
// TBK Madde 344 — kira artışı TÜFE 12 aylık ortalamasını aşamaz
// ================================================================
export function hesaplaKiraArtis(mevcutKira: number, tufeOran: number) {
  const artisOrani = Math.min(tufeOran, C.TUFE_SON_ORAN)
  const artis = mevcutKira * (artisOrani / 100)
  const yeniKira = mevcutKira + artis
  return {
    mevcutKira,
    artisOrani,
    artis: Math.round(artis * 100) / 100,
    yeniKira: Math.round(yeniKira * 100) / 100,
    aylikFark: Math.round(artis * 100) / 100,
    yillikFark: Math.round(artis * 12 * 100) / 100,
    kanunDayanak: 'TBK Madde 344'
  }
}

// ================================================================
// 2. KIDEM TAZMİNATI HESAPLAMA
// İş Kanunu Madde 14 — Her tam yıl için 30 günlük brüt ücret
// Tavan: C.KIDEM_TAZMINATI_TAVAN (yıllık)
// ================================================================
export function hesaplaKidemTazminati(brutAylikUcret: number, calismaSuresiAy: number) {
  const tamYil = Math.floor(calismaSuresiAy / 12)
  const kalanAy = calismaSuresiAy % 12
  const gunlukBrut = brutAylikUcret / 30
  const yillikHak = Math.min(gunlukBrut * 30, C.KIDEM_TAZMINATI_TAVAN)
  const tamYilTutar = tamYil * yillikHak
  const kalanAyTutar = (kalanAy / 12) * yillikHak
  const toplamTazminat = tamYilTutar + kalanAyTutar
  // Vergi muafiyeti: kıdem tazminatı gelir vergisinden muaf, damga vergisi uygulanır
  const damgaVergisi = toplamTazminat * C.DAMGA_VERGISI_ORANI
  const netTazminat = toplamTazminat - damgaVergisi
  return {
    brutAylikUcret,
    calismaSuresiYil: tamYil,
    calismaSuresiAy: kalanAy,
    gunlukBrut: Math.round(gunlukBrut * 100) / 100,
    yillikHak: Math.round(yillikHak * 100) / 100,
    tavanUygulandı: gunlukBrut * 30 > C.KIDEM_TAZMINATI_TAVAN,
    toplamBrut: Math.round(toplamTazminat * 100) / 100,
    damgaVergisi: Math.round(damgaVergisi * 100) / 100,
    netTazminat: Math.round(netTazminat * 100) / 100,
    kanunDayanak: 'İş Kanunu Madde 14'
  }
}

// ================================================================
// 3. İHBAR TAZMİNATI HESAPLAMA
// İş Kanunu Madde 17
// ================================================================
export function hesaplaIhbarTazminati(brutAylikUcret: number, calismaSuresiAy: number) {
  const ihbarEntry = C.IHBAR_HAFTALARI.find(h => calismaSuresiAy <= h.max_ay)!
  const ihbarHaftasi = ihbarEntry.hafta
  const gunlukBrut = brutAylikUcret / 30
  const tazminat = ihbarHaftasi * 7 * gunlukBrut
  const damgaVergisi = tazminat * C.DAMGA_VERGISI_ORANI
  return {
    calismaSuresiAy,
    ihbarHaftasi,
    ihbarGunu: ihbarHaftasi * 7,
    tazminatBrut: Math.round(tazminat * 100) / 100,
    damgaVergisi: Math.round(damgaVergisi * 100) / 100,
    netTazminat: Math.round((tazminat - damgaVergisi) * 100) / 100,
    kanunDayanak: 'İş Kanunu Madde 17'
  }
}

// ================================================================
// 4. NET MAAŞ HESAPLAMA (Brüt → Net)
// ================================================================
export function hesaplaNetMaas(brutMaas: number) {
  const sgkMatrahi = Math.min(Math.max(brutMaas, C.SGK_TABAN_UCRET), C.SGK_TAVAN_UCRET)
  const sgkIssci = sgkMatrahi * C.SGK_ISSCI_PAYI
  const issizlikIssci = sgkMatrahi * C.SGK_ISSIZLIK_ISSCI
  const vergiyeTabanUcret = brutMaas - sgkIssci - issizlikIssci
  // Gelir vergisi — kümülatif dilim hesabı (tek ay için aylık dilim)
  const gelirVergisi = hesaplaGelirVergisi(vergiyeTabanUcret)
  const damgaVergisi = brutMaas * C.DAMGA_VERGISI_ORANI
  const toplamKesinti = sgkIssci + issizlikIssci + gelirVergisi + damgaVergisi
  const netMaas = brutMaas - toplamKesinti
  // İşveren maliyeti
  const isvSgk = sgkMatrahi * C.SGK_ISVEREN_PAYI
  const isvIssizlik = sgkMatrahi * C.SGK_ISVEREN_ISSIZLIK
  const isvMaliyet = brutMaas + isvSgk + isvIssizlik
  return {
    brutMaas,
    sgkIssci: Math.round(sgkIssci * 100) / 100,
    issizlikIssci: Math.round(issizlikIssci * 100) / 100,
    gelirVergisi: Math.round(gelirVergisi * 100) / 100,
    damgaVergisi: Math.round(damgaVergisi * 100) / 100,
    toplamKesinti: Math.round(toplamKesinti * 100) / 100,
    netMaas: Math.round(netMaas * 100) / 100,
    isvMaliyet: Math.round(isvMaliyet * 100) / 100,
    kesintilerYuzdesi: Math.round((toplamKesinti / brutMaas) * 10000) / 100
  }
}

function hesaplaGelirVergisi(matrAh: number): number {
  // Aylık vergi matrahını yıllığa çevir, dilim uygula, 12'ye böl
  const yillik = matrAh * 12
  let vergi = 0
  let oncekiLimit = 0
  for (const dilim of C.GELIR_VERGISI_DILIMLERI) {
    if (yillik <= oncekiLimit) break
    const dilimdeKalan = Math.min(yillik, dilim.limit) - oncekiLimit
    vergi += dilimdeKalan * dilim.oran
    oncekiLimit = dilim.limit
    if (yillik <= dilim.limit) break
  }
  return vergi / 12
}

// ================================================================
// 5. BRÜT MAAŞ HESAPLAMA (Net → Brüt) — iteratif yaklaşım
// ================================================================
export function hesaplaBrutMaas(netHedef: number): number {
  let brut = netHedef * 1.35  // başlangıç tahmini
  for (let i = 0; i < 50; i++) {
    const hesap = hesaplaNetMaas(brut)
    const fark = netHedef - hesap.netMaas
    if (Math.abs(fark) < 0.01) break
    brut += fark * 0.8
  }
  return Math.round(brut * 100) / 100
}

// ================================================================
// 6. KONUT KREDİSİ — Aylık Taksit (PMT Formülü)
// ================================================================
export function hesaplaKonutKredisi(anapara: number, aylikFaizYuzde: number, vadeSuresiAy: number) {
  const r = aylikFaizYuzde / 100
  const taksit = anapara * (r * Math.pow(1 + r, vadeSuresiAy)) / (Math.pow(1 + r, vadeSuresiAy) - 1)
  const toplamOdeme = taksit * vadeSuresiAy
  const toplamFaiz = toplamOdeme - anapara
  // Amortisman tablosu — ilk 5 ve son 5 ay + seçili aylar
  const tablo: Array<{ay: number, taksit: number, anapara: number, faiz: number, kalanAnapara: number}> = []
  let kalan = anapara
  for (let ay = 1; ay <= vadeSuresiAy; ay++) {
    const faizPay = kalan * r
    const anaparaPay = taksit - faizPay
    kalan -= anaparaPay
    if (ay <= 6 || ay === Math.ceil(vadeSuresiAy / 2) || ay >= vadeSuresiAy - 5) {
      tablo.push({ ay, taksit: Math.round(taksit), anapara: Math.round(anaparaPay), faiz: Math.round(faizPay), kalanAnapara: Math.round(Math.max(0, kalan)) })
    }
  }
  return {
    anapara, aylikFaizYuzde, vadeSuresiAy,
    aylikTaksit: Math.round(taksit * 100) / 100,
    toplamOdeme: Math.round(toplamOdeme * 100) / 100,
    toplamFaiz: Math.round(toplamFaiz * 100) / 100,
    faizOrani: Math.round((toplamFaiz / anapara) * 10000) / 100,
    amortismanTablosu: tablo
  }
}

// ================================================================
// 7. YKS NET HESAPLAMA
// ================================================================
export function hesaplaYKSNet(dogru: number, yanlis: number) {
  const net = dogru - (yanlis / 4)
  return {
    dogru, yanlis,
    net: Math.round(net * 100) / 100,
    bos: 0,  // soru sayısına göre doldurulur
    netToplam: Math.max(0, net)
  }
}

export function hesaplaTYTNet(brans: { ad: string, dogru: number, yanlis: number }[]) {
  return brans.map(b => ({
    ...b,
    net: Math.max(0, Math.round((b.dogru - b.yanlis / 4) * 100) / 100)
  }))
}

// ================================================================
// 8. BMI HESAPLAMA
// ================================================================
export function hesaplaBMI(agirlikKg: number, boyMetre: number) {
  const bmi = agirlikKg / (boyMetre * boyMetre)
  const sinif = C.BMI_SINIFLARI.find(s => bmi <= s.max)!
  // İdeal kilo aralığı (BMI 18.5 - 25)
  const idealMin = 18.5 * boyMetre * boyMetre
  const idealMax = 25.0 * boyMetre * boyMetre
  return {
    bmi: Math.round(bmi * 100) / 100,
    sinif: sinif.label,
    sinifRenk: sinif.color,
    idealKiloMin: Math.round(idealMin * 10) / 10,
    idealKiloMax: Math.round(idealMax * 10) / 10,
    fark: Math.round((agirlikKg - idealMax) * 10) / 10  // pozitif = fazla, negatif = eksik
  }
}

// ================================================================
// 9. KALORİ İHTİYACI (Harris-Benedict Denklemi — revize)
// ================================================================
export function hesaplaKalori(agirlik: number, boy: number, yas: number, cinsiyet: 'erkek'|'kadin', aktivite: number) {
  // Aktivite katsayıları: 1.2=sedanter, 1.375=hafif, 1.55=orta, 1.725=aktif, 1.9=çok aktif
  const bmh = cinsiyet === 'erkek'
    ? 88.362 + (13.397 * agirlik) + (4.799 * boy) - (5.677 * yas)
    : 447.593 + (9.247 * agirlik) + (3.098 * boy) - (4.330 * yas)
  const tdee = bmh * aktivite
  return {
    bmh: Math.round(bmh),
    tdee: Math.round(tdee),
    zayiflama: Math.round(tdee - 500),   // 0.5 kg/hafta hedefi
    hizliZayiflama: Math.round(tdee - 1000),
    kilo_alma: Math.round(tdee + 300)
  }
}

// ================================================================
// 10. FAZLA MESAİ HESAPLAMA — İş Kanunu Madde 41
// Günlük 45 saati aşan çalışma — %50 zamlı
// Gece/hafta sonu fazla mesai — %100 zamlı
// ================================================================
export function hesaplaFazlaMesai(brutAylikUcret: number, fazlaMesaiSaati: number, tur: 'normal'|'gecegunduz') {
  const saatlikUcret = brutAylikUcret / (225)  // 45 saat/hafta × 5 hafta/ay
  const zam = tur === 'normal' ? 1.5 : 2.0
  const toplamUcret = saatlikUcret * zam * fazlaMesaiSaati
  return {
    saatlikUcret: Math.round(saatlikUcret * 100) / 100,
    zamliSaatlik: Math.round(saatlikUcret * zam * 100) / 100,
    fazlaMesaiSaati,
    toplamFazlaMesaiUcreti: Math.round(toplamUcret * 100) / 100,
    kanunDayanak: 'İş Kanunu Madde 41'
  }
}

// ================================================================
// 11. ELEKTRİK FATURASI TAHMİNİ
// ================================================================
export function hesaplaElektrikFaturasi(aylikKwh: number) {
  const t = C.ELEKTRIK_TARIFESI
  let tutar = 0
  if (aylikKwh <= 150) {
    tutar = aylikKwh * t.mesken_0_150
  } else if (aylikKwh <= 240) {
    tutar = 150 * t.mesken_0_150 + (aylikKwh - 150) * t.mesken_151_240
  } else {
    tutar = 150 * t.mesken_0_150 + 90 * t.mesken_151_240 + (aylikKwh - 240) * t.mesken_241_plus
  }
  const dagitim = aylikKwh * t.dagitim_bedeli
  const fon = tutar * t.enerji_fonu
  const kdv = (tutar + dagitim + fon) * 0.20
  const toplam = tutar + dagitim + fon + kdv
  return {
    aylikKwh,
    enerjiTutar: Math.round(tutar * 100) / 100,
    dagitimBedeli: Math.round(dagitim * 100) / 100,
    kdv: Math.round(kdv * 100) / 100,
    toplamFatura: Math.round(toplam * 100) / 100
  }
}

// ================================================================
// 12. DOĞALGAZ FATURASI
// ================================================================
export function hesaplaDogalgazFaturasi(aylikM3: number) {
  const enerji = aylikM3 * C.DOGALGAZ_BIRIM_FIYAT
  const dagitim = aylikM3 * 1.20   // TL/m³ yaklaşık dağıtım
  const kdv = (enerji + dagitim) * 0.20
  return {
    aylikM3,
    enerjiTutar: Math.round(enerji * 100) / 100,
    dagitimBedeli: Math.round(dagitim * 100) / 100,
    kdv: Math.round(kdv * 100) / 100,
    toplamFatura: Math.round((enerji + dagitim + kdv) * 100) / 100
  }
}

// ================================================================
// 13. YAKIT MASRAFI HESAPLAMA
// ================================================================
export function hesaplaYakitMasrafi(km: number, yakitTuketimi: number, litreUcreti: number) {
  const toplamLitre = (km * yakitTuketimi) / 100
  const toplamTutar = toplamLitre * litreUcreti
  return {
    km, yakitTuketimi, litreUcreti,
    toplamLitre: Math.round(toplamLitre * 100) / 100,
    toplamTutar: Math.round(toplamTutar * 100) / 100,
    kmBasinaUcret: Math.round((toplamTutar / km) * 100) / 100
  }
}

// ================================================================
// 14. BOYA HESAPLAMA
// ================================================================
export function hesaplaBoya(uzunluk: number, genislik: number, tavan: boolean, kapiSayisi: number, pencereSayisi: number) {
  const tavanAlani = tavan ? uzunluk * genislik : 0
  const duvarAlani = 2 * (uzunluk + genislik) * 2.70  // ortalama oda yüksekliği 2.70m
  const kapiAlani = kapiSayisi * 2.0  // ortalama kapı 2m²
  const pencereAlani = pencereSayisi * 1.5  // ortalama pencere 1.5m²
  const netAlan = duvarAlani + tavanAlani - kapiAlani - pencereAlani
  const boyaMiktari = (netAlan / 10) * 1.5  // standart: 10m²/L — 1.5 kat
  return {
    brutAlan: Math.round((duvarAlani + tavanAlani) * 10) / 10,
    netAlan: Math.round(netAlan * 10) / 10,
    boyaLitre: Math.ceil(boyaMiktari),
    boyaKg: Math.ceil(boyaMiktari * 1.4)  // yaklaşık yoğunluk
  }
}

// ================================================================
// 15. KDV HESAPLAMA
// ================================================================
export function hesaplaKDV(tutar: number, oran: number, dahilMi: boolean) {
  if (dahilMi) {
    const kdvsiz = tutar / (1 + oran / 100)
    const kdv = tutar - kdvsiz
    return { kdvsizFiyat: Math.round(kdvsiz * 100) / 100, kdvTutar: Math.round(kdv * 100) / 100, kdvliFiyat: tutar }
  } else {
    const kdv = tutar * (oran / 100)
    return { kdvsizFiyat: tutar, kdvTutar: Math.round(kdv * 100) / 100, kdvliFiyat: Math.round((tutar + kdv) * 100) / 100 }
  }
}

// ================================================================
// 16. FAİZ HESAPLAMA (basit ve bileşik)
// ================================================================
export function hesaplaBilesikFaiz(anapara: number, yillikFaiz: number, sure: number, periyot: 'yillik'|'aylik'|'gunluk') {
  const n = periyot === 'yillik' ? sure : periyot === 'aylik' ? sure / 12 : sure / 365
  const r = yillikFaiz / 100
  const sonDeger = anapara * Math.pow(1 + r, n)
  const kazanc = sonDeger - anapara
  return {
    anapara,
    sonDeger: Math.round(sonDeger * 100) / 100,
    kazanc: Math.round(kazanc * 100) / 100,
    toplamGetiri: Math.round((kazanc / anapara) * 10000) / 100
  }
}

// ================================================================
// 17. FAYANS / ZEMİN KAPLAMA HESAPLAMA
// ================================================================
export function hesaplaFayans(uzunluk: number, genislik: number, firingaYuzdesi: number, boyutu: number) {
  const alan = uzunluk * genislik
  const firingaliAlan = alan * (1 + firingaYuzdesi / 100)
  const fayansAlani = (boyutu / 100) * (boyutu / 100)
  const fayansAdedi = Math.ceil(firingaliAlan / fayansAlani)
  return {
    netAlan: Math.round(alan * 100) / 100,
    firingaliAlan: Math.round(firingaliAlan * 100) / 100,
    fayansAdedi,
    kutucukAdedi: Math.ceil(fayansAdedi / 12)  // 12'li paket varsayımı
  }
}
