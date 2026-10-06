'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { Pair } from '../data/nav'
import type { Lang } from '../lib/i18n'

type Theme = 'dark' | 'light'
type ViewTransition = { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> }
type DocumentWithViewTransition = Document & { startViewTransition?: (callback: () => void) => ViewTransition }
type Ctx = { theme: Theme; lang: Lang; t: (p: Pair) => string; toggleTheme: (x?: number, y?: number) => void; toggleLang: () => void }
const SettingsCtx = createContext<Ctx | null>(null)

/** Language comes from the URL (/en, /id). Theme is a data-theme attribute set before paint by the script in layout.tsx. */
export function SettingsProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const pathname = usePathname()

  // sync React state with whatever the init script applied
  useEffect(() => {
    setThemeState(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  }, [])

  const value = useMemo<Ctx>(() => ({
    theme,
    lang,
    t: (p) => p[lang],
    toggleTheme: (x?: number, y?: number) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      const apply = (): void => {
        document.documentElement.dataset.theme = next
        try { localStorage.setItem('theme', next) } catch { /* ignore */ }
        setThemeState(next)
      }
      try {
        const doc = document as DocumentWithViewTransition
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!doc.startViewTransition || reduce || x === undefined || y === undefined) { apply(); return }
        const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
        const root = document.documentElement
        root.style.setProperty('--wipe-x', `${x}px`)
        root.style.setProperty('--wipe-y', `${y}px`)
        root.style.setProperty('--wipe-max', `${r}px`)
        doc.startViewTransition(() => { apply() })
      } catch { apply() }
    },
    toggleLang: () => {
      const next: Lang = lang === 'en' ? 'id' : 'en'
      document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`
      // full navigation: the root <html lang> changes, so let the browser reload instead of re-rendering <head> on the client
      window.location.assign(pathname.replace(/^\/(en|id)/, '/' + next))
    },
  }), [lang, theme, pathname])

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export function useSettings() {
  const c = useContext(SettingsCtx)
  if (!c) throw new Error('useSettings must be used inside SettingsProvider')
  return c
}