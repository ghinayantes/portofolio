import type { Entry, Note, Project } from '../data/content'
import type { PointerEvent } from 'react'
import { localized, type Localized } from '../data/nav'
import { useSettings } from '../context/Settings'
import { getProjectCardAction, getProjectCardLeanForPointer } from '../lib/project-card-motion'

export function ProjectCard({ p, i, featured, interactive = false, tilt = true }: { p: Project; i: number; featured?: boolean; interactive?: boolean; tilt?: boolean }) {
  const { lang } = useSettings()
  const action = interactive
    ? getProjectCardAction(p.links.map((link) => localized(link, lang)), p.linkHrefs)
    : null

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
        <h3 className={`font-display ${interactive ? 'text-lg' : 'text-xl'} font-semibold`}>{localized(p.title, lang)}</h3>
        <p className={interactive ? 'text-sm text-fg2' : 'text-[15px] text-fg2'}>{localized(p.desc, lang)}</p>
        <div className="flex flex-wrap gap-1.5">{p.tags.map((g) => <span key={localized(g, lang)} className={`rounded-md border border-line bg-muted ${interactive ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-[13px]'}`}>{localized(g, lang)}</span>)}</div>
        {p.links.length > 0 && <div className="mt-auto flex gap-4 pt-1.5">{p.links.map((link, index) => <a key={localized(link, lang)} href={p.linkHrefs?.[index] || '#'} className="text-sm font-semibold text-brand">{localized(link, lang)}</a>)}</div>}
      </div>
    </article>
  )

  if (!interactive) return card

  return (
    <div
      className={`project-card-hitbox ${featured ? 'project-card-hitbox--featured md:col-span-2' : ''} ${tilt ? '' : 'project-card-hitbox--no-tilt'}`}
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

export const Medal = ({ n, i }: { n: Note; i: number }) => {
  const { lang } = useSettings()
  return <div className="card p-6">
    <div className={`mdl m${i % 3}`} />
    <small className="text-[13px] text-fg2">{localized(n.meta, lang)}</small>
    <b className="my-1 block font-display text-lg font-semibold">{localized(n.title, lang)}</b>
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
  return <a href="#" className="group grid gap-1.5 border-t border-line py-6 last:border-b sm:grid-cols-[120px_1fr] sm:gap-6">
    <span className="pt-1 text-sm text-fg2">{localized(n.meta, lang)}</span>
    <div><h3 className="font-display text-lg font-semibold group-hover:text-brand">{localized(n.title, lang)}</h3><p className="mt-1.5 text-fg2">{localized(n.desc, lang)}</p></div>
  </a>
}

export const Timeline = ({ items }: { items: Entry[] }) => {
  const { lang } = useSettings()
  return <ul className="tl">
    {items.map((e) => (
      <li key={localized(e.title, lang) + localized(e.when, lang)} className={e.current ? 'cur' : ''}>
        <h3 className="font-display text-lg font-semibold">{localized(e.title, lang)}</h3>
        <span className="text-sm text-fg2">{localized(e.when, lang)}</span>
        <p className="mt-1 text-fg2">{localized(e.desc, lang)}</p>
      </li>
    ))}
  </ul>
}

export const Empty = ({ text }: { text: Localized }) => {
  const { lang } = useSettings()
  return <div className="max-w-3xl rounded-2xl border border-dashed border-line p-7 text-fg2">{localized(text, lang)}</div>
}
