'use client'

import { useEffect } from 'react'

/** Feeds cursor position to .card so the CSS spotlight can follow it. */
export default function Spotlight() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest?.('.card') as HTMLElement | null
      if (!c) return
      const r = c.getBoundingClientRect()
      c.style.setProperty('--mx', `${e.clientX - r.left}px`)
      c.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [])
  return null
}
