'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

/** Lenis smooth scrolling. Disabled for reduced-motion users. Add data-lenis-prevent to inner scroll areas (e.g. the mobile menu). */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    lenis.current = l
    let raf = 0
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); l.destroy(); lenis.current = null }
  }, [])

  useEffect(() => { lenis.current?.scrollTo(0, { immediate: true }) }, [pathname])
  return <>{children}</>
}
