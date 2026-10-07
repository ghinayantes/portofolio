'use client'

import type { CSSProperties } from 'react'
import type { IconType } from 'react-icons'
import {
  FaBriefcase, FaCertificate, FaClockRotateLeft, FaCode, FaDiagramProject, FaEnvelopeOpenText, FaFeatherPointed,
  FaGraduationCap, FaLayerGroup, FaNewspaper, FaPenRuler, FaPeopleGroup, FaSitemap, FaTrophy, FaUser,
} from 'react-icons/fa6'
import { LocLink as Link } from './LocLink'
import { Reveal } from './motion'
import { NAV, localized } from '../data/nav'
import { projects } from '../data/content'
import { useSettings } from '../context/Settings'

const ICONS: Record<string, IconType> = {
  about: FaUser, portfolio: FaLayerGroup, skills: FaCode, certificate: FaCertificate, news: FaNewspaper,
  work: FaBriefcase, project: FaDiagramProject, organization: FaPeopleGroup, award: FaTrophy, hire: FaEnvelopeOpenText,
  design: FaPenRuler, writing: FaFeatherPointed, education: FaGraduationCap, timeline: FaClockRotateLeft, sitemap: FaSitemap,
}
/** one accent per group: Profile, Experience, Artwork, Other */
const TONES = ['#a78bfa', '#38bdf8', '#f472b6', '#fbbf24']

/**
 * Home "Explore": two feature tiles (Projects, Hire me) on top, then a directory of every page grouped by topic.
 * Styles: .explore-* in globals.css.
 */
export default function Explore() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const all = NAV.flatMap((g) => g.items)
  const proj = all.find((x) => x.key === 'project')
  const hire = all.find((x) => x.key === 'hire')
  const shots = projects.filter((p) => p.image).slice(0, 3)

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        {proj && (
          <Reveal>
            <Link to="/project" className="explore-feature explore-feature--projects">
              <div className="explore-feature__text">
                <span className="explore-chip">{projects.length} {id ? 'proyek' : 'projects'}</span>
                <h3>{t(proj.title)}</h3>
                <p>{t(proj.desc)}</p>
                <span className="explore-cta">{id ? 'Lihat semua proyek' : 'Browse all projects'}<i aria-hidden>→</i></span>
              </div>
              <div className="explore-shots" aria-hidden>
                {shots.map((p, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={k} src={p.image} alt="" loading="lazy" decoding="async" className={`explore-shot explore-shot--${k}`} />
                ))}
              </div>
            </Link>
          </Reveal>
        )}
        {hire && (
          <Reveal index={1}>
            <Link to="/hire" className="explore-feature explore-feature--hire">
              <div className="explore-feature__text">
                <span className="explore-chip explore-chip--live"><i aria-hidden />{id ? 'Terbuka untuk peluang' : 'Open to opportunities'}</span>
                <h3>{t(hire.title)}</h3>
                <p>{t(hire.desc)}</p>
                <span className="explore-cta">{id ? 'Mulai ngobrol' : 'Say hello'}<i aria-hidden>→</i></span>
              </div>
            </Link>
          </Reveal>
        )}
      </div>

      <Reveal>
        <nav aria-label={id ? 'Semua halaman' : 'All pages'} className="card explore-dir">
          {NAV.map((g, gi) => {
            const first = g.items[0]
            const GIcon = first ? ICONS[first.key] : undefined
            return (
              <section key={gi} className="explore-col" style={{ '--tone': TONES[gi % TONES.length] } as CSSProperties}>
                <h3 className="explore-col__head">
                  <span className="explore-col__badge" aria-hidden>{GIcon ? <GIcon /> : null}</span>
                  {t(g.title)}
                </h3>
                <ul>
                  {g.items.map((x) => {
                    const Icon = ICONS[x.key]
                    return (
                      <li key={x.key}>
                        <Link to={'/' + x.key} className="explore-row">
                          <span className="explore-row__icon" aria-hidden>{Icon && <Icon />}</span>
                          <span className="explore-row__text"><b>{t(x.title)}</b><small>{localized(x.desc, lang)}</small></span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </nav>
      </Reveal>
    </div>
  )
}
