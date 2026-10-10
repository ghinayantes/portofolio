'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LocLink as Link } from './LocLink'
import { Reveal } from './motion'
import { TECH_TILES, splitRole, techIcon } from './cards'
import { currentRoles } from './AboutCard'
import { awards, certificates, motto, organizations, projectSlug, projects, skills, work } from '../data/content'
import { localized } from '../data/nav'
import { SITE } from '../data/site'
import { tagLabel } from '../lib/project-tags'
import { useSettings } from '../context/Settings'

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

/** Home statement: one sentence pinned to the screen whose words light up as the page scrolls, then the motto. */
export function HomeStatement() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLParagraphElement>(null)
  const foot = useRef<HTMLParagraphElement>(null)
  const pinned = useMedia(TALL_QUERY)
  const words = localized(SITE.statement, lang).split(' ')

  useScrollFrame(() => {
    if (!section.current || !stage.current || !text.current) return
    const p = pinProgress(section.current, stage.current)
    const spans = text.current.children
    const head = p * (spans.length + 4)
    for (let i = 0; i < spans.length; i++) (spans[i] as HTMLElement).style.opacity = (0.16 + 0.84 * clamp01(head - i)).toFixed(3)
    text.current.style.transform = `scale(${(0.94 + 0.06 * clamp01(p * 1.4)).toFixed(4)})`
    if (foot.current) {
      const k = clamp01((p - 0.82) / 0.14)
      foot.current.style.opacity = k.toFixed(3)
      foot.current.style.transform = `translate3d(0, ${((1 - k) * 28).toFixed(1)}px, 0)`
    }
  }, pinned)

  return (
    <section ref={section} className={`home-section home-say${pinned ? ' home-say--on' : ''}`} aria-label={id ? 'Tentang cara kerja saya' : 'How I work'}>
      <div ref={stage} className="home-say__stage">
        <p className="home-eyebrow"><span aria-hidden="true">01</span>{id ? 'Pendekatan' : 'Approach'}</p>
        <p ref={text} className="home-say__text">
          {words.map((w, i) => <span key={i}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
        </p>
        <p ref={foot} className="home-say__motto"><span>{id ? 'Moto hidup' : 'Life motto'}</span>{motto}</p>
      </div>
    </section>
  )
}

/**
 * Home "History": a full-width strip of story chapters and tall photos.
 * On desktop the strip is pinned under the header and travels sideways one pixel per pixel scrolled, so the story is read by scrolling;
 * on small screens or with reduced motion it is a normal swipeable row.
 */
export function HomeHistory() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const section = useRef<HTMLElement>(null)
  const clip = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLElement>(null)
  const pinned = useMedia(DESKTOP_QUERY)
  const [travel, setTravel] = useState(0)
  const [tab, setTab] = useState(0)
  const story = SITE.histories[Math.min(tab, SITE.histories.length - 1)]

  useEffect(() => {
    if (!pinned) return
    const measure = () => {
      if (!clip.current || !track.current) return
      setTravel(Math.max(0, track.current.scrollWidth - clip.current.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (clip.current) ro.observe(clip.current)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [pinned, lang, tab])

  useScrollFrame(() => {
    if (!section.current || !track.current) return
    const p = travel > 0 ? clamp01((PIN_TOP - section.current.getBoundingClientRect().top) / travel) : 0
    track.current.style.transform = `translate3d(${-p * travel}px, 0, 0)`
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
  }, pinned)

  /** Switches timeline and returns to its opening, so the new story is read from the start. */
  const pick = (i: number) => {
    setTab(i)
    if (pinned && section.current) scrollTo({ top: section.current.getBoundingClientRect().top + scrollY - PIN_TOP })
    else clip.current?.scrollTo({ left: 0 })
  }

  if (!story) return null
  return (
    <section
      ref={section}
      className={`home-section home-story${pinned ? ' home-story--on' : ''}`}
      style={pinned ? { height: `calc(100vh - ${PIN_TOP}px + ${travel}px)` } : undefined}
      aria-labelledby="home-story-title"
    >
      <div className="home-story__stage">
        <div className="home-story__bar">
          <p className="home-eyebrow"><span aria-hidden="true">02</span>{id ? 'Perjalanan' : 'History'}</p>
          {SITE.histories.length > 1 && (
            <div className="home-story__tabs" role="group" aria-label={id ? 'Pilih linimasa' : 'Choose a timeline'}>
              {SITE.histories.map((h, i) => (
                <button key={i} type="button" aria-pressed={i === tab} onClick={() => pick(i)}>{localized(h.label, lang)}</button>
              ))}
            </div>
          )}
          {pinned && (
            <p className="home-story__hint" aria-hidden="true">
              <span>{id ? 'Bergerak mengikuti scroll' : 'Moving with scroll'}</span>
              <i><b ref={bar} /></i>
            </p>
          )}
        </div>
        <div ref={clip} className="home-story__clip" tabIndex={pinned ? undefined : 0}>
          <ol ref={track} className="home-story__track">
            <li className="home-story__intro">
              <h2 id="home-story-title">{localized(story.title, lang)}</h2>
              <p>{localized(SITE.lead, lang)}</p>
            </li>
            {story.chapters.map((h, i) => (
              <li key={`${tab}-${i}`} className="home-story__chapter">
                {/* Chapters without a photo yet show a labelled placeholder of the same size. */}
                <figure className={h.photo ? 'home-story__shot' : `home-story__shot home-story__shot--empty t${i % 3}`}>
                  {h.photo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={h.photo.src} alt={localized(h.photo.caption, lang)} decoding="async" />
                      <figcaption>{localized(h.photo.caption, lang)}</figcaption>
                    </>
                  ) : (
                    <figcaption>{id ? 'Foto pengganti' : 'Placeholder photo'}</figcaption>
                  )}
                </figure>
                <div className="home-story__copy">
                  <p className="home-story__when">{localized(h.when, lang)}</p>
                  <h3>{localized(h.title, lang)}</h3>
                  <p className="home-story__text">{localized(h.text, lang)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

type Highlight = { key: string; kind: string; year: string; title: string; org: string; desc: string; to: string }

/**
 * Home "Highlights": awards and certificates as a deck of large cards.
 * Each card rides up with the scroll, straightens as it lands, and sticks; the cards beneath shrink back and dim as the next one covers them.
 */
export function HomeHighlights() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const list = useRef<HTMLOListElement>(null)
  const motion = useMedia(MOTION_QUERY)

  const items: Highlight[] = [
    ...awards.slice(0, 4).map((a, i) => ({
      key: `a${i}`,
      kind: a.category ? localized(a.category, lang) : id ? 'Penghargaan' : 'Award',
      year: localized(a.meta, lang),
      title: localized(a.title, lang),
      org: a.org ? localized(a.org, lang) : '',
      desc: localized(a.desc, lang),
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
        to: '/certificate',
      }
    }),
  ]

  useScrollFrame(() => {
    if (!list.current) return
    // The sticky <li> wrappers are measured; only the card inside each one is transformed, so nothing feeds back.
    const rows = Array.from(list.current.children) as HTMLElement[]
    const rects = rows.map((r) => r.getBoundingClientRect())
    let depth = 0
    for (let i = rows.length - 1; i >= 0; i--) {
      // How far the next card has slid over this one (0 = clear, 1 = fully covered).
      if (i < rows.length - 1) depth += clamp01(1 - (rects[i + 1].top - rects[i].top) / rects[i].height)
      const stick = PIN_TOP + 32 + i * 14
      const arrive = clamp01((rects[i].top - stick) / (innerHeight * 0.6))
      rows[i].style.setProperty('--depth', Math.min(depth, 4).toFixed(3))
      rows[i].style.setProperty('--arrive', arrive.toFixed(3))
    }
  }, motion)

  const stats: [number, string][] = [
    [awards.length, id ? 'Penghargaan dan beasiswa' : 'Awards and scholarships'],
    [certificates.length, id ? 'Sertifikat' : 'Certificates'],
  ]

  return (
    <section className="home-section home-deck" aria-labelledby="home-highlights-title">
      <div className="home-deck__intro">
        <Scrub>
          <p className="home-eyebrow"><span aria-hidden="true">03</span>{id ? 'Sorotan' : 'Highlights'}</p>
          <h2 id="home-highlights-title" className="home-title"><Words text={id ? 'Pencapaian yang membentuk saya' : 'Milestones that shaped me'} /></h2>
          <dl className="home-figures">
            {stats.map(([n, label]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd><Count n={n} /></dd>
              </div>
            ))}
          </dl>
          <Link to="/award" className="home-more">{id ? 'Semua penghargaan' : 'All awards'}<span aria-hidden="true">→</span></Link>
        </Scrub>
      </div>

      <ol ref={list} className="home-deck__list">
        {items.map((h, i) => (
          <li key={h.key} className="home-deck__item" style={{ '--i': i, '--dir': i % 2 ? -1 : 1 } as CSSProperties}>
            <Link to={h.to} className="card home-award">
              <span className="home-award__top">
                <span className="home-award__kind">{h.kind}</span>
                <span>{h.year}</span>
              </span>
              <span className="home-award__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="home-award__title">{h.title}</span>
              {h.org && <span className="home-award__org">{h.org}</span>}
              <span className="home-award__desc">{h.desc}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

type Role = { key: string; role: string; org: string; when: string; desc: string; tech: string[]; current: boolean; to: string }

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
  }))
  // An organization entry whose institution is already a work entry repeats it; keep only the work one.
  const orgs: Role[] = organizations.map((o, i) => {
    const { role, org } = splitRole(localized(o.title, lang))
    return { key: `o${i}`, role, org: org ?? '', when: localized(o.when, lang), desc: localized(o.desc, lang), tech: [], current: Boolean(o.current), to: '/organization' }
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

/** Home gallery: campus and activity photos (SITE.gallery). Neighbouring photos drift and tilt in opposite directions with the scroll. */
export function HomeGallery() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const grid = useRef<HTMLUListElement>(null)
  const motion = useMedia(MOTION_QUERY)

  useScrollFrame(() => {
    if (grid.current) grid.current.style.setProperty('--s', passProgress(grid.current).toFixed(3))
  }, motion)

  if (SITE.gallery.length === 0) return null
  return (
    <section className="home-section" aria-labelledby="home-gallery-title">
      <Head n="07" label={id ? 'Galeri' : 'Gallery'} title={id ? 'Kuliah dan kegiatan' : 'Campus life and activities'} titleId="home-gallery-title" />
      <ul ref={grid} className="home-gallery">
        {SITE.gallery.map((g) => (
          <li key={g.src}>
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
