'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { LocLink as Link } from '../LocLink'

/** Header offset (sticky navbar) used by the pinned stages. Keep in sync with the 72px values under "Home story sections" in globals.css. */
export const PIN_TOP = 72
export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
export const TALL_QUERY = `(min-height: 560px) and ${MOTION_QUERY}`
export const DESKTOP_QUERY = `(min-width: 1024px) and (min-height: 640px) and ${MOTION_QUERY}`

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function useMedia(query: string): boolean {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = matchMedia(query)
    const sync = () => setOn(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])
  return on
}

const scrollFrames = new Set<() => void>()
let scrollRaf = 0

const flushScrollFrames = () => {
  scrollRaf = 0
  scrollFrames.forEach((frame) => frame())
}

const requestScrollFrame = () => {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(flushScrollFrames)
}

/** Shares one scroll/resize listener and animation frame across Home motion effects. */
export function useScrollFrame(frame: () => void, enabled = true) {
  const saved = useRef(frame)
  useEffect(() => { saved.current = frame })
  useEffect(() => {
    if (!enabled) return
    const run = () => saved.current()
    const first = scrollFrames.size === 0
    scrollFrames.add(run)
    if (first) {
      addEventListener('scroll', requestScrollFrame, { passive: true })
      addEventListener('resize', requestScrollFrame)
    }
    requestScrollFrame()
    return () => {
      scrollFrames.delete(run)
      if (scrollFrames.size === 0) {
        removeEventListener('scroll', requestScrollFrame)
        removeEventListener('resize', requestScrollFrame)
        if (scrollRaf) cancelAnimationFrame(scrollRaf)
        scrollRaf = 0
      }
    }
  }, [enabled])
}

/** 0 → 1 while a pinned section's stage stays stuck under the header. */
export const pinProgress = (section: HTMLElement, stage: HTMLElement) => {
  const travel = section.offsetHeight - stage.offsetHeight
  return travel > 0 ? clamp01((PIN_TOP - section.getBoundingClientRect().top) / travel) : 0
}

/** 0 → 1 while an element crosses the viewport, from its top entering at the bottom to its bottom leaving at the top. */
export const passProgress = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return clamp01((innerHeight - r.top) / (innerHeight + r.height))
}

type ScrubFrom = 'up' | 'left' | 'right' | 'zoom'

/**
 * Scroll-scrubbed entrance: the content fades and travels with the scroll position itself (not a one-shot reveal),
 * so it moves back when scrolling up. `from` picks the direction; 'zoom' grows the block instead of sliding it.
 */
export function Scrub({ children, className = '', from = 'up', range = 0.5 }: { children: ReactNode; className?: string; from?: ScrubFrom; range?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const settled = useRef(false)
  const on = useMedia(MOTION_QUERY)
  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    // Anything already on screen before the first scroll is part of the first view: show it settled and leave it alone.
    if (scrollY < 8 && top < innerHeight) settled.current = true
    // Measured on the untransformed wrapper so the moving child never feeds back into the progress.
    el.style.setProperty('--v', settled.current ? '1' : clamp01((innerHeight - top) / (innerHeight * range)).toFixed(3))
  }, on)
  return <div ref={ref} className={className}><div className={`scrub scrub--${from}`}>{children}</div></div>
}

/** Heading text split into words that rise out of a mask one after another as the parent Scrub progresses. */
function Words({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.flatMap((w, i) => [
        <span key={i} className="home-word"><span style={{ '--i': i } as CSSProperties}>{w}</span></span>,
        i < words.length - 1 ? ' ' : null,
      ])}
    </>
  )
}

/** Number that counts up from zero the first time it scrolls into view. Screen readers get the final value. */
export function Count({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(n)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia(MOTION_QUERY).matches) return
    let raf = 0
    setShown(0)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (t: number) => {
        const k = clamp01((t - start) / 1100)
        setShown(Math.round(n * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [n])
  return <><span ref={ref} aria-hidden="true">{shown}</span><span className="sr-only">{n}</span></>
}

export function Head({ n, label, title, titleId, to, cta }: { n: string; label: string; title: string; titleId: string; to?: string; cta?: string }) {
  return (
    <Scrub>
      <div className="home-head">
        <div>
          <p className="home-eyebrow"><span aria-hidden="true">{n}</span>{label}</p>
          <h2 id={titleId} className="home-title"><Words text={title} /></h2>
        </div>
        {to && cta && <Link to={to} className="home-more">{cta}<span aria-hidden="true">→</span></Link>}
      </div>
    </Scrub>
  )
}
