'use client'

import type { ReactNode } from 'react'
import * as C from '../data/content'
import { localized } from '../data/nav'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section" aria-label={title}>
      <h2 className="resume-section__title">{title}</h2>
      <div className="resume-section__entries">{children}</div>
    </section>
  )
}

function ResumeEntry({
  title,
  subtitle,
  date,
  description,
  bullets,
  tags,
}: {
  title: string
  subtitle?: string
  date?: string
  description?: string
  bullets?: string[]
  tags?: string[]
}) {
  return (
    <article className="resume-entry">
      <header className="resume-entry__header">
        <div className="min-w-0">
          <h3 className="resume-entry__title">{title}</h3>
          {subtitle && <p className="resume-entry__subtitle">{subtitle}</p>}
        </div>
        {date && <time className="resume-entry__date">{date}</time>}
      </header>
      {description && <p className="resume-entry__description">{description}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="resume-entry__bullets">
          {bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
        </ul>
      )}
      {tags && tags.length > 0 && <p className="resume-entry__tags">{tags.join(' · ')}</p>}
    </article>
  )
}

function splitOrganization(title: string): { role: string; organization?: string } {
  const match = title.match(/^(.*?)\s+[-–—]\s+(.+)$/)
  return match ? { role: match[1], organization: match[2] } : { role: title }
}

export default function ResumePortfolio() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const projects = [...C.projects].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  const contacts = SITE.contacts.filter((contact) => ['email', 'linkedin', 'github'].includes(contact.key))

  return (
    <article className="resume-cv">
      <header className="resume-cv__header">
        <div>
          <p className="resume-cv__eyebrow">{id ? 'PORTOFOLIO · CV' : 'PORTFOLIO · CV'}</p>
          <h1 className="resume-cv__name">{SITE.name}</h1>
          <p className="resume-cv__role">{localized(SITE.role, lang)}</p>
        </div>
        <a className="resume-cv__download" href={SITE.cv} download>
          {id ? 'Unduh CV' : 'Download CV'} <span aria-hidden="true">↓</span>
        </a>
        <p className="resume-cv__summary">{localized(SITE.lead, lang)}</p>
        <nav className="resume-cv__contacts" aria-label={id ? 'Kontak profesional' : 'Professional contacts'}>
          {contacts.map((contact) => (
            <a key={contact.key} href={contact.href} target={contact.href.startsWith('mailto:') ? undefined : '_blank'} rel={contact.href.startsWith('mailto:') ? undefined : 'noreferrer'}>
              {contact.key === 'email' ? SITE.email : contact.href.replace(/^https?:\/\//, '').replace(/^www\./, '')}
            </a>
          ))}
        </nav>
      </header>

      <ResumeSection title={id ? 'Pendidikan' : 'Education'}>
        {C.education.map((entry) => (
          <ResumeEntry
            key={localized(entry.title, lang)}
            title={localized(entry.title, lang)}
            date={localized(entry.when, lang)}
            description={localized(entry.desc, lang)}
          />
        ))}
      </ResumeSection>

      <ResumeSection title={id ? 'Pengalaman Profesional' : 'Professional Experience'}>
        {C.work.map((entry) => (
          <ResumeEntry
            key={`${localized(entry.role, lang)}-${localized(entry.company, lang)}`}
            title={localized(entry.role, lang)}
            subtitle={`${localized(entry.company, lang)} · ${localized(entry.location, lang)}`}
            date={localized(entry.when, lang)}
            bullets={entry.highlights.slice(0, 2).map((highlight) => localized(highlight, lang))}
            tags={entry.tech}
          />
        ))}
      </ResumeSection>

      <ResumeSection title={id ? 'Proyek' : 'Projects'}>
        {projects.map((project) => (
          <ResumeEntry
            key={project.slug ?? localized(project.title, lang)}
            title={localized(project.title, lang)}
            date={project.date ? new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${project.date}T12:00:00Z`)) : undefined}
            description={localized(project.desc, lang)}
            tags={project.tags.slice(0, 4).map((tag) => localized(tag, lang))}
          />
        ))}
      </ResumeSection>

      <ResumeSection title={id ? 'Organisasi & Kepemimpinan' : 'Organizations & Leadership'}>
        {C.organizations.map((entry) => {
          const { role, organization } = splitOrganization(localized(entry.title, lang))
          return (
            <ResumeEntry
              key={localized(entry.title, lang)}
              title={role}
              subtitle={organization}
              date={localized(entry.when, lang)}
              description={localized(entry.desc, lang)}
            />
          )
        })}
      </ResumeSection>

      <ResumeSection title={id ? 'Penghargaan' : 'Awards'}>
        {C.awards.map((award) => (
          <ResumeEntry
            key={localized(award.title, lang)}
            title={localized(award.title, lang)}
            subtitle={award.org ? localized(award.org, lang) : undefined}
            date={award.date ? localized(award.date, lang) : localized(award.meta, lang)}
            description={localized(award.desc, lang)}
          />
        ))}
      </ResumeSection>

      <ResumeSection title={id ? 'Keahlian' : 'Skills'}>
        <div className="resume-skills">
          {C.skills.map((group) => (
            <div className="resume-skills__row" key={localized(group.title, lang)}>
              <h3>{localized(group.title, lang)}</h3>
              <p>{group.items.map((item) => localized(item, lang)).join(' · ')}</p>
            </div>
          ))}
        </div>
      </ResumeSection>
    </article>
  )
}
