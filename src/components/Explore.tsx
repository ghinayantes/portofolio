'use client'

import { LocLink as Link } from './LocLink'
import { NAV } from '../data/nav'
import { useSettings } from '../context/Settings'

const row = 'flex items-baseline justify-between gap-4 border-t border-line px-1 py-3 text-[15px] font-semibold transition-all hover:pl-2.5 hover:text-brand'

/** Home "bento": each group gets a different component treatment. */
export default function Explore() {
  const { t } = useSettings()
  const [prof, exp, art, oth] = NAV
  const h3 = 'mb-2.5 font-display text-lg font-semibold'
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
      <div className="card p-6 lg:row-span-2">
        <h3 className={h3}>{t(prof.title)}</h3>
        {prof.items.map((x) => (
          <Link key={x.key} to={'/' + x.key} className={row}><span>{t(x.title)}</span><small className="text-right text-[13.5px] font-normal text-fg2">{t(x.desc)}</small></Link>
        ))}
      </div>
      <div className="card p-6">
        <h3 className={h3}>{t(exp.title)}</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
          {exp.items.map((x) => (
            <Link key={x.key} to={'/' + x.key} className="flex flex-col gap-0.5 rounded-2xl border border-line bg-fg/5 p-3.5 text-[15px] font-semibold transition hover:border-brand/50 hover:bg-brand/10">
              {t(x.title)}<small className="text-[13px] font-normal text-fg2">{t(x.desc)}</small>
            </Link>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <h3 className={h3}>{t(art.title)}</h3>
        <div className="grid grid-cols-2 gap-3">
          {art.items.map((x, i) => (
            <Link key={x.key} to={'/' + x.key} className={`thumb t${i} flex min-h-30 flex-col justify-end !p-3.5 font-bold text-white transition hover:-translate-y-0.5`}>
              {t(x.title)}<small className="text-[12.5px] font-normal text-white/80">{t(x.desc)}</small>
            </Link>
          ))}
        </div>
      </div>
      <div className="card p-6 lg:col-span-2">
        <h3 className={h3}>{t(oth.title)}</h3>
        <div className="flex flex-wrap gap-2.5">
          {oth.items.map((x) => <Link key={x.key} to={'/' + x.key} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-brand hover:bg-brand hover:text-ink">{t(x.title)}</Link>)}
        </div>
      </div>
    </div>
  )
}
