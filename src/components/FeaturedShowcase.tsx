'use client'

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { FaGithub, FaGlobe } from 'react-icons/fa6'
import { LocLink as Link } from './LocLink'
import { localized } from '../data/nav'
import { projectSlug, type Project } from '../data/content'
import { useSettings } from '../context/Settings'
import { getAvailableProjectLinks } from '../lib/project-links'
import { tagLabel } from '../lib/project-tags'

const ROTATE_MS = 6000

/** Editorial featured-project showcase: eyebrow, big title, frosted description
    overlapping a large visual. Rotates automatically when given 2+ projects. */
export function FeaturedShowcase({ list }: { list: Project[] }): ReactElement | null {
  const { lang } = useSettings()
  const id = lang === 'id'
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useMemo(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const safeIndex = list.length === 0 ? 0 : index % list.length
  const current = list[safeIndex] ?? null

  useEffect(() => {
    if (list.length < 2 || paused || reduceMotion) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % list.length), ROTATE_MS)
    return () => window.clearTimeout(t)
  }, [list.length, paused, reduceMotion, safeIndex])

  useEffect(() => { setIndex(0) }, [lang])
  if (!current) return null

  const availableLinks = getAvailableProjectLinks(
    current.links.map((link) => localized(link, lang)),
    current.linkHrefs,
  )
  const live = availableLinks.find(({ label }) => label.toLowerCase().includes('live') || label.toLowerCase().includes('situs langsung')) ?? null
  const github = availableLinks.find(({ label }) => label.toLowerCase().includes('github')) ?? null
  const otherLinks = availableLinks.filter((l) => l !== live && l !== github)
  const imageSrc = current.image ? (current.image.startsWith('/') ? current.image : `/${current.image}`) : null
  const key = current.slug ?? localized(current.title, 'en')

  return (
    <section
      aria-roledescription="carousel"
      aria-label={id ? 'Proyek unggulan' : 'Featured projects'}
      className="showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false) }}
    >
      <div key={key} className="showcase-slide">
        <div className="showcase-copy">
          <p className="showcase-eyebrow">{id ? 'Proyek Unggulan' : 'Featured Project'}</p>
          <h3 className="showcase-title">
            <Link to={`/project/${projectSlug(current)}`} className="hover:text-brand">
              {localized(current.title, lang)}
            </Link>
          </h3>
          <p className="showcase-desc">{localized(current.desc, lang)}</p>
          <div className="showcase-tags">
            {(current.tech ?? []).slice(0, 4).map((t) => (
              <span key={t} className="rounded-md border border-brand/25 bg-brand/10 px-3 py-1 text-[13px]">{tagLabel(t, lang)}</span>
            ))}
          </div>
          <div className="showcase-actions">
            {live && (
              <a
                href={live.href}
                target="_blank"
                rel="noreferrer"
                aria-label={id ? `Situs langsung ${localized(current.title, lang)}` : `${localized(current.title, lang)} live site`}
                className="showcase-globe"
              >
                <FaGlobe aria-hidden="true" className="size-5" />
              </a>
            )}
            {github && (
              <a
                href={github.href}
                target="_blank"
                rel="noreferrer"
                aria-label={id ? `Repositori GitHub ${localized(current.title, lang)}` : `${localized(current.title, lang)} GitHub repository`}
                className="showcase-globe"
              >
                <FaGithub aria-hidden="true" className="size-5" />
              </a>
            )}
            {otherLinks.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand hover:underline">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="showcase-visual">
          {imageSrc ? (
            <img src={imageSrc} alt={`${localized(current.title, lang)} project preview`} loading="lazy" />
          ) : (
            <div className="thumb t0 showcase-fallback" aria-hidden="true">
              <div className="win"><span /><span /><span /></div>
              <div className="ln"><i /><i /><i /></div>
            </div>
          )}
        </div>
      </div>
      {list.length > 1 && (
        <p className="showcase-count" aria-hidden="true">{safeIndex + 1} / {list.length}</p>
      )}
    </section>
  )
}
