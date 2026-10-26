'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

const observed = new Set<Element>()
let observer: IntersectionObserver | null = null

function disconnectIfIdle() {
  if (observed.size !== 0) return
  observer?.disconnect()
  observer = null
}

function watch(element: HTMLElement) {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.setAttribute('data-home-entered', 'true')
        observer?.unobserve(entry.target)
        observed.delete(entry.target)
      })
      disconnectIfIdle()
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' })
  }

  observed.add(element)
  observer.observe(element)

  return () => {
    observer?.unobserve(element)
    observed.delete(element)
    disconnectIfIdle()
  }
}

export function HomeReveal({ children, className = '', index }: { children: ReactNode; className?: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    return watch(element)
  }, [])

  const delay = Math.min(Math.max(0, index) * 15, 180)
  const style = { '--home-enter-delay': `${delay}ms` } as CSSProperties

  return <div ref={ref} className={`home-reveal ${className}`} style={style}>{children}</div>
}
