'use client'

import { useRef, useState } from 'react'
import { LocLink as Link } from '../LocLink'
import { Reveal } from '../motion'
import { OrgLogo, splitRole } from '../cards'
import { organizations, work } from '../../data/content'
import { localized } from '../../data/nav'
import { tagLabel } from '../../lib/project-tags'
import { useSettings } from '../../context/Settings'
import { DESKTOP_QUERY, MOTION_QUERY, PIN_TOP, Scrub, clamp01, pinProgress, useMedia, useScrollFrame } from './shared'

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
      <section ref={section} className="home-section home-xp home-xp--on home-lines" style={{ height: `calc(100vh - ${PIN_TOP}px + ${roles.length * 60}vh)` }} aria-labelledby="home-exp-title">
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
    <section className="home-section home-lines" aria-labelledby="home-exp-title">
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
