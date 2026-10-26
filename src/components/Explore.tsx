'use client'

import Image from 'next/image'
import { LocLink as Link } from './LocLink'
import { Scrub } from './home'
import { NAV, localized } from '../data/nav'
import { projects, type Project } from '../data/content'
import { useSettings } from '../context/Settings'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

/**
 * Home "Explore": two feature tiles (Projects, Hire me) on top, then an index of every page: one row per group, its pages laid out beside the group name.
 * Styles: .explore-* in globals.css.
 */
export default function Explore() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const all = NAV.flatMap((g) => g.items)
  const proj = all.find((x) => x.key === 'project')
  const hire = all.find((x) => x.key === 'hire')
  const shots = projects.filter((p): p is Project & { image: string } => Boolean(p.image)).slice(0, 3)

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        {proj && (
          <Scrub from="left" className="h-full">
            <Link to="/project" className="explore-feature explore-feature--projects">
              <div className="explore-feature__text">
                <span className="explore-chip">{projects.length} {id ? 'proyek' : 'projects'}</span>
                <h3>{t(proj.title)}</h3>
                <p>{t(proj.desc)}</p>
                <span className="explore-cta">{id ? 'Lihat semua proyek' : 'Browse all projects'}<i aria-hidden>→</i></span>
              </div>
              <div className="explore-shots" aria-hidden>
                {shots.map((p, k) => (
                  <Image key={k} src={p.image} alt="" width={800} height={500} sizes="(max-width: 767px) 34vw, 280px" loading="lazy" decoding="async" className={`explore-shot explore-shot--${k}`} />
                ))}
              </div>
            </Link>
          </Scrub>
        )}
        {hire && (
          <Scrub from="right" className="h-full">
            <Link to="/hire" className="explore-feature explore-feature--hire">
              <div className="explore-feature__text">
                <span className="explore-chip explore-chip--live"><i aria-hidden />{id ? 'Terbuka untuk peluang' : 'Open to opportunities'}</span>
                <h3>{t(hire.title)}</h3>
                <p>{t(hire.desc)}</p>
                <span className="explore-cta">{id ? 'Mulai ngobrol' : 'Say hello'}<i aria-hidden>→</i></span>
              </div>
            </Link>
          </Scrub>
        )}
      </div>

      <Scrub><ExploreIndex /></Scrub>
    </div>
  )
}

/**
 * Home "Explore" index: every page as large words grouped under their section, no boxes.
 * The words alternate upright and italic and rise in one after another when the index scrolls into view.
 * With a mouse, a soft light follows the cursor across the row and the hovered page shows a live preview card (an iframe of
 * that page) beside the cursor while the other pages dim; on touch screens it is a plain list of links.
 */
function ExploreIndex() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const wrap = useRef<HTMLElement>(null)
  const [hover, setHover] = useState<{ key: string; title: string; desc: string } | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const follow = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !wrap.current) return
    const r = wrap.current.getBoundingClientRect()
    const x = e.clientX - r.left
    wrap.current.style.setProperty('--x', `${x}px`)
    wrap.current.style.setProperty('--y', `${e.clientY - r.top}px`)
    // Near the right edge the card sits to the left of the cursor so it stays on the page.
    wrap.current.style.setProperty('--dx', x > r.width - 420 ? 'calc(-100% - 1.5rem)' : '1.5rem')
    // Light inside the row under the cursor.
    const row = (e.target as HTMLElement).closest<HTMLElement>('.xidx__group')
    if (row) {
      const b = row.getBoundingClientRect()
      row.style.setProperty('--lx', `${e.clientX - b.left}px`)
      row.style.setProperty('--ly', `${e.clientY - b.top}px`)
    }
  }
  const enter = (key: string, title: string, desc: string) => (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    setHover({ key, title, desc })
    // Load the preview only once the cursor rests on a word, so sweeping across the list does not load every page.
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSrc(`/${lang}/${key}`), 140)
  }

  return (
    <nav ref={wrap} aria-label={id ? 'Semua halaman' : 'All pages'} className={`xidx${shown ? ' is-in' : ''}`} onPointerMove={follow} onPointerLeave={() => { window.clearTimeout(timer.current); setHover(null) }}>
      {NAV.map((g, gi) => {
        const before = NAV.slice(0, gi).reduce((n, x) => n + x.items.length, 0)
        return (
          <section key={gi} className="xidx__group">
            <div className="xidx__head">
              <h3>{t(g.title)}</h3>
              <p>{t(g.desc)}</p>
            </div>
            <ul className="xidx__list">
              {g.items.map((x, k) => (
                <li key={x.key} style={{ '--i': before + k } as CSSProperties}>
                  <Link to={'/' + x.key} className={`xidx__item${k % 2 ? ' xidx__item--alt' : ''}${hover?.key === x.key ? ' is-on' : ''}`} onPointerEnter={enter(x.key, t(x.title), localized(x.desc, lang))}>
                    <span className="xidx__word">{t(x.title)}</span>
                    <span className="xidx__arrow" aria-hidden="true">↗</span>
                    <small>{localized(x.desc, lang)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      <div className="xidx__card" data-show={hover !== null} aria-hidden="true">
        <div className="xidx__bar"><i /><i /><i /><span>{hover ? `/${hover.key}` : ''}</span></div>
        <div className="xidx__shot">{src && <iframe key={src} src={src} title="" tabIndex={-1} loading="lazy" />}</div>
        {hover && <p className="xidx__meta"><b>{hover.title}</b>{hover.desc}</p>}
      </div>
    </nav>
  )
}
