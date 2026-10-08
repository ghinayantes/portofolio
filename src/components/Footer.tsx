'use client'

import { LocLink as Link } from './LocLink'
import { NAV } from '../data/nav'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'

export default function Footer() {
  const { t, lang } = useSettings()
  return (
    <footer className="relative z-10 border-t border-line py-12 text-sm text-fg2">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-20">
        <div className="grid grid-cols-2 gap-7 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div><b className="mb-2.5 block font-display text-[15px] text-fg">{SITE.name}</b>{t(SITE.role)}<br />Bandung, Indonesia<br /><a href={`mailto:${SITE.email}`} className="break-all hover:text-brand">{SITE.email}</a><br /><a href={SITE.cv} download className="hover:text-brand">{lang === 'id' ? 'Unduh CV' : 'Download CV'}</a></div>
          {NAV.map((g, i) => (
            <div key={i}>
              <b className="mb-2.5 block font-display text-[15px] text-fg">{t(g.title)}</b>
              {g.items.map((x) => <Link key={x.key} to={'/' + x.key} className="block py-0.5 hover:text-brand">{t(x.title)}</Link>)}
            </div>
          ))}
        </div>
        <p className="mt-8 border-t border-line pt-5">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  )
}
