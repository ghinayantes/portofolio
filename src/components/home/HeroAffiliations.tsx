'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { LocLink as Link } from '../LocLink'
import { splitRole } from '../cards'
import { organizations, work } from '../../data/content'
import { localized } from '../../data/nav'
import { useSettings } from '../../context/Settings'
import { contentBox, fitSize, type ContentBox } from '../../lib/logo-fit'

type Affiliation = { logo: string; name: string; to: string }
type Fit = { box: ContentBox; w: number; h: number }

/** Reads a loaded logo's pixels and works out how big to show it; null if the image can't be read. */
function measure(img: HTMLImageElement): Fit | null {
  const scale = Math.min(1, 160 / Math.max(img.naturalWidth, img.naturalHeight))
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))
  const ctx = Object.assign(document.createElement('canvas'), { width, height }).getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  try {
    ctx.drawImage(img, 0, 0, width, height)
    const box = contentBox(ctx.getImageData(0, 0, width, height).data, width, height)
    if (!box) return null
    return { box, ...fitSize((box.w * width) / (box.h * height), 1936, 96, 48) }
  } catch {
    return null
  }
}

/**
 * Hero: the logos of the places I have worked or volunteered at (one per logo file, work first), in place of plain counts.
 * Logos stay greyed out until hovered; the hovered name shows beside the label.
 * Each logo is trimmed to its visible part and sized to a shared area (lib/logo-fit), so new logos line up without hand tuning.
 * When they don't fit on one line the row loops slowly (paused on hover); with reduced motion it wraps instead.
 */
export function HeroAffiliations() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const track = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [loop, setLoop] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const [fits, setFits] = useState<Record<string, Fit>>({})

  const seen = new Set<string>()
  const items: Affiliation[] = []
  const add = (logo: string | undefined, name: string, to: string) => {
    if (!logo || seen.has(logo)) return
    seen.add(logo)
    items.push({ logo, name, to })
  }
  work.forEach((w) => add(w.logo, localized(w.company, lang), '/work'))
  organizations.forEach((o) => {
    const title = localized(o.title, lang)
    add(o.logo, splitRole(title).org ?? title, '/organization')
  })

  useEffect(() => {
    const box = track.current
    const row = list.current
    if (!box || !row || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return
    // Measured on the first copy only, so adding the looping copy never feeds back into the check.
    const ro = new ResizeObserver(() => setLoop(row.scrollWidth > box.clientWidth + 1))
    ro.observe(box)
    ro.observe(row)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const row = list.current
    if (!row) return
    const imgs = Array.from(row.querySelectorAll('img'))
    const done = (img: HTMLImageElement) => {
      const fit = measure(img)
      const key = img.dataset.logo
      if (fit && key) setFits((prev) => ({ ...prev, [key]: fit }))
    }
    // Images may finish before hydration, so check `complete` instead of relying on onLoad.
    imgs.forEach((img) => { if (img.complete && img.naturalWidth) done(img); else img.addEventListener('load', () => done(img), { once: true }) })
  }, [])

  const row = (copy: boolean) => (
    <ul ref={copy ? undefined : list} className="hero-orgs__row" aria-hidden={copy || undefined}>
      {items.map((a) => {
        const fit = fits[a.logo]
        // Trimmed: the box is the visible part's size and the image is enlarged and shifted so only that part shows.
        const box: CSSProperties | undefined = fit && { width: fit.w, height: fit.h }
        const img: CSSProperties | undefined = fit && {
          width: `${100 / fit.box.w}%`, height: `${100 / fit.box.h}%`,
          left: `${(-fit.box.x / fit.box.w) * 100}%`, top: `${(-fit.box.y / fit.box.h) * 100}%`,
        }
        return (
          <li key={a.logo}>
            <Link to={a.to} tabIndex={copy ? -1 : undefined} className={`hero-orgs__logo${fit ? ' is-fit' : ''}`} style={box} onPointerEnter={() => setHover(a.name)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(a.name)} onBlur={() => setHover(null)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.logo} alt={copy ? '' : a.name} decoding="async" data-logo={a.logo} style={img} />
            </Link>
          </li>
        )
      })}
    </ul>
  )

  if (items.length === 0) return null
  return (
    <div className="hero-orgs mt-12 border-t border-line pt-6">
      <p className="mono-label !text-[11px]">
        {id ? 'Terlibat di' : 'Involved with'}
        <span className="hero-orgs__name" aria-hidden="true" data-show={hover !== null || undefined}>{hover ?? ''}</span>
      </p>
      <div ref={track} className={`hero-orgs__track${loop ? ' is-loop' : ''}`}>
        <div className="hero-orgs__reel">
          {row(false)}
          {loop && row(true)}
        </div>
      </div>
    </div>
  )
}
