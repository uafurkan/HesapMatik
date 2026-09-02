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
        />
      )}
      <CookieConsent onConsent={(accepted) => setAdsAllowed(accepted)} />
    </>
  );
}
