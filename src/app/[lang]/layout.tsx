import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import '../globals.css'
import { SettingsProvider } from '../../context/Settings'
import Background from '../../components/Background'
import Constellations from '../../components/Constellations'
import Spotlight from '../../components/Spotlight'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
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
  openGraph: { type: 'website', siteName: SITE.name },
}
export const viewport: Viewport = { viewportFit: 'cover', themeColor: '#05060F' }

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return (
    <html lang={lang} data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
         <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
       </head>
      <body>
          <SettingsProvider lang={lang}>
            <Background />
            <Constellations />
            <Spotlight />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
              <main className="mx-auto w-full max-w-page flex-1 px-5 pb-28 pt-10 sm:px-8 lg:px-20">{children}</main>
              <Footer />
            </div>
          </SettingsProvider>
      </body>
    </html>
  )
}
