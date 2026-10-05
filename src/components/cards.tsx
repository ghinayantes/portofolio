import type { Entry, Note, Project } from '../data/content'
import { localized, type Localized } from '../data/nav'
import { useSettings } from '../context/Settings'

export function ProjectCard({ p, i, featured }: { p: Project; i: number; featured?: boolean }) {
  const { lang } = useSettings()
  return (
    <article className={`card flex flex-col ${featured ? 'md:col-span-2 md:flex-row' : ''}`}>
      <div className={`thumb t${i % 3} ${featured ? 'min-h-48 md:min-h-[280px] md:flex-[1.2]' : 'aspect-[16/10]'}`}>
        <div className="win"><span /><span /><span /></div>
        <div className="ln"><i /><i /><i /></div>
      </div>
      <div className={`flex flex-1 flex-col gap-2.5 p-5 ${featured ? 'md:justify-center md:p-9' : ''}`}>
        {p.status && <span className="text-[13px] font-medium" style={{ color: p.wip ? 'var(--accent)' : 'var(--ok)' }}>{localized(p.status, lang)}</span>}
        <h3 className="font-display text-xl font-semibold">{localized(p.title, lang)}</h3>
        <p className="text-[15px] text-fg2">{localized(p.desc, lang)}</p>
        <div className="flex flex-wrap gap-1.5">{p.tags.map((g) => <span key={localized(g, lang)} className="rounded-md border border-line bg-muted px-3 py-1 text-[13px]">{localized(g, lang)}</span>)}</div>
        {p.links.length > 0 && <div className="mt-auto flex gap-4 pt-1.5">{p.links.map((l) => <a key={localized(l, lang)} href="#" className="text-sm font-semibold text-brand">{localized(l, lang)}</a>)}</div>}
      </div>
    </article>
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
