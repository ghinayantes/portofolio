'use client'

import { about, organizations, work } from '../data/content'
import { splitRole } from './cards'
import { LocLink } from './LocLink'
import { localized } from '../data/nav'
import { SITE } from '../data/site'
import type { Lang } from '../lib/i18n'
import { useSettings } from '../context/Settings'

const SOCIAL_KEYS = ['linkedin', 'github', 'instagram']

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

/** Identity card on the About page: inset portrait, name, location, CV and profile links. */
export function AboutIdentity() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const photo = SITE.photos[0]
  const location = about.find(([k]) => k.en === 'Location')
  const socials = SITE.contacts.filter((c) => SOCIAL_KEYS.includes(c.key))

  return (
    <div className="card about-id">
      {photo && (
        <figure className="about-id__portrait">
          <img src={photo.src} alt={localized(photo.alt, lang)} className="about-id__img" />
        </figure>
      )}

      <div className="about-id__body">
        <h3 className="font-display text-[1.6rem] font-bold leading-tight tracking-[-0.02em]">{SITE.name}</h3>
        <p className="about-id__meta">{localized(SITE.role, lang)}{location ? ` · ${localized(location[1], lang)}` : ''}</p>
        <a href={`mailto:${SITE.email}`} className="about-link text-sm">{SITE.email}</a>

        <ul className="about-id__actions" aria-label={id ? 'Profil' : 'Profiles'}>
          <li><a href={SITE.cv} target="_blank" rel="noopener noreferrer" className="about-cv">{id ? 'Unduh CV' : 'Download CV'}</a></li>
          {socials.map((c) => (
            <li key={c.key}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="about-link">{localized(c.label, lang)}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Current roles tile. */
export function AboutNow({ roles }: { roles: CurrentRole[] }) {
  const { lang } = useSettings()

  return (
    <section className="card about-tile" aria-labelledby="about-now-title">
      <h3 id="about-now-title" className="about-label">{lang === 'id' ? 'Saat ini' : 'Currently'}</h3>
      <ul className="about-now-list">
        {roles.map((r) => (
          <li key={r.role + r.org}>
            <LocLink to={r.to} className="about-now">
              <span className="about-now__role">{r.role}</span>
              <span className="about-now__org">{r.org}</span>
            </LocLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
