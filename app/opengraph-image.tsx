import { ImageResponse } from 'next/og'

export const alt = "HesapMatik — Türkiye'nin Hesaplama Merkezi"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #030305 0%, #0a0a12 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontSize: 56,
              fontWeight: 900,
            }}
          >
            H
          </div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#fff', letterSpacing: -2 }}>
            HESAP<span style={{ color: '#f59e0b' }}>MATİK</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#9ca3af', fontWeight: 500 }}>
          Türkiye&apos;nin Hesaplama Merkezi — 50+ Ücretsiz Hesaplayıcı
        </div>
      </div>
    ),
    { ...size }
  )
}
