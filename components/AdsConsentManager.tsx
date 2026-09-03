"use client";

import CookieConsent from "./CookieConsent";

type ConsentState = "granted" | "denied";

function updateConsent(state: ConsentState) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  } catch {
    // sessiz geç — gtag henüz tanımlı değilse (AdSense id yoksa) yapılacak bir şey yok
  }
}

export default function AdsConsentManager() {
  return (
    <CookieConsent onConsent={(accepted) => updateConsent(accepted ? "granted" : "denied")} />
  );
}
