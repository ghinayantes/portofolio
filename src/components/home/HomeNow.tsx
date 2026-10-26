'use client'

import Image from 'next/image'
import { LocLink as Link } from '../LocLink'
import { techIcon } from '../cards'
import { currentRoles } from '../AboutCard'
import { projectSlug, projects } from '../../data/content'
import { localized } from '../../data/nav'
import { tagLabel } from '../../lib/project-tags'
import { useSettings } from '../../context/Settings'
import { Head, Scrub } from './shared'

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
                    <Image src={p.image} alt="" fill sizes="(max-width: 767px) 90vw, 40vw" loading="lazy" decoding="async" />
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
