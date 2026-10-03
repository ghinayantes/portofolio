'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import type { Pair } from '../data/nav'
import type { Lang } from '../lib/i18n'

type Ctx = { theme: 'dark' | 'light'; lang: Lang; t: (p: Pair) => string; toggleTheme: () => void; toggleLang: () => void }
const SettingsCtx = createContext<Ctx | null>(null)

/** Language comes from the URL (/en, /id); theme is handled by next-themes. */
export function SettingsProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const value = useMemo<Ctx>(() => ({
    theme: resolvedTheme === 'light' ? 'light' : 'dark',
    lang,
    t: (p) => p[lang],
    toggleTheme: () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light'),
    toggleLang: () => {
      const next: Lang = lang === 'en' ? 'id' : 'en'
      document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`
      router.push(pathname.replace(/^\/(en|id)/, '/' + next))
    },
  }), [lang, resolvedTheme, setTheme, pathname, router])
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export function useSettings() {
  const c = useContext(SettingsCtx)
  if (!c) throw new Error('useSettings must be used inside SettingsProvider')
  return c
}
