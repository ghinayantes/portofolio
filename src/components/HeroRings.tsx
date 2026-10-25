'use client'

import { useEffect, useRef } from 'react'

/**
 * Concentric hairline rings behind the hero photo.
 * With a mouse they drift away from the cursor, inner rings further than outer ones (eased, so the motion settles softly);
 * without a hover pointer they breathe slowly instead (CSS). Reduced motion keeps them still.
 */
export default function HeroRings() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0, ty = 0, x = 0, y = 0
    const step = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      el.style.setProperty('--mx', x.toFixed(3))
      el.style.setProperty('--my', y.toFixed(3))
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(step) : 0
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      // -1 → 1 across the viewport, measured from its centre.
      tx = (e.clientX / innerWidth) * 2 - 1
      ty = (e.clientY / innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(step)
    }
    addEventListener('pointermove', move, { passive: true })
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])

  return <div ref={ref} className="hero-rings" aria-hidden="true"><span /><span /><span /></div>
}
