'use client'

import { useCallback, useEffect, useMemo, useState, type AnimationEvent, type ReactElement } from 'react'
import { FaChevronLeft, FaChevronRight, FaGithub, FaGlobe } from 'react-icons/fa6'
import { LocLink as Link } from './LocLink'
import { localized } from '../data/nav'
import { projectSlug, type Project } from '../data/content'
import { useSettings } from '../context/Settings'
import { getAvailableProjectLinks } from '../lib/project-links'
import { tagLabel } from '../lib/project-tags'

const ROTATE_MS = 6000
const LEAVE_FALLBACK_MS = 1000

type Lang = ReturnType<typeof useSettings>['lang']
type Dir = 0 | 1 | -1

/** One showcase slide: eyebrow, big title, frosted description overlapping a large visual. */
type SlideState = 'active' | 'leave' | 'idle'

function ShowcaseSlide({ project, lang, dir, state, onLeft }: {
  project: Project
  lang: Lang
  dir: Dir
  state: SlideState
  onLeft?: () => void
}): ReactElement {
  const id = lang === 'id'
  const availableLinks = getAvailableProjectLinks(
    project.links.map((link) => localized(link, lang)),
    project.linkHrefs,
  )
  const live = availableLinks.find(({ label }) => label.toLowerCase().includes('live') || label.toLowerCase().includes('situs langsung')) ?? null
  const github = availableLinks.find(({ label }) => label.toLowerCase().includes('github')) ?? null
  const otherLinks = availableLinks.filter((l) => l !== live && l !== github)
  const imageSrc = project.image ? (project.image.startsWith('/') ? project.image : `/${project.image}`) : null
  const done = (e: AnimationEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onLeft?.() }

  return (
    <div
      className={`showcase-slide showcase-slide--${state}`}
      data-dir={dir}
      aria-hidden={state !== 'active' || undefined}
      inert={state !== 'active' || undefined}
      onAnimationEnd={state === 'leave' ? done : undefined}
    >
      <div className="showcase-copy">
        <p className="showcase-eyebrow">{id ? 'Proyek Unggulan' : 'Featured Project'}</p>
        <h3 className="showcase-title">
          <Link to={`/project/${projectSlug(project)}`} className="hover:text-brand">
            {localized(project.title, lang)}
          </Link>
        </h3>
        <p className="showcase-desc">{localized(project.desc, lang)}</p>
        <div className="showcase-tags">
          {(project.tech ?? []).slice(0, 4).map((t) => (
            <span key={t} className="rounded-md border border-brand/25 bg-brand/10 px-3 py-1 text-[13px]">{tagLabel(t, lang)}</span>
          ))}
        </div>
        <div className="showcase-actions">
          {live && (
            <a
              href={live.href}
              target="_blank"
              rel="noreferrer"
              aria-label={id ? `Situs langsung ${localized(project.title, lang)}` : `${localized(project.title, lang)} live site`}
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
              aria-label={id ? `Repositori GitHub ${localized(project.title, lang)}` : `${localized(project.title, lang)} GitHub repository`}
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
          <img src={imageSrc} alt={`${localized(project.title, lang)} project preview`} loading="lazy" />
        ) : (
          <div className="thumb t0 showcase-fallback" aria-hidden="true">
            <div className="win"><span /><span /><span /></div>
            <div className="ln"><i /><i /><i /></div>
          </div>
        )}
      </div>
    </div>
  )
}

const slideKey = (p: Project): string => p.slug ?? localized(p.title, 'en')

/** Editorial featured-project showcase. Rotates automatically when given 2+ projects;
    the outgoing slide slides out while the next one slides in from the travel direction.
    Every slide stays mounted (idle ones hidden) so the stage keeps the tallest slide's height
    and nothing jumps vertically between projects. */
export function FeaturedShowcase({ list }: { list: Project[] }): ReactElement | null {
  const { lang } = useSettings()
  const id = lang === 'id'
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<Dir>(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useMemo(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const safeIndex = list.length === 0 ? 0 : index % list.length
  const current = list[safeIndex] ?? null

  const go = useCallback((delta: 1 | -1) => {
    if (list.length < 2 || leaving !== null) return
    setDir(delta)
    if (!reduceMotion) setLeaving(safeIndex)
    setIndex((safeIndex + delta + list.length) % list.length)
  }, [list.length, leaving, reduceMotion, safeIndex])

  useEffect(() => {
    if (list.length < 2 || paused || reduceMotion || leaving !== null) return
    const t = window.setTimeout(() => go(1), ROTATE_MS)
    return () => window.clearTimeout(t)
  }, [list.length, paused, reduceMotion, leaving, go])

  // Fallback in case animationend never fires (e.g. the section is hidden mid-transition).
  useEffect(() => {
    if (leaving === null) return
    const t = window.setTimeout(() => setLeaving(null), LEAVE_FALLBACK_MS)
    return () => window.clearTimeout(t)
  }, [leaving])

  useEffect(() => { setIndex(0); setDir(0); setLeaving(null) }, [lang])
  if (!current) return null

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
      <div className="showcase-stage">
        {list.map((project, i) => (
          <ShowcaseSlide
            key={slideKey(project)}
            project={project}
            lang={lang}
            dir={dir}
            state={i === safeIndex ? 'active' : i === leaving ? 'leave' : 'idle'}
            onLeft={() => setLeaving(null)}
          />
        ))}
      </div>
      {list.length > 1 && (
        <div className="showcase-nav">
          <button type="button" onClick={() => go(-1)} aria-label={id ? 'Proyek sebelumnya' : 'Previous project'} className="showcase-arrow showcase-arrow--prev"><FaChevronLeft aria-hidden="true" /></button>
          <p className="showcase-count" aria-hidden="true">{safeIndex + 1} / {list.length}</p>
          <button type="button" onClick={() => go(1)} aria-label={id ? 'Proyek berikutnya' : 'Next project'} className="showcase-arrow showcase-arrow--next"><FaChevronRight aria-hidden="true" /></button>
        </div>
      )}
    </section>
  )
}
