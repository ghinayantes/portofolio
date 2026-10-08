'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaBars } from 'react-icons/fa6'
import { LocLink as Link, NavLink } from './LocLink'
import { NAV } from '../data/nav'
import { useSettings } from '../context/Settings'

const link = 'inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-medium text-fg2 hover:text-fg aria-[current=page]:text-brand'

/** Sun/moon morph toggle (Josh Comeau-style): the two glyphs cross-fade while rotating + scaling.
    The icon shows the *destination* theme: sun while dark, moon while light. */
function ThemeIcon({ theme, animate }: { theme: 'dark' | 'light'; animate: boolean }) {
  const toLight = theme === 'dark'
  const swap = `absolute inset-0 size-full ${animate ? 'motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out' : ''}`
  return (
    <span aria-hidden="true" className="relative block size-5">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${swap} ${toLight ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'}`}>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${swap} ${toLight ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </span>
  )
}

export default function Header() {
  const { t, lang, theme, toggleLang, toggleTheme } = useSettings()
  const [open, setOpen] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const [menu, setMenu] = useState(false)
  // Enable the icon morph only after mount: the theme state starts as 'dark' and is
  // corrected in an effect, so animating from the start would replay the morph on
  // every full load (e.g. language switch, which reloads the page).
  const [iconReady, setIconReady] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setIconReady(true), 50)
    return () => window.clearTimeout(t)
  }, [])
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  // Hover intent timers: open fast, close with a grace period so crossing menus doesn't flicker.
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
  }, [])

  const canHover = () =>
    typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches

  const scheduleOpen = (i: number) => {
    window.clearTimeout(closeTimer.current)
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(i), 120)
  }
  const scheduleClose = () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(null), 150)
  }
  const togglePin = (i: number) => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    setPinned((prev) => (prev === i ? null : i))
    setOpen(null)
  }
  const shown = pinned ?? open

  useEffect(() => { setOpen(null); setPinned(null); setMenu(false) }, [pathname])
  useEffect(() => {
    const out = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) { setOpen(null); setPinned(null) }
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(null); setPinned(null) }
    }
    addEventListener('mousedown', out)
    addEventListener('keydown', esc)
    return () => { removeEventListener('mousedown', out); removeEventListener('keydown', esc) }
  }, [])

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-bg/55 backdrop-blur-md">
        <div className="mx-auto grid h-17 max-w-page grid-cols-2 items-center gap-3 lg:grid-cols-[1fr_auto_1fr] px-5 sm:px-8 lg:px-20">
          <Link to="/" className="justify-self-start font-display text-2xl font-extrabold">G<span className="text-brand">.</span></Link>
        <nav data-lenis-prevent aria-label={lang === 'id' ? 'Navigasi utama' : 'Main'} id="main-nav" className={`${menu ? 'flex' : 'hidden'} absolute inset-x-0 top-full max-h-[calc(100vh-4.25rem)] flex-col overflow-auto border-b border-brand/25 bg-bg/90 px-5 pb-5 backdrop-blur-xl lg:static lg:col-start-2 lg:flex lg:max-h-none lg:flex-row lg:items-center lg:justify-center lg:gap-1 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none`}>
          <NavLink to="/" end className={link}>{lang === 'id' ? 'Beranda' : 'Home'}</NavLink>
          {NAV.map((g, i) => (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => { if (canHover()) scheduleOpen(i) }}
              onMouseLeave={() => { if (canHover()) scheduleClose() }}
              onFocus={() => scheduleOpen(i)}
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleClose() }}
            >
              <button type="button" aria-expanded={shown === i} aria-haspopup="true" onClick={() => togglePin(i)} className={`${link} gap-1.5`}>
                {t(g.title)}
                <span aria-hidden="true" className={`size-1.5 -translate-y-px border-b-2 border-r-2 border-current transition-transform ${shown === i ? '-rotate-[135deg]' : 'rotate-45'}`} />
              </button>
              {shown === i && (
                <div className="lg:absolute lg:left-1/2 lg:top-full lg:mt-2 lg:w-56 lg:-translate-x-1/2 lg:rounded-2xl lg:border lg:border-brand/25 lg:bg-surface lg:p-2 lg:shadow-[0_24px_60px_-20px_rgba(109,40,217,0.4)]">
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
          <div className="col-start-2 flex items-center justify-self-end gap-2 lg:col-start-3">
          <button type="button" className="icon-btn grid place-items-center" onClick={toggleLang} aria-label={lang === 'id' ? 'Ganti ke bahasa Inggris' : 'Switch to Indonesian'}>{lang === 'id' ? 'EN' : 'ID'}</button>
          <button type="button" className="icon-btn grid place-items-center" onClick={(e) => toggleTheme(e.clientX, e.clientY)} aria-label={lang === 'id' ? 'Ganti tema' : 'Toggle theme'}><ThemeIcon theme={theme} animate={iconReady} /></button>
          <Link to="/hire" className="btn-primary hidden sm:inline-flex">{lang === 'id' ? 'Hubungi aku' : 'Hire me'}</Link>
          <button type="button" className="icon-btn grid place-items-center lg:hidden" aria-label={lang === 'id' ? 'Buka menu' : 'Open menu'} aria-expanded={menu} aria-controls="main-nav" onClick={() => setMenu(!menu)}><FaBars aria-hidden="true" className="size-5" /></button>
        </div>
      </div>
    </header>
  )
}
