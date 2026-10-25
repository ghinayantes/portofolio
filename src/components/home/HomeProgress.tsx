'use client'

import { useRef } from 'react'
import { clamp01, useScrollFrame } from './shared'

/** Thin page-progress line pinned to the top edge while the home page scrolls. */
export function HomeProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? clamp01(scrollY / max) : 0})`
  })
  return <div ref={bar} className="home-progress" aria-hidden="true" />
}
