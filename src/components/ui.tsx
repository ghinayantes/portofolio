'use client'

import type { ReactNode } from 'react'
import { LocLink as Link } from './LocLink'
import { NAV, type NavItem } from '../data/nav'
import { useSettings } from '../context/Settings'

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-14">
    <h2 className="mb-5 font-display text-[clamp(1.4rem,3vw,1.75rem)] font-extrabold tracking-tight">{title}</h2>
    {children}
  </section>
)

export function PageShell({ item, gi, children }: { item: NavItem; gi: number; children: ReactNode }) {
  const { t, lang } = useSettings()
  return (
    <div>
      <p className="mb-4 text-sm text-fg2"><Link to="/" className="hover:text-brand">{lang === 'id' ? 'Beranda' : 'Home'}</Link> / {t(NAV[gi].title)} / {t(item.title)}</p>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="grad-text font-display text-[clamp(2.5rem,9vw,6.5rem)] font-extrabold leading-[1.05] tracking-[-.04em]">{t(item.title)}</h1>
        <i className="gl" />
        <p className="mx-auto mt-5 max-w-[58ch] text-lg text-fg2">{t(item.desc)}</p>
      </div>
      <div className="mt-14">{children}</div>
    </div>
  )
}
