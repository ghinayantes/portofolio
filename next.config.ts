import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content Security Policy. Scripts, styles, images, and fonts load from this site only; the two external hosts are
 * Vercel Analytics/Speed Insights and the Formspree fallback used by the contact form. Inline scripts stay allowed
 * because Next.js hydration, the theme bootstrap, and JSON-LD are inline; React needs eval in development only.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://formspree.io https://va.vercel-scripts.com https://vitals.vercel-insights.com${isDev ? ' ws: wss:' : ''}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig: NextConfig = { reactStrictMode: true,
    poweredByHeader: false,
    allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*', '*.local'],
    async headers() {
      return [{ source: '/:path*', headers: securityHeaders }]
    },
}

export default nextConfig
