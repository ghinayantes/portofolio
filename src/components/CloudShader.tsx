'use client'

import { useEffect, useRef } from 'react'

type Puff = { dx: number; dy: number; rx: number; ry: number; a: number; ph: number }
type Cloud = { x: number; y: number; ox: number; oy: number; puffs: Puff[]; speed: number }

const CLOUD_COUNT = 8
const SCALE = 0.5 // render at half resolution, upscale via CSS (cheap + naturally soft)

/**
 * Procedural light-theme sky: gradient + big soft drifting clouds that part
 * around the cursor. Hidden entirely in dark theme. Half resolution, 30fps.
 */
export default function CloudShader() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const root = document.documentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const isLight = () => root.dataset.theme === 'light'
    let W = 0, V = 0, raf = 0, lastPaint = 0
    let clouds: Cloud[] = []
    const cursor = { x: -9999, y: -9999, tx: -9999, ty: -9999 }

    const seed = () => {
      clouds = Array.from({ length: CLOUD_COUNT }, () => {
        const s = Math.min(W, V) * (0.12 + Math.random() * 0.11)
        const puffs: Puff[] = Array.from({ length: 5 }, () => ({
          dx: (Math.random() - 0.5) * s * 2.4,
          dy: (Math.random() - 0.5) * s * 0.7,
          rx: s * (0.58 + Math.random() * 0.55),
          ry: s * (0.3 + Math.random() * 0.26),
          a: 0.18 + Math.random() * 0.14,
          ph: Math.random() * 6.28,
        }))
        return {
          x: Math.random() * (W + s * 3) - s * 1.5,
          y: V * (0.06 + Math.random() * 0.52),
          ox: 0,
          oy: 0,
          puffs,
          speed: 5 + Math.random() * 9,
        }
      })
    }

    const draw = (t: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, V)
      sky.addColorStop(0, '#aed4f7')
      sky.addColorStop(0.55, '#d6e9ff')
      sky.addColorStop(1, '#f4faff')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, V)

      const k = 1 - Math.exp(-1 / 8)
      cursor.x += (cursor.tx - cursor.x) * k
      cursor.y += (cursor.ty - cursor.y) * k

      const ok = 1 - Math.exp(-1 / 12)
      for (const c of clouds) {
        c.x -= c.speed / 2
        const margin = Math.min(W, V) * 0.45
        if (c.x < -margin) c.x = W + margin
        const dx = c.x - cursor.x
        const dy = c.y - cursor.y
        const d = Math.hypot(dx, dy)
        const push = d < 280 && d > 0.01 ? (1 - d / 280) * 52 : 0
        c.ox += ((dx / (d || 1)) * push - c.ox) * ok
        c.oy += ((dy / (d || 1)) * push - c.oy) * ok
        const ox = c.x + c.ox
        const oy = c.y + c.oy
        const shadeR = Math.min(W, V) * 0.16
        ctx.save()
        ctx.translate(ox, oy + shadeR * 0.5)
        ctx.scale(1.6, 0.42)
        const shade = ctx.createRadialGradient(0, 0, 0, 0, 0, shadeR)
        shade.addColorStop(0, 'rgba(125,160,195,0.14)')
        shade.addColorStop(1, 'rgba(125,160,195,0)')
        ctx.fillStyle = shade
        ctx.beginPath()
        ctx.arc(0, 0, shadeR, 0, 6.283)
        ctx.fill()
        ctx.restore()
        for (const p of c.puffs) {
          const px = ox + p.dx
          const py = oy + p.dy
          const breathe = 0.9 + 0.1 * Math.sin(t / 3200 + p.ph)
          ctx.save()
          ctx.translate(px, py)
          ctx.scale(1, p.ry / p.rx)
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.rx)
          g.addColorStop(0, `rgba(255,255,255,${(p.a * breathe).toFixed(3)})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(0, 0, p.rx, 0, 6.283)
          ctx.fill()
          ctx.restore()
        }
      }
    }

    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const loop = (t: number) => {
      if (!isLight()) {
        stop()
        return
      }
      raf = requestAnimationFrame(loop)
      if (t - lastPaint < 33) return
      lastPaint = t
      draw(t)
    }

    const start = () => {
      if (raf || reduce || !isLight()) return
      lastPaint = 0
      raf = requestAnimationFrame(loop)
    }

    const syncVisible = () => {
      canvas.style.opacity = isLight() ? '1' : '0'
    }

    const size = () => {
      W = innerWidth
      V = innerHeight
      canvas.width = Math.max(2, Math.floor(W * SCALE))
      canvas.height = Math.max(2, Math.floor(V * SCALE))
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)
      seed()
      if (isLight()) draw(performance.now())
    }

    const onMove = (e: PointerEvent) => {
      cursor.tx = e.clientX
      cursor.ty = e.clientY
    }
    const onLeave = () => {
      cursor.tx = -9999
      cursor.ty = -9999
    }
    const onTheme = () => {
      syncVisible()
      start()
    }

    size()
    syncVisible()
    if (reduce) {
      if (isLight()) draw(performance.now())
    } else {
      start()
    }
    addEventListener('resize', size)
    addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    const mo = new MutationObserver(onTheme)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      stop()
      removeEventListener('resize', size)
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      mo.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-700"
    />
  )
}
