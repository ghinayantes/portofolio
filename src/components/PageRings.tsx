'use client'

import { usePathname } from 'next/navigation'
import HeroRings from './HeroRings'

export default function PageRings() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.at(-1) === 'sitemap') return <div aria-hidden="true" className="page-grid" />
  if (segments.at(-1) === 'education') return <div aria-hidden="true" className="page-grid page-grid--vertical">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>
  return segments.length > 1 ? <HeroRings className="hero-rings page-rings" count={5} /> : null
}
