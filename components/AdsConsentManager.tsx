"use client";

import { useState } from "react";
import Script from "next/script";
import CookieConsent from "./CookieConsent";

export default function AdsConsentManager({ adsenseId }: { adsenseId: string }) {
  const [adsAllowed, setAdsAllowed] = useState(false);

  return (
    <>
      {adsAllowed && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
          onLoad={() => {
            // Otomatik Reklamlar: Google, sayfa içeriğine göre reklamları
            // (mobilde anchor/vignette dahil) kendisi, politika uyumlu şekilde yerleştirir.
            try {
              ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
                (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
              ;(window as unknown as { adsbygoogle: Record<string, unknown>[] }).adsbygoogle.push({
                google_ad_client: adsenseId,
                enable_page_level_ads: true,
              })
            } catch {
              // sessiz geç — reklam engelleyici veya ağ hatası olabilir
            }
          }}
        />
      )}
      <CookieConsent onConsent={(accepted) => setAdsAllowed(accepted)} />
    </>
  );
}
