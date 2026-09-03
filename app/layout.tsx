import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import AdsConsentManager from "@/components/AdsConsentManager";
import AdsenseScript from "@/components/AdsenseScript";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hesapmatik.site'
// AdSense yayıncı ID'si gizli bir bilgi değildir — zaten her sayfanın kaynağında
// görünmesi gerekir, bu yüzden Vercel'de env değişkeni gerektirmeden doğrudan koda
// gömülüyor (env değişkeni varsa onu geçersiz kılabilirsiniz).
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-2501861627867479'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HesapMatik — Türkiye'nin Hesaplama Merkezi | Ücretsiz",
  description: "Kira artış, kıdem tazminatı, maaş, konut kredisi, BMI ve 50+ hesaplama aracı. 2026 güncel mevzuat. Tamamen ücretsiz.",
  keywords: ["hesaplama", "hesaplayıcı", "kira artış hesaplama", "kıdem tazminatı hesaplama", "maaş hesaplama", "net maaş hesaplama 2026"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "HesapMatik",
    title: "HesapMatik — Türkiye'nin Hesaplama Merkezi | Ücretsiz",
    description: "Kira artış, kıdem tazminatı, maaş, konut kredisi, BMI ve 50+ hesaplama aracı. 2026 güncel mevzuat. Tamamen ücretsiz.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "HesapMatik — Türkiye'nin Hesaplama Merkezi | Ücretsiz",
    description: "Kira artış, kıdem tazminatı, maaş, konut kredisi, BMI ve 50+ hesaplama aracı. 2026 güncel mevzuat.",
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${syne.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col relative bg-[#FDFBF7] dark:bg-[#030305] text-gray-900 dark:text-[#f0f0f5] transition-colors duration-300`}>
        {ADSENSE_ID && <AdsenseScript adsenseId={ADSENSE_ID} />}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Ambient Glowing Orbs */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-[-1] animate-pulse-slow"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-[-1] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

          <header className="glass border-b border-black/5 dark:border-white/5 py-3 sm:py-4 sticky top-0 z-40 transition-all duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-between items-center">
              <Link href="/" className="text-xl sm:text-2xl font-bold font-syne tracking-tight group flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg sm:text-xl shadow-[0_0_20px_rgba(255,179,71,0.5)] group-hover:scale-105 transition-transform duration-300">H</div>
                <span className="text-gray-900 dark:text-white drop-shadow-sm">HESAP<span className="gradient-text">MATİK</span></span>
              </Link>
              <ThemeToggle />
            </div>
          </header>
        
        <main className="flex-grow relative z-10 animate-fade-in pb-12 sm:pb-0">
          {children}
        </main>
        
        <footer className="glass border-t border-black/10 dark:border-white/5 py-10 sm:py-12 mt-16 sm:mt-20 text-center text-xs sm:text-sm font-mono text-gray-600 dark:text-gray-500 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4">
            <div className="text-2xl font-bold font-syne text-gray-900 dark:text-white opacity-20 tracking-widest">HESAPMATİK</div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/gizlilik" className="hover:text-amber-500 transition-colors">Gizlilik Politikası</Link>
              <Link href="/kullanim-kosullari" className="hover:text-amber-500 transition-colors">Kullanım Koşulları</Link>
              <a href="mailto:iletisim@hesapmatik.site" className="hover:text-amber-500 transition-colors">iletisim@hesapmatik.site</a>
            </nav>
            <p>© {new Date().getFullYear()} HesapMatik. Tüm hakları saklıdır. Hesaplama sonuçları bilgi amaçlıdır, kesin bir yasal dayanak oluşturmaz.</p>
          </div>
        </footer>
        <AdsConsentManager />
        <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
