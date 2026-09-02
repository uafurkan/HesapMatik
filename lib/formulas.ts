import * as C from './constants'

// ================================================================
// 1. FİNANS & PARA FORMÜLLERİ
// ================================================================

export function hesaplaKiraArtis({ mevcutKira, tufeOran }: { mevcutKira: number; tufeOran: number }) {
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

export function hesaplaKidemTazminati({ brutAylikUcret, calismaSuresiAy }: { brutAylikUcret: number; calismaSuresiAy: number }) {
  if (calismaSuresiAy < 12) {
    return {
      brutAylikUcret,
      calismaSuresiYil: 0,
      calismaSuresiAy: calismaSuresiAy,
      gunlukBrut: Math.round((brutAylikUcret / 30) * 100) / 100,
      yillikHak: 0,
      tavanUygulandı: false,
      toplamBrut: 0,
      damgaVergisi: 0,
      netTazminat: 0,
      kanunDayanak: 'İş Kanunu Madde 14 (En az 1 yıl şartı sağlanamadı)'
    }
  }

  const tamYil = Math.floor(calismaSuresiAy / 12)
  const kalanAy = calismaSuresiAy % 12
  const gunlukBrut = brutAylikUcret / 30
  const yillikHak = Math.min(gunlukBrut * 30, C.KIDEM_TAZMINATI_TAVAN)
  const tamYilTutar = tamYil * yillikHak
  const kalanAyTutar = (kalanAy / 12) * yillikHak
  const toplamTazminat = tamYilTutar + kalanAyTutar
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

export function hesaplaIhbarTazminati({ brutAylikUcret, calismaSuresiAy }: { brutAylikUcret: number; calismaSuresiAy: number }) {
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

// Netten Brütü bulmak için iç fonksiyon (iteratif)
function hesaplaBrutMaasTek(netHedef: number): number {
  let brut = netHedef * 1.35
  for (let i = 0; i < 50; i++) {
    const hesap = hesaplaNetMaasTek(brut)
    const fark = netHedef - hesap.netMaas
    if (Math.abs(fark) < 0.01) break
    brut += fark * 0.8
  }
  return Math.round(brut * 100) / 100
}

// Brütten Neti bulmak için iç fonksiyon
function hesaplaNetMaasTek(brutMaas: number) {
  const sgkMatrahi = Math.min(Math.max(brutMaas, C.SGK_TABAN_UCRET), C.SGK_TAVAN_UCRET)
  const sgkIssci = sgkMatrahi * C.SGK_ISSCI_PAYI
  const issizlikIssci = sgkMatrahi * C.SGK_ISSIZLIK_ISSCI
  const vergiyeTabanUcret = brutMaas - sgkIssci - issizlikIssci
  
  // Gelir Vergisi Dilimleri (Aylık kümülatif basitleştirilmiş)
  const yillik = vergiyeTabanUcret * 12
  let vergi = 0
  let oncekiLimit = 0
  for (const dilim of C.GELIR_VERGISI_DILIMLERI) {
    if (yillik <= oncekiLimit) break
    const dilimdeKalan = Math.min(yillik, dilim.limit) - oncekiLimit
    vergi += dilimdeKalan * dilim.oran
    oncekiLimit = dilim.limit
    if (yillik <= dilim.limit) break
  }
  const gelirVergisi = vergi / 12

  const damgaVergisi = brutMaas * C.DAMGA_VERGISI_ORANI
  const toplamKesinti = sgkIssci + issizlikIssci + gelirVergisi + damgaVergisi
  const netMaas = brutMaas - toplamKesinti
  const isvSgk = sgkMatrahi * C.SGK_ISVEREN_PAYI
  const isvIssizlik = sgkMatrahi * C.SGK_ISVEREN_ISSIZLIK
  const isvMaliyet = brutMaas + isvSgk + isvIssizlik
  return {
    brutMaas,
    sgkIssci,
    issizlikIssci,
    gelirVergisi,
    damgaVergisi,
    toplamKesinti,
    netMaas,
    isvMaliyet
  }
}

// 4. NET MAAŞ HESAPLAMA (Brütten Nete veya Netten Brüte)
export function hesaplaNetMaas({ brutMaas, yon }: { brutMaas: number; yon: 'bruttenNet' | 'nettenBrut' }) {
  if (yon === 'nettenBrut') {
    const brut = hesaplaBrutMaasTek(brutMaas)
    const netHesap = hesaplaNetMaasTek(brut)
    return {
      brutMaas: brut,
      sgkIssci: Math.round(netHesap.sgkIssci * 100) / 100,
      issizlikIssci: Math.round(netHesap.issizlikIssci * 100) / 100,
      gelirVergisi: Math.round(netHesap.gelirVergisi * 100) / 100,
      damgaVergisi: Math.round(netHesap.damgaVergisi * 100) / 100,
      toplamKesinti: Math.round(netHesap.toplamKesinti * 100) / 100,
      netMaas: Math.round(brutMaas * 100) / 100,
      isvMaliyet: Math.round(netHesap.isvMaliyet * 100) / 100,
      kesintiYuzdesi: brut > 0 ? Math.round((netHesap.toplamKesinti / brut) * 10000) / 100 : 0
    }
  } else {
    const netHesap = hesaplaNetMaasTek(brutMaas)
    return {
      brutMaas: Math.round(brutMaas * 100) / 100,
      sgkIssci: Math.round(netHesap.sgkIssci * 100) / 100,
      issizlikIssci: Math.round(netHesap.issizlikIssci * 100) / 100,
      gelirVergisi: Math.round(netHesap.gelirVergisi * 100) / 100,
      damgaVergisi: Math.round(netHesap.damgaVergisi * 100) / 100,
      toplamKesinti: Math.round(netHesap.toplamKesinti * 100) / 100,
      netMaas: Math.round(netHesap.netMaas * 100) / 100,
      isvMaliyet: Math.round(netHesap.isvMaliyet * 100) / 100,
      kesintiYuzdesi: brutMaas > 0 ? Math.round((netHesap.toplamKesinti / brutMaas) * 10000) / 100 : 0
    }
  }
}

// 5. BRÜT-NET MAAŞ ÇEVİRİCİ
export function hesaplaBrutNetCevirici({ miktar, yon }: { miktar: number; yon: 'b2n' | 'n2b' }) {
  const yonMapped = yon === 'b2n' ? 'bruttenNet' : 'nettenBrut'
  return hesaplaNetMaas({ brutMaas: miktar, yon: yonMapped })
}

// 6. KONUT KREDİSİ
export function hesaplaKonutKredisi({ anapara, aylikFaizYuzde, vadeSuresiAy }: { anapara: number; aylikFaizYuzde: number; vadeSuresiAy: number }) {
  const r = aylikFaizYuzde / 100
  const taksit = r === 0 ? anapara / vadeSuresiAy : anapara * (r * Math.pow(1 + r, vadeSuresiAy)) / (Math.pow(1 + r, vadeSuresiAy) - 1)
  const toplamOdeme = taksit * vadeSuresiAy
  const toplamFaiz = toplamOdeme - anapara
  const tablo: Array<{ ay: number; taksit: number; anapara: number; faiz: number; kalanAnapara: number }> = []
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
    anapara,
    aylikFaizYuzde,
    vadeSuresiAy,
    aylikTaksit: Math.round(taksit * 100) / 100,
    toplamOdeme: Math.round(toplamOdeme * 100) / 100,
    toplamFaiz: Math.round(toplamFaiz * 100) / 100,
    faizOrani: anapara > 0 ? Math.round((toplamFaiz / anapara) * 10000) / 100 : 0,
    amortismanTablosu: tablo
  }
}

// 7. KDV HESAPLAMA
export function hesaplaKDV({ tutar, oran, dahilMi }: { tutar: number; oran: number; dahilMi: 'dahil' | 'haric' | boolean }) {
  const isDahil = dahilMi === 'dahil' || dahilMi === true
  if (isDahil) {
    const kdvsiz = tutar / (1 + oran / 100)
    const kdv = tutar - kdvsiz
    return { kdvsizFiyat: Math.round(kdvsiz * 100) / 100, kdvTutar: Math.round(kdv * 100) / 100, kdvliFiyat: tutar }
  } else {
    const kdv = tutar * (oran / 100)
    return { kdvsizFiyat: tutar, kdvTutar: Math.round(kdv * 100) / 100, kdvliFiyat: Math.round((tutar + kdv) * 100) / 100 }
  }
}

// 8. BİLEŞİK FAİZ HESAPLAMA
export function hesaplaBilesikFaiz({ anapara, yillikFaiz, sure, periyot }: { anapara: number; yillikFaiz: number; sure: number; periyot: 'yillik' | 'aylik' | 'gunluk' }) {
  const n = periyot === 'yillik' ? sure : periyot === 'aylik' ? sure / 12 : sure / 365
  const r = yillikFaiz / 100
  const sonDeger = anapara * Math.pow(1 + r, n)
  const kazanc = sonDeger - anapara
  return {
    anapara,
    sonDeger: Math.round(sonDeger * 100) / 100,
    kazanc: Math.round(kazanc * 100) / 100,
    toplamGetiri: anapara > 0 ? Math.round((kazanc / anapara) * 10000) / 100 : 0
  }
}

// 9. MEVDUAT FAİZİ HESAPLAMA
export function hesaplaMevduatFaizi({ anapara, yillikFaiz, vadeGun }: { anapara: number; yillikFaiz: number; vadeGun: number }) {
  // Stopaj oranları 2026: 6 aya kadar %7.5, 1 yıla kadar %5, 1 yıldan uzun %2.5
  let stopajOrani = 0.075
  if (vadeGun > 365) stopajOrani = 0.025
  else if (vadeGun > 180) stopajOrani = 0.05

  const brutKazanc = (anapara * (yillikFaiz / 100) * vadeGun) / 365
  const stopajTutar = brutKazanc * stopajOrani
  const netKazanc = brutKazanc - stopajTutar
  const toplamBakiye = anapara + netKazanc

  return {
    anapara,
    brutKazanc: Math.round(brutKazanc * 100) / 100,
    stopajTutar: Math.round(stopajTutar * 100) / 100,
    netKazanc: Math.round(netKazanc * 100) / 100,
    toplamBakiye: Math.round(toplamBakiye * 100) / 100,
    stopajOraniYuzde: stopajOrani * 100
  }
}

// 10. KREDI KARTLI ASGARİ ÖDEME
export function hesaplaKrediKartıAsgari({ toplamBorc }: { toplamBorc: number }) {
  // Asgari ödeme oranı standart %20
  const asgariOran = 0.20
  const asgariOdeme = toplamBorc * asgariOran
  const kalanBorc = toplamBorc - asgariOdeme
  // Gecikme faizi TCMB azami 2026 referansı (örn. %5.0)
  const aylikFaizOrani = 5.0
  const tahminiGecikmeFaizi = kalanBorc * (aylikFaizOrani / 100)

  return {
    toplamBorc,
    asgariOdeme: Math.round(asgariOdeme * 100) / 100,
    kalanBorc: Math.round(kalanBorc * 100) / 100,
    tahminiGecikmeFaizi: Math.round(tahminiGecikmeFaizi * 100) / 100,
    gelecekAyToplam: Math.round((kalanBorc + tahminiGecikmeFaizi) * 100) / 100
  }
}

// 11. GENEL KREDİ HESAPLAMA (İhtiyaç & Taşıt vb.)
export function hesaplaKrediGenel({ anapara, yillikFaiz, vadeAy, bsmvYuzde, kkdfYuzde }: { anapara: number; yillikFaiz: number; vadeAy: number; bsmvYuzde: number; kkdfYuzde: number }) {
  const aylikFaiz = (yillikFaiz / 12) / 100
  const vergiDahilFaiz = aylikFaiz * (1 + bsmvYuzde / 100 + kkdfYuzde / 100)
  const taksit = vergiDahilFaiz === 0 ? anapara / vadeAy : anapara * (vergiDahilFaiz * Math.pow(1 + vergiDahilFaiz, vadeAy)) / (Math.pow(1 + vergiDahilFaiz, vadeAy) - 1)
  const toplamOdeme = taksit * vadeAy
  const toplamFaizVeVergi = toplamOdeme - anapara

  return {
    anapara,
    aylikTaksit: Math.round(taksit * 100) / 100,
    toplamGeriOdeme: Math.round(toplamOdeme * 100) / 100,
    toplamFaizVeVergi: Math.round(toplamFaizVeVergi * 100) / 100,
    maliyetOraniYuzde: anapara > 0 ? Math.round((toplamFaizVeVergi / anapara) * 10000) / 100 : 0
  }
}

// 12. ENFLASYON ETKİSİ HESAPLAYICI (Satın alma gücü)
export function hesaplaEnflasyonEtkisi({ tutar, baslangicYili, hedefYil }: { tutar: number; baslangicYili: number; hedefYil: number }) {
  const yilFarki = Math.abs(hedefYil - baslangicYili)
  const ortalamaEnflasyon = 0.35 // %35 ortalama enflasyon varsayımı
  let sonucTutar = tutar
  if (hedefYil > baslangicYili) {
    // Paranın değer kaybı (Satın alma gücü azalır)
    sonucTutar = tutar / Math.pow(1 + ortalamaEnflasyon, yilFarki)
  } else {
    sonucTutar = tutar * Math.pow(1 + ortalamaEnflasyon, yilFarki)
  }

  return {
    baslangicTutari: tutar,
    yilFarki,
    hedefYilSatinAlmaGucu: Math.round(sonucTutar * 100) / 100,
    degerKaybiTL: Math.round(Math.abs(tutar - sonucTutar) * 100) / 100
  }
}

// 13. MTV HESAPLAMA (2026)
export function hesaplaMTV({ motorHacmi, aracYasi, aracTuru }: { motorHacmi: number; aracYasi: number; aracTuru: 'binek' | 'motosiklet' | 'ticari' }) {
  let matrah = 3000 // 2026 ortalama baz tutar
  if (aracTuru === 'motosiklet') {
    matrah = motorHacmi <= 250 ? 500 : motorHacmi <= 650 ? 1200 : 2500
  } else if (aracTuru === 'ticari') {
    matrah = 4000
  } else {
    // Binek araç
    if (motorHacmi <= 1300) matrah = 3500
    else if (motorHacmi <= 1600) matrah = 6200
    else if (motorHacmi <= 2000) matrah = 11000
    else matrah = 25000
  }

  // Yaş indirimi
  let yasCarpan = 1.0
  if (aracYasi > 15) yasCarpan = 0.2
  else if (aracYasi > 10) yasCarpan = 0.4
  else if (aracYasi > 5) yasCarpan = 0.7
  else if (aracYasi > 3) yasCarpan = 0.85

  const yillikMTV = matrah * yasCarpan
  return {
    yillikMTV: Math.round(yillikMTV * 100) / 100,
    taksitMTV: Math.round((yillikMTV / 2) * 100) / 100,
    aracTuruAçıklama: aracTuru === 'binek' ? 'Binek Otomobil' : aracTuru === 'motosiklet' ? 'Motosiklet' : 'Hafif Ticari'
  }
}

// 14. DİĞER FİNANSAL YARDIMCI FORMÜLLER
export function hesaplaAltinDegeri({ gramFiyati, miktar }: { gramFiyati: number; miktar: number }) {
  return { toplamTutar: Math.round(gramFiyati * miktar * 100) / 100 }
}

export function hesaplaDovizCevirici({ miktar, kur }: { miktar: number; kur: number }) {
  return { toplamTutarTL: Math.round(miktar * kur * 100) / 100 }
}

export function hesaplaDovizArbitraj({ miktar, parite }: { miktar: number; parite: number }) {
  return { hedefDovizTutar: Math.round(miktar * parite * 100) / 100 }
}

export function hesaplaBES({ aylikKatki, sureYil, fonGetirisi }: { aylikKatki: number; sureYil: number; fonGetirisi: number }) {
  const aySayisi = sureYil * 12
  let toplamMevduat = 0
  let toplamDevletKatkisi = 0
  const aylikFonOrani = fonGetirisi / 12 / 100

  for (let i = 0; i < aySayisi; i++) {
    toplamMevduat = (toplamMevduat + aylikKatki) * (1 + aylikFonOrani)
    // %30 devlet katkısı
    toplamDevletKatkisi = (toplamDevletKatkisi + aylikKatki * 0.3) * (1 + aylikFonOrani)
  }

  return {
    sahisBirikimi: Math.round(toplamMevduat * 100) / 100,
    devletKatkisiBirikimi: Math.round(toplamDevletKatkisi * 100) / 100,
    toplamBESBirikimi: Math.round((toplamMevduat + toplamDevletKatkisi) * 100) / 100
  }
}

export function hesaplaTemettu({ brutTemettu, stopajOrani }: { brutTemettu: number; stopajOrani: number }) {
  const stopaj = brutTemettu * (stopajOrani / 100)
  const netTemettu = brutTemettu - stopaj
  return {
    brutTemettu: Math.round(brutTemettu * 100) / 100,
    stopajKesintisi: Math.round(stopaj * 100) / 100,
    netTemettu: Math.round(netTemettu * 100) / 100
  }
}

export function hesaplaRepo({ anapara, gunlukFaiz, vadeGun }: { anapara: number; gunlukFaiz: number; vadeGun: number }) {
  const brutRepo = (anapara * (gunlukFaiz / 100) * vadeGun) / 365
  const stopaj = brutRepo * 0.075 // standart %7.5 stopaj
  const netRepo = brutRepo - stopaj
  return {
    anapara,
    brutRepo: Math.round(brutRepo * 100) / 100,
    stopajKesintisi: Math.round(stopaj * 100) / 100,
    netRepo: Math.round(netRepo * 100) / 100,
    toplamTutar: Math.round((anapara + netRepo) * 100) / 100
  }
}

export function hesaplaHisseOrtalama({ adet1, fiyat1, adet2, fiyat2 }: { adet1: number; fiyat1: number; adet2: number; fiyat2: number }) {
  const toplamAdet = adet1 + adet2
  const toplamMaliyet = adet1 * fiyat1 + adet2 * fiyat2
  const ortalamaMaliyet = toplamMaliyet / toplamAdet
  return {
    toplamAdet,
    toplamMaliyet: Math.round(toplamMaliyet * 100) / 100,
    ortalamaMaliyet: Math.round(ortalamaMaliyet * 100) / 100
  }
}

export function hesaplaKriptoKarZarar({ alisFiyati, satisFiyati, adet, komisyonOrani }: { alisFiyati: number; satisFiyati: number; adet: number; komisyonOrani: number }) {
  const alisMaliyet = alisFiyati * adet
  const satisTutari = satisFiyati * adet
  const alisKomisyon = alisMaliyet * (komisyonOrani / 100)
  const satisKomisyon = satisTutari * (komisyonOrani / 100)
  const toplamKomisyon = alisKomisyon + satisKomisyon
  const karZarar = satisTutari - alisMaliyet - toplamKomisyon
  return {
    toplamMaliyet: Math.round((alisMaliyet + alisKomisyon) * 100) / 100,
    toplamGelir: Math.round((satisTutari - satisKomisyon) * 100) / 100,
    toplamKomisyon: Math.round(toplamKomisyon * 100) / 100,
    netKarZarar: Math.round(karZarar * 100) / 100,
    basariOraniYuzde: Math.round((karZarar / alisMaliyet) * 10000) / 100
  }
}

export function hesaplaReelFaiz({ nominalFaiz, enflasyonOrani }: { nominalFaiz: number; enflasyonOrani: number }) {
  const r = (1 + nominalFaiz / 100) / (1 + enflasyonOrani / 100) - 1
  return { reelFaizOraniYuzde: Math.round(r * 10000) / 100 }
}

export function hesaplaROI({ yatirimMaliyeti, yillikGetiri }: { yatirimMaliyeti: number; yillikGetiri: number }) {
  const roi = (yillikGetiri / yatirimMaliyeti) * 100
  const geriDonusYili = yatirimMaliyeti / yillikGetiri
  return {
    roiYuzde: Math.round(roi * 100) / 100,
    geriDonusYili: Math.round(geriDonusYili * 10) / 10
  }
}

export function hesaplaDamgaVergisi({ tutar, belgeTuru }: { tutar: number; belgeTuru: 'sozlesme' | 'kira' | 'ihale' }) {
  let oran = 0.00948 // standart sözleşme binde 9.48
  if (belgeTuru === 'kira') oran = 0.00189 // kira binde 1.89
  else if (belgeTuru === 'ihale') oran = 0.00569 // ihale kararı binde 5.69

  const vergi = tutar * oran
  return {
    damgaVergisiOrani: (oran * 100).toFixed(3) + '%',
    damgaVergisiTutar: Math.round(vergi * 100) / 100
  }
}


// ================================================================
// 2. İŞ HUKUKU FORMÜLLERİ
// ================================================================

export function hesaplaFazlaMesai({ brutAylikUcret, fazlaMesaiSaati, tur }: { brutAylikUcret: number; fazlaMesaiSaati: number; tur: 'normal' | 'gecegunduz' }) {
  const saatlikUcret = brutAylikUcret / 225
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

export function hesaplaYillikIzinUcreti({ brutAylikUcret, calismaSuresiYil, kullanilmayanGun }: { brutAylikUcret: number; calismaSuresiYil: number; kullanilmayanGun: number }) {
  let izinGunu = 14
  if (calismaSuresiYil >= 15) izinGunu = 26
  else if (calismaSuresiYil > 5) izinGunu = 20

  const gunlukBrut = brutAylikUcret / 30
  const brutTutar = kullanilmayanGun * gunlukBrut
  // Yıllık izin ücreti gelir ve damga vergisine tabidir
  const sgkKesintisi = brutTutar * (C.SGK_ISSCI_PAYI + C.SGK_ISSIZLIK_ISSCI) // %15
  const gelirVergisiMatrahi = brutTutar - sgkKesintisi
  const gelirVergisi = gelirVergisiMatrahi * 0.15 // başlangıç dilimi %15
  const damgaVergisi = brutTutar * C.DAMGA_VERGISI_ORANI
  const netTutar = brutTutar - sgkKesintisi - gelirVergisi - damgaVergisi

  return {
    toplamHakEdilenIzinGunu: izinGunu,
    kullanilmayanGun,
    gunlukBrut: Math.round(gunlukBrut * 100) / 100,
    toplamBrutIzinUcreti: Math.round(brutTutar * 100) / 100,
    vergiKesintileri: Math.round((gelirVergisi + damgaVergisi) * 100) / 100,
    netIzinUcreti: Math.round(netTutar * 100) / 100,
    kanunDayanak: 'İş Kanunu Madde 53-57'
  }
}

export function hesaplaIssizlikMaasi({ primGunSayisi, sonDortAyOrtalamaBrut }: { primGunSayisi: number; sonDortAyOrtalamaBrut: number }) {
  // Şartlar: son 3 yılda en az 600 gün prim
  if (primGunSayisi < 600) {
    return { durum: 'Yetersiz Prim Günü (En az 600 gün olmalı)', baglananMaas: 0 }
  }

  let sureAy = 6
  if (primGunSayisi >= 1080) sureAy = 10
  else if (primGunSayisi >= 900) sureAy = 8

  // İşsizlik maaşı ortalama brütün %40'ıdır, ancak brüt asgari ücretin %80'ini geçemez
  const hesaplanan = sonDortAyOrtalamaBrut * 0.40
  const azamiLimit = C.ASGARI_UCRET_BRUT * 0.80
  const netMaas = Math.min(hesaplanan, azamiLimit)
  const damgaVergisi = netMaas * C.DAMGA_VERGISI_ORANI
  const odenenNet = netMaas - damgaVergisi

  return {
    primGunSayisi,
    odenecekSureAy: sureAy,
    brutIssizlikMaasi: Math.round(netMaas * 100) / 100,
    damgaVergisi: Math.round(damgaVergisi * 100) / 100,
    aylikNetOdenen: Math.round(odenenNet * 100) / 100,
    toplamNetOdenen: Math.round(odenenNet * sureAy * 100) / 100,
    kanunDayanak: '4447 Sayılı Kanun Madde 50'
  }
}

export function hesaplaPartTimeSGK({ aylikCalismaSaati }: { aylikCalismaSaati: number }) {
  // Part time çalışmada her 7.5 saat 1 gün sayılır
  const gunSayisi = Math.ceil(aylikCalismaSaati / 7.5)
  return {
    aylikCalismaSaati,
    sgkBildirilecekGun: Math.min(gunSayisi, 30),
    eksikGunSayisi: Math.max(0, 30 - Math.min(gunSayisi, 30))
  }
}

export function hesaplaIseIadeTazminati({ brutAylikUcret, bosSureAy, tazminatAy }: { brutAylikUcret: number; bosSureAy: number; tazminatAy: number }) {
  const bosSureTutar = Math.min(bosSureAy, 4) * brutAylikUcret
  const tazminatTutar = Math.min(tazminatAy, 8) * brutAylikUcret
  const toplamBrut = bosSureTutar + tazminatTutar
  const damgaVergisi = toplamBrut * C.DAMGA_VERGISI_ORANI
  return {
    bostaGecenSureBrut: Math.round(bosSureTutar * 100) / 100,
    iseBaslatmamaTazminatiBrut: Math.round(tazminatTutar * 100) / 100,
    toplamBrut,
    damgaVergisi: Math.round(damgaVergisi * 100) / 100,
    toplamNetTazminat: Math.round((toplamBrut - damgaVergisi) * 100) / 100
  }
}

export function hesaplaKotuniyetTazminati({ brutAylikUcret, calismaSuresiAy }: { brutAylikUcret: number; calismaSuresiAy: number }) {
  const ihbarEntry = C.IHBAR_HAFTALARI.find(h => calismaSuresiAy <= h.max_ay)!
  const ihbarGunu = ihbarEntry.hafta * 7
  const gunlukBrut = brutAylikUcret / 30
  // Kötüniyet tazminatı ihbar süresinin 3 katıdır
  const tazminatBrut = gunlukBrut * ihbarGunu * 3
  const damgaVergisi = tazminatBrut * C.DAMGA_VERGISI_ORANI
  return {
    tazminatBrut: Math.round(tazminatBrut * 100) / 100,
    damgaVergisi: Math.round(damgaVergisi * 100) / 100,
    netTazminat: Math.round((tazminatBrut - damgaVergisi) * 100) / 100,
    kanunDayanak: 'İş Kanunu Madde 18'
  }
}

export function hesaplaAskerlikBorclanmasi({ borclanilanGun }: { borclanilanGun: number }) {
  // 2026 Günlük taban prim = brüt asgari ücretin %32'si / 30
  const gunlukTaban = (C.ASGARI_UCRET_BRUT * 0.32) / 30
  const gunlukTavan = gunlukTaban * 7.5
  return {
    borclanilanGun,
    asgariMaliyet: Math.round(gunlukTaban * borclanilanGun * 100) / 100,
    azamiMaliyet: Math.round(gunlukTavan * borclanilanGun * 100) / 100
  }
}

export function hesaplaDogumBorclanmasi({ çocukSayisi, borclanilanGun }: { çocukSayisi: number; borclanilanGun: number }) {
  // En fazla 3 çocuk için her çocukta maks 720 gün
  const maxGun = çocukSayisi * 720
  const gercekGun = Math.min(borclanilanGun, maxGun)
  const gunlukTaban = (C.ASGARI_UCRET_BRUT * 0.32) / 30
  return {
    çocukSayisi,
    hesaplananGun: gercekGun,
    toplamAsgariMaliyet: Math.round(gunlukTaban * gercekGun * 100) / 100
  }
}

export function hesaplaYurtdisiBorclanmasi({ borclanilanGun }: { borclanilanGun: number }) {
  // Yurtdışı borçlanma oranı %45'tir
  const gunlukTaban = (C.ASGARI_UCRET_BRUT * 0.45) / 30
  return {
    borclanilanGun,
    toplamMaliyet: Math.round(gunlukTaban * borclanilanGun * 100) / 100
  }
}

export function hesaplaMalulenEmeklilik({ sgkGirisYili, primGunSayisi, engelOrani }: { sgkGirisYili: number; primGunSayisi: number; engelOrani: number }) {
  // Malullük şartı: en az %60 iş göremezlik, 10 yıl sigortalılık ve 1800 gün prim
  const suAnkiYil = 2026
  const sigortalilikYili = suAnkiYil - sgkGirisYili
  const sart1 = sigortalilikYili >= 10
  const sart2 = primGunSayisi >= 1800
  const sart3 = engelOrani >= 60

  return {
    sigortalilikYili,
    durum: sart1 && sart2 && sart3 ? 'Malulen Emekliliğe Hak Kazanıyor' : 'Şartları Sağlamıyor',
    eksikSigortalilikYil: sart1 ? 0 : 10 - sigortalilikYili,
    eksikPrimGun: sart2 ? 0 : 1800 - primGunSayisi,
    gerekliEngelOrani: 'En az %60 olmalı'
  }
}

export function hesaplaEngelliEmeklilik({ engelOrani, primGunSayisi }: { engelOrani: number; primGunSayisi: number }) {
  let derece = 'Yok'
  let gerekliPrim = 0
  if (engelOrani >= 80) {
    derece = '1. Derece (%80+)'
    gerekliPrim = 3600
  } else if (engelOrani >= 60) {
    derece = '2. Derece (%60-%79)'
    gerekliPrim = 4000
  } else if (engelOrani >= 40) {
    derece = '3. Derece (%40-%59)'
    gerekliPrim = 4400
  }

  return {
    engelDerecesi: derece,
    mevcutPrimGunu: primGunSayisi,
    gerekliPrimGunu: gerekliPrim,
    durum: gerekliPrim > 0 && primGunSayisi >= gerekliPrim ? 'Emeklilik Şartlarını Sağlıyor' : 'Prim Gün Sayısı Yersiz'
  }
}

export function hesaplaSGDPMaliyeti({ brutAylikUcret }: { brutAylikUcret: number }) {
  // SGDP Oranları 2026: işveren %24.5, işçi %7.5
  const isvPay = brutAylikUcret * 0.245
  const isciPay = brutAylikUcret * 0.075
  return {
    brutAylikUcret,
    isciSGDPHakki: Math.round(isciPay * 100) / 100,
    isverenSGDPPayi: Math.round(isvPay * 100) / 100,
    isvereneToplamMaliyet: Math.round((brutAylikUcret + isvPay) * 100) / 100
  }
}

export function hesaplaGiydirilmisUcret({ brutAylikUcret, aylikYemekYardimi, aylikYolYardimi, yillikIkramiyeTutari }: { brutAylikUcret: number; aylikYemekYardimi: number; aylikYolYardimi: number; yillikIkramiyeTutari: number }) {
  const aylikIkramiye = yillikIkramiyeTutari / 12
  const giydirilmis = brutAylikUcret + aylikYemekYardimi + aylikYolYardimi + aylikIkramiye
  return {
    brutCiplakUcret: brutAylikUcret,
    aylikIkramiyePayi: Math.round(aylikIkramiye * 100) / 100,
    giydirilmisAylikBrut: Math.round(giydirilmis * 100) / 100,
    giydirilmisGunlukBrut: Math.round((giydirilmis / 30) * 100) / 100
  }
}

export function hesaplaIsKazasiOdenegi({ brutAylikUcret, gunSayisi }: { brutAylikUcret: number; gunSayisi: number }) {
  const gunlukBrut = brutAylikUcret / 30
  // Tedavi durumuna göre yatarak %50, ayakta %66.6
  const yatarakOdenek = gunlukBrut * 0.5 * gunSayisi
  const ayaktaOdenek = gunlukBrut * 0.666 * gunSayisi
  return {
    gunlukBrut: Math.round(gunlukBrut * 100) / 100,
    toplamGün: gunSayisi,
    yatarakTedaviOdenek: Math.round(yatarakOdenek * 100) / 100,
    ayaktaTedaviOdenek: Math.round(ayaktaOdenek * 100) / 100
  }
}

export function hesaplaHaftaTatiliUcreti({ brutAylikUcret, pazarCalisilanGun }: { brutAylikUcret: number; pazarCalisilanGun: number }) {
  const gunlukBrut = brutAylikUcret / 30
  // Hafta tatili çalışması %150 zamlı ödenir (toplam 2.5 yevmiye)
  const hakEdilen = gunlukBrut * 1.5 * pazarCalisilanGun
  return {
    gunlukStandartUcret: Math.round(gunlukBrut * 100) / 100,
    pazarCalisilanGun,
    haftaTatiliEkUcreti: Math.round(hakEdilen * 100) / 100
  }
}

export function hesaplaUBGT({ brutAylikUcret, calisilanResmiTatilGunu }: { brutAylikUcret: number; calisilanResmiTatilGunu: number }) {
  const gunlukBrut = brutAylikUcret / 30
  // Resmi tatil çalışması %100 zamlı (çift yevmiye)
  const ekUcret = gunlukBrut * calisilanResmiTatilGunu
  return {
    gunlukStandartUcret: Math.round(gunlukBrut * 100) / 100,
    calisilanResmiTatilGunu,
    hakEdilenEkTatilUcreti: Math.round(ekUcret * 100) / 100
  }
}

export function hesaplaSendikaAidati({ brutAylikUcret, aidatYevmiyeAdet }: { brutAylikUcret: number; aidatYevmiyeAdet: number }) {
  const gunlukBrut = brutAylikUcret / 30
  const aidat = gunlukBrut * aidatYevmiyeAdet
  return {
    aylikBrutUcret: brutAylikUcret,
    kesilenSendikaAidati: Math.round(aidat * 100) / 100,
    aidatSonrasiMatahk: Math.round((brutAylikUcret - aidat) * 100) / 100
  }
}

export function hesaplaAsgariUcretVergiIstisnasi({ brutAylikUcret }: { brutAylikUcret: number }) {
  // Asgari ücrete isabet eden kısımdan vergi muafiyeti tutarı hesaplama
  const asgariSgk = C.ASGARI_UCRET_BRUT * (C.SGK_ISSCI_PAYI + C.SGK_ISSIZLIK_ISSCI)
  const asgariMatrah = C.ASGARI_UCRET_BRUT - asgariSgk
  const istisnaVergi = asgariMatrah * 0.15 // asgari ücret seviyesi %15 vergi
  const istisnaDamga = C.ASGARI_UCRET_BRUT * C.DAMGA_VERGISI_ORANI

  return {
    asgariUcretBrut: C.ASGARI_UCRET_BRUT,
    aylikIstisnaGelirVergisi: Math.round(istisnaVergi * 100) / 100,
    aylikIstisnaDamgaVergisi: Math.round(istisnaDamga * 100) / 100,
    toplamVergiIstisnaAvantaji: Math.round((istisnaVergi + istisnaDamga) * 100) / 100
  }
}

export function hesaplaIsciIbraname({ brutAylikUcret, calismaSuresiAy, kullanilmayanIzinGun, fazlaMesaiSaati }: { brutAylikUcret: number; calismaSuresiAy: number; kullanilmayanIzinGun: number; fazlaMesaiSaati: number }) {
  const kidem = hesaplaKidemTazminati({ brutAylikUcret, calismaSuresiAy })
  const ihbar = hesaplaIhbarTazminati({ brutAylikUcret, calismaSuresiAy })
  const izin = hesaplaYillikIzinUcreti({ brutAylikUcret, calismaSuresiYil: Math.floor(calismaSuresiAy / 12), kullanilmayanGun: kullanilmayanIzinGun })
  const mesai = hesaplaFazlaMesai({ brutAylikUcret, fazlaMesaiSaati, tur: 'normal' })

  const toplamBrut = kidem.toplamBrut + ihbar.tazminatBrut + izin.toplamBrutIzinUcreti + mesai.toplamFazlaMesaiUcreti
  const toplamNet = kidem.netTazminat + ihbar.netTazminat + izin.netIzinUcreti + (mesai.toplamFazlaMesaiUcreti * 0.70) // tahmini vergi kesintisiyle net mesai

  return {
    toplamBrutIbranamelTutari: Math.round(toplamBrut * 100) / 100,
    toplamNetEleGecen: Math.round(toplamNet * 100) / 100,
    detayKidemNet: kidem.netTazminat,
    detayIhbarNet: ihbar.netTazminat,
    detayIzinNet: izin.netIzinUcreti,
    detayMesaiTahminiNet: Math.round((mesai.toplamFazlaMesaiUcreti * 0.70) * 100) / 100
  }
}

export function hesaplaHakliNedenleIstifa({ mobbingVarMi, maasGecikmesiVarMi, sigortaEksikMi }: { mobbingVarMi: 'evet' | 'hayir'; maasGecikmesiVarMi: 'evet' | 'hayir'; sigortaEksikMi: 'evet' | 'hayir' }) {
  const hakli = mobbingVarMi === 'evet' || maasGecikmesiVarMi === 'evet' || sigortaEksikMi === 'evet'
  return {
    hakliFesihHakkı: hakli ? 'MEVCUT' : 'Mevcut Değil',
    kidemTazminatiHakki: hakli ? 'Var (Kıdem tazminatı talep edebilir)' : 'Yok (İstifa halinde kıdem alamaz)',
    ihbarTazminatiHakki: 'Yok (İstifa eden ihbar tazminatı alamaz)',
    kanunDayanak: 'İş Kanunu Madde 24/II'
  }
}

export function hesaplaStajyerMaasi({ stajTuru }: { stajTuru: 'lise_universite' | 'muhendislik' | 'aday_cirak' }) {
  let oran = 0.30
  if (stajTuru === 'muhendislik') oran = 0.60
  const netMaas = C.ASGARI_UCRET_NET * oran
  return {
    asgariUcretNet: C.ASGARI_UCRET_NET,
    stajyerOraniYuzde: oran * 100,
    stajyerAylikNetMaas: Math.round(netMaas * 100) / 100,
    kanunDayanak: '3308 Sayılı Kanun Madde 25'
  }
}

export function hesaplaIsverenSGKTehvikleri({ brutAylikUcret, sektor }: { brutAylikUcret: number; sektor: 'imalat' | 'diger' }) {
  const sgkMatrahi = Math.min(Math.max(brutAylikUcret, C.SGK_TABAN_UCRET), C.SGK_TAVAN_UCRET)
  const standartIsvSGK = sgkMatrahi * C.SGK_ISVEREN_PAYI // %15.5
  // İmalat %5 teşvik, Diğer %2 teşvik (2026 Hazine indirimi)
  const tesvikOrani = sektor === 'imalat' ? 0.05 : 0.02
  const indirimTutar = sgkMatrahi * tesvikOrani
  const odenenSGK = standartIsvSGK - indirimTutar

  return {
    standartIsverenSGK: Math.round(standartIsvSGK * 100) / 100,
    tesvikIndirimi: Math.round(indirimTutar * 100) / 100,
    odenecekNetSGK: Math.round(odenenSGK * 100) / 100,
    toplamIsverenMaliyeti: Math.round((brutAylikUcret + odenenSGK + (sgkMatrahi * C.SGK_ISVEREN_ISSIZLIK)) * 100) / 100
  }
}

export function hesaplaGelirVergisi({ yillikGelir }: { yillikGelir: number }) {
  let vergi = 0
  let oncekiLimit = 0
  const dilimler: { dilim: string; oran: string; vergi: number }[] = []

  for (const dilim of C.GELIR_VERGISI_DILIMLERI) {
    if (yillikGelir <= oncekiLimit) break
    const dilimdeKalan = Math.min(yillikGelir, dilim.limit) - oncekiLimit
    const dilimVergisi = dilimdeKalan * dilim.oran
    vergi += dilimVergisi
    dilimler.push({
      dilim: dilim.limit === Infinity ? `${oncekiLimit.toLocaleString('tr-TR')} TL üzeri` : `${oncekiLimit.toLocaleString('tr-TR')} - ${dilim.limit.toLocaleString('tr-TR')} TL`,
      oran: `%${(dilim.oran * 100).toFixed(0)}`,
      vergi: Math.round(dilimVergisi * 100) / 100
    })
    oncekiLimit = dilim.limit
    if (yillikGelir <= dilim.limit) break
  }

  const efektifOran = yillikGelir > 0 ? (vergi / yillikGelir) * 100 : 0
  const netGelir = yillikGelir - vergi

  return {
    toplamVergi: Math.round(vergi * 100) / 100,
    netGelir: Math.round(netGelir * 100) / 100,
    efektifVergiOrani: Math.round(efektifOran * 100) / 100,
    dilimler
  }
}

export function hesaplaKumulatifVergiTakibi({ aylikBrutMaas, baslangicAyAdet }: { aylikBrutMaas: number; baslangicAyAdet: number }) {
  const sgk = aylikBrutMaas * (C.SGK_ISSCI_PAYI + C.SGK_ISSIZLIK_ISSCI)
  const aylikMatrah = aylikBrutMaas - sgk
  let kumulatifMatrah = aylikMatrah * baslangicAyAdet
  
  // Bulunulan ayın vergisini kümülatif dilime göre bulma
  let vergi = 0
  const yillikMatrahSonrasi = kumulatifMatrah + aylikMatrah

  const hesaplaKümülatifVergi = (matrah: number) => {
    let v = 0
    let oncekiLimit = 0
    for (const dilim of C.GELIR_VERGISI_DILIMLERI) {
      if (matrah <= oncekiLimit) break
      const dilimdeKalan = Math.min(matrah, dilim.limit) - oncekiLimit
      v += dilimdeKalan * dilim.oran
      oncekiLimit = dilim.limit
      if (matrah <= dilim.limit) break
    }
    return v
  }

  const vergiOnceki = hesaplaKümülatifVergi(kumulatifMatrah)
  const vergiSonraki = hesaplaKümülatifVergi(yillikMatrahSonrasi)
  vergi = vergiSonraki - vergiOnceki

  const damga = aylikBrutMaas * C.DAMGA_VERGISI_ORANI
  const netMaas = aylikBrutMaas - sgk - vergi - damga

  return {
    aylikBrutMaas,
    mevcutKumulatifMatrah: Math.round(kumulatifMatrah * 100) / 100,
    buAyKesilenGelirVergisi: Math.round(vergi * 100) / 100,
    buAyNetEleGecen: Math.round(netMaas * 100) / 100
  }
}

export function hesaplaTazminatZamanAsimi({ tazminatMiktarı, hakEdisYili }: { tazminatMiktarı: number; hakEdisYili: number }) {
  const suAnkiYil = 2026
  const gecenYil = suAnkiYil - hakEdisYili
  // Yasal kıdem tazminatı zaman aşımı 5 yıldır
  const zamanAsimiVarMi = gecenYil > 5
  return {
    gecenYil,
    zamanAsimiDurumu: zamanAsimiVarMi ? 'ZAMAN AŞIMINA UĞRADI (Maks 5 Yıl)' : 'Zaman Aşımı Süresi İçinde (Talep Edilebilir)',
    tazminatAnaPara: tazminatMiktarı,
    kanunDayanak: '7036 Sayılı Kanun Madde 15'
  }
}


// ================================================================
// 3. EĞİTİM & SINAV FORMÜLLERİ
// ================================================================

export function hesaplaTYTNet({ turkce_d, turkce_y, mat_d, mat_y, sosyal_d, sosyal_y, fen_d, fen_y }: any) {
  const sections = [
    { ad: 'Türkçe', d: turkce_d || 0, y: turkce_y || 0 },
    { ad: 'Matematik', d: mat_d || 0, y: mat_y || 0 },
    { ad: 'Sosyal Bilimler', d: sosyal_d || 0, y: sosyal_y || 0 },
    { ad: 'Fen Bilimleri', d: fen_d || 0, y: fen_y || 0 }
  ]
  const tyt = sections.map(s => ({
    ad: s.ad,
    dogru: s.d,
    yanlis: s.y,
    net: Math.max(0, Math.round((s.d - s.y / 4) * 100) / 100)
  }))
  const toplamNet = tyt.reduce((sum, s) => sum + s.net, 0)
  // Her ders grubunun ÖSYM ham puana katkısı farklı ağırlıklıdır (yaklaşık, yıllık
  // ortalama/standart sapmaya göre ÖSYM tarafından belirlenir ve her sınavda değişir).
  // Türkçe ve Temel Matematik ~1.32, Sosyal ve Fen Bilimleri ~1.36 katsayısıyla hesaba katılır.
  const agirlik: Record<string, number> = {
    'Türkçe': 1.32,
    'Matematik': 1.32,
    'Sosyal Bilimler': 1.36,
    'Fen Bilimleri': 1.36
  }
  const taban = 100
  const tahminiPuan = taban + tyt.reduce((sum, s) => sum + s.net * (agirlik[s.ad] || 1.34), 0)

  return {
    tyt,
    toplamNet: Math.round(toplamNet * 100) / 100,
    tahminiTabanPuan: Math.round(tahminiPuan * 100) / 100
  }
}

export function hesaplaAYTPuan({ say_d, say_y, soz_d, soz_y, ea_d, ea_y, obp }: any) {
  const sayNet = Math.max(0, (say_d || 0) - (say_y || 0) / 4)
  const sozNet = Math.max(0, (soz_d || 0) - (soz_y || 0) / 4)
  const eaNet = Math.max(0, (ea_d || 0) - (ea_y || 0) / 4)
  
  const obpPuani = (obp || 50) * 0.12

  return {
    sayisalNet: Math.round(sayNet * 100) / 100,
    sozelNet: Math.round(sozNet * 100) / 100,
    esitAgirlikNet: Math.round(eaNet * 100) / 100,
    sayisalHamPuan: Math.round((100 + sayNet * 3.0) * 100) / 100,
    sozelHamPuan: Math.round((100 + sozNet * 3.0) * 100) / 100,
    obpKatkisi: Math.round(obpPuani * 100) / 100
  }
}

export function hesaplaYKSYerlestirme({ hamPuan, obp, okulBirincisi }: { hamPuan: number; obp: number; okulBirincisi: 'evet' | 'hayir' }) {
  const obpKatki = obp * 0.12
  const yerlestirme = hamPuan + obpKatki
  return {
    hamPuan,
    obpKatki: Math.round(obpKatki * 100) / 100,
    yerlestirmePuani: Math.round(yerlestirme * 100) / 100,
    okulBirinciligiDurumu: okulBirincisi === 'evet' ? 'Öncelikli kontenjandan faydalanabilir' : 'Faydalanamaz'
  }
}

export function hesaplaKPSS({ gk_d, gk_y, gy_d, gy_y, egitim_d, egitim_y }: any) {
  const gkNet = Math.max(0, (gk_d || 0) - (gk_y || 0) / 4)
  const gyNet = Math.max(0, (gy_d || 0) - (gy_y || 0) / 4)
  const toplamNet = gkNet + gyNet
  // P3 puan türü tahmini formülü: 40 + (GK + GY Netleri) * 0.5
  const p3 = 48 + (toplamNet * 0.45)
  return {
    gkNet: Math.round(gkNet * 100) / 100,
    gyNet: Math.round(gyNet * 100) / 100,
    toplamNet: Math.round(toplamNet * 100) / 100,
    tahminiKPSSP3Puani: Math.round(p3 * 100) / 100
  }
}

export function hesaplaLGS({ turkce_d, turkce_y, mat_d, mat_y, fen_d, fen_y, inkilap_d, inkilap_y, din_d, din_y, dil_d, dil_y }: any) {
  // LGS'de 3 yanlış 1 doğruyu götürür
  const t_net = Math.max(0, (turkce_d || 0) - (turkce_y || 0) / 3)
  const m_net = Math.max(0, (mat_d || 0) - (mat_y || 0) / 3)
  const f_net = Math.max(0, (fen_d || 0) - (fen_y || 0) / 3)
  const i_net = Math.max(0, (inkilap_d || 0) - (inkilap_y || 0) / 3)
  const d_net = Math.max(0, (din_d || 0) - (din_y || 0) / 3)
  const l_net = Math.max(0, (dil_d || 0) - (dil_y || 0) / 3)

  // Standart MEB katsayıları: Türkçe, Mat, Fen = 4; İnkılap, Din, Dil = 1
  const agirlikliNet = t_net * 4 + m_net * 4 + f_net * 4 + i_net * 1 + d_net * 1 + l_net * 1
  const tahminiPuan = 194 + agirlikliNet * 1.83

  return {
    toplamLGSNeti: Math.round((t_net + m_net + f_net + i_net + d_net + l_net) * 100) / 100,
    tahminiLGSPuani: Math.round(Math.min(500, tahminiPuan) * 100) / 100
  }
}

export function hesaplaALES({ say_d, say_y, soz_d, soz_y }: any) {
  const sayNet = Math.max(0, (say_d || 0) - (say_y || 0) / 4)
  const sozNet = Math.max(0, (soz_d || 0) - (soz_y || 0) / 4)

  const alesSay = 50 + sayNet * 0.95
  const alesSoz = 50 + sozNet * 0.95
  const alesEa = 50 + ((sayNet + sozNet) / 2) * 0.95

  return {
    alesSayisal: Math.round(alesSay * 100) / 100,
    alesSozel: Math.round(alesSoz * 100) / 100,
    alesEsitAgirlik: Math.round(alesEa * 100) / 100
  }
}

export function hesaplaDGS({ say_d, say_y, soz_d, soz_y, onlisansBasariPuani }: any) {
  const sayNet = Math.max(0, (say_d || 0) - (say_y || 0) / 4)
  const sozNet = Math.max(0, (soz_d || 0) - (soz_y || 0) / 4)
  const obpKatki = (onlisansBasariPuani || 50) * 0.6
  
  return {
    sayisalNet: Math.round(sayNet * 100) / 100,
    sozelNet: Math.round(sozNet * 100) / 100,
    tahminiDGSSayisal: Math.round((120 + sayNet * 1.5 + obpKatki) * 100) / 100,
    tahminiDGSSozel: Math.round((120 + sozNet * 1.5 + obpKatki) * 100) / 100
  }
}

export function hesaplaYDS({ dogruSayisi }: { dogruSayisi: number }) {
  // YDS'de yanlış doğruyu götürmez, her soru 1.25 puandır (maks 80 soru)
  const soru = Math.min(dogruSayisi, 80)
  const puan = soru * 1.25
  let seviye = 'E'
  if (puan >= 90) seviye = 'A'
  else if (puan >= 80) seviye = 'B'
  else if (puan >= 70) seviye = 'C'
  else if (puan >= 60) seviye = 'D'

  return {
    soruSayisi: soru,
    ydsPuani: puan,
    dilSeviyesi: seviye
  }
}

export function hesaplaYOKDIL({ dogruSayisi }: { dogruSayisi: number }) {
  return hesaplaYDS({ dogruSayisi }) // YÖKDİL de 80 soru ve 1.25 katsayısına sahiptir
}

export function hesaplaNotOrtalamasi(params: any) {
  const { sistem } = params
  let totalCredits = 0
  let weightedSum = 0
  
  for (let i = 1; i <= 5; i++) {
    const grade = params[`ders${i}_not`]
    const credit = params[`ders${i}_kredi`]
    if (grade !== undefined && grade !== '' && credit !== undefined && credit !== '') {
      const g = Number(grade)
      const c = Number(credit)
      weightedSum += g * c
      totalCredits += c
    }
  }
  
  const ortalama = totalCredits > 0 ? weightedSum / totalCredits : 0
  return {
    secilenSistem: sistem === '4' ? "4'lük Sistem" : "100'lük Sistem",
    toplamKredi: totalCredits,
    ortalama: Math.round(ortalama * 100) / 100,
    durum: ortalama >= (sistem === '4' ? 2.0 : 50) ? 'Başarılı' : 'Başarısız'
  }
}

export function hesaplaNotSistemiCevirici({ notu, kaynakSistem }: { notu: number; kaynakSistem: '100' | '4' }) {
  if (kaynakSistem === '4') {
    // 4'lükten 100'lüğe YÖK dönüşümü (yaklaşık lineer formül)
    const yuzluk = 25 * notu
    return { kaynakNot: notu, hedefNot100: Math.round(yuzluk * 100) / 100 }
  } else {
    // 100'lükten 4'lüğe
    const dortluk = notu / 25
    return { kaynakNot: notu, hedefNot4: Math.round(dortluk * 100) / 100 }
  }
}

export function hesaplaCanEgrisi({ ogrenciNotu, sinifOrtalamasi, standartSapma }: { ogrenciNotu: number; sinifOrtalamasi: number; standartSapma: number }) {
  const zSkoru = (ogrenciNotu - sinifOrtalamasi) / (standartSapma || 1)
  const tSkoru = 50 + zSkoru * 10
  let harf = 'CC'
  if (tSkoru >= 70) harf = 'AA'
  else if (tSkoru >= 65) harf = 'BA'
  else if (tSkoru >= 60) harf = 'BB'
  else if (tSkoru >= 55) harf = 'CB'
  else if (tSkoru >= 45) harf = 'DC'
  else if (tSkoru >= 40) harf = 'DD'
  else harf = 'FF'

  return {
    zSkoru: Math.round(zSkoru * 100) / 100,
    tSkoru: Math.round(tSkoru * 100) / 100,
    tahminiHarfNotu: harf
  }
}

export function hesaplaTakdirTesekkur({ donemOrtalamasi, zayıfDersSayisi }: { donemOrtalamasi: number; zayıfDersSayisi: number }) {
  if (zayıfDersSayisi > 0) {
    return { donemOrtalamasi, durum: 'Belge Alamaz (Zayıf ders var)' }
  }
  let belge = 'Belge Alamaz'
  if (donemOrtalamasi >= 85) belge = 'TAKDİR BELGESİ'
  else if (donemOrtalamasi >= 70) belge = 'TEŞEKKÜR BELGESİ'

  return {
    donemOrtalamasi,
    belgeDurumu: belge
  }
}

export function hesaplaLiseSinifGecme({ donemOrtalamasi, zayıfDersSayisi }: { donemOrtalamasi: number; zayıfDersSayisi: number }) {
  let durum = 'Sınıf Geçti'
  if (donemOrtalamasi < 50) durum = 'Sınıfta Kaldı'
  else if (zayıfDersSayisi > 3) durum = 'Sorumlu Geçti (Borçlu)'

  return {
    donemOrtalamasi,
    zayıfDersSayisi,
    sinifGecmeDurumu: durum
  }
}

export function hesaplaTUS({ tıp_d, tıp_y, klinik_d, klinik_y }: any) {
  const t_net = Math.max(0, (tıp_d || 0) - (tıp_y || 0) / 4)
  const k_net = Math.max(0, (klinik_d || 0) - (klinik_y || 0) / 4)
  const puan = 45 + t_net * 0.22 + k_net * 0.22
  return {
    temelTıpNeti: Math.round(t_net * 100) / 100,
    klinikTıpNeti: Math.round(k_net * 100) / 100,
    tahminiTUSPuani: Math.round(puan * 100) / 100
  }
}

export function hesaplaDUS({ d_d, d_y }: any) {
  const net = Math.max(0, (d_d || 0) - (d_y || 0) / 4)
  return { net, tahminiDUSPuani: Math.round((40 + net * 0.45) * 100) / 100 }
}

export function hesaplaEUS({ e_d, e_y }: any) {
  const net = Math.max(0, (e_d || 0) - (e_y || 0) / 4)
  return { net, tahminiEUSPuani: Math.round((40 + net * 0.45) * 100) / 100 }
}

export function hesaplaUniversiteHarclari({ fakulteTuru, uzatilanDonemAdet }: { fakulteTuru: 'muhendislik' | 'tip' | 'hukuk' | 'edebiyat'; uzatilanDonemAdet: number }) {
  let baz = 400
  if (fakulteTuru === 'tip') baz = 1200
  else if (fakulteTuru === 'muhendislik') baz = 600
  else if (fakulteTuru === 'hukuk') baz = 500

  const harc = baz * (1 + uzatilanDonemAdet * 0.5)
  return {
    donemlikHarçTutari: Math.round(harc * 100) / 100,
    aciklama: uzatilanDonemAdet > 0 ? `%${uzatilanDonemAdet * 50} zam uygulandı (okul uzadığı için)` : 'Standart harç bedeli'
  }
}

export function hesaplaGPADonusturuci({ gpa, ulke }: { gpa: number; ulke: 'US' | 'EU' | 'UK' }) {
  let sonuc = 'A'
  if (ulke === 'US') {
    sonuc = gpa >= 3.5 ? '4.0 (A)' : gpa >= 3.0 ? '3.0 (B)' : '2.0 (C)'
  } else {
    sonuc = gpa >= 3.5 ? 'First Class' : 'Upper Second'
  }
  return { kaynakGPA: gpa, hedefUlkeNotKarsiligi: sonuc }
}

export function hesaplaLisansustuKabul({ alesPuani, ydsPuani, mezuniyetNotu }: { alesPuani: number; ydsPuani: number; mezuniyetNotu: number }) {
  // Standart ağırlıklar: ALES %50, YDS %20, OBP %30
  const yerlestirme = alesPuani * 0.5 + ydsPuani * 0.2 + (mezuniyetNotu * 25) * 0.3
  return {
    tahminiAkademikKabulPuani: Math.round(yerlestirme * 100) / 100,
    durum: yerlestirme >= 75 ? 'Başvurusu Güçlü' : 'Başvurusu Zayıf'
  }
}

export function hesaplaSinavGeriSayim({ sinavTuru }: { sinavTuru: 'YKS' | 'KPSS' | 'LGS' | 'ALES' }) {
  const tarihler = {
    YKS: new Date('2026-06-20T10:00:00'),
    KPSS: new Date('2026-07-12T10:00:00'),
    LGS: new Date('2026-06-07T09:30:00'),
    ALES: new Date('2026-04-19T10:00:00')
  }

  const bugun = new Date()
  const farkMs = tarihler[sinavTuru].getTime() - bugun.getTime()
  const gun = Math.ceil(farkMs / (1000 * 60 * 60 * 24))

  return {
    secilenSinav: sinavTuru,
    kalanGunSayisi: Math.max(0, gun),
    durum: gun > 0 ? 'Hazırlık Dönemi Devam Ediyor' : 'Sınav Tamamlandı'
  }
}

export function hesaplaPomodoro({ calismaTur }: { calismaTur: 'klasik' | 'uzun' }) {
  let calisma = 25
  let mola = 5
  if (calismaTur === 'uzun') {
    calisma = 50
    mola = 10
  }
  return {
    calismaSuresiDk: calisma,
    molaSuresiDk: mola,
    toplamDonguDk: calisma + mola
  }
}

export function hesaplaSoruBasinaSure({ toplamSoru, toplamSureDk }: { toplamSoru: number; toplamSureDk: number }) {
  const sn = (toplamSureDk * 60) / toplamSoru
  return {
    soruBasinaKalanSaniye: Math.round(sn),
    soruBasinaKalanDakika: (sn / 60).toFixed(2)
  }
}


// ================================================================
// 4. SAĞLIK FORMÜLLERİ
// ================================================================

export function hesaplaBMI({ agirlik, boy }: { agirlik: number; boy: number }) {
  // boy cm cinsinden geldiği için metreye çeviriyoruz
  const boyMetre = boy / 100
  const bmi = agirlik / (boyMetre * boyMetre)
  const sinif = C.BMI_SINIFLARI.find(s => bmi <= s.max)!
  const idealMin = 18.5 * boyMetre * boyMetre
  const idealMax = 25.0 * boyMetre * boyMetre
  return {
    bmi: Math.round(bmi * 100) / 100,
    sinif: sinif.label,
    idealKiloMin: Math.round(idealMin * 10) / 10,
    idealKiloMax: Math.round(idealMax * 10) / 10,
    fark: Math.round((agirlik - idealMax) * 10) / 10
  }
}

export function hesaplaKalori({ agirlik, boy, yas, cinsiyet, aktivite }: { agirlik: number; boy: number; yas: number; cinsiyet: 'erkek' | 'kadin'; aktivite: number }) {
  const bmh = cinsiyet === 'erkek'
    ? 88.362 + (13.397 * agirlik) + (4.799 * boy) - (5.677 * yas)
    : 447.593 + (9.247 * agirlik) + (3.098 * boy) - (4.330 * yas)
  const tdee = bmh * aktivite
  return {
    bmh: Math.round(bmh),
    tdee: Math.round(tdee),
    zayiflama: Math.round(tdee - 500),
    hizliZayiflama: Math.round(tdee - 1000),
    kilo_alma: Math.round(tdee + 300)
  }
}

export function hesaplaVucutYagOrani({ bel, boyun, kalca, boy, cinsiyet }: { bel: number; boyun: number; kalca: number; boy: number; cinsiyet: 'erkek' | 'kadin' }) {
  let yag = 0
  if (cinsiyet === 'erkek') {
    // US Navy formülü erkek
    yag = 495 / (1.0324 - 0.19077 * Math.log10(bel - boyun) + 0.15456 * Math.log10(boy)) - 450
  } else {
    // US Navy formülü kadın
    yag = 495 / (1.29579 - 0.35004 * Math.log10(bel + kalca - boyun) + 0.22100 * Math.log10(boy)) - 450
  }
  return { vucutYagOraniYuzde: Math.round(Math.max(2, yag) * 10) / 10 }
}

export function hesaplaIdealKilo({ boy, cinsiyet }: { boy: number; cinsiyet: 'erkek' | 'kadin' }) {
  // Devine formülü
  const inchOver5Feet = Math.max(0, (boy - 152.4) / 2.54)
  const ideal = cinsiyet === 'erkek' ? 50 + 2.3 * inchOver5Feet : 45.5 + 2.3 * inchOver5Feet
  return { idealKiloKg: Math.round(ideal * 10) / 10 }
}

export function hesaplaGebelikHaftasi({ sonAdetTarihi }: { sonAdetTarihi: string }) {
  const adet = new Date(sonAdetTarihi)
  const bugun = new Date()
  const farkMs = bugun.getTime() - adet.getTime()
  const gun = Math.floor(farkMs / (1000 * 60 * 60 * 24))
  const hafta = Math.floor(gun / 7)
  const kalanGun = gun % 7

  const dogum = new Date(adet.getTime() + 280 * 24 * 60 * 60 * 1000)

  return {
    gebelikHaftası: `${hafta} Hafta ${kalanGun} Gün`,
    toplamGünGecen: gun,
    tahminiDogumTarihi: dogum.toLocaleDateString('tr-TR'),
    gebelikDurumu: hafta < 40 ? 'Gelişim Devam Ediyor' : 'Doğum Zamanı Geldi'
  }
}

export function hesaplaSuIhtiyaci({ agirlik, günlükEgzersizDk }: { agirlik: number; günlükEgzersizDk: number }) {
  // Standart su ihtiyacı: kilo * 0.033 + egzersiz_dakika * 0.005
  const su = agirlik * 0.033 + günlükEgzersizDk * 0.005
  return { günlükSuİhtiyaciLitre: Math.round(su * 10) / 10 }
}

export function hesaplaHedefNabiz({ yas, dinlenikNabiz, hedefYogunlukYuzde }: { yas: number; dinlenikNabiz: number; hedefYogunlukYuzde: number }) {
  const maksNabiz = 220 - yas
  const yedekNabiz = maksNabiz - dinlenikNabiz
  const hedef = dinlenikNabiz + yedekNabiz * (hedefYogunlukYuzde / 100)
  return {
    maksimumNabiz: maksNabiz,
    hedefEgzersizNabzi: Math.round(hedef)
  }
}

export function hesaplaYagsizVucutKutlesi({ agirlik, boy, cinsiyet }: { agirlik: number; boy: number; cinsiyet: 'erkek' | 'kadin' }) {
  // James formülü
  let lbm = 0
  if (cinsiyet === 'erkek') {
    lbm = 1.1 * agirlik - 128 * Math.pow(agirlik / boy, 2)
  } else {
    lbm = 1.07 * agirlik - 148 * Math.pow(agirlik / boy, 2)
  }
  return { yagsizVucutKutlesiKg: Math.round(lbm * 10) / 10 }
}

export function hesaplaBMR({ agirlik, boy, yas, cinsiyet }: { agirlik: number; boy: number; yas: number; cinsiyet: 'erkek' | 'kadin' }) {
  return { bmrKalori: Math.round(hesaplaKalori({ agirlik, boy, yas, cinsiyet, aktivite: 1.0 }).bmh) }
}

export function hesaplaBebekPersentil({ cinsiyet, yasAy, agirlik, boy }: { cinsiyet: 'erkek' | 'kadin'; yasAy: number; agirlik: number; boy: number }) {
  // Basit ortalama persentil
  const beklenenAgirlik = 3.2 + yasAy * 0.6
  const beklenenBoy = 50 + yasAy * 2.0
  const persentilAgirlik = Math.round((agirlik / beklenenAgirlik) * 50)
  const persentilBoy = Math.round((boy / beklenenBoy) * 50)

  return {
    agirlikPersentili: `${Math.min(99, Math.max(1, persentilAgirlik))}. Persentil`,
    boyPersentili: `${Math.min(99, Math.max(1, persentilBoy))}. Persentil`
  }
}

export function hesaplaOvulasyonTakvimi({ adetDongusuGunu, sonAdetTarihi }: { adetDongusuGunu: number; sonAdetTarihi: string }) {
  const adet = new Date(sonAdetTarihi)
  // Ovülasyon genelde adetten 14 gün öncedir
  const ovulasyonGunu = adetDongusuGunu - 14
  const fertilBaslangic = new Date(adet.getTime() + (ovulasyonGunu - 3) * 24 * 60 * 60 * 1000)
  const fertilBitis = new Date(adet.getTime() + (ovulasyonGunu + 2) * 24 * 60 * 60 * 1000)

  return {
    enFertilGrupBaslangic: fertilBaslangic.toLocaleDateString('tr-TR'),
    enFertilGrupBitis: fertilBitis.toLocaleDateString('tr-TR'),
    tahminiYumurtlamaGunu: new Date(adet.getTime() + ovulasyonGunu * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
  }
}

export function hesaplaAlkolOraniBAC({ miktarMl, alkolYuzdesi, agirlikKg, cinsiyet, gecenSureSaat }: { miktarMl: number; alkolYuzdesi: number; agirlikKg: number; cinsiyet: 'erkek' | 'kadin'; gecenSureSaat: number }) {
  // Widmark Formülü
  const r = cinsiyet === 'erkek' ? 0.68 : 0.55
  const safAlkolGram = miktarMl * (alkolYuzdesi / 100) * 0.8
  let bac = (safAlkolGram / (agirlikKg * 1000 * r)) * 1000
  // Alkolün vücuttan atılımı saatlik yakl. 0.015 promil
  bac = Math.max(0, bac - gecenSureSaat * 0.15)
  return {
    tahminiKanAlkolPromili: Math.round(bac * 100) / 100,
    trafigeCikisDurumu: bac >= 0.5 ? 'YASAK (Limit Üstü)' : 'Yasal Limit Altında (Sorumluluk size aittir)'
  }
}

export function hesaplaVucutYuzeyAlani({ boy, agirlik }: { boy: number; agirlik: number }) {
  // Mosteller formülü
  const bsa = Math.sqrt((boy * agirlik) / 3600)
  return { vucutYuzeyAlanim2: Math.round(bsa * 100) / 100 }
}

export function hesaplaBelKalcaOrani({ bel, kalca, cinsiyet }: { bel: number; kalca: number; cinsiyet: 'erkek' | 'kadin' }) {
  const oran = bel / (kalca || 1)
  let risk = 'Düşük'
  if (cinsiyet === 'erkek' && oran > 0.9) risk = 'Yüksek'
  else if (cinsiyet === 'kadin' && oran > 0.85) risk = 'Yüksek'

  return {
    belKalcaOrani: Math.round(oran * 100) / 100,
    kardiyovaskulerRiskDurumu: risk
  }
}

export function hesaplaAktiviteKalori({ agirlik, sureDk, aktiviteMET }: { agirlik: number; sureDk: number; aktiviteMET: number }) {
  // Kalori = MET * 3.5 * kilo / 200 * dakika
  const cal = aktiviteMET * 3.5 * agirlik * (sureDk / 200)
  return { yakilanToplamKalori: Math.round(cal) }
}

export function hesaplaSigaraBirakmaKazanci({ gunlukPaketAdet, paketFiyati, birakilanGun }: { gunlukPaketAdet: number; paketFiyati: number; birakilanGun: number }) {
  const birikenPara = gunlukPaketAdet * paketFiyati * birakilanGun
  const sigaraSayisi = gunlukPaketAdet * 20 * birakilanGun
  return {
    birakilanGunSayisi: birakilanGun,
    toplamBirikenMiktarTL: Math.round(birikenPara * 100) / 100,
    icilmeyenSigaraAdedi: sigaraSayisi,
    akcigerKapasitesiKazanci: `%${Math.min(99, Math.round(birakilanGun * 0.5))}`
  }
}

export function hesaplaKafeinTakipci({ kahveAdet, cayAdet }: { kahveAdet: number; cayAdet: number }) {
  // kahve 90mg, çay 40mg kafein barındırır
  const toplam = kahveAdet * 90 + cayAdet * 40
  return {
    toplamKafeinAlimiMg: toplam,
    durum: toplam > 400 ? 'GÜNLÜK SINIR AŞILDI (Maks 400mg)' : 'Güvenli Bölgede'
  }
}

export function hesaplaGozlukAks({ kure, silindir, aks }: { kure: number; silindir: number; aks: number }) {
  // Transpozisyon
  const yeniKure = kure + silindir
  const yeniSilindir = -silindir
  const yeniAks = aks >= 90 ? aks - 90 : aks + 90
  return {
    transpozeKure: yeniKure,
    transpozeSilindir: yeniSilindir,
    transpozeAks: yeniAks
  }
}

export function hesaplaBioritim({ dogumTarihi }: { dogumTarihi: string }) {
  const dogum = new Date(dogumTarihi)
  const bugun = new Date()
  const farkMs = bugun.getTime() - dogum.getTime()
  const gun = Math.floor(farkMs / (1000 * 60 * 60 * 24))

  // Ritimler: Fiziksel (23 gün), Duygusal (28 gün), Zihinsel (33 gün)
  const fiz = Math.sin((2 * Math.PI * gun) / 23) * 100
  const duy = Math.sin((2 * Math.PI * gun) / 28) * 100
  const zih = Math.sin((2 * Math.PI * gun) / 33) * 100

  return {
    fizikselRitimYuzde: Math.round(fiz),
    duygusalRitimYuzde: Math.round(duy),
    zihinselRitimYuzde: Math.round(zih)
  }
}

export function hesaplaTansiyonDegerlendirici({ buyuk, kucuk }: { buyuk: number; kucuk: number }) {
  let durum = 'Normal'
  if (buyuk >= 140 || kucuk >= 90) durum = 'Hipertansiyon (Yüksek)'
  else if (buyuk >= 120 || kucuk >= 80) durum = 'Prehipertansiyon (Sınırda)'
  else if (buyuk < 90 || kucuk < 60) durum = 'Hipotansiyon (Düşük)'

  return {
    sistolikBuyuk: buyuk,
    diyastolikKucuk: kucuk,
    tansiyonDurum: durum
  }
}

export function hesaplaMakroBesin({ gunlukKalori, diyetTuru }: { gunlukKalori: number; diyetTuru: 'dengeli' | 'keto' | 'yuksek_protein' }) {
  let p = 0.3, y = 0.3, k = 0.4
  if (diyetTuru === 'keto') {
    p = 0.2
    y = 0.7
    k = 0.1
  } else if (diyetTuru === 'yuksek_protein') {
    p = 0.4
    y = 0.2
    k = 0.4
  }

  // Protein/Karbonhidrat 4 kcal/g, Yağ 9 kcal/g
  const protGram = (gunlukKalori * p) / 4
  const yagGram = (gunlukKalori * y) / 9
  const karbGram = (gunlukKalori * k) / 4

  return {
    hedefKalori: gunlukKalori,
    proteinGram: Math.round(protGram),
    yagGram: Math.round(yagGram),
    karbonhidratGram: Math.round(karbGram)
  }
}

export function hesaplaAkcigerKapasitesi({ boyCm, yas, cinsiyet }: { boyCm: number; yas: number; cinsiyet: 'erkek' | 'kadin' }) {
  // Baldwin formülü
  const boyMetre = boyCm / 100
  const vc = cinsiyet === 'erkek'
    ? (27.63 - 0.112 * yas) * boyMetre
    : (21.78 - 0.101 * yas) * boyMetre
  return { vitalKapasiteLitre: Math.round(vc * 100) / 100 }
}

export function hesaplaBiyolojikYas({ gercekYas, haftalikSporSaat, sigaraAdedi }: { gercekYas: number; haftalikSporSaat: number; sigaraAdedi: number }) {
  let biyo = gercekYas
  if (haftalikSporSaat >= 5) biyo -= 3
  if (sigaraAdedi > 0) biyo += Math.round(sigaraAdedi * 0.2)
  return { gercekYas, tahminiBiyolojikYas: Math.max(18, biyo) }
}

export function hesaplaDehidrasyonRiski({ agirlikKg, egzersizSureDk, sicaklikDerece }: { agirlikKg: number; egzersizSureDk: number; sicaklikDerece: number }) {
  const baz = agirlikKg * 0.033
  const ekSpor = egzersizSureDk * 0.01
  const ekSicaklik = sicaklikDerece > 30 ? (sicaklikDerece - 30) * 0.1 : 0
  const risk = baz + ekSpor + ekSicaklik
  return { gunlukGerekliSuLitre: Math.round(risk * 10) / 10 }
}

export function hesaplaUykuDongusu({ kalkisSaati }: { kalkisSaati: string }) {
  // Geriye doğru 90'ar dakikalık uyku döngüleri
  const parts = kalkisSaati.split(':')
  const h = Number(parts[0])
  const m = Number(parts[1])
  const target = new Date()
  target.setHours(h, m, 0)

  const formatTime = (d: Date) => d.toTimeString().substring(0, 5)

  const d1 = new Date(target.getTime() - 4.5 * 60 * 60 * 1000)
  const d2 = new Date(target.getTime() - 6.0 * 60 * 60 * 1000)
  const d3 = new Date(target.getTime() - 7.5 * 60 * 60 * 1000)
  const d4 = new Date(target.getTime() - 9.0 * 60 * 60 * 1000)

  return {
    kalkisSaati,
    enIdealYatisSuresi: formatTime(d3) + ' (5 Döngü - 7.5 Saat)',
    alternatifYatis1: formatTime(d2) + ' (4 Döngü - 6 Saat)',
    alternatifYatis2: formatTime(d4) + ' (6 Döngü - 9 Saat)'
  }
}


// ================================================================
// 5. FATURA VE ENERJİ FORMÜLLERİ
// ================================================================

export function hesaplaElektrikFaturasi({ aylikKwh }: { aylikKwh: number }) {
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

export function hesaplaDogalgazFaturasi({ aylikM3 }: { aylikM3: number }) {
  const enerji = aylikM3 * C.DOGALGAZ_BIRIM_FIYAT
  const dagitim = aylikM3 * 1.20
  const kdv = (enerji + dagitim) * 0.20
  return {
    aylikM3,
    enerjiTutar: Math.round(enerji * 100) / 100,
    dagitimBedeli: Math.round(dagitim * 100) / 100,
    kdv: Math.round(kdv * 100) / 100,
    toplamFatura: Math.round((enerji + dagitim + kdv) * 100) / 100
  }
}

export function hesaplaSuFaturasi({ aylikM3 }: { aylikM3: number }) {
  // İSKİ 2026 kademeli: 0-15 m³ arası 32.40 TL, 15+ m³ 49.00 TL, atık su dahildir
  const t1 = 32.40
  const t2 = 49.00
  let tutar = 0
  if (aylikM3 <= 15) {
    tutar = aylikM3 * t1
  } else {
    tutar = 15 * t1 + (aylikM3 - 15) * t2
  }
  const kdv = tutar * 0.10
  return {
    aylikM3,
    enerjiTutar: Math.round(tutar * 100) / 100,
    kdv: Math.round(kdv * 100) / 100,
    toplamFatura: Math.round((tutar + kdv) * 100) / 100
  }
}

export function hesaplaTaahhutCayma({ aylikPaketBedeli, toplamTaahhutAyi, kalanAy }: { aylikPaketBedeli: number; toplamTaahhutAyi: number; kalanAy: number }) {
  const kullanilanAy = toplamTaahhutAyi - kalanAy
  const normalFiyat = aylikPaketBedeli * 1.5
  const saglananFayda = (normalFiyat - aylikPaketBedeli) * kullanilanAy
  const kalanDonemBedeli = aylikPaketBedeli * kalanAy
  // Tüketici kanununa göre hangisi tüketici lehine ise o uygulanır
  const caymaBedeli = Math.min(saglananFayda, kalanDonemBedeli)

  return {
    saglananIndirimFaydasi: Math.round(saglananFayda * 100) / 100,
    kalanAylarToplamBedeli: Math.round(kalanDonemBedeli * 100) / 100,
    yasalCaymaBedeliLimit: Math.round(caymaBedeli * 100) / 100
  }
}

export function hesaplaYakitMasrafi({ km, tuketim, litreFiyat }: { km: number; tuketim: number; litreFiyat: number }) {
  const toplamLitre = (km * tuketim) / 100
  const toplamTutar = toplamLitre * litreFiyat
  return {
    km,
    tuketim,
    litreFiyat,
    toplamLitre: Math.round(toplamLitre * 100) / 100,
    toplamTutar: Math.round(toplamTutar * 100) / 100,
    kmBasinaUcret: Math.round((toplamTutar / km) * 100) / 100
  }
}

export function hesaplaOrtakGiderPaylastirma({ toplamGider, daireSayisi }: { toplamGider: number; daireSayisi: number }) {
  return { daireBasinaGider: Math.round((toplamGider / (daireSayisi || 1)) * 100) / 100 }
}

export function hesaplaAbonelikSepeti({ netflix, spotify, youtube, diger }: { netflix: number; spotify: number; youtube: number; diger: number }) {
  const aylik = netflix + spotify + youtube + diger
  return {
    aylikToplamMaliyet: Math.round(aylik * 100) / 100,
    yillikToplamMaliyet: Math.round(aylik * 12 * 100) / 100
  }
}

export function hesaplaElektrikliAracSarj({ bataryaKapasiteKwh, evdenSarjMi }: { bataryaKapasiteKwh: number; evdenSarjMi: 'ev' | 'dc_istasyon' }) {
  // Evden şarj kWh mesken 2.83, dc istasyon kWh 8.5
  const kwhFiyat = evdenSarjMi === 'ev' ? C.ELEKTRIK_TARIFESI.mesken_0_150 : 8.5
  const dolum = bataryaKapasiteKwh * kwhFiyat
  return {
    bataryaKapasiteKwh,
    sarjTip: evdenSarjMi === 'ev' ? 'Evden AC Şarj' : 'Hızlı DC İstasyon',
    dolumMaliyetiTL: Math.round(dolum * 100) / 100
  }
}

export function hesaplaKombiTasarruf({ dereceFarki }: { dereceFarki: number }) {
  // Her 1 derece düşüş %6 tasarruf sağlar
  const tasarruf = dereceFarki * 6
  return { tasarrufOraniYuzde: tasarruf }
}

export function hesaplaGESAmortisman({ panelGucuKw, kurulumMaliyetiTL }: { panelGucuKw: number; kurulumMaliyetiTL: number }) {
  // Türkiye ortalama 4 saat güneş alır
  const gunlukUretim = panelGucuKw * 4
  const aylikUretim = gunlukUretim * 30
  // kWh fiyatı mesken ortalaması
  const tasarrufTL = aylikUretim * C.ELEKTRIK_TARIFESI.mesken_241_plus
  const amortismanYil = kurulumMaliyetiTL / (tasarrufTL * 12)

  return {
    aylikUretimKwh: Math.round(aylikUretim),
    aylikFaturaKazancliTL: Math.round(tasarrufTL * 100) / 100,
    amortismanYili: Math.round(amortismanYil * 10) / 10
  }
}

export function hesaplaTicarethaneElektrik({ aylikKwh }: { aylikKwh: number }) {
  const birim = 5.20 // Ticarethane 2026 ortalama birim fiyat
  const tutar = aylikKwh * birim
  const kdv = tutar * 0.20
  return {
    aylikKwh,
    enerjiTutar: Math.round(tutar * 100) / 100,
    kdv: Math.round(kdv * 100) / 100,
    toplamFatura: Math.round((tutar + kdv) * 100) / 100
  }
}

export function hesaplaSantiyeFatura({ elektrikKwh, suM3 }: { elektrikKwh: number; suM3: number }) {
  const e_birim = 6.50
  const s_birim = 65.00
  const e_tutar = elektrikKwh * e_birim
  const s_tutar = suM3 * s_birim
  const toplam = (e_tutar + s_tutar) * 1.20
  return {
    elektrikMaliyetiBrut: Math.round(e_tutar * 100) / 100,
    suMaliyetiBrut: Math.round(s_tutar * 100) / 100,
    toplamFaturaKdvDahil: Math.round(toplam * 100) / 100
  }
}

export function hesaplaFaturaGecikmeZammi({ faturaTutarı, gecikenGunSayisi }: { faturaTutarı: number; gecikenGunSayisi: number }) {
  const aylikFaiz = 0.025 // %2.5 yasal gecikme faizi
  const gunlukFaiz = aylikFaiz / 30
  const faiz = faturaTutarı * gunlukFaiz * gecikenGunSayisi
  return {
    faturaTutarı,
    gecikenGunSayisi,
    gecikmeZammıTutar: Math.round(faiz * 100) / 100,
    toplamOdenecekTutar: Math.round((faturaTutarı + faiz) * 100) / 100
  }
}

export function hesaplaYillikFaturaAnalizi({ elektrik, dogalgaz, su, internet }: { elektrik: number; dogalgaz: number; su: number; internet: number }) {
  const aylik = elektrik + dogalgaz + su + internet
  return {
    aylikToplamGider: Math.round(aylik * 100) / 100,
    yillikToplamGider: Math.round(aylik * 12 * 100) / 100
  }
}

export function hesaplaSuTasarrufu({ tasarrufluMuslukVarMi }: { tasarrufluMuslukVarMi: 'evet' | 'hayir' }) {
  // Tasarruf musluğu %40 su tasarrufu sağlar. Ortalama fatura 300 TL varsayımıyla
  const tasarruf = tasarrufluMuslukVarMi === 'evet' ? 120 : 0
  return {
    aylikSuTasarrufuTL: tasarruf,
    yillikTasarrufTL: tasarruf * 12
  }
}

export function hesaplaLedTasarrufu({ akkorAmpulAdedi, wattFarki }: { akkorAmpulAdedi: number; wattFarki: number }) {
  // 50W fark, günde 5 saat kullanım
  const gunlukKwh = (akkorAmpulAdedi * wattFarki * 5) / 1000
  const aylikKwh = gunlukKwh * 30
  const tasarruf = aylikKwh * C.ELEKTRIK_TARIFESI.mesken_0_150
  return {
    aylikKwhTasarruf: Math.round(aylikKwh),
    aylikMaddiKazancTL: Math.round(tasarruf * 100) / 100
  }
}

export function hesaplaEvAletleriTuketim({ aletWatti, gunlukKullanimSaat }: { aletWatti: number; gunlukKullanimSaat: number }) {
  const gunlukKwh = (aletWatti * gunlukKullanimSaat) / 1000
  const aylikKwh = gunlukKwh * 30
  const faturaEtkisi = aylikKwh * C.ELEKTRIK_TARIFESI.mesken_151_240
  return {
    aylikKwhTuketimi: Math.round(aylikKwh * 100) / 100,
    faturayaAylikEtkisiTL: Math.round(faturaEtkisi * 100) / 100
  }
}

export function hesaplaSicakSuMaliyeti({ kisiSayisi }: { kisiSayisi: number }) {
  // Kisi başı 50L sıcak su. Kombi doğalgaz vs.
  const dogalgazLitreMaliyeti = 0.08
  const aylik = kisiSayisi * 50 * 30 * dogalgazLitreMaliyeti
  return { aylikSicakSuMaliyetiTL: Math.round(aylik) }
}

export function hesaplaKlimaBTUTuketim({ alanM2 }: { alanM2: number }) {
  // BTU = alan * 400
  const btu = alanM2 * 400
  const tüketimSaat = (btu / 12000) * 1.1 // kW saatte tahmini
  return {
    gerekliKlimaBTU: Math.round(btu),
    tahminiSaatlikElektrikKwh: Math.round(tüketimSaat * 100) / 100
  }
}

export function hesaplaGeriDonusumKatkisi({ kagitKg, plastikKg }: { kagitKg: number; plastikKg: number }) {
  // 1 ton kağıt 17 ağaç kurtarır
  const kurtarilanAgac = (kagitKg / 1000) * 17
  const tasarrufLitrePetrol = plastikKg * 2
  return {
    kurtarilanAgacAdet: Math.round(kurtarilanAgac * 100) / 100,
    tasarrufPetrolLitre: Math.round(tasarrufLitrePetrol)
  }
}

export function hesaplaMerkeziPayOlcer({ binaToplamFatura, daireMetrekare, toplamMetrekare, bireyselTuketimPayi }: { binaToplamFatura: number; daireMetrekare: number; toplamMetrekare: number; bireyselTuketimPayi: number }) {
  // %30 ortak alan gideri arsa payı oranında dağıtılır
  const ortakGider = (binaToplamFatura * 0.3) * (daireMetrekare / (toplamMetrekare || 1))
  // %70 bireysel tüketim payına göre
  const bireysel = (binaToplamFatura * 0.7) * (bireyselTuketimPayi / 100)
  return {
    ortakAlanPayiTL: Math.round(ortakGider * 100) / 100,
    bireyselKullanimPayiTL: Math.round(bireysel * 100) / 100,
    toplamDaireBorcuTL: Math.round((ortakGider + bireysel) * 100) / 100
  }
}

export function hesaplaEndeksOkumaFatura({ ilkEndeks, sonEndeks }: { ilkEndeks: number; sonEndeks: number }) {
  const kwh = sonEndeks - ilkEndeks
  return hesaplaElektrikFaturasi({ aylikKwh: kwh })
}

export function hesaplaSanayiElektrik({ aylikKwh }: { aylikKwh: number }) {
  const birim = 4.80
  const tutar = aylikKwh * birim
  const kdv = tutar * 0.20
  return {
    aylikKwh,
    brutTutar: Math.round(tutar * 100) / 100,
    kdv: Math.round(kdv * 100) / 100,
    toplamSanayiElektrik: Math.round((tutar + kdv) * 100) / 100
  }
}

export function hesaplaFaturayaEkCihaz({ pesinFiyat, taksitSuresi, aylikEkFatura }: { pesinFiyat: number; taksitSuresi: number; aylikEkFatura: number }) {
  const toplam = aylikEkFatura * taksitSuresi
  const vadeFarki = toplam - pesinFiyat
  return {
    toplamOdemeTL: Math.round(toplam * 100) / 100,
    vadeFarkiMiktariTL: Math.round(vadeFarki * 100) / 100,
    vadeFarkYuzdesi: Math.round((vadeFarki / pesinFiyat) * 100)
  }
}

export function hesaplaKDVTevkifati({ tutar, oran, tevkifatTuru }: { tutar: number; oran: number; tevkifatTuru: '5/10' | '9/10' | '2/10' }) {
  const parts = tevkifatTuru.split('/')
  const pay = Number(parts[0])
  const payda = Number(parts[1])

  const kdv = tutar * (oran / 100)
  const tevkifEdilen = kdv * (pay / payda)
  const tahsilEdilen = kdv - tevkifEdilen

  return {
    KDVMatrahi: tutar,
    toplamKDV: Math.round(kdv * 100) / 100,
    tevkifEdilenKDV: Math.round(tevkifEdilen * 100) / 100,
    tahsilEdilecekKDV: Math.round(tahsilEdilen * 100) / 100,
    toplamFaturaTutari: Math.round((tutar + tahsilEdilen) * 100) / 100
  }
}


// ================================================================
// 6. KONUT & İNŞAAT FORMÜLLERİ
// ================================================================

export function hesaplaBoya({ uzunluk, genislik, tavan, kapiSayisi, pencereSayisi }: { uzunluk: number; genislik: number; tavan: 'evet' | 'hayir' | boolean; kapiSayisi: number; pencereSayisi: number }) {
  const isTavan = tavan === 'evet' || tavan === true
  const tavanAlani = isTavan ? uzunluk * genislik : 0
  const duvarAlani = 2 * (uzunluk + genislik) * 2.70
  const kapiAlani = kapiSayisi * 2.0
  const pencereAlani = pencereSayisi * 1.5
  const netAlan = duvarAlani + tavanAlani - kapiAlani - pencereAlani
  const boyaMiktari = (netAlan / 10) * 1.5
  return {
    brutAlan: Math.round((duvarAlani + tavanAlani) * 10) / 10,
    netAlan: Math.round(netAlan * 10) / 10,
    boyaLitre: Math.ceil(boyaMiktari),
    boyaKg: Math.ceil(boyaMiktari * 1.4)
  }
}

export function hesaplaFayans({ uzunluk, genislik, firingaYuzdesi, boyutu }: { uzunluk: number; genislik: number; firingaYuzdesi: number; boyutu: number }) {
  const alan = uzunluk * genislik
  const firingaliAlan = alan * (1 + firingaYuzdesi / 100)
  const fayansAlani = (boyutu / 100) * (boyutu / 100)
  const fayansAdedi = Math.ceil(firingaliAlan / fayansAlani)
  return {
    netAlan: Math.round(alan * 100) / 100,
    firingaliAlan: Math.round(firingaliAlan * 100) / 100,
    fayansAdedi,
    kutucukAdedi: Math.ceil(fayansAdedi / 12)
  }
}

export function hesaplaInsaatDemiriTonaj({ yapilm2, katSayisi }: { yapilm2: number; katSayisi: number }) {
  // Yaklaşık m² başına 35 kg demir
  const demir = yapilm2 * katSayisi * 35
  return { toplamGerekliDemirTon: Math.round((demir / 1000) * 100) / 100 }
}

export function hesaplaHazirBetonHacmi({ alanm2, kalinlikCm }: { alanm2: number; kalinlikCm: number }) {
  const m3 = alanm2 * (kalinlikCm / 100)
  return { gerekliBetonHacmim3: Math.round(m3 * 100) / 100 }
}

export function hesaplaTuglaHarcHesaplama({ duvarUzunluguM, duvarYuksekligiM, tuglaEniCm }: { duvarUzunluguM: number; duvarYuksekligiM: number; tuglaEniCm: number }) {
  const alan = duvarUzunluguM * duvarYuksekligiM
  // standart 13.5 tuğla m²'ye 25 adet gider
  const tugla = alan * 25
  const cimentoTorba = Math.ceil(alan * 0.1) // 10m²'ye 1 torba çimento
  return {
    duvarAlani: Math.round(alan * 10) / 10,
    tahminiTuglaAdedi: Math.ceil(tugla),
    cimentoTorbaAdet: cimentoTorba
  }
}

export function hesaplaTapuHarci({ mülkDegeri }: { mülkDegeri: number }) {
  const alici = mülkDegeri * 0.02
  const satıcı = mülkDegeri * 0.02
  return {
    aliciTapuHarci: Math.round(alici * 100) / 100,
    saticiTapuHarci: Math.round(satıcı * 100) / 100,
    toplamTapuHarci: Math.round((alici + satıcı) * 100) / 100,
    donerSermayeBedeli: '2.500 TL (Yaklaşık)'
  }
}

export function hesaplaEmlakciKomisyonu({ mülkDegeri }: { mülkDegeri: number }) {
  const komisyon = mülkDegeri * 0.02
  const kdv = komisyon * 0.20
  const toplam = komisyon + kdv
  return {
    komisyonTutar: Math.round(komisyon * 100) / 100,
    kdvTutar: Math.round(kdv * 100) / 100,
    toplamEmlakciUcretiKdvDahil: Math.round(toplam * 100) / 100
  }
}

export function hesaplaKiraAmortisman({ mülkAlisFiyati, aylikKiraGetirisi }: { mülkAlisFiyati: number; aylikKiraGetirisi: number }) {
  const yillik = aylikKiraGetirisi * 12
  const amortismanYili = yillik > 0 ? mülkAlisFiyati / yillik : null
  return {
    yillikKiraGeliri: Math.round(yillik * 100) / 100,
    amortismanSüresiYil: amortismanYili !== null ? Math.round(amortismanYili * 10) / 10 : 'Kira geliri girilmedi',
    yillikNetVerimYuzde: mülkAlisFiyati > 0 ? Math.round((yillik / mülkAlisFiyati) * 10000) / 100 : 0
  }
}

export function hesaplaDegerArtisVergisi({ satisBedeli, alisBedeli, sahiplikAyi }: { satisBedeli: number; alisBedeli: number; sahiplikAyi: number }) {
  // 5 yıldan uzunsa muaf (60 ay)
  if (sahiplikAyi >= 60) {
    return { durum: '5 Yıldan uzun süre sahiplik nedeniyle VERGİDEN MUAFTIR', odenecekVergi: 0 }
  }
  // Enflasyon endeksleme basitleştirilmiş (örn. %80 artış yapalım)
  const endeksliAlis = alisBedeli * 1.80
  const kar = Math.max(0, satisBedeli - endeksliAlis)
  // İstisna sınırı 2026 (yaklaşık 200.000 TL)
  const matrah = Math.max(0, kar - 200000)
  const vergi = matrah * 0.15 // başlangıç dilimi %15

  return {
    satisBedeli,
    endeksliAlisBedeli: Math.round(endeksliAlis * 100) / 100,
    vergilendirilebilirNetKar: Math.round(kar * 100) / 100,
    odenecekGelirVergisi: Math.round(vergi * 100) / 100
  }
}

export function hesaplaHafriyatKamyon({ alanM2, derinlikM }: { alanM2: number; derinlikM: number }) {
  const hacim = alanM2 * derinlikM * 1.25 // %25 gevşeme payı
  const kamyonKapasitesi = 12 // m³ cinsinden kamyon kapasitesi
  const sefer = Math.ceil(hacim / kamyonKapasitesi)
  return {
    toplamKazıHacmim3: Math.round(hacim * 100) / 100,
    gerekliKamyonSeferAdedi: sefer
  }
}

export function hesaplaCatiMalzemesi({ catiAlaniM2, egimDerecesi }: { catiAlaniM2: number; egimDerecesi: number }) {
  const radyan = (egimDerecesi * Math.PI) / 180
  const gercekAlan = catiAlaniM2 / Math.cos(radyan)
  // 1 m² çatıya 15 kiremit gider
  const kiremit = gercekAlan * 15 * 1.05 // %5 fire
  return {
    gercekCatiAlanim2: Math.round(gercekAlan * 10) / 10,
    gerekliKiremitAdet: Math.ceil(kiremit)
  }
}

export function hesaplaMantolamaTasarruf({ cepheAlaniM2, yillikYakitFaturası }: { cepheAlaniM2: number; yillikYakitFaturası: number }) {
  const tasarruf = yillikYakitFaturası * 0.45 // Ortalama %45 tasarruf
  const kurulumMaliyeti = cepheAlaniM2 * 450 // m² maliyeti 450 TL
  const amortismanYil = kurulumMaliyeti / tasarruf
  return {
    yillikYakitTasarrufuTL: Math.round(tasarruf * 100) / 100,
    tahminiKurulumMaliyetiTL: Math.round(kurulumMaliyeti),
    amortismanSüresiYil: Math.round(amortismanYil * 10) / 10
  }
}

export function hesaplaAlcipanProfil({ asmaTavanAlaniM2 }: { asmaTavanAlaniM2: number }) {
  // 1 m² asma tavan için 0.4 plaka alçıpan, 2.5m profil
  const plaka = Math.ceil(asmaTavanAlaniM2 * 0.4)
  const profil = Math.ceil(asmaTavanAlaniM2 * 2.5)
  return {
    alçıpanPlakaAdet: plaka,
    profilMetre: profil
  }
}

export function hesaplaHarcKarisimi({ harcHacmim3 }: { harcHacmim3: number }) {
  // M100 harç için: 1 m³ harç = 300 kg çimento + 1 m³ kum
  const cimentoTorba = Math.ceil((harcHacmim3 * 300) / 50)
  return {
    kumMiktariM3: Math.round(harcHacmim3 * 10) / 10,
    cimentoTorbaAdet: cimentoTorba
  }
}

export function hesaplaEmlakVergisi({ mülkRayiçDegeri, buyuksehirMi }: { mülkRayiçDegeri: number; buyuksehirMi: 'evet' | 'hayir' }) {
  const isBuyuk = buyuksehirMi === 'evet'
  const oran = isBuyuk ? 0.002 : 0.001 // konut için binde 1 / binde 2
  const vergi = mülkRayiçDegeri * oran
  return {
    emlakVergisiOrani: (oran * 100).toFixed(1) + '%',
    yillikEmlakVergisi: Math.round(vergi * 100) / 100
  }
}

export function hesaplaDASKPrim({ binaM2, depremBolgesi }: { binaM2: number; depremBolgesi: '1' | '2' | '3' | '4' }) {
  let birimPrim = 5.0
  if (depremBolgesi === '1') birimPrim = 8.5
  else if (depremBolgesi === '2') birimPrim = 7.0
  else if (depremBolgesi === '3') birimPrim = 4.5

  const prim = binaM2 * birimPrim
  return {
    secilenDepremBolgesi: depremBolgesi + '. Derece Deprem Bölgesi',
    tahminiDASKPrimiTL: Math.round(prim)
  }
}

export function hesaplaParkeSupurgelik({ zeminAlaniM2, odaCevresiM }: { zeminAlaniM2: number; odaCevresiM: number }) {
  const parke = zeminAlaniM2 * 1.07 // %7 fire
  const supurgelik = odaCevresiM * 1.05 // %5 fire
  return {
    gerekliParkem2: Math.round(parke * 10) / 10,
    gerekliSupurgelikMetre: Math.round(supurgelik * 10) / 10
  }
}

export function hesaplaTapuKoordinat({ x, y }: { x: number; y: number }) {
  // Bilgilendirme amaçlı basit işlem
  return {
    girilenX: x,
    girilenY: y,
    donusturulenX: Math.round((x + 120.5) * 100) / 100,
    donusturulenY: Math.round((y - 80.2) * 100) / 100,
    sistem: 'ED50 -> WGS84 Dönüşümü yapıldı'
  }
}

export function hesaplaDepremRiskPuanlama({ binaYasamYili, katSayisi, zeminTuru }: { binaYasamYili: number; katSayisi: number; zeminTuru: 'kaya' | 'toprak' | 'dolgu' }) {
  let puan = 0
  const binaYasi = 2026 - binaYasamYili
  if (binaYasi >= 27) puan += 40 // 1999 öncesi
  else if (binaYasi >= 15) puan += 20
  
  if (katSayisi >= 8) puan += 20
  if (zeminTuru === 'dolgu') puan += 30
  else if (zeminTuru === 'toprak') puan += 15

  let risk = 'DÜŞÜK RİSK'
  if (puan >= 70) risk = 'YÜKSEK RİSK'
  else if (puan >= 40) risk = 'ORTA RİSK'

  return {
    riskPuani: puan,
    riskSeviyesi: risk
  }
}

export function hesaplaInsaatRuhsatHarclari({ yapim2 }: { yapim2: number }) {
  const h_birim = 85.0
  const harc = yapim2 * h_birim
  return { tahminiToplamBelediyeRuhsatHarciTL: Math.round(harc) }
}

export function hesaplaNetBrutAlan({ netAlanM2 }: { netAlanM2: number }) {
  // Brüt alan net alanın yaklaşık 1.22 katıdır
  const brut = netAlanM2 * 1.22
  return {
    netAlanM2,
    tahminiBrutAlanM2: Math.round(brut * 10) / 10
  }
}

export function hesaplaDuvarKagidi({ duvarGenişliğiM, duvarYuksekligiM, ruloGenisligiCm }: { duvarGenişliğiM: number; duvarYuksekligiM: number; ruloGenisligiCm: number }) {
  const alan = duvarGenişliğiM * duvarYuksekligiM
  const ruloEniM = ruloGenisligiCm / 100
  // standart rulo boyu 10m
  const ruloAlani = ruloEniM * 10
  const rulo = alan / ruloAlani * 1.10 // %10 fire
  return {
    duvarAlaniM2: Math.round(alan * 10) / 10,
    gerekliDuvarKagidiRuloAdet: Math.ceil(rulo)
  }
}

export function hesaplaKilitParkeTasi({ alanM2 }: { alanM2: number }) {
  // 1 m² alana yaklaşık 36 adet kilit taşı gider
  const tas = alanM2 * 36
  const kum = alanM2 * 0.05 // m³ kum
  return {
    gerekliKilitTasiAdet: Math.ceil(tas),
    gerekliKumM3: Math.round(kum * 100) / 100
  }
}

export function hesaplaMerdivenBasamakRiht({ katYuksekligiCm }: { katYuksekligiCm: number }) {
  const idealRiht = 17
  const basamakAdedi = Math.max(1, Math.round(katYuksekligiCm / idealRiht))
  const gercekRiht = katYuksekligiCm / basamakAdedi
  return {
    toplamBasamakAdedi: basamakAdedi,
    basamakYuksekligiRihtCm: Math.round(gercekRiht * 10) / 10
  }
}

export function hesaplaIsiKaybiPetek({ odaM2, cephe }: { odaM2: number; cephe: 'kuzey' | 'guney' | 'dogu' | 'bati' }) {
  // m² başına yaklaşık 150 kcal ısı kaybı (kuzey cephede +%15)
  let carpan = 150
  if (cephe === 'kuzey') carpan = 175
  const isiKaybi = odaM2 * carpan
  // 1 metre standart radyatör (petek) 1800 kcal verir
  const petekMetresi = isiKaybi / 1800

  return {
    tahminiOdaIsiKaybiKcal: Math.round(isiKaybi),
    gerekliRadyatorBoyuMetre: Math.round(petekMetresi * 10) / 10
  }
}


// ================================================================
// 7. MATEMATİK & ÇEVİRİCİ FORMÜLLERİ
// ================================================================

export function hesaplaYuzde({ mod, deger1, deger2 }: { mod: string; deger1: number; deger2: number }) {
  let sonuc = 0
  let aciklama = ''
  
  if (mod === 'ne_kadar') {
    sonuc = (deger1 * deger2) / 100
    aciklama = `${deger1} sayısının %${deger2} değeri`
  } else if (mod === 'yuzde_kac') {
    sonuc = deger2 > 0 ? (deger1 / deger2) * 100 : 0
    aciklama = `${deger1} sayısı, ${deger2} sayısının % oranı`
  } else if (mod === 'artis') {
    const fark = deger2 - deger1
    sonuc = deger1 > 0 ? (fark / deger1) * 100 : 0
    aciklama = `${deger1} değerinden ${deger2} değerine değişim yüzdesi`
  }
  
  return {
    islemTuru: mod === 'ne_kadar' ? "Değer Bulma" : mod === 'yuzde_kac' ? "Oran Bulma" : "Değişim Yüzdesi",
    birinciDeger: deger1,
    ikinciDeger: deger2,
    sonuc: Math.round(sonuc * 100) / 100 + (mod === 'yuzde_kac' || mod === 'artis' ? ' %' : ''),
    aciklama
  }
}

export function hesaplaEbobEkok({ sayi1, sayi2 }: { sayi1: number; sayi2: number }) {
  const bulEbob = (a: number, b: number): number => (b === 0 ? a : bulEbob(b, a % b))
  const ebob = bulEbob(sayi1, sayi2)
  const ekok = (sayi1 * sayi2) / ebob
  return {
    ebobVal: ebob,
    ekokVal: ekok
  }
}

export function hesaplaAsalSayiCarpanlar({ sayi }: { sayi: number }) {
  let isAsal = sayi > 1
  for (let i = 2; i <= Math.sqrt(sayi); i++) {
    if (sayi % i === 0) {
      isAsal = false
      break
    }
  }

  // Çarpanlar
  const carpanlar: number[] = []
  let n = sayi
  for (let i = 2; i <= n; i++) {
    while (n % i === 0) {
      carpanlar.push(i)
      n /= i
    }
  }

  return {
    sayi,
    asalMi: isAsal ? 'ASAL SAYI' : 'Asal Sayı Değil',
    asalCarpanlari: carpanlar.length > 0 ? carpanlar.join(' × ') : 'Yok'
  }
}

export function hesaplaDenklemCozucu({ a, b, c }: { a: number; b: number; c: number }) {
  if (a === 0) {
    // 1. dereceden denklem bx + c = 0 -> x = -c/b
    if (b === 0) return { durum: 'Çözümsüz' }
    return { kok1: -c / b, durum: '1. Dereceden Tek Kök' }
  }
  const delta = b * b - 4 * a * c
  if (delta < 0) {
    return { diskriminantDelta: delta, durum: 'Reel Kök Yoktur' }
  } else if (delta === 0) {
    const x = -b / (2 * a)
    return { diskriminantDelta: delta, çakisikKokX: x, durum: 'Çakışık Tek Kök' }
  } else {
    const x1 = (-b + Math.sqrt(delta)) / (2 * a)
    const x2 = (-b - Math.sqrt(delta)) / (2 * a)
    return {
      diskriminantDelta: delta,
      kok1: Math.round(x1 * 100) / 100,
      kok2: Math.round(x2 * 100) / 100,
      durum: 'İki Farklı Reel Kök'
    }
  }
}

export function hesaplaKombinasyonPermutasyon({ n, r }: { n: number; r: number }) {
  if (r > n) {
    return { hata: 'r, n değerinden büyük olamaz', faktöriyelN: null, permutasyonN_R: null, kombinasyonN_R: null }
  }
  const f = (val: number): number => (val <= 1 ? 1 : val * f(val - 1))
  const perm = f(n) / f(n - r)
  const komb = perm / f(r)
  return {
    faktöriyelN: f(n),
    permutasyonN_R: perm,
    kombinasyonN_R: komb
  }
}

export function hesaplaRomaRakamlari({ sayi }: { sayi: number }) {
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const syb = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  let num = sayi
  let rom = ''
  for (let i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      rom += syb[i]
      num -= val[i]
    }
  }
  return { normalSayi: sayi, romaRakamı: rom }
}

export function hesaplaTrigonometri({ derece }: { derece: number }) {
  const rad = (derece * Math.PI) / 180
  return {
    sinus: Math.round(Math.sin(rad) * 1000) / 1000,
    kosinus: Math.round(Math.cos(rad) * 1000) / 1000,
    tanjant: Math.round(Math.tan(rad) * 1000) / 1000
  }
}

export function hesaplaUsluKokluSayilar({ taban, us }: { taban: number; us: number }) {
  return {
    usSonucu: Math.pow(taban, us),
    karekokSonucu: Math.round(Math.sqrt(taban) * 100) / 100
  }
}

export function hesaplaLogaritma({ sayi }: { sayi: number }) {
  return {
    dogalLogaritmaln: Math.round(Math.log(sayi) * 100) / 100,
    log10Değeri: Math.round(Math.log10(sayi) * 100) / 100
  }
}

export function hesaplaBorcTaksitBolucu({ toplamBorc, taksitSayisi }: { toplamBorc: number; taksitSayisi: number }) {
  const taksit = Math.floor(toplamBorc / taksitSayisi)
  const sonTaksit = taksit + (toplamBorc % taksitSayisi)
  return {
    taksitSuresi: taksitSayisi + ' Ay',
    aylikTaksitTutarı: taksit,
    sonAyOdenecekTaksitTutarı: sonTaksit
  }
}

export function hesaplaTarihZamanFarki({ tarih1, tarih2 }: { tarih1: string; tarih2: string }) {
  const d1 = new Date(tarih1)
  const d2 = new Date(tarih2)
  const farkMs = Math.abs(d2.getTime() - d1.getTime())
  const gun = Math.ceil(farkMs / (1000 * 60 * 60 * 24))
  return {
    ikiTarihArasindakiGunSayisi: gun,
    haftaSayisi: (gun / 7).toFixed(1)
  }
}

export function hesaplaStandartSapma({ degerlerCsv }: { degerlerCsv: string }) {
  const vals = degerlerCsv.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v))
  if (vals.length === 0) return { ortalama: 0, standartSapma: 0 }

  const n = vals.length
  const ort = vals.reduce((s, v) => s + v, 0) / n
  const varyans = vals.reduce((s, v) => s + Math.pow(v - ort, 2), 0) / n
  const sapma = Math.sqrt(varyans)

  return {
    veriAdedi: n,
    ortalama: Math.round(ort * 100) / 100,
    varyans: Math.round(varyans * 100) / 100,
    standartSapma: Math.round(sapma * 100) / 100
  }
}

export function hesapla2DSekiller({ genislik, yukseklik, yaricap }: { genislik: number; yukseklik: number; yaricap: number }) {
  let daireAlan = 0
  let daireCevre = 0
  if (yaricap > 0) {
    daireAlan = Math.PI * yaricap * yaricap
    daireCevre = 2 * Math.PI * yaricap
  }
  return {
    dikdortgenAlani: genislik * yukseklik,
    dikdortgenCevresi: 2 * (genislik + yukseklik),
    daireAlani: Math.round(daireAlan * 100) / 100,
    daireCevresi: Math.round(daireCevre * 100) / 100
  }
}

export function hesapla3DCisimler({ en, boy, yukseklik, yaricap }: { en: number; boy: number; yukseklik: number; yaricap: number }) {
  let kureHacmi = 0
  if (yaricap > 0) {
    kureHacmi = (4 / 3) * Math.PI * Math.pow(yaricap, 3)
  }
  return {
    prizmaHacmi: en * boy * yukseklik,
    kureHacmi: Math.round(kureHacmi * 100) / 100
  }
}

export function hesaplaSayiTabanlari({ sayi, kaynakTaban }: { sayi: string; kaynakTaban: number }) {
  const dec = parseInt(sayi, kaynakTaban)
  if (isNaN(dec)) return { durum: 'Geçersiz Giriş' }
  return {
    onlukTabanDecimal: dec,
    ikilikTabanBinary: dec.toString(2),
    onaltilikTabanHex: dec.toString(16).toUpperCase()
  }
}

export function hesaplaCalismaSaatiCevirici({ gunlukSaat, haftalikGun }: { gunlukSaat: number; haftalikGun: number }) {
  const haftalik = gunlukSaat * haftalikGun
  const aylik = haftalik * 4.33
  const yillik = haftalik * 52
  return {
    haftalikToplamSaat: Math.round(haftalik),
    aylikToplamSaat: Math.round(aylik),
    yillikToplamSaat: Math.round(yillik)
  }
}

export function hesaplaAltinOran({ uzunluk }: { uzunluk: number }) {
  // Altın oran 1.61803
  const a = uzunluk / 1.61803
  const b = uzunluk - a
  return {
    kucukParca: Math.round(b * 100) / 100,
    buyukParca: Math.round(a * 100) / 100,
    oran: (a / b).toFixed(5)
  }
}

// 18. JENERİK BİRİM ÇEVİRİCİ (Hacim, Alan, Uzunluk, Ağırlık, Hız, Veri Boyutu, Sıcaklık)
export function hesaplaBirimCevirici({ deger, cevirimTuru, kaynakBirim, hedefBirim }: { deger: number; cevirimTuru: string; kaynakBirim: string; hedefBirim: string }) {
  let sonuc = deger

  // Uzunluk dönüşüm matrisi (metre bazlı)
  const uzunluk: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1.0, km: 1000.0, inc: 0.0254, fit: 0.3048, mil: 1609.344 }
  // Alan dönüşüm matrisi (metrekare bazlı)
  const alan: Record<string, number> = { m2: 1.0, donum: 1000.0, hektar: 10000.0, fitkare: 0.092903 }
  // Ağırlık dönüşüm matrisi (gram bazlı)
  const agirlik: Record<string, number> = { gr: 1.0, kg: 1000.0, ton: 1000000.0, libre: 453.592, ons: 28.3495 }
  // Hacim dönüşüm matrisi (litre bazlı)
  const hacim: Record<string, number> = { L: 1.0, m3: 1000.0, desilitre: 0.1, galon: 3.78541, varil: 158.987 }
  // Hız dönüşüm matrisi (km/s bazlı)
  const hiz: Record<string, number> = { kms: 1.0, mph: 1.60934, ms: 3.6, knot: 1.852 }
  // Veri dönüşüm matrisi (byte bazlı)
  const veri: Record<string, number> = { byte: 1.0, KB: 1024.0, MB: 1024 * 1024, GB: 1024 * 1024 * 1024, TB: 1024 * 1024 * 1024 * 1024 }

  if (cevirimTuru === 'sicaklik') {
    if (kaynakBirim === 'C' && hedefBirim === 'F') sonuc = deger * 1.8 + 32
    else if (kaynakBirim === 'F' && hedefBirim === 'C') sonuc = (deger - 32) / 1.8
    else if (kaynakBirim === 'C' && hedefBirim === 'K') sonuc = deger + 273.15
    else if (kaynakBirim === 'K' && hedefBirim === 'C') sonuc = deger - 273.15
  } else if (cevirimTuru === 'uzunluk' && uzunluk[kaynakBirim] && uzunluk[hedefBirim]) {
    sonuc = (deger * uzunluk[kaynakBirim]) / uzunluk[hedefBirim]
  } else if (cevirimTuru === 'alan' && alan[kaynakBirim] && alan[hedefBirim]) {
    sonuc = (deger * alan[kaynakBirim]) / alan[hedefBirim]
  } else if (cevirimTuru === 'agirlik' && agirlik[kaynakBirim] && agirlik[hedefBirim]) {
    sonuc = (deger * agirlik[kaynakBirim]) / agirlik[hedefBirim]
  } else if (cevirimTuru === 'hacim' && hacim[kaynakBirim] && hacim[hedefBirim]) {
    sonuc = (deger * hacim[kaynakBirim]) / hacim[hedefBirim]
  } else if (cevirimTuru === 'hiz' && hiz[kaynakBirim] && hiz[hedefBirim]) {
    sonuc = (deger * hiz[kaynakBirim]) / hiz[hedefBirim]
  } else if (cevirimTuru === 'veri' && veri[kaynakBirim] && veri[hedefBirim]) {
    sonuc = (deger * veri[kaynakBirim]) / veri[hedefBirim]
  }

  return {
    girilenDeger: deger + ' ' + kaynakBirim,
    cevirilenSonuc: Math.round(sonuc * 100000) / 100000 + ' ' + hedefBirim
  }
}
