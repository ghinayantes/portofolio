'use client'

import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; r: number; s: number; p: number }
type ShootingStar = { x: number; y: number; vx: number; vy: number; tail: number; age: number; duration: number }

/** Fixed canvas: faint wave lines + twinkling particles (particles off in light theme). */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const x = c.getContext('2d')!
    const root = document.documentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, V = 0, raf = 0
    let dots: Dot[] = []
    let shootingStars: ShootingStar[] = []
    let nextShootingStarAt = 7000 + Math.random() * 5000
    let lastFrameAt = 0

    const createShootingStar = (): ShootingStar => {
      const direction = Math.random() < 0.5 ? -1 : 1
      return {
        x: W * (0.08 + Math.random() * 0.84),
        y: V * (0.06 + Math.random() * 0.78),
        vx: direction * (7 + Math.random() * 5),
        vy: 3 + Math.random() * 5,
        tail: 15 + Math.random() * 16,
        age: 0,
        duration: 42 + Math.random() * 24,
      }
    }

    const draw = (t: number) => {
      const k = getComputedStyle(root).getPropertyValue('--spark').trim() || '200,210,255'
      const frameScale = lastFrameAt ? Math.min((t - lastFrameAt) / 16.67, 2) : 1
      lastFrameAt = t
      x.clearRect(0, 0, W, V)
      x.lineWidth = 1
      for (let i = 0; i < 34; i++) {
        x.beginPath()
        for (let px = 0; px <= W; px += 20) {
          const u = px / W
          const y = V * 0.8 + i * 2.4 - Math.sin(u * 3.1 + i * 0.05 + t / 7000) * 70 * (0.4 + u) - Math.sin(u * 7 + t / 9000) * 14
          if (px) x.lineTo(px, y); else x.moveTo(px, y)
        }
        x.strokeStyle = `rgba(${k},${0.03 + i * 0.0016})`
        x.stroke()
      }
      if (root.dataset.theme !== 'dark') {
        shootingStars = []
        nextShootingStarAt = t + 7000 + Math.random() * 5000
        return
      }
      for (const p of dots) {
        const a = 0.25 + 0.75 * Math.abs(Math.sin(t / 1300 + p.p))
        x.fillStyle = `rgba(${k},${a * 0.75})`
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill()
        if (!reduce) { p.y -= p.s; if (p.y < -4) { p.y = V + 4; p.x = Math.random() * W } }
      }
      if (reduce) return

      if (t >= nextShootingStarAt) {
        shootingStars.push(createShootingStar())
        if (Math.random() < 0.28) shootingStars.push(createShootingStar())
        nextShootingStarAt = t + 5500 + Math.random() * 6500
      }

      shootingStars = shootingStars.filter((star) => {
        star.x += star.vx * frameScale
        star.y += star.vy * frameScale
        star.age += frameScale
        const progress = star.age / star.duration
        const alpha = Math.sin(Math.PI * progress) * 0.78
        const tailX = star.x - star.vx * star.tail
        const tailY = star.y - star.vy * star.tail
        const trail = x.createLinearGradient(tailX, tailY, star.x, star.y)
        trail.addColorStop(0, `rgba(${k},0)`)
        trail.addColorStop(0.72, `rgba(${k},${alpha * 0.45})`)
        trail.addColorStop(1, `rgba(255,255,255,${alpha})`)
        x.beginPath()
        x.moveTo(tailX, tailY)
        x.lineTo(star.x, star.y)
        x.strokeStyle = trail
        x.lineWidth = 1.4
        x.shadowColor = `rgba(${k},${alpha * 0.8})`
        x.shadowBlur = 9
        x.stroke()
        x.shadowBlur = 0
        return progress < 1
      })
    }
    const size = () => {
      const d = devicePixelRatio || 1
      W = innerWidth; V = innerHeight
      c.width = W * d; c.height = V * d
      x.setTransform(d, 0, 0, d, 0, 0)
      dots = Array.from({ length: Math.min(110, Math.floor(W / 10)) }, () => ({ x: Math.random() * W, y: Math.random() * V, r: Math.random() * 1.3 + 0.3, s: Math.random() * 0.2 + 0.04, p: Math.random() * 6.28 }))
      draw(performance.now())
    }
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop) }
    size()
    addEventListener('resize', size)
    const mo = new MutationObserver(() => draw(performance.now()))
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); mo.disconnect() }
  }, [])
  return <>
    <div aria-hidden className="day-sun pointer-events-none fixed z-0" />
    <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
  </>
}
