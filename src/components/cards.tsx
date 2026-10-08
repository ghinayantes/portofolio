import { projectSlug, type Award, type Certificate, type Entry, type NewsItem, type Note, type Project } from '../data/content'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { LocLink } from './LocLink'
import { localized, type Localized } from '../data/nav'
import { useSettings } from '../context/Settings'
import { getProjectCardAction, getProjectCardLeanForPointer } from '../lib/project-card-motion'
import { getAvailableProjectLinks } from '../lib/project-links'

export function ProjectCard({ p, i, featured, interactive = false, tilt = true, reveal = true }: { p: Project; i: number; featured?: boolean; interactive?: boolean; tilt?: boolean; reveal?: boolean }) {
  const { lang } = useSettings()
  const revealRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(!reveal)
  const action = interactive
    ? getProjectCardAction(p.links.map((link) => localized(link, lang)), p.linkHrefs)
    : null
  const beacon = action && action.href.trim() !== '' && action.href !== '#' ? action : null
  const availableLinks = getAvailableProjectLinks(
    p.links.map((link) => localized(link, lang)),
    p.linkHrefs,
  )

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
        {availableLinks.length > 0 && <div className="mt-auto flex gap-4 pt-1.5">{availableLinks.map(({ label, href }) => <a key={label} href={href} className="text-sm font-semibold text-brand">{label}</a>)}</div>}
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
      {beacon && (
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
            href={beacon.href}
            target="_blank"
            rel="noreferrer"
            aria-label={lang === 'id'
              ? beacon.label === 'live' ? `Lihat situs ${localized(p.title, lang)}` : `Lihat ${localized(p.title, lang)} di GitHub`
              : beacon.label === 'live' ? `View ${localized(p.title, lang)} live site` : `See ${localized(p.title, lang)} on GitHub`}
          >
            {lang === 'id'
              ? beacon.label === 'live' ? 'Lihat Situs' : 'Lihat di GitHub'
              : beacon.label === 'live' ? 'View Live Site' : 'See on GitHub'}
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

/** Official brand glyph (single-color path). */
function TechGlyph({ d, color }: { d: string; color?: string }) {
  return (
    <span aria-hidden="true" style={color ? { color } : undefined} className="grid place-items-center">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6"><path d={d} /></svg>
    </span>
  )
}

/** Multi-color Java glyph (devicon, original fills kept). */
function JavaGlyph() {
  return (
    <span aria-hidden="true" className="grid place-items-center">
      <svg viewBox="0 0 128 128" className="size-6">
        <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z" />
        <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z" />
        <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z" />
        <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z" />
        <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z" />
      </svg>
    </span>
  )
}

const TECH_TILES: { label: string; icon: ReactNode }[] = [
  { label: 'Python', icon: <TechGlyph color="#3776AB" d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" /> },
  { label: 'JavaScript', icon: <TechGlyph color="#F7DF1E" d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" /> },
  { label: 'TypeScript', icon: <TechGlyph color="#3178C6" d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" /> },
  { label: 'Java', icon: <JavaGlyph /> },
  { label: 'SQL', icon: <TechGlyph color="#4479A1" d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z" /> },
  { label: 'HTML', icon: <TechGlyph color="#E34F26" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" /> },
  { label: 'CSS', icon: <TechGlyph color="#1572B6" d="M0 0v20.16A3.84 3.84 0 0 0 3.84 24h16.32A3.84 3.84 0 0 0 24 20.16V3.84A3.84 3.84 0 0 0 20.16 0Zm14.256 13.08c1.56 0 2.28 1.08 2.304 2.64h-1.608c.024-.288-.048-.6-.144-.84-.096-.192-.288-.264-.552-.264-.456 0-.696.264-.696.84-.024.576.288.888.768 1.08.72.288 1.608.744 1.92 1.296q.432.648.432 1.656c0 1.608-.912 2.592-2.496 2.592-1.656 0-2.4-1.032-2.424-2.688h1.68c0 .792.264 1.176.792 1.176.264 0 .456-.072.552-.24.192-.312.24-1.176-.048-1.512-.312-.408-.912-.6-1.32-.816q-.828-.396-1.224-.936c-.24-.36-.36-.888-.36-1.536 0-1.44.936-2.472 2.424-2.448m5.4 0c1.584 0 2.304 1.08 2.328 2.64h-1.608c0-.288-.048-.6-.168-.84-.096-.192-.264-.264-.528-.264-.48 0-.72.264-.72.84s.288.888.792 1.08c.696.288 1.608.744 1.92 1.296.264.432.408.984.408 1.656.024 1.608-.888 2.592-2.472 2.592-1.68 0-2.424-1.056-2.448-2.688h1.68c0 .744.264 1.176.792 1.176.264 0 .456-.072.552-.24.216-.312.264-1.176-.048-1.512-.288-.408-.888-.6-1.32-.816-.552-.264-.96-.576-1.2-.936s-.36-.888-.36-1.536c-.024-1.44.912-2.472 2.4-2.448m-11.031.018c.711-.006 1.419.198 1.839.63.432.432.672 1.128.648 1.992H9.336c.024-.456-.096-.792-.432-.96-.312-.144-.768-.048-.888.24-.12.264-.192.576-.168.864v3.504c0 .744.264 1.128.768 1.128a.65.65 0 0 0 .552-.264c.168-.24.192-.552.168-.84h1.776c.096 1.632-.984 2.712-2.568 2.688-1.536 0-2.496-.864-2.472-2.472v-4.032c0-.816.24-1.44.696-1.848.432-.408 1.146-.624 1.857-.63" /> },
  { label: 'React', icon: <TechGlyph color="#61DAFB" d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" /> },
  { label: 'Next.js', icon: <TechGlyph d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" /> },
  { label: 'Tailwind', icon: <TechGlyph color="#06B6D4" d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" /> },
  { label: 'Git', icon: <TechGlyph color="#F05032" d="M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z" /> },
  { label: 'Figma', icon: <TechGlyph color="#F24E1E" d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" /> },
]

/** Infinite tech logo ring (marquee): duplicated track, pauses on hover, off for reduced motion. */
export function SkillMarquee() {
  return (
    <div className="marquee mt-10" role="presentation">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="marquee-group">
            {TECH_TILES.map((t) => (
              <span key={t.label} className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-2.5 font-display text-[15px] font-semibold">
                {t.icon}
                {t.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
