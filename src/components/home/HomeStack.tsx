'use client'

import { useRef } from 'react'
import { TECH_TILES } from '../cards'
import { skills } from '../../data/content'
import { localized } from '../../data/nav'
import { useSettings } from '../../context/Settings'
import { Count, Head, MOTION_QUERY, Scrub, passProgress, useMedia, useScrollFrame } from './shared'

/** Home "Stack": two rows of tech logos that slide in opposite directions with the scroll, plus per-group counts. */
export function HomeStack() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const rows = useRef<HTMLDivElement>(null)
  const motion = useMedia(MOTION_QUERY)
  const groups = skills.slice(0, 3)
  const half = Math.ceil(TECH_TILES.length / 2)
  const lines = [TECH_TILES.slice(0, half), TECH_TILES.slice(half)]

  useScrollFrame(() => {
    if (rows.current) rows.current.style.setProperty('--s', passProgress(rows.current).toFixed(3))
  }, motion)

  return (
    <section className="home-section home-lines" aria-labelledby="home-stack-title">
      <Head n="06" label={id ? 'Teknologi' : 'Stack'} title={id ? 'Alat yang saya gunakan' : 'Tools I build with'} titleId="home-stack-title" to="/skills" cta={id ? 'Semua keahlian' : 'All skills'} />
      <Scrub>
        <dl className="home-figures home-figures--row">
          {groups.map((g) => (
            <div key={localized(g.title, lang)}>
              <dt>{localized(g.title, lang)}</dt>
              <dd><Count n={g.items.length} /></dd>
            </div>
          ))}
        </dl>
      </Scrub>
      <div ref={rows} className="home-rows">
        {lines.map((line, k) => (
          <ul key={k} className={k % 2 ? 'home-rows__row home-rows__row--back' : 'home-rows__row'}>
            {[0, 1, 2].flatMap((copy) => line.map((t) => (
              <li key={`${copy}-${t.label}`} className="home-rows__pill" aria-hidden={copy > 0 || undefined}>{t.icon}{t.label}</li>
            )))}
          </ul>
        ))}
      </div>
    </section>
  )
}
