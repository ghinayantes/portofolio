'use client'

import { LocLink as Link } from './LocLink'
import { NAV } from '../data/nav'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'

export default function Footer() {
  const { t, lang } = useSettings()
  return (
    <footer className="relative z-10 border-t border-line py-14 text-sm text-fg2">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-20">
        <div className="grid grid-cols-2 gap-7 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div><b className="mb-3 block font-display text-2xl font-normal text-fg">{SITE.name}</b>{t(SITE.role)}<br />Bandung, Indonesia<br /><a href={`mailto:${SITE.email}`} className="break-all hover:text-fg">{SITE.email}</a><br /><a href={SITE.cv} download className="hover:text-fg">{lang === 'id' ? 'Unduh CV' : 'Download CV'}</a></div>
          {NAV.map((g, i) => (
            <div key={i}>
              <b className="mono-label mb-3 block !text-[11px] font-normal">{t(g.title)}</b>
              {g.items.map((x) => <Link key={x.key} to={'/' + x.key} className="block py-0.5 transition-colors hover:text-fg">{t(x.title)}</Link>)}
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-line pt-6 font-mono text-xs">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  )
}
