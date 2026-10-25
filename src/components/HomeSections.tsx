'use client'

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { LocLink as Link } from './LocLink'
import { Reveal } from './motion'
import { OrgLogo, TECH_TILES, splitRole, techIcon } from './cards'
import { currentRoles } from './AboutCard'
import { awards, certificates, motto, organizations, projectSlug, projects, skills, work } from '../data/content'
import { localized } from '../data/nav'
import { SITE } from '../data/site'
import { tagLabel } from '../lib/project-tags'
import { useSettings } from '../context/Settings'
import { FaCode, FaLayerGroup, FaMagnifyingGlass } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

/** Header offset (sticky navbar) used by the pinned stages. Keep in sync with the 72px values under "Home story sections" in globals.css. */
const PIN_TOP = 72
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
const TALL_QUERY = `(min-height: 560px) and ${MOTION_QUERY}`
const DESKTOP_QUERY = `(min-width: 1024px) and (min-height: 640px) and ${MOTION_QUERY}`

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function useMedia(query: string): boolean {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = matchMedia(query)
    const sync = () => setOn(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])
  return on
}

/** Runs `frame` on scroll and resize, throttled to one call per animation frame. */
function useScrollFrame(frame: () => void, enabled = true) {
  const saved = useRef(frame)
  useEffect(() => { saved.current = frame })
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const tick = () => { raf = 0; saved.current() }
    const request = () => { if (!raf) raf = requestAnimationFrame(tick) }
    request()
    addEventListener('scroll', request, { passive: true })
    addEventListener('resize', request)
    return () => { removeEventListener('scroll', request); removeEventListener('resize', request); if (raf) cancelAnimationFrame(raf) }
  }, [enabled])
}

/** 0 → 1 while a pinned section's stage stays stuck under the header. */
const pinProgress = (section: HTMLElement, stage: HTMLElement) => {
  const travel = section.offsetHeight - stage.offsetHeight
  return travel > 0 ? clamp01((PIN_TOP - section.getBoundingClientRect().top) / travel) : 0
}

/** 0 → 1 while an element crosses the viewport, from its top entering at the bottom to its bottom leaving at the top. */
const passProgress = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return clamp01((innerHeight - r.top) / (innerHeight + r.height))
}

type ScrubFrom = 'up' | 'left' | 'right' | 'zoom'

/**
 * Scroll-scrubbed entrance: the content fades and travels with the scroll position itself (not a one-shot reveal),
 * so it moves back when scrolling up. `from` picks the direction; 'zoom' grows the block instead of sliding it.
 */
export function Scrub({ children, className = '', from = 'up' }: { children: ReactNode; className?: string; from?: ScrubFrom }) {
  const ref = useRef<HTMLDivElement>(null)
  const settled = useRef(false)
  const on = useMedia(MOTION_QUERY)
  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    // Anything already on screen before the first scroll is part of the first view: show it settled and leave it alone.
    if (scrollY < 8 && top < innerHeight) settled.current = true
    // Measured on the untransformed wrapper so the moving child never feeds back into the progress.
    el.style.setProperty('--v', settled.current ? '1' : clamp01((innerHeight - top) / (innerHeight * 0.5)).toFixed(3))
  }, on)
  return <div ref={ref} className={className}><div className={`scrub scrub--${from}`}>{children}</div></div>
}

/** Heading text split into words that rise out of a mask one after another as the parent Scrub progresses. */
function Words({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.flatMap((w, i) => [
        <span key={i} className="home-word"><span style={{ '--i': i } as CSSProperties}>{w}</span></span>,
        i < words.length - 1 ? ' ' : null,
      ])}
    </>
  )
}

/** Number that counts up from zero the first time it scrolls into view. Screen readers get the final value. */
function Count({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(n)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia(MOTION_QUERY).matches) return
    let raf = 0
    setShown(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (t: number) => {
        const k = clamp01((t - start) / 1100)
        setShown(Math.round(n * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [n])
  return <><span ref={ref} aria-hidden="true">{shown}</span><span className="sr-only">{n}</span></>
}

/** Thin page-progress line pinned to the top edge while the home page scrolls. */
export function HomeProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? clamp01(scrollY / max) : 0})`
  })
  return <div ref={bar} className="home-progress" aria-hidden="true" />
}

/** Oversized outlined words that slide sideways with the scroll; decorative divider between home sections. */
export function HomeBand({ back = false }: { back?: boolean }) {
  const { lang } = useSettings()
  const ref = useRef<HTMLDivElement>(null)
  const motion = useMedia(MOTION_QUERY)
  useScrollFrame(() => {
    if (ref.current) ref.current.style.setProperty('--s', passProgress(ref.current).toFixed(3))
  }, motion)
  const line = SITE.roles[lang].join(' · ')
  return (
    <div ref={ref} className={back ? 'home-band home-band--back' : 'home-band'} aria-hidden="true">
      <p>{line} · {line} · {line}</p>
    </div>
  )
}

function Head({ n, label, title, titleId, to, cta }: { n: string; label: string; title: string; titleId: string; to?: string; cta?: string }) {
  return (
    <Scrub>
      <div className="home-head">
        <div>
          <p className="home-eyebrow"><span aria-hidden="true">{n}</span>{label}</p>
          <h2 id={titleId} className="home-title"><Words text={title} /></h2>
        </div>
        {to && cta && <Link to={to} className="home-more">{cta}<span aria-hidden="true">→</span></Link>}
      </div>
    </Scrub>
  )
}

/** The three parts of the statement as steps (same wording as SITE.statement), shown under it on the home page. */
const APPROACH: { icon: IconType; title: { en: string; id: string }; text: { en: string; id: string } }[] = [
  { icon: FaMagnifyingGlass, title: { en: 'Analyze', id: 'Analisis' }, text: { en: 'Approaching problems analytically.', id: 'Menganalisis permasalahan.' } },
  { icon: FaLayerGroup, title: { en: 'Understand', id: 'Pahami' }, text: { en: 'Understanding how things work beneath the surface.', id: 'Memahami cara kerja suatu sistem secara mendalam.' } },
  { icon: FaCode, title: { en: 'Build', id: 'Bangun' }, text: { en: 'Exploring different ways to build effective solutions.', id: 'Mengeksplorasi berbagai pendekatan untuk menemukan solusi yang efektif.' } },
]

/**
 * Home statement: a full-bleed dark block pinned to the screen.
 * The sentence lights up word by word as the page scrolls, then its three parts arrive as steps one after another, then the motto.
 */
export function HomeStatement() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLParagraphElement>(null)
  const steps = useRef<HTMLOListElement>(null)
  const foot = useRef<HTMLParagraphElement>(null)
  const pinned = useMedia(TALL_QUERY)
  const words = localized(SITE.statement, lang).split(' ')

  useScrollFrame(() => {
    if (!section.current || !stage.current || !text.current) return
    const p = pinProgress(section.current, stage.current)
    // 0 → 0.55: words light up; 0.55 → 0.85: steps arrive one by one; 0.85 → 1: motto.
    const spans = text.current.children
    const head = (p / 0.55) * (spans.length + 2)
    for (let i = 0; i < spans.length; i++) (spans[i] as HTMLElement).style.opacity = (0.18 + 0.82 * clamp01(head - i)).toFixed(3)
    if (steps.current) {
      Array.from(steps.current.children).forEach((el, i) => {
        const k = clamp01((p - 0.55 - i * 0.09) / 0.1)
        ;(el as HTMLElement).style.opacity = k.toFixed(3)
        ;(el as HTMLElement).style.transform = `translate3d(0, ${((1 - k) * 36).toFixed(1)}px, 0)`
      })
    }
    if (foot.current) {
      const k = clamp01((p - 0.85) / 0.1)
      foot.current.style.opacity = k.toFixed(3)
      foot.current.style.transform = `translate3d(0, ${((1 - k) * 24).toFixed(1)}px, 0)`
    }
  }, pinned)

  return (
    <section ref={section} className={`home-section home-say${pinned ? ' home-say--on' : ''}`} aria-label={id ? 'Tentang cara kerja saya' : 'How I work'}>
      <div ref={stage} className="home-say__stage">
        <p className="home-say__pill"><span aria-hidden="true">01</span>{id ? 'Pendekatan' : 'Approach'}</p>
        <p ref={text} className="home-say__text">
          {words.map((w, i) => <span key={i}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
        </p>
        <ol ref={steps} className="home-say__steps">
          {APPROACH.map(({ icon: Icon, title, text: line }, i) => (
            <li key={title.en}>
              <span className="home-say__icon"><Icon aria-hidden="true" /></span>
              <span className="home-say__n">{String(i + 1).padStart(2, '0')}</span>
              <b>{title[lang]}</b>
              <span className="home-say__line">{line[lang]}</span>
            </li>
          ))}
        </ol>
        <p ref={foot} className="home-say__motto"><span>{id ? 'Moto hidup' : 'Life motto'}</span>{motto}</p>
      </div>
    </section>
  )
}

/** First four-digit year in a "when" label ("2022 – 2025" → "2022"), used as the oversized outline numeral. */
const firstYear = (when: string) => when.match(/\d{4}/)?.[0] ?? when

/**
 * Home "History": the story as a zig-zag across the full width.
 * Chapters alternate sides of a centre rail; the empty side carries the chapter year as an oversized outline numeral that drifts with the scroll.
 * The rail fills as the page scrolls and the chapter being read lights up while the others dim. With reduced motion everything is shown plainly.
 */
export function HomeHistory() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLElement>(null)
  const motion = useMedia(MOTION_QUERY)
  const [tab, setTab] = useState(0)
  const [active, setActive] = useState(0)
  const story = SITE.histories[Math.min(tab, SITE.histories.length - 1)]

  useScrollFrame(() => {
    if (!list.current) return
    const r = list.current.getBoundingClientRect()
    const line = innerHeight * 0.55
    if (fill.current) fill.current.style.transform = `scaleY(${clamp01((line - r.top) / r.height).toFixed(4)})`
    const steps = Array.from(list.current.querySelectorAll<HTMLElement>('.home-journey__step'))
    let k = 0
    steps.forEach((el, i) => {
      const b = el.getBoundingClientRect()
      if (b.top < line) k = i
      el.style.setProperty('--s', passProgress(el).toFixed(3))
    })
    setActive((prev) => (prev === k ? prev : k))
  }, motion)

  if (!story) return null
  return (
    <section className={`home-section home-journey${motion ? ' home-journey--on' : ''}`} aria-labelledby="home-story-title">
      <Scrub>
        <div className="home-journey__head">
          <div>
            <p className="home-eyebrow"><span aria-hidden="true">02</span>{id ? 'Perjalanan' : 'History'}</p>
            <h2 id="home-story-title" className="home-title">{localized(story.title, lang)}</h2>
            <p className="home-journey__lead">{localized(SITE.lead, lang)}</p>
          </div>
          {SITE.histories.length > 1 && (
            <div className="home-journey__tabs" role="group" aria-label={id ? 'Pilih linimasa' : 'Choose a timeline'}>
              {SITE.histories.map((h, i) => (
                <button key={i} type="button" aria-pressed={i === tab} onClick={() => setTab(i)}>{localized(h.label, lang)}</button>
              ))}
            </div>
          )}
        </div>
      </Scrub>

      <ol ref={list} className="home-journey__list">
        <li className="home-journey__rail" aria-hidden="true"><b ref={fill} /></li>
        {story.chapters.map((h, i) => {
          const when = localized(h.when, lang)
          return (
            <li key={`${tab}-${i}`} className={`home-journey__step${i % 2 ? ' home-journey__step--right' : ''}${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}>
              <span className="home-journey__node" aria-hidden="true" />
              <span className="home-journey__year" aria-hidden="true">{firstYear(when)}</span>
              <div className="home-journey__body">
                {h.photo && (
                  <figure className="home-journey__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.photo.src} alt={localized(h.photo.caption, lang)} loading="lazy" decoding="async" />
                  </figure>
                )}
                <p className="home-journey__when"><span>{String(i + 1).padStart(2, '0')}</span>{when}</p>
                <h3>{localized(h.title, lang)}</h3>
                <p className="home-journey__text">{localized(h.text, lang)}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

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

type Role = { key: string; role: string; org: string; when: string; desc: string; tech: string[]; current: boolean; to: string; logo?: string; mono?: string }

function RoleBody({ r, lang, big = false }: { r: Role; lang: 'en' | 'id'; big?: boolean }) {
  return (
    <>
      <div className="home-rail__row">
        <div className="min-w-0">
          <h3 className={big ? 'home-rail__role home-rail__role--big' : 'home-rail__role'}><Link to={r.to} className="hover:text-brand">{r.role}</Link></h3>
          {r.org && <p className="home-rail__org">{r.org}</p>}
        </div>
        <p className="home-rail__when">{r.when}</p>
      </div>
      <p className="home-rail__desc">{r.desc}</p>
      {r.tech.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {r.tech.map((t) => <li key={t} className="home-chip">{tagLabel(t, lang)}</li>)}
        </ul>
      )}
      <OrgLogo name={r.org || r.role} logo={r.logo} mono={r.mono} className="home-exp__watermark" decorative />
    </>
  )
}

/**
 * Home "Experience": the most recent roles.
 * On desktop the section is pinned and the scroll steps through one role at a time; otherwise it is a rail that fills while it scrolls by.
 */
export function HomeExperience() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLElement>(null)
  const pinned = useMedia(DESKTOP_QUERY)
  const motion = useMedia(MOTION_QUERY)
  const [active, setActive] = useState(0)

  const jobs: Role[] = work.map((w, i) => ({
    key: `w${i}`,
    role: localized(w.role, lang),
    org: localized(w.company, lang),
    when: localized(w.when, lang),
    desc: localized(w.desc, lang),
    tech: w.tech,
    current: Boolean(w.current),
    to: '/work',
    logo: w.logo,
    mono: w.mono,
  }))
  // An organization entry whose institution is already a work entry repeats it; keep only the work one.
  const orgs: Role[] = organizations.map((o, i) => {
    const { role, org } = splitRole(localized(o.title, lang))
    return { key: `o${i}`, role, org: org ?? '', when: localized(o.when, lang), desc: localized(o.desc, lang), tech: [], current: Boolean(o.current), to: '/organization', logo: o.logo, mono: o.mono }
  }).filter((o) => !jobs.some((j) => o.org !== '' && j.org.toLowerCase().includes(o.org.toLowerCase())))
  const roles = [...jobs, ...orgs].slice(0, 4)

  useScrollFrame(() => {
    if (pinned) {
      if (!section.current || !stage.current) return
      const p = pinProgress(section.current, stage.current)
      setActive(Math.min(roles.length - 1, Math.floor(p * roles.length)))
      if (fill.current) fill.current.style.transform = `scaleY(${p})`
      return
    }
    if (!list.current) return
    const r = list.current.getBoundingClientRect()
    list.current.style.setProperty('--p', String(clamp01((innerHeight * 0.7 - r.top) / r.height)))
  }, motion)

  const head = (
    <>
      <p className="home-eyebrow"><span aria-hidden="true">04</span>{id ? 'Pengalaman' : 'Experience'}</p>
      <h2 id="home-exp-title" className="home-title">{id ? 'Tempat saya berkontribusi' : 'Where I have contributed'}</h2>
    </>
  )
  const more = <Link to="/organization" className="home-more">{id ? 'Semua pengalaman' : 'All experience'}<span aria-hidden="true">→</span></Link>

  if (pinned) {
    return (
      <section ref={section} className="home-section home-xp home-xp--on" style={{ height: `calc(100vh - ${PIN_TOP}px + ${roles.length * 60}vh)` }} aria-labelledby="home-exp-title">
        <div ref={stage} className="home-xp__stage">
          <div>
            {head}
            <ol className="home-xp__nav">
              {roles.map((r, i) => (
                <li key={r.key} data-active={i === active || undefined}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">{r.role}{r.org && <small>{r.org}</small>}</span>
                </li>
              ))}
            </ol>
            {more}
          </div>
          <div className="home-xp__deckwrap">
            <i className="home-xp__bar" aria-hidden="true"><b ref={fill} /></i>
            <div className="card home-xp__deck">
              {roles.map((r, i) => (
                <article key={r.key} className="home-xp__panel" data-state={i === active ? 'active' : i < active ? 'past' : 'next'} inert={i !== active || undefined}>
                  <span className="home-xp__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <RoleBody r={r} lang={lang} big />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="home-section" aria-labelledby="home-exp-title">
      <Scrub>
        <div className="home-head"><div>{head}</div>{more}</div>
      </Scrub>
      <ol ref={list} className="home-rail">
        {roles.map((r, i) => (
          <li key={r.key} className={r.current ? 'home-rail__item home-rail__item--now' : 'home-rail__item'}>
            <Reveal index={i}><RoleBody r={r} lang={lang} /></Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Home "Now": the projects still in progress, sliding in from alternating sides, plus the roles held right now. */
export function HomeNow() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const live = projects.filter((p) => p.wip)
  const roles = currentRoles(lang)

  if (live.length === 0) return null
  return (
    <section className="home-section" aria-labelledby="home-now-title">
      <Head n="05" label={id ? 'Sekarang' : 'Now'} title={id ? 'Yang sedang saya kerjakan' : 'What I am building right now'} titleId="home-now-title" to="/project" cta={id ? 'Semua proyek' : 'All projects'} />
      <ol className="home-now">
        {live.map((p, i) => (
          <li key={projectSlug(p)}>
            <Scrub from={i % 2 ? 'right' : 'left'}>
              <Link to={`/project/${projectSlug(p)}`} className={p.image ? 'card home-now__row home-now__row--shot' : 'card home-now__row'}>
                <span className="min-w-0">
                  <span className="home-now__live"><i aria-hidden="true" />{p.status ? localized(p.status, lang) : id ? 'Sedang dikerjakan' : 'In progress'}</span>
                  <span className="home-now__title">{localized(p.title, lang)}</span>
                  <span className="home-now__desc">{localized(p.desc, lang)}</span>
                  {(p.tech ?? []).length > 0 && (
                    <span className="tech-stack">
                      {(p.tech ?? []).map((t) => (
                        <span key={t} className="tech-dot" title={tagLabel(t, lang)}>{techIcon(tagLabel(t, 'en'))}<span className="sr-only">{tagLabel(t, lang)}</span></span>
                      ))}
                    </span>
                  )}
                </span>
                {p.image && (
                  <span className="home-now__shot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" loading="lazy" decoding="async" />
                  </span>
                )}
              </Link>
            </Scrub>
          </li>
        ))}
      </ol>
      {roles.length > 0 && (
        <Scrub>
          <p className="home-now__also">
            <span>{id ? 'Juga aktif sebagai' : 'Also active as'}</span>
            {roles.map((r) => <span key={r.role + r.org} className="home-chip">{r.role}{r.org ? ` · ${r.org}` : ''}</span>)}
          </p>
        </Scrub>
      )}
    </section>
  )
}

/** Home "Stack": two rows of tech logos that slide in opposite directions with the scroll, plus per-group counts. */
export function HomeStack() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const rows = useRef<HTMLDivElement>(null)
  const motion = useMedia(MOTION_QUERY)
  const groups = skills.slice(0, 3)
  const half = Math.ceil(TECH_TILES.length / 2)
  const lines = [TECH_TILES.slice(0, half), TECH_TILES.slice(half)]

  useScrollFrame(() => {
    if (rows.current) rows.current.style.setProperty('--s', passProgress(rows.current).toFixed(3))
  }, motion)

  return (
    <section className="home-section" aria-labelledby="home-stack-title">
      <Head n="06" label={id ? 'Teknologi' : 'Stack'} title={id ? 'Alat yang saya gunakan' : 'Tools I build with'} titleId="home-stack-title" to="/skills" cta={id ? 'Semua keahlian' : 'All skills'} />
      <Scrub>
        <dl className="home-figures home-figures--row">
          {groups.map((g) => (
            <div key={localized(g.title, lang)}>
              <dt>{localized(g.title, lang)}</dt>
              <dd><Count n={g.items.length} /></dd>
            </div>
          ))}
        </dl>
      </Scrub>
      <div ref={rows} className="home-rows">
        {lines.map((line, k) => (
          <ul key={k} className={k % 2 ? 'home-rows__row home-rows__row--back' : 'home-rows__row'}>
            {[0, 1, 2].flatMap((copy) => line.map((t) => (
              <li key={`${copy}-${t.label}`} className="home-rows__pill" aria-hidden={copy > 0 || undefined}>{t.icon}{t.label}</li>
            )))}
          </ul>
        ))}
      </div>
    </section>
  )
}

/** Home gallery: square campus and activity tiles revealed bottom-to-top as they enter view. */
export function HomeGallery() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const grid = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ul = grid.current
    if (!ul) return
    const items = Array.from(ul.querySelectorAll('li'))
    const cleanups: (() => void)[] = []
    const markLoaded = (img: HTMLImageElement) => {
      const item = img.closest('li')
      if (!item) return
      if (img.naturalWidth > img.naturalHeight * 1.5) item.classList.add('is-wide')
      item.dataset.imageLoaded = 'true'
      if (item.dataset.inView === 'true') item.dataset.revealed = 'true'
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const item = entry.target
        if (!(item instanceof HTMLLIElement)) return
        item.dataset.inView = 'true'
        if (item.dataset.imageLoaded === 'true') item.dataset.revealed = 'true'
      })
    })
    const section = ul.closest('section')
    const sectionObserver = section ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return
        items.forEach((item) => {
          delete item.dataset.inView
          delete item.dataset.revealed
        })
      })
    }) : null
    if (section) sectionObserver?.observe(section)
    ul.dataset.motionReady = 'true'
    items.forEach((item) => {
      observer.observe(item)
      const img = item.querySelector('img')
      if (!img) return
      if (img.complete) markLoaded(img)
      else {
        const onLoad = () => markLoaded(img)
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onLoad, { once: true })
        cleanups.push(() => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onLoad)
        })
      }
    })
    return () => {
      observer.disconnect()
      sectionObserver?.disconnect()
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  if (SITE.gallery.length === 0) return null
  return (
    <section className="home-section" aria-labelledby="home-gallery-title">
      <Head n="07" label={id ? 'Galeri' : 'Gallery'} title={id ? 'Kuliah dan kegiatan' : 'Campus life and activities'} titleId="home-gallery-title" />
      <ul ref={grid} className="home-gallery">
        {SITE.gallery.map((g, i) => (
          <li key={g.src} className={g.wide ? 'is-wide' : undefined} style={{ '--gallery-order': i } as CSSProperties}>
            <figure className="home-shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={localized(g.caption, lang)} loading="lazy" decoding="async" />
              <figcaption>{localized(g.caption, lang)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
