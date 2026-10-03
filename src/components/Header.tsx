'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LocLink as Link, NavLink } from './LocLink'
import { NAV } from '../data/nav'
import { useSettings } from '../context/Settings'

const link = 'inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-medium text-fg2 hover:text-fg aria-[current=page]:bg-muted aria-[current=page]:text-fg'

export default function Header() {
  const { t, lang, theme, toggleLang, toggleTheme } = useSettings()
  const [open, setOpen] = useState<number | null>(null)
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => { setOpen(null); setMenu(false) }, [pathname])
  useEffect(() => {
    const out = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    addEventListener('mousedown', out)
    addEventListener('keydown', esc)
    return () => { removeEventListener('mousedown', out); removeEventListener('keydown', esc) }
  }, [])

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-bg/55 backdrop-blur-md">
      <div className="mx-auto grid h-17 max-w-page grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8 lg:px-20">
        <Link to="/" className="font-display text-2xl font-extrabold">G<span className="text-brand">.</span></Link>
        <nav aria-label="Main" className={`${menu ? 'flex' : 'hidden'} absolute inset-x-0 top-full max-h-[calc(100vh-4.25rem)] flex-col overflow-auto border-b border-line bg-bg px-5 pb-5 lg:static lg:flex lg:max-h-none lg:flex-row lg:items-center lg:justify-center lg:gap-1 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0`}>
          <NavLink to="/" end className={link}>{lang === 'id' ? 'Beranda' : 'Home'}</NavLink>
          {NAV.map((g, i) => (
            <div key={i} className="relative">
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className={`${link} gap-1.5`}>
                {t(g.title)}
                <span className={`size-1.5 -translate-y-px border-b-2 border-r-2 border-current transition-transform ${open === i ? '-rotate-[135deg]' : 'rotate-45'}`} />
              </button>
              {open === i && (
                <div className="lg:absolute lg:left-1/2 lg:top-full lg:mt-2 lg:w-56 lg:-translate-x-1/2 lg:rounded-2xl lg:border lg:border-line lg:bg-surface lg:p-2 lg:shadow-2xl">
                  {g.items.map((x) => (
                    <NavLink key={x.key} to={'/' + x.key} className="block rounded-xl px-3.5 py-2.5 hover:bg-muted aria-[current=page]:bg-muted">
                      <b className="block font-display text-[15px] font-semibold">{t(x.title)}</b>
                      <small className="text-fg2">{t(x.desc)}</small>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center justify-self-end gap-2">
          <button className="icon-btn" onClick={toggleLang} aria-label="Switch language">{lang.toUpperCase()}</button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <Link to="/hire" className="btn-primary hidden sm:inline-flex">{lang === 'id' ? 'Hubungi aku' : 'Hire me'}</Link>
          <button className="icon-btn lg:hidden" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button>
        </div>
      </div>
    </header>
  )
}
