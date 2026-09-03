"use client";

import Script from "next/script";

export default function AdsenseScript({ adsenseId }: { adsenseId: string }) {
  return (
    <>
      {/* KVKK: reklam/analiz çerezlerine varsayılan olarak izin verilmiyor;
          kullanıcı çerez bannerında "Kabul Et"e basınca AdsConsentManager bu izni günceller.
          AdSense'in site doğrulaması için kod her sayfada koşulsuz mevcut olmalı. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
          });`}
      </Script>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          const w = window as unknown as { adsbygoogle: Record<string, unknown>[] }
          w.adsbygoogle = w.adsbygoogle || []
          w.adsbygoogle.push({
            google_ad_client: adsenseId,
            enable_page_level_ads: true,
          })
        }}
      />
    </>
  );
}
