import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import 'lenis/dist/lenis.css'
import '../globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SettingsProvider } from '../../context/Settings'
import CloudShader from '../../components/CloudShader'
import Background from '../../components/Background'
import Constellations from '../../components/Constellations'
import Spotlight from '../../components/Spotlight'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SmoothScroll from '../../components/SmoothScroll'
import { SITE } from '../../data/site'
import { LANGS, isLang } from '../../lib/i18n'
import { SITE_URL } from '../../lib/seo'

export const dynamicParams = false
const THEME_INIT = "try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){}"
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }))

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} — Portfolio`, template: `%s — ${SITE.name}` },
  description: SITE.lead.en,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Portfolio`,
    description: SITE.lead.en,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Portfolio`,
    description: SITE.lead.en,
    images: ['/og-image.png'],
  },
}
export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8f5ff' },
    { media: '(prefers-color-scheme: dark)', color: '#05060F' },
  ],
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return (
    <html lang={lang} data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
         <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
       </head>
      <body>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-5 focus:py-2.5 focus:font-semibold focus:text-ink">{lang === 'id' ? 'Lewati ke konten utama' : 'Skip to main content'}</a>
          <SettingsProvider lang={lang}>
            <SmoothScroll>
              <CloudShader />
              <Background />
              <Constellations />
              <Spotlight />
              <div className="relative z-10 flex min-h-screen flex-col">
                <Header />
                <main id="main-content" className="mx-auto w-full max-w-page flex-1 px-5 pb-28 pt-10 sm:px-8 lg:px-20">{children}</main>
                <Footer />
              </div>
            </SmoothScroll>
            <Analytics />
          </SettingsProvider>
      </body>
    </html>
  )
}
