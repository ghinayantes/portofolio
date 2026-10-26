'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { localized } from '../../data/nav'
import { SITE } from '../../data/site'
import { useSettings } from '../../context/Settings'
import { MOTION_QUERY, Scrub, clamp01, passProgress, useMedia, useScrollFrame } from './shared'

/** First four-digit year in a "when" label ("2022 – 2025" → "2022"), used as the oversized outline numeral. */
const firstYear = (when: string) => when.match(/\d{4}/)?.[0] ?? when

/**
 * Home "History": the story as a zig-zag across the full width.
 * Chapters alternate sides of a centre rail; the empty side carries the chapter year as an oversized outline numeral that drifts with the scroll.
 * The rail fills as the page scrolls and the chapter being read lights up while the others dim. With reduced motion everything is shown plainly.
 */
export function HomeHistory() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLElement>(null)
  const motion = useMedia(MOTION_QUERY)
  const [tab, setTab] = useState(0)
  const [active, setActive] = useState(0)
  const story = SITE.histories[Math.min(tab, SITE.histories.length - 1)]

  useScrollFrame(() => {
    if (!list.current) return
    const r = list.current.getBoundingClientRect()
    const line = innerHeight * 0.55
    if (fill.current) fill.current.style.transform = `scaleY(${clamp01((line - r.top) / r.height).toFixed(4)})`
    const steps = Array.from(list.current.querySelectorAll<HTMLElement>('.home-journey__step'))
    let k = 0
    steps.forEach((el, i) => {
      const b = el.getBoundingClientRect()
      if (b.top < line) k = i
      el.style.setProperty('--s', passProgress(el).toFixed(3))
    })
    setActive((prev) => (prev === k ? prev : k))
  }, motion)

  if (!story) return null
  return (
    <section className={`home-section home-journey${motion ? ' home-journey--on' : ''}`} aria-labelledby="home-story-title">
      <Scrub>
        <div className="home-journey__head">
          <div>
            <p className="home-eyebrow"><span aria-hidden="true">02</span>{id ? 'Perjalanan' : 'History'}</p>
            <h2 id="home-story-title" className="home-title">{localized(story.title, lang)}</h2>
            <p className="home-journey__lead">{localized(SITE.lead, lang)}</p>
          </div>
          {SITE.histories.length > 1 && (
            <div className="home-journey__tabs" role="group" aria-label={id ? 'Pilih linimasa' : 'Choose a timeline'}>
              {SITE.histories.map((h, i) => (
                <button key={i} type="button" aria-pressed={i === tab} onClick={() => setTab(i)}>{localized(h.label, lang)}</button>
              ))}
            </div>
          )}
        </div>
      </Scrub>

      <ol ref={list} className="home-journey__list">
        <li className="home-journey__rail" aria-hidden="true"><b ref={fill} /></li>
        {story.chapters.map((h, i) => {
          const when = localized(h.when, lang)
          return (
            <li key={`${tab}-${i}`} className={`home-journey__step${i % 2 ? ' home-journey__step--right' : ''}${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}>
              <span className="home-journey__node" aria-hidden="true" />
              <span className="home-journey__year" aria-hidden="true">{firstYear(when)}</span>
              <div className="home-journey__body">
                {h.photo && (
                  <figure className="home-journey__media">
                    <Image src={h.photo.src} alt={localized(h.photo.caption, lang)} fill sizes="(max-width: 767px) 90vw, 50vw" loading="lazy" decoding="async" />
                  </figure>
                )}
                <p className="home-journey__when"><span>{String(i + 1).padStart(2, '0')}</span>{when}</p>
                <h3>{localized(h.title, lang)}</h3>
                <p className="home-journey__text">{localized(h.text, lang)}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
