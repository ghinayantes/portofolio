import type { Entry, Note, Project } from '../data/content'

export function ProjectCard({ p, i, featured }: { p: Project; i: number; featured?: boolean }) {
  return (
    <article className={`card flex flex-col ${featured ? 'md:col-span-2 md:flex-row' : ''}`}>
      <div className={`thumb t${i % 3} ${featured ? 'min-h-48 md:min-h-[280px] md:flex-[1.2]' : 'aspect-[16/10]'}`}>
        <div className="win"><span /><span /><span /></div>
        <div className="ln"><i /><i /><i /></div>
      </div>
      <div className={`flex flex-1 flex-col gap-2.5 p-5 ${featured ? 'md:justify-center md:p-9' : ''}`}>
        {p.status && <span className="text-[13px] font-medium" style={{ color: p.wip ? 'var(--accent)' : 'var(--ok)' }}>{p.status}</span>}
        <h3 className="font-display text-xl font-semibold">{p.title}</h3>
        <p className="text-[15px] text-fg2">{p.desc}</p>
        <div className="flex flex-wrap gap-1.5">{p.tags.map((g) => <span key={g} className="rounded-md border border-line bg-muted px-3 py-1 text-[13px]">{g}</span>)}</div>
        {p.links.length > 0 && <div className="mt-auto flex gap-4 pt-1.5">{p.links.map((l) => <a key={l} href="#" className="text-sm font-semibold text-brand">{l}</a>)}</div>}
      </div>
    </article>
  )
}

export const Medal = ({ n, i }: { n: Note; i: number }) => (
  <div className="card p-6">
    <div className={`mdl m${i % 3}`} />
    <small className="text-[13px] text-fg2">{n.meta}</small>
    <b className="my-1 block font-display text-lg font-semibold">{n.title}</b>
    <p className="text-[15px] text-fg2">{n.desc}</p>
  </div>
)

export function Ticket({ n }: { n: Note }) {
  const [issuer, year] = n.meta.split(', ')
  return (
    <div className="tk">
      <div className="stub"><b className="font-display text-3xl font-extrabold">{year}</b><small className="text-xs text-fg2">{issuer}</small></div>
      <div className="p-5"><h3 className="font-display text-lg font-semibold">{n.title}</h3><p className="mt-1.5 text-sm text-fg2">{n.desc}</p></div>
    </div>
  )
}

export const FeedItem = ({ n }: { n: Note }) => (
  <a href="#" className="group grid gap-1.5 border-t border-line py-6 last:border-b sm:grid-cols-[120px_1fr] sm:gap-6">
    <span className="pt-1 text-sm text-fg2">{n.meta}</span>
    <div><h3 className="font-display text-lg font-semibold group-hover:text-brand">{n.title}</h3><p className="mt-1.5 text-fg2">{n.desc}</p></div>
  </a>
)

export const Timeline = ({ items }: { items: Entry[] }) => (
  <ul className="tl">
    {items.map((e) => (
      <li key={e.title + e.when} className={e.current ? 'cur' : ''}>
        <h3 className="font-display text-lg font-semibold">{e.title}</h3>
        <span className="text-sm text-fg2">{e.when}</span>
        <p className="mt-1 text-fg2">{e.desc}</p>
      </li>
    ))}
  </ul>
)

export const Empty = ({ text }: { text: string }) => <div className="max-w-3xl rounded-2xl border border-dashed border-line p-7 text-fg2">{text}</div>
