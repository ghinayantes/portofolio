'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LocLink as Link } from './LocLink'
import { useSettings } from '../context/Settings'

/**
 * Home: a floating "hire me" bar pinned to the bottom of the screen.
 * Appears once the hero has scrolled away and hides for good once the closing CTA (#home-cta) comes into view.
 * Rendered into <body>: the page-transition wrapper keeps a transform, which would pin a fixed child to the page instead of the screen.
 */
export default function FloatingCta() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const [pastHero, setPastHero] = useState(false)
  const [ctaReached, setCtaReached] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setPastHero(scrollY > innerHeight * 0.8)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    const target = document.getElementById('home-cta')
    const io = target ? new IntersectionObserver(([e]) => setCtaReached(e.isIntersecting || e.boundingClientRect.top < 0)) : null
    if (target && io) io.observe(target)
    return () => { removeEventListener('scroll', onScroll); io?.disconnect() }
  }, [])

  const show = pastHero && !ctaReached
  if (!mounted) return null
  return createPortal(
    <div className="floating-cta" data-show={show} inert={!show}>
      <p>{id ? 'Punya ide?' : 'Have an idea?'}</p>
      <Link to="/hire" aria-label={id ? 'Yuk ngobrol' : "Let's talk"} className="btn-primary floating-cta__arrow"><span aria-hidden="true">↗</span></Link>
    </div>,
    document.body,
  )
}
