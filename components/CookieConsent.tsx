"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const COOKIE_CONSENT_KEY = "hesapmatik-cookie-consent";

export default function CookieConsent({ onConsent }: { onConsent?: (accepted: boolean) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted") {
      onConsent?.(true);
    } else if (!stored) {
      setVisible(true);
    }
  }, [onConsent]);

  const handle = (accepted: boolean) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? "accepted" : "rejected");
    setVisible(false);
    onConsent?.(accepted);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto glass-card rounded-2xl border border-black/10 dark:border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1">
          Sitemizde deneyiminizi iyileştirmek ve reklam göstermek için çerezler kullanıyoruz.{" "}
          <Link href="/gizlilik" className="underline hover:text-amber-500">
            Gizlilik Politikası
          </Link>{" "}
          sayfasından detaylara ulaşabilirsiniz.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handle(false)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={() => handle(true)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:scale-105 transition-transform"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
