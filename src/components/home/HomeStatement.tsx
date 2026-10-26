'use client'

import { useRef } from 'react'
import { motto } from '../../data/content'
import { localized } from '../../data/nav'
import { SITE } from '../../data/site'
import { useSettings } from '../../context/Settings'
import { IoCodeSlashOutline, IoLayersOutline, IoSearchOutline } from 'react-icons/io5'
import type { IconType } from 'react-icons'
import { TALL_QUERY, clamp01, pinProgress, useMedia, useScrollFrame } from './shared'

/** The three parts of the statement as steps (same wording as SITE.statement), shown under it on the home page. */
const APPROACH: { icon: IconType; title: { en: string; id: string }; text: { en: string; id: string } }[] = [
  { icon: IoSearchOutline, title: { en: 'Analyze', id: 'Analisis' }, text: { en: 'Approaching problems analytically.', id: 'Menganalisis permasalahan.' } },
  { icon: IoLayersOutline, title: { en: 'Understand', id: 'Pahami' }, text: { en: 'Understanding how things work beneath the surface.', id: 'Memahami cara kerja suatu sistem secara mendalam.' } },
  { icon: IoCodeSlashOutline, title: { en: 'Build', id: 'Bangun' }, text: { en: 'Exploring different ways to build effective solutions.', id: 'Mengeksplorasi berbagai pendekatan untuk menemukan solusi yang efektif.' } },
]

/**
 * Home statement: a full-bleed dark block pinned to the screen.
 * The sentence lights up word by word as the page scrolls, then its three parts arrive as steps one after another, then the motto.
 */
export function HomeStatement() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLParagraphElement>(null)
  const steps = useRef<HTMLOListElement>(null)
  const foot = useRef<HTMLParagraphElement>(null)
  const pinned = useMedia(TALL_QUERY)
  const words = localized(SITE.statement, lang).split(' ')

  useScrollFrame(() => {
    if (!section.current || !stage.current || !text.current) return
    const p = pinProgress(section.current, stage.current)
    // 0 → 0.55: words light up; 0.55 → 0.85: steps arrive one by one; 0.85 → 1: motto.
    const spans = text.current.children
    const head = (p / 0.55) * (spans.length + 2)
    for (let i = 0; i < spans.length; i++) (spans[i] as HTMLElement).style.opacity = (0.18 + 0.82 * clamp01(head - i)).toFixed(3)
    if (steps.current) {
      Array.from(steps.current.children).forEach((el, i) => {
        const k = clamp01((p - 0.55 - i * 0.09) / 0.1)
        ;(el as HTMLElement).style.opacity = k.toFixed(3)
        ;(el as HTMLElement).style.transform = `translate3d(0, ${((1 - k) * 36).toFixed(1)}px, 0)`
      })
    }
    if (foot.current) {
      const k = clamp01((p - 0.85) / 0.1)
      foot.current.style.opacity = k.toFixed(3)
      foot.current.style.transform = `translate3d(0, ${((1 - k) * 24).toFixed(1)}px, 0)`
    }
  }, pinned)

  return (
    <section ref={section} className={`home-section home-say${pinned ? ' home-say--on' : ''}`} aria-label={id ? 'Tentang cara kerja saya' : 'How I work'}>
      <div ref={stage} className="home-say__stage">
        <p className="home-say__pill"><span aria-hidden="true">01</span>{id ? 'Pendekatan' : 'Approach'}</p>
        <p ref={text} className="home-say__text">
          {words.map((w, i) => <span key={i}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
        </p>
        <cite className="home-say__author">— Edsger W. Dijkstra</cite>
        <ol ref={steps} className="home-say__steps">
          {APPROACH.map(({ icon: Icon, title, text: line }) => (
            <li key={title.en}>
              <span className="home-say__icon"><Icon aria-hidden="true" /></span>
              <b>{title[lang]}</b>
              <span className="home-say__line">{line[lang]}</span>
            </li>
          ))}
        </ol>
        <p ref={foot} className="home-say__motto"><span>{id ? 'Moto hidup' : 'Life motto'}</span>{motto}</p>
      </div>
    </section>
  )
}
