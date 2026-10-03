import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Pair } from '../data/nav'

type Lang = 'en' | 'id'
type Theme = 'dark' | 'light'
type Ctx = { theme: Theme; lang: Lang; t: (p: Pair) => string; toggleTheme: () => void; toggleLang: () => void }
const SettingsCtx = createContext<Ctx | null>(null)

function read<T extends string>(key: string, fallback: T): T {
  try { return (localStorage.getItem(key) as T | null) ?? fallback } catch { return fallback }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => read<Theme>('theme', 'dark'))
  const [lang, setLang] = useState<Lang>(() => read<Lang>('lang', 'en'))
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang
    try { localStorage.setItem('theme', theme); localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [theme, lang])
  const value = useMemo<Ctx>(() => ({
    theme, lang,
    t: (p) => p[lang],
    toggleTheme: () => setTheme((x) => (x === 'dark' ? 'light' : 'dark')),
    toggleLang: () => setLang((x) => (x === 'en' ? 'id' : 'en')),
  }), [theme, lang])
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export function useSettings() {
  const c = useContext(SettingsCtx)
  if (!c) throw new Error('useSettings must be used inside SettingsProvider')
  return c
}
