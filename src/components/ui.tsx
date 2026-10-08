'use client'

import type { ReactNode } from 'react'
import { LocLink as Link } from './LocLink'
import { NAV, type NavItem } from '../data/nav'
import { useSettings } from '../context/Settings'

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-14">
    <h2 className="shine mb-5 font-display text-[clamp(1.4rem,3vw,1.75rem)] font-extrabold tracking-tight">{title}</h2>
    {children}
  </section>
)

export function PageShell({ item, gi, children, compact, stats }: { item: NavItem; gi: number; children: ReactNode; compact?: boolean; stats?: ReactNode }) {
  const { t, lang } = useSettings()
  if (compact) {
    return (
      <div>
        <p className="mb-4 text-sm text-fg2"><Link to="/" className="hover:text-brand">{lang === 'id' ? 'Beranda' : 'Home'}</Link> / {t(NAV[gi].title)} / {t(item.title)}</p>
        <div className="project-page-head">
          <h1 className="project-page-title shine pb-1">{t(item.title)}</h1>
          <p className="project-page-desc">{t(item.desc)}</p>
          {stats ? <div className="project-stats">{stats}</div> : null}
        </div>
        <div>{children}</div>
      </div>
    )
  }
  return (
    <div>
      <p className="mb-4 text-sm text-fg2"><Link to="/" className="hover:text-brand">{lang === 'id' ? 'Beranda' : 'Home'}</Link> / {t(NAV[gi].title)} / {t(item.title)}</p>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="shine pb-1 font-display text-[clamp(2.5rem,9vw,6.5rem)] font-extrabold leading-[1.05] tracking-[-.04em]">{t(item.title)}</h1>
        <i className="gl" />
        <p className="mx-auto mt-5 max-w-[58ch] text-lg text-fg2">{t(item.desc)}</p>
      </div>
      <div className="mt-14">{children}</div>
    </div>
  )
}
