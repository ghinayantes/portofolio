import { projectSlug, type Entry, type Note, type Project } from '../data/content'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { LocLink } from './LocLink'
import { localized, type Localized } from '../data/nav'
import { useSettings } from '../context/Settings'
import { getProjectCardAction, getProjectCardLeanForPointer } from '../lib/project-card-motion'

export function ProjectCard({ p, i, featured, interactive = false, tilt = true, reveal = true }: { p: Project; i: number; featured?: boolean; interactive?: boolean; tilt?: boolean; reveal?: boolean }) {
  const { lang } = useSettings()
  const revealRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(!reveal)
  const action = interactive
    ? getProjectCardAction(p.links.map((link) => localized(link, lang)), p.linkHrefs)
    : null

  useEffect(() => {
    if (!interactive || !reveal) return
    const element = revealRef.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsRevealed(entry.isIntersecting)
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0.08 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [interactive, reveal])

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!tilt) return
    const lean = getProjectCardLeanForPointer(event.pointerType)
    if (!lean) return
    const { rotateX } = lean
    event.currentTarget.style.setProperty('--project-tilt-x', `${rotateX}deg`)
  }

  const resetPointerTilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--project-tilt-x', '0deg')
  }

  const card = (
    <article className={`card ${interactive ? 'project-card' : ''} flex flex-col ${featured ? 'md:flex-row' : ''}`}>
      <div className={`thumb t${i % 3} ${featured ? 'min-h-48 md:min-h-[280px] md:flex-[1.2]' : 'aspect-[16/10]'}`}>
        {p.image ? (
          <img src={p.image} alt={`${localized(p.title, lang)} project preview`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <div className="win"><span /><span /><span /></div>
            <div className="ln"><i /><i /><i /></div>
          </>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${interactive ? 'gap-2 p-4' : 'gap-2.5 p-5'} ${featured ? (interactive ? 'md:justify-center md:p-7' : 'md:justify-center md:p-9') : ''}`}>
        {p.status && <span className="text-[13px] font-medium" style={{ color: p.wip ? 'var(--accent)' : 'var(--ok)' }}>{localized(p.status, lang)}</span>}
        <h3 className={`font-display ${interactive ? 'text-lg' : 'text-xl'} font-semibold`}><LocLink to={`/project/${projectSlug(p)}`} className="hover:text-brand">{localized(p.title, lang)}</LocLink></h3>
        <p className={interactive ? 'text-sm text-fg2' : 'text-[15px] text-fg2'}>{localized(p.desc, lang)}</p>
        <div className="flex flex-wrap gap-1.5">{p.tags.map((g) => <span key={localized(g, lang)} className={`rounded-md border border-line bg-muted ${interactive ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-[13px]'}`}>{localized(g, lang)}</span>)}</div>
        {p.links.length > 0 && <div className="mt-auto flex gap-4 pt-1.5">{p.links.map((link, index) => <a key={localized(link, lang)} href={p.linkHrefs?.[index] || '#'} className="text-sm font-semibold text-brand">{localized(link, lang)}</a>)}</div>}
      </div>
    </article>
  )

  if (!interactive) return card

  return (
    <div
      ref={revealRef}
      className={`project-card-hitbox ${reveal ? `project-card-reveal ${isRevealed ? 'project-card-reveal--visible' : ''}` : ''} ${featured ? 'project-card-hitbox--featured md:col-span-2' : ''} ${tilt ? '' : 'project-card-hitbox--no-tilt'}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={resetPointerTilt}
    >
      <div className="project-card-stage">{card}</div>
      {action && (
        <div className="project-beacon">
          <div className="project-beacon__waves" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="project-beacon__ray project-beacon__ray--blur" aria-hidden="true" />
          <span className="project-beacon__ray" aria-hidden="true" />
          <span className="project-beacon__dot" aria-hidden="true" />
          <a
            className="project-beacon__link"
            href={action.href}
            target="_blank"
            rel="noreferrer"
            aria-label={lang === 'id'
              ? action.label === 'live' ? `Lihat situs ${localized(p.title, lang)}` : `Lihat ${localized(p.title, lang)} di GitHub`
              : action.label === 'live' ? `View ${localized(p.title, lang)} live site` : `See ${localized(p.title, lang)} on GitHub`}
          >
            {lang === 'id'
              ? action.label === 'live' ? 'Lihat Situs' : 'Lihat di GitHub'
              : action.label === 'live' ? 'View Live Site' : 'See on GitHub'}
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      )}
    </div>
  )
}

const RANKS = ['gold', 'silver', 'bronze'] as const

export const Medal = ({ n, i }: { n: Note; i: number }) => {
  const { lang } = useSettings()
  const rank = RANKS[i % RANKS.length]
  return <div className="card medal-card">
    <span className="medal-year">{localized(n.meta, lang)}</span>
    <div className={`mdl rank-${rank}`} />
    <b className="my-1 block font-display text-xl font-semibold">{localized(n.title, lang)}</b>
    <p className="text-[15px] text-fg2">{localized(n.desc, lang)}</p>
  </div>
}

export function Ticket({ n }: { n: Note }) {
  const { lang } = useSettings()
  const [issuer, year] = localized(n.meta, lang).split(', ')
  return (
    <div className="tk">
      <div className="stub"><b className="font-display text-3xl font-extrabold">{year}</b><small className="text-xs text-fg2">{issuer}</small></div>
      <div className="p-5"><h3 className="font-display text-lg font-semibold">{localized(n.title, lang)}</h3><p className="mt-1.5 text-sm text-fg2">{localized(n.desc, lang)}</p></div>
    </div>
  )
}

export const FeedItem = ({ n }: { n: Note }) => {
  const { lang } = useSettings()
  const [mon, ...rest] = localized(n.meta, lang).split(' ')
  return <article className="news-card">
    <div className="news-date"><b>{rest.join(' ')}</b><span>{mon}</span></div>
    <div><h3 className="font-display text-lg font-semibold">{localized(n.title, lang)}</h3><p className="mt-1.5 text-fg2">{localized(n.desc, lang)}</p></div>
  </article>
}

export const Timeline = ({ items }: { items: Entry[] }) => {
  const { lang } = useSettings()
  return <ul className="tl">
    {items.map((e) => (
      <li key={localized(e.title, lang) + localized(e.when, lang)} className={e.current ? 'cur' : ''}>
        <div className="tl-card">
          <span className="tl-year">{localized(e.when, lang)}</span>
          <h3 className="font-display text-lg font-semibold">{localized(e.title, lang)}</h3>
          <p className="mt-1 text-fg2">{localized(e.desc, lang)}</p>
        </div>
      </li>
    ))}
  </ul>
}

export const Empty = ({ text }: { text: Localized }) => {
  const { lang } = useSettings()
  return <div className="max-w-3xl rounded-2xl border border-dashed border-line p-7 text-fg2">{localized(text, lang)}</div>
}
