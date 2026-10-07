'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { LocLink as Link } from './LocLink'
import { localized, NAV, type NavGroup, type NavItem } from '../data/nav'
import { useSettings } from '../context/Settings'

/** Observes the whole Explore grid once, then flips data-in so items stagger in. Mirrors the cards.tsx reveal pattern.
    Once the entrance finishes, flips data-done so the animation is stripped — theme toggles must never replay it. */
function useExploreReveal(itemCount: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setShown(true)
      setDone(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!shown || done) return
    // longest stagger delay + entrance duration, then park on the final state with no animation to replay
    const t = window.setTimeout(() => setDone(true), itemCount * 70 + 700)
    return () => window.clearTimeout(t)
  }, [shown, done, itemCount])
  return { ref, shown, done }
}

function GroupHeader({ group }: { group: NavGroup }) {
  const { t } = useSettings()
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <h3 className="font-display text-lg font-semibold tracking-tight">{t(group.title)}</h3>
      <span className="ml-auto explore-static rounded-full border border-line bg-fg/5 px-2.5 py-0.5 text-xs font-bold tabular-nums text-fg2">{group.items.length}</span>
    </div>
  )
}

/** Typographic thumb: first letter of the title. No icon glyphs. */
function Initial({ item }: { item: NavItem }) {
  const { lang } = useSettings()
  const letter = localized(item.title, lang).trim().charAt(0).toUpperCase()
  return (
    <span aria-hidden="true" className="explore-static grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-fg/5 font-display text-base font-bold text-brand">
      {letter}
    </span>
  )
}

function AchievementRow({ item, d }: { item: NavItem; d: number }) {
  const { t } = useSettings()
  return (
    <Link
      to={'/' + item.key}
      style={{ '--d': d } as CSSProperties}
      className="explore-item group flex min-h-11 items-center gap-3.5 border-t border-line px-1 py-3 hover:pl-2.5 motion-safe:hover:-translate-y-px"
    >
      <Initial item={item} />
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold transition-colors duration-200 group-hover:text-brand">{t(item.title)}</span>
        <small className="block truncate text-[13px] font-normal text-fg2">{t(item.desc)}</small>
      </span>
    </Link>
  )
}

/** Home "bento": achievement-style rows inside the existing 4-card grid. */
export default function Explore() {
  const { t } = useSettings()
  const [prof, exp, art, oth] = NAV
  const { ref, shown, done } = useExploreReveal(prof.items.length + exp.items.length + art.items.length + oth.items.length)
  return (
    <div ref={ref} data-in={shown} data-done={done} className="explore grid gap-5 lg:grid-cols-[1fr_1.5fr]">
      <div className="card p-6 lg:row-span-2">
        <GroupHeader group={prof} />
        <nav aria-label={t(prof.title)}>
          {prof.items.map((x, i) => <AchievementRow key={x.key} item={x} d={i} />)}
        </nav>
      </div>
      <div className="card p-6">
        <GroupHeader group={exp} />
        <nav aria-label={t(exp.title)}>
          {exp.items.map((x, i) => <AchievementRow key={x.key} item={x} d={prof.items.length + i} />)}
        </nav>
      </div>
      <div className="card p-6">
        <GroupHeader group={art} />
        <div className="grid grid-cols-2 gap-3">
          {art.items.map((x, i) => (
            <Link
              key={x.key}
              to={'/' + x.key}
              style={{ '--d': prof.items.length + exp.items.length + i } as CSSProperties}
              className={`thumb t${i} explore-item group flex min-h-30 flex-col justify-end overflow-hidden !rounded-2xl !p-3.5 font-bold text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-safe:hover:-translate-y-0.5`}
            >
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
          {oth.items.map((x, i) => (
            <Link
              key={x.key}
              to={'/' + x.key}
              style={{ '--d': prof.items.length + exp.items.length + art.items.length + i } as CSSProperties}
              className="explore-item group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:-translate-y-px hover:border-brand hover:bg-brand hover:text-ink hover:shadow-[var(--shadow-soft)] motion-safe:hover:-translate-y-px"
            >
              {t(x.title)}
              <span className="sr-only"> — {t(x.desc)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
