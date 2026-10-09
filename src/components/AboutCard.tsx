'use client'

import { about, awards, certificates, organizations, projects, work } from '../data/content'
import { splitRole } from './cards'
import { LocLink } from './LocLink'
import { localized } from '../data/nav'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'

const SOCIAL_KEYS = ['linkedin', 'github', 'instagram']

/** Editorial identity block on the About page: large portrait, name line, fact grid, and profile links. */
export function AboutCard() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const photo = SITE.photos[0]
  const facts = about.filter(([k]) => k.en !== 'Status')
  const socials = SITE.contacts.filter((c) => SOCIAL_KEYS.includes(c.key))

  return (
    <div className="about-id self-start">
      {photo && (
        <figure className="about-id__portrait">
          <img src={photo.src} alt={localized(photo.alt, lang)} className="about-id__img" />
        </figure>
      )}

      <div className="about-id__name">
        <div className="min-w-0">
          <h3 className="font-display text-[1.6rem] font-bold leading-tight tracking-[-0.02em]">{SITE.name}</h3>
          <p className="mt-1 text-[15px] text-fg2">{localized(SITE.role, lang)}</p>
        </div>
        <a href={SITE.cv} target="_blank" rel="noopener noreferrer" className="about-cv">{id ? 'Unduh CV' : 'Download CV'}</a>
      </div>

      <dl className="about-id__facts">
        {facts.map(([k, v]) => {
          const value = localized(v, lang)
          return (
            <div key={k.en} className="min-w-0">
              <dt className="about-fact__label">{localized(k, lang)}</dt>
              <dd className="about-fact__value">
                {k.en === 'Email' ? <a href={`mailto:${value}`} className="about-link">{value}</a> : value}
              </dd>
            </div>
          )
        })}
      </dl>

      <ul className="about-id__links" aria-label={id ? 'Profil' : 'Profiles'}>
        {socials.map((c) => (
          <li key={c.key}>
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="about-link">{localized(c.label, lang)}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Real-data highlights under the bio: collection counts and the roles marked as current. */
export function AboutHighlights() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const stats = [
    { to: '/project', n: projects.length, label: id ? 'Proyek' : 'Projects' },
    { to: '/organization', n: organizations.length, label: id ? 'Organisasi' : 'Organizations' },
    { to: '/award', n: awards.length, label: id ? 'Penghargaan' : 'Awards' },
    { to: '/certificate', n: certificates.length, label: id ? 'Sertifikat' : 'Certificates' },
  ]
  // An organization entry whose institution is the current employer (e.g. 'HMIF ITB' inside "Executive Department HMIF ITB 'Prisma'") repeats the work entry; keep only the work one.
  const jobs = work.filter((w) => w.current).map((w) => ({ role: localized(w.role, lang), org: localized(w.company, lang), to: '/work' }))
  const orgs = organizations.filter((o) => o.current).map((o) => {
    const { role, org } = splitRole(localized(o.title, lang))
    return { role, org: org ?? '', to: '/organization' }
  })
  const now = [...jobs, ...orgs.filter((o) => !jobs.some((j) => o.org !== '' && j.org.toLowerCase().includes(o.org.toLowerCase())))].slice(0, 3)

  return (
    <div className="about-hl">
      <ul className="about-hl__stats">
        {stats.map((s) => (
          <li key={s.to}>
            <LocLink to={s.to} className="about-stat">
              <span className="about-stat__n">{s.n}</span>
              <span className="about-stat__label">{s.label}</span>
            </LocLink>
          </li>
        ))}
      </ul>

      {now.length > 0 && (
        <section className="about-hl__now" aria-labelledby="about-now-title">
          <h3 id="about-now-title" className="about-fact__label">{id ? 'Saat ini' : 'Currently'}</h3>
          <ul>
            {now.map((r) => (
              <li key={r.role + r.org}>
                <LocLink to={r.to} className="about-now">
                  <span className="about-now__role">{r.role}</span>
                  <span className="about-now__org">{r.org}</span>
                </LocLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
