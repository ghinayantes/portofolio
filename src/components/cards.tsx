import { projectSlug, type Award, type Certificate, type Entry, type NewsItem, type Note, type Project } from '../data/content'
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
        <div className="flex flex-wrap gap-1.5">{p.tags.map((g) => <span key={localized(g, lang)} className={`rounded-md border border-brand/25 bg-brand/10 ${interactive ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-[13px]'}`}>{localized(g, lang)}</span>)}</div>
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

/** Award list row (reference-style): date, title, category + organizer. Bullets show inline on mobile; on md+ they live in the sticky preview. */
export function AwardRow({ a, selected, onSelect }: { a: Award; selected: boolean; onSelect: () => void }) {
  const { lang } = useSettings()
  const bullets = a.bullets && a.bullets.length > 0 ? a.bullets : [a.desc]
  return (
    <article
      tabIndex={0}
      data-active={selected}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      className="group cursor-default border-t border-line px-1 py-5 transition-colors last:border-b data-[active=true]:bg-fg/5"
    >
      <p className="text-[13px] font-semibold text-fg2">{a.date ? localized(a.date, lang) : localized(a.meta, lang)}</p>
      <h3 className="mt-1 font-display text-xl font-semibold transition-colors group-data-[active=true]:text-brand">{localized(a.title, lang)}</h3>
      <p className="mt-1.5 flex flex-wrap items-center gap-2">
        {a.category && <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-xs font-semibold text-fg2">{localized(a.category, lang)}</span>}
        {a.org && <span className="text-sm text-fg2">{localized(a.org, lang)}</span>}
      </p>
      <ul className="mt-3 space-y-1.5 md:hidden">
        {bullets.map((b) => <li key={localized(b, lang)} className="flex gap-2 text-[15px] text-fg2"><span aria-hidden="true" className="text-brand">•</span>{localized(b, lang)}</li>)}
      </ul>
    </article>
  )
}

/** Sticky hover preview for the award list (desktop). Gradient header with big year, full detail below. */
export function AwardPreview({ a, i }: { a: Award | null; i: number }) {
  const { lang } = useSettings()
  if (!a) {
    return <div className="card p-6 text-[15px] text-fg2">{lang === 'id' ? 'Arahkan kursor ke penghargaan untuk melihat detail.' : 'Hover an award to see details.'}</div>
  }
  const bullets = a.bullets && a.bullets.length > 0 ? a.bullets : [a.desc]
  return (
    <div key={localized(a.title, 'en')} className="award-preview-swap card overflow-hidden !p-0">
      <div className={`thumb t${i % 3} relative flex min-h-36 flex-col justify-end overflow-hidden p-5 text-white`}>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1 font-display text-7xl font-extrabold text-white/25">{localized(a.meta, lang)}</span>
        <p className="relative text-[13px] font-semibold text-white/80">{a.date ? localized(a.date, lang) : localized(a.meta, lang)}</p>
        <h3 className="relative mt-1 font-display text-2xl font-bold tracking-tight">{localized(a.title, lang)}</h3>
      </div>
      <div className="p-6">
        <p className="flex flex-wrap items-center gap-2">
        {a.category && <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-xs font-semibold text-fg2">{localized(a.category, lang)}</span>}
        {a.org && <span className="text-sm font-semibold text-brand">{localized(a.org, lang)}</span>}
        </p>
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {bullets.map((b) => <li key={localized(b, lang)} className="flex gap-2 text-[15px] text-fg2"><span aria-hidden="true" className="text-brand">•</span>{localized(b, lang)}</li>)}
        </ul>
      </div>
    </div>
  )
}

/** Certificate image card: certificate image (or gradient + medal fallback) above, issuer + title + desc below. */
export function Ticket({ n, i }: { n: Certificate; i: number }) {
  const { lang } = useSettings()
  const [issuer, year] = localized(n.meta, lang).split(', ')
  return (
    <div className="card overflow-hidden !p-0">
      {n.image ? (
        <div className="cert-img aspect-[16/10] overflow-hidden">
          <img src={n.image} alt={localized(n.title, lang)} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
        </div>
      ) : (
        <div className={`thumb t${i % 3} aspect-[16/10]`} aria-hidden="true">
          <div className="win"><span /><span /><span /></div>
          <div className="ln"><i /><i /><i /></div>
        </div>
      )}
      <div className="p-4">
        <p className="text-xs font-semibold text-fg2">{issuer}{year ? ` · ${year}` : ''}</p>
        <h3 className="mt-1 font-display text-base font-semibold">{localized(n.title, lang)}</h3>
        <p className="mt-1 text-[13px] text-fg2">{localized(n.desc, lang)}</p>
      </div>
    </div>
  )
}

/** Editorial news list card: image left, tag + title + org + desc right. */
export const FeedItem = ({ n, i }: { n: NewsItem; i: number }) => {
  const { lang } = useSettings()
  return (
    <article className="card overflow-hidden !p-0 sm:grid sm:grid-cols-[2fr_3fr]">
      <div className="news-img relative min-h-44 overflow-hidden sm:min-h-full">
        {n.image ? (
          <img src={n.image} alt={localized(n.title, lang)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className={`thumb t${i % 3} absolute inset-0`} aria-hidden="true" />
        )}
      </div>
      <div className="p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-2">
          {n.tag && <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-xs font-semibold text-brand">{localized(n.tag, lang)}</span>}
          <span className="text-[13px] font-semibold text-fg2">{localized(n.meta, lang)}</span>
        </p>
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{localized(n.title, lang)}</h3>
        {n.org && <p className="mt-0.5 text-sm italic text-fg2">{localized(n.org, lang)}</p>}
        <p className="mt-2 text-[15px] leading-relaxed text-fg2">{localized(n.desc, lang)}</p>
      </div>
    </article>
  )
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
