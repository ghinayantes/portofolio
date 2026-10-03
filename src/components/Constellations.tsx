'use client'

import { useEffect, useRef } from 'react'

/**
 * Geometric "constellations" built from structures you meet in an informatics degree:
 *  - K5 and K3,3            (discrete math / graph theory)
 *  - binary tree            (data structures)
 *  - Hasse diagram of the divisors of 12 (order theory)
 *  - vector-addition parallelogram       (linear algebra)
 *  - slowly rotating cube   (rotation matrices)
 * Colors come from the --spark CSS variable, so it follows the light/dark theme.
 */

// ---- tuning ---------------------------------------------------------------
const ALPHA = { dark: { line: 0.12, node: 0.55 }, light: { line: 0.16, node: 0.5 } }
const SIZE = 1 // global scale multiplier (0.8 = smaller, 1.2 = bigger)
const SHOW: string[] = ['cube', 'tree', 'parallelogram', 'k5', 'hasse', 'k33'] // remove ids to hide shapes
const SMALL_SCREEN = 700 // below this width only shapes with `mobile: true` are drawn
// ---------------------------------------------------------------------------

type V2 = [number, number]
type Edge = [number, number]
type Shape = {
  id: string
  pts: V2[] // unit coordinates, roughly inside [-1, 1]; y points down
  edges: Edge[]
  x: number // anchor, fraction of viewport width
  y: number // anchor, fraction of viewport height
  size: number // fraction of min(viewport w, h)
  tilt: number // base rotation in radians
  dashed?: number[] // edge indices drawn dashed
  mobile?: boolean
}

const polygon = (n: number): V2[] => Array.from({ length: n }, (_, i) => [Math.sin((2 * Math.PI * i) / n), -Math.cos((2 * Math.PI * i) / n)] as V2)
const complete = (n: number): Edge[] => Array.from({ length: n }, (_, i) => Array.from({ length: n - i - 1 }, (_, k) => [i, i + k + 1] as Edge)).flat()

const SHAPES: Shape[] = [
  { id: 'cube', pts: [], edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], x: 0.9, y: 0.17, size: 0.1, tilt: 0, mobile: true },
  { id: 'tree', pts: [[0, -1], [-0.55, -0.35], [0.55, -0.35], [-0.8, 0.3], [-0.3, 0.3], [0.3, 0.3], [0.8, 0.3]], edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], x: 0.07, y: 0.24, size: 0.12, tilt: -0.08 },
  { id: 'parallelogram', pts: [[-0.9, 0.8], [0.6, 0.5], [-0.3, -0.3], [1.2, -0.6]], edges: [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3]], dashed: [4], x: 0.93, y: 0.6, size: 0.1, tilt: 0.1 },
  { id: 'k5', pts: polygon(5), edges: complete(5), x: 0.07, y: 0.72, size: 0.1, tilt: 0.2, mobile: true },
  { id: 'hasse', pts: [[0, 0.95], [-0.55, 0.35], [0.55, 0.35], [-0.55, -0.3], [0.55, -0.3], [0, -0.95]], edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]], x: 0.84, y: 0.9, size: 0.09, tilt: 0 },
  { id: 'k33', pts: [[-0.8, -0.8], [-0.8, 0], [-0.8, 0.8], [0.8, -0.8], [0.8, 0], [0.8, 0.8]], edges: [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]], x: 0.22, y: 0.93, size: 0.08, tilt: -0.15 },
]

/** Orthographic-ish projection of a cube rotated by two angles (a rotation-matrix demo). */
function cubePoints(t: number): V2[] {
  const a = 0.6 + t / 9000
  const b = 0.45 + Math.sin(t / 14000) * 0.25
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b)
  const v: [number, number, number][] = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]
  return v.map(([x, y, z]) => {
    const x1 = x * ca + z * sa
    const z1 = -x * sa + z * ca
    const y2 = y * cb - z1 * sb
    const z2 = y * sb + z1 * cb
    const p = 0.75 / (1 - z2 * 0.18)
    return [x1 * p, y2 * p] as V2
  })
}

export default function Constellations() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const root = document.documentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, V = 0, raf = 0, t0 = 0

    const draw = (t: number, fade: number) => {
      const rgb = getComputedStyle(root).getPropertyValue('--spark').trim() || '200,210,255'
      const a = root.dataset.theme === 'light' ? ALPHA.light : ALPHA.dark
      const small = W < SMALL_SCREEN
      ctx.clearRect(0, 0, W, V)
      ctx.lineWidth = 1
      for (const s of SHAPES) {
        if (!SHOW.includes(s.id) || (small && !s.mobile)) continue
        const R = Math.min(W, V) * s.size * SIZE
        const base = s.id === 'cube' ? cubePoints(reduce ? 0 : t) : s.pts
        const ang = s.tilt + (reduce ? 0 : Math.sin(t / 9000 + s.x * 9) * 0.05)
        const c = Math.cos(ang), sn = Math.sin(ang)
        const P = base.map(([x, y]) => [s.x * W + (x * c - y * sn) * R, s.y * V + (x * sn + y * c) * R] as V2)

        ctx.strokeStyle = `rgba(${rgb},${a.line * fade})`
        s.edges.forEach(([i, j], k) => {
          ctx.setLineDash(s.dashed?.includes(k) ? [4, 5] : [])
          ctx.beginPath()
          ctx.moveTo(P[i][0], P[i][1])
          ctx.lineTo(P[j][0], P[j][1])
          ctx.stroke()
        })
        ctx.setLineDash([])
        P.forEach(([x, y], i) => {
          const twinkle = reduce ? 1 : 0.6 + 0.4 * Math.sin(t / 1400 + i * 1.7 + s.y * 7)
          ctx.fillStyle = `rgba(${rgb},${a.node * twinkle * fade})`
          ctx.beginPath()
          ctx.arc(x, y, i % 3 === 0 ? 2.4 : 1.8, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    }

    const size = () => {
      const d = devicePixelRatio || 1
      W = innerWidth; V = innerHeight
      canvas.width = W * d; canvas.height = V * d
      ctx.setTransform(d, 0, 0, d, 0, 0)
      draw(0, 1)
    }
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      draw(ts, Math.min(1, (ts - t0) / 1600)) // fade in on load
      raf = requestAnimationFrame(loop)
    }

    size()
    addEventListener('resize', size)
    const mo = new MutationObserver(() => draw(0, 1)) // repaint when the theme changes (also covers reduced motion)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); mo.disconnect() }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
}