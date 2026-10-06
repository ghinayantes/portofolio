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
function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fade: number) {
  const w = radius * 2.8
  const h = radius * 1.55
  const left = x - w / 2
  const top = y - h * 0.62
  const fill = ctx.createLinearGradient(0, top, 0, top + h)
  fill.addColorStop(0, `rgba(255,255,255,${0.94 * fade})`)
  fill.addColorStop(0.46, `rgba(231,244,255,${0.82 * fade})`)
  fill.addColorStop(1, `rgba(157,193,222,${0.46 * fade})`)
  ctx.beginPath()
  ctx.moveTo(left + radius * 0.25, top + h * 0.8)
  ctx.bezierCurveTo(left + radius * 0.05, top + h * 0.65, left + radius * 0.1, top + h * 0.36, left + radius * 0.42, top + h * 0.34)
  ctx.bezierCurveTo(left + radius * 0.52, top + h * 0.02, left + radius * 1.02, top - h * 0.08, left + radius * 1.18, top + h * 0.28)
  ctx.bezierCurveTo(left + radius * 1.42, top - h * 0.02, left + radius * 1.98, top + h * 0.1, left + radius * 2.02, top + h * 0.44)
  ctx.bezierCurveTo(left + radius * 2.52, top + h * 0.34, left + radius * 2.9, top + h * 0.58, left + radius * 2.65, top + h * 0.82)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = `rgba(255,255,255,${0.58 * fade})`
  ctx.lineWidth = Math.max(1, radius * 0.08)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(left + radius * 0.55, top + h * 0.38)
  ctx.quadraticCurveTo(left + radius * 1.05, top + h * 0.04, left + radius * 1.35, top + h * 0.3)
  ctx.strokeStyle = `rgba(255,255,255,${0.42 * fade})`
  ctx.lineWidth = Math.max(1, radius * 0.12)
  ctx.stroke()
}
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
    let drift = 0
    let returnActive = false
    let returnFrom = 0
    let returnStart = 0
    const RETURN_MS = 1100
    const BLEND_MS = 850
    let blend = root.dataset.theme === 'light' ? 1 : 0
    let blendFrom = blend
    let blendTo = blend
    let blendStart = 0

    const easeOutExpo = (p: number): number => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p))
    const shortest = (v: number, m: number): number => {
      const h = ((v % m) + m) % m
      return h > m / 2 ? h - m : h
    }
    const arcAmp = (id: string): number => {
      let hsh = 0
      for (const ch of id) hsh = (hsh * 31 + ch.charCodeAt(0)) | 0
      return (((hsh % 28) + 28) % 28) - 14
    }

    const DARK_RGB = [200, 210, 255] as const
    const LIGHT_RGB = [79, 70, 229] as const

    const draw = (t: number, fade: number) => {
      const target = root.dataset.theme === 'light' ? 1 : 0
      const dt = t0 ? Math.min((t - t0) / 16.67, 2) : 1
      if (reduce) {
        blend = target
        blendFrom = target
        blendTo = target
      } else {
        if (target !== blendTo) {
          blendTo = target
          blendFrom = blend
          blendStart = t
        }
        const bp = Math.min(1, Math.max(0, (t - blendStart) / BLEND_MS))
        blend = blendFrom + (blendTo - blendFrom) * (1 - Math.pow(1 - bp, 3))
      }
      const r = Math.round(DARK_RGB[0] + (LIGHT_RGB[0] - DARK_RGB[0]) * blend)
      const g = Math.round(DARK_RGB[1] + (LIGHT_RGB[1] - DARK_RGB[1]) * blend)
      const b = Math.round(DARK_RGB[2] + (LIGHT_RGB[2] - DARK_RGB[2]) * blend)
      const rgb = `${r},${g},${b}`
      const lineAlpha = ((1 - blend) * ALPHA.dark.line + blend * ALPHA.light.line * 0.55) * fade
      const windCycle = Math.max(320, W)
      let shiftX = 0
      let returnP = 0
      if (target === 1) {
        drift = (drift + 0.18 * dt * (0.3 + 0.7 * blend)) % windCycle
        returnActive = false
        shiftX = drift
      } else if (returnActive) {
        returnP = Math.min(1, Math.max(0, (t - returnStart) / RETURN_MS))
        shiftX = returnFrom * (1 - easeOutExpo(returnP))
        if (returnP >= 1) {
          drift = 0
          returnActive = false
          returnP = 0
          shiftX = 0
        }
      }
      const small = W < SMALL_SCREEN
      ctx.clearRect(0, 0, W, V)
      ctx.lineWidth = 1
      for (const s of SHAPES) {
        if (!SHOW.includes(s.id) || (small && !s.mobile)) continue
        const R = Math.min(W, V) * s.size * SIZE
        const base = s.id === 'cube' ? cubePoints(reduce ? 0 : t) : s.pts
        const ang = s.tilt + (reduce ? 0 : Math.sin(t / 9000 + s.x * 9) * 0.05)
        const c = Math.cos(ang), sn = Math.sin(ang)
        const anchorX = s.x * W + shiftX
        const drifting = target === 1 && shiftX > 0
        const wrappedAnchors = drifting
          ? [anchorX - W, anchorX, anchorX + W].filter((a) => a + R * 1.3 > 0 && a - R * 1.3 < W)
          : [anchorX]
        const lift = returnActive ? Math.sin(Math.PI * returnP) * arcAmp(s.id) : 0
        for (const wrappedAnchor of wrappedAnchors) {
          const P = base.map(([x, y]) => [wrappedAnchor + (x * c - y * sn) * R, s.y * V + (x * sn + y * c) * R + lift] as V2)
          if (lineAlpha > 0.004) {
            ctx.strokeStyle = `rgba(${rgb},${lineAlpha})`
            s.edges.forEach(([i, j], k) => {
              ctx.setLineDash(s.dashed?.includes(k) ? [4, 5] : [])
              ctx.beginPath()
              ctx.moveTo(P[i][0], P[i][1])
              ctx.lineTo(P[j][0], P[j][1])
              ctx.stroke()
            })
            ctx.setLineDash([])
          }
          P.forEach(([x, y], i) => {
            const twinkle = reduce ? 1 : 0.6 + 0.4 * Math.sin(t / 1400 + i * 1.7 + s.y * 7)
            const starAlpha = ALPHA.dark.node * twinkle * fade * (1 - blend)
            const cloudFade = fade * blend
            if (starAlpha > 0.01) {
              ctx.fillStyle = `rgba(${rgb},${starAlpha})`
              ctx.beginPath()
              ctx.arc(x, y, i % 3 === 0 ? 2.4 : 1.8, 0, Math.PI * 2)
              ctx.fill()
            }
            if (cloudFade > 0.01) {
              drawCloud(ctx, x, y, i % 3 === 0 ? 8 : 6, cloudFade)
            }
            ctx.shadowBlur = 0
          })
        }
      }
    }

    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5)
      W = innerWidth; V = innerHeight
      canvas.width = W * d; canvas.height = V * d
      ctx.setTransform(d, 0, 0, d, 0, 0)
      draw(0, 1)
    }
    let lastPaint = 0
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop)
      if (!t0) t0 = ts
      if (ts - lastPaint < 33) return
      lastPaint = ts
      draw(ts, Math.min(1, (ts - t0) / 1600)) // fade in on load
    }

    size()
    addEventListener('resize', size)
    const mo = new MutationObserver(() => {
      if (root.dataset.theme === 'dark') {
        if (reduce) {
          drift = 0
          returnActive = false
        } else if (drift !== 0) {
          returnFrom = shortest(drift, Math.max(320, W))
          returnStart = performance.now()
          returnActive = true
        }
      } else {
        returnActive = false
      }
      draw(performance.now(), 1)
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', size)
      mo.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
}
