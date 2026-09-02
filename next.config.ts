import type { NextConfig } from "next";

// AdSense + Groq (AI açıklama) + Vercel Analytics ile uyumlu, ama yine de
// script/frame kaynaklarını bilinen alan adlarıyla sınırlayan bir CSP.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://tpc.googlesyndication.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.groq.com https://www.tcmb.gov.tr https://pagead2.googlesyndication.com https://vitals.vercel-insights.com",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ')

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate' }]
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: CSP },
        ]
      }
    ]
  }
};

export default nextConfig;
