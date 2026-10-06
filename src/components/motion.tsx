'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/** Fades/lifts its children in (with a slight 3D tilt) the first time they scroll into view. `index` staggers siblings in a row. */
export function Reveal({ children, className = '', index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current!
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} data-in={shown} className={`reveal ${className}`} style={{ '--d': index % 3 } as CSSProperties}>{children}</div>
}
