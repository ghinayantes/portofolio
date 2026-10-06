import { ImageResponse } from 'next/og'
import { SITE } from '../data/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Default share image (per-language pages override via their own metadata where needed). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 96,
          background: 'linear-gradient(135deg,#1B1A5E,#4338CA 70%,#7C3AED)',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.85 }}>{SITE.greeting.en}</div>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>{SITE.name}</div>
        <div style={{ marginTop: 16, fontSize: 40, opacity: 0.9 }}>{SITE.role.en}</div>
      </div>
    ),
    { ...size },
  )
}
