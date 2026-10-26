'use client'

import Image from 'next/image'
import { organizations, work } from '../data/content'
import { splitRole } from './cards'
import { LocLink } from './LocLink'
import { localized } from '../data/nav'
import { SITE } from '../data/site'
import type { Lang } from '../lib/i18n'
import { useSettings } from '../context/Settings'

export type CurrentRole = { role: string; org: string; to: string }

/** Roles marked as current across work and organizations (at most three). */
export function currentRoles(lang: Lang): CurrentRole[] {
  // An organization entry whose institution is the current employer (e.g. 'HMIF ITB' inside "Executive Department HMIF ITB 'Prisma'") repeats the work entry; keep only the work one.
  const jobs = work.filter((w) => w.current).map((w) => ({ role: localized(w.role, lang), org: localized(w.company, lang), to: '/work' }))
  const orgs = organizations.filter((o) => o.current).map((o) => {
    const { role, org } = splitRole(localized(o.title, lang))
    return { role, org: org ?? '', to: '/organization' }
  })
  return [...jobs, ...orgs.filter((o) => !jobs.some((j) => o.org !== '' && j.org.toLowerCase().includes(o.org.toLowerCase())))].slice(0, 3)
}

/** About portrait: bleeds to the screen edge and fades into the page, no frame. */
export function AboutIdentity() {
  const { lang } = useSettings()
  const photo = SITE.photos[0]
  if (!photo) return null

  return (
    <figure className="about-id">
      <Image src={photo.src} alt={localized(photo.alt, lang)} fill sizes="(max-width: 767px) 100vw, 45vw" className="about-id__img" />
    </figure>
  )
}

/** Current roles as large hover rows. */
export function AboutNow({ roles }: { roles: CurrentRole[] }) {
  const { lang } = useSettings()

  return (
    <section aria-labelledby="about-now-title">
      <h3 id="about-now-title" className="home-eyebrow">{lang === 'id' ? 'Saat ini' : 'Currently'}</h3>
      <ul className="about-now-list">
        {roles.map((r) => (
          <li key={r.role + r.org}>
            <LocLink to={r.to} className="about-now">
              <span className="about-now__role">{r.role}</span>
              <span className="about-now__org">{r.org}</span>
              <span className="about-now__arrow" aria-hidden="true">→</span>
            </LocLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
