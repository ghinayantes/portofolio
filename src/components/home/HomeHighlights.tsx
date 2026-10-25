'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { LocLink as Link } from '../LocLink'
import { Reveal } from '../motion'
import { awards, certificates } from '../../data/content'
import { localized } from '../../data/nav'
import { useSettings } from '../../context/Settings'
import { Count, Head } from './shared'

type Highlight = { key: string; kind: string; year: string; title: string; org: string; desc: string; bullets: string[]; to: string }

/**
 * Home "Highlights": awards and certificates as a full-width list of large rows.
 * On pointer devices a detail card follows the cursor over the hovered row while the other rows dim;
 * clicking a row (the only way on touch screens) opens its details inline.
 */
export function HomeHighlights() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const wrap = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)

  const items: Highlight[] = [
    ...awards.slice(0, 4).map((a, i) => ({
      key: `a${i}`,
      kind: a.category ? localized(a.category, lang) : id ? 'Penghargaan' : 'Award',
      year: localized(a.meta, lang),
      title: localized(a.title, lang),
      org: a.org ? localized(a.org, lang) : '',
      desc: localized(a.desc, lang),
      bullets: (a.bullets ?? []).map((b) => localized(b, lang)),
      to: '/award',
    })),
    ...certificates.slice(0, 3).map((c, i) => {
      const meta = localized(c.meta, lang)
      const cut = meta.lastIndexOf(', ')
      return {
        key: `c${i}`,
        kind: id ? 'Sertifikat' : 'Certificate',
        year: cut > 0 ? meta.slice(cut + 2) : '',
        title: localized(c.title, lang),
        org: cut > 0 ? meta.slice(0, cut) : meta,
        desc: localized(c.desc, lang),
        bullets: [],
        to: '/certificate',
      }
    }),
  ]
  const shown = hover === null ? null : items[hover]

  /** Moves the floating card with the mouse, relative to the list. */
  const follow = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !wrap.current) return
    const r = wrap.current.getBoundingClientRect()
    const x = e.clientX - r.left
    wrap.current.style.setProperty('--x', `${x}px`)
    wrap.current.style.setProperty('--y', `${e.clientY - r.top}px`)
    // Near the right edge the card flips to the left of the cursor so it never leaves the page.
    wrap.current.style.setProperty('--dx', x > r.width - 400 ? 'calc(-100% - 1.5rem)' : '1.5rem')
  }

  return (
    <section className="home-section" aria-labelledby="home-highlights-title">
      <Head n="03" label={id ? 'Sorotan' : 'Highlights'} title={id ? 'Pencapaian yang membentuk saya' : 'Milestones that shaped me'} titleId="home-highlights-title" to="/award" cta={id ? 'Semua penghargaan' : 'All awards'} />
      <div ref={wrap} className="home-awards" onPointerMove={follow} onPointerLeave={() => setHover(null)}>
        <p className="home-awards__meta">
          <span>{id ? 'Penghargaan' : 'Awards'} · <Count n={awards.length} /></span>
          <span>{id ? 'Sertifikat' : 'Certificates'} · <Count n={certificates.length} /></span>
        </p>
        <ul className="home-awards__list">
          {items.map((h, i) => (
            <li key={h.key} className={`home-awards__row${open === i ? ' is-open' : ''}`} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(i) }}>
              <Reveal index={i}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="home-awards__head">
                  <span className="home-awards__year">{h.year}</span>
                  <span className="home-awards__title">{h.title}</span>
                  <span className="home-awards__kind">{h.kind}</span>
                  <span className="home-awards__plus" aria-hidden="true" />
                </button>
                <div className="home-awards__detail">
                  <div>
                    {h.org && <p className="home-awards__org">{h.org}</p>}
                    {h.bullets.length > 0
                      ? <ul className="home-awards__bullets">{h.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                      : <p className="home-awards__desc">{h.desc}</p>}
                    <Link to={h.to} className="home-more">{id ? 'Lihat detail' : 'See details'}<span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="home-awards__card" data-show={shown !== null && open === null} aria-hidden="true">
          {shown && (
            <>
              <p className="home-awards__card-meta"><span>{shown.kind}</span><span>{shown.year}</span></p>
              {shown.org && <p className="home-awards__card-org">{shown.org}</p>}
              <p className="home-awards__card-desc">{shown.desc}</p>
              <p className="home-awards__card-cta">{id ? 'Klik untuk detail' : 'Click for details'} →</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
