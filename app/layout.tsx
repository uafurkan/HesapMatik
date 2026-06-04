import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import Link from "next/link";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "HesapMatik — Türkiye'nin Hesaplama Merkezi | Ücretsiz",
  description: "Kira artış, kıdem tazminatı, maaş, konut kredisi, BMI ve 50+ hesaplama aracı. 2024 güncel mevzuat. Tamamen ücretsiz.",
  keywords: ["hesaplama", "hesaplayıcı", "kira artış hesaplama", "kıdem tazminatı hesaplama", "maaş hesaplama", "net maaş hesaplama 2024"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXX'}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${syne.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="border-b border-[#1e1e30] py-4 bg-[#07070d]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold font-syne tracking-tight">HESAP<span className="text-amber-500">MATİK</span></Link>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-[#1e1e30] py-8 mt-12 text-center text-sm font-mono text-gray-500">
          <p>© 2024 HesapMatik. Tüm hakları saklıdır. Hesaplama sonuçları bilgi amaçlıdır.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
