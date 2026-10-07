'use client'

import { LocLink as Link } from './LocLink'
import { NAV, type NavGroup } from '../data/nav'
import { useSettings } from '../context/Settings'

function GroupHeader({ group }: { group: NavGroup }) {
  const { t } = useSettings()
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <h3 className="font-display text-lg font-semibold tracking-tight">{t(group.title)}</h3>
      <span className="ml-auto rounded-full border border-line bg-fg/5 px-2.5 py-0.5 text-xs font-bold tabular-nums text-fg2">{group.items.length}</span>
    </div>
  )
}

/** Home "bento": each group gets a different component treatment. */
export default function Explore() {
  const { t } = useSettings()
  const [prof, exp, art, oth] = NAV
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
      <div className="card group/main p-6 lg:row-span-2">
        <GroupHeader group={prof} />
        <nav aria-label={t(prof.title)}>
          {prof.items.map((x) => (
            <Link key={x.key} to={'/' + x.key} className="group flex min-h-11 items-center justify-between gap-4 border-t border-line px-1 py-3 text-[15px] font-semibold transition-all duration-200 hover:pl-2.5 hover:text-brand motion-safe:hover:-translate-y-px">
              <span className="min-w-0">
                <span className="block truncate">{t(x.title)}</span>
                <small className="block truncate text-[13px] font-normal text-fg2">{t(x.desc)}</small>
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="card p-6">
        <GroupHeader group={exp} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
          {exp.items.map((x) => (
            <Link key={x.key} to={'/' + x.key} className="group relative flex min-h-11 flex-col gap-0.5 overflow-hidden rounded-2xl border border-line bg-fg/5 p-3.5 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-brand/10 hover:shadow-[var(--shadow-soft)] motion-safe:hover:-translate-y-0.5">
              <span className="line-clamp-1">{t(x.title)}</span>
              <small className="line-clamp-2 text-[13px] font-normal leading-snug text-fg2">{t(x.desc)}</small>
            </Link>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <GroupHeader group={art} />
        <div className="grid grid-cols-2 gap-3">
          {art.items.map((x, i) => (
            <Link key={x.key} to={'/' + x.key} className={`thumb t${i} group flex min-h-30 flex-col justify-end overflow-hidden !rounded-2xl !p-3.5 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-safe:hover:-translate-y-0.5`}>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10 opacity-80 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
              <span className="relative">{t(x.title)}</span>
              <small className="relative line-clamp-1 text-[12.5px] font-normal text-white/80">{t(x.desc)}</small>
            </Link>
          ))}
        </div>
      </div>
      <div className="card p-6 lg:col-span-2">
        <GroupHeader group={oth} />
        <div className="flex flex-wrap gap-2.5">
          {oth.items.map((x) => <Link key={x.key} to={'/' + x.key} className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:border-brand hover:bg-brand hover:text-ink hover:shadow-[var(--shadow-soft)] motion-safe:hover:-translate-y-px">{t(x.title)}<span className="sr-only"> — {t(x.desc)}</span></Link>)}
        </div>
      </div>
    </div>
  )
}
