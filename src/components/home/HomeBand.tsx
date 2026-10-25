'use client'

import { useRef } from 'react'
import { SITE } from '../../data/site'
import { useSettings } from '../../context/Settings'
import { MOTION_QUERY, passProgress, useMedia, useScrollFrame } from './shared'

/** Oversized outlined words that slide sideways with the scroll; decorative divider between home sections. */
export function HomeBand({ back = false }: { back?: boolean }) {
  const { lang } = useSettings()
  const ref = useRef<HTMLDivElement>(null)
  const motion = useMedia(MOTION_QUERY)
  useScrollFrame(() => {
    if (ref.current) ref.current.style.setProperty('--s', passProgress(ref.current).toFixed(3))
  }, motion)
  const line = SITE.roles[lang].join(' · ')
  return (
    <div ref={ref} className={back ? 'home-band home-band--back' : 'home-band'} aria-hidden="true">
      <p>{line} · {line} · {line}</p>
    </div>
  )
}
