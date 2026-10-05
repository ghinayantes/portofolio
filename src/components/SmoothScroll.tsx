'use client'

import type { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: true, anchors: true, respectReducedMotion: true }}>
      {children}
    </ReactLenis>
  )
}
