import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; r: number; s: number; p: number }

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

    const draw = (t: number) => {
      const k = getComputedStyle(root).getPropertyValue('--spark').trim() || '200,210,255'
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
      if (root.dataset.theme === 'light') return
      for (const p of dots) {
        const a = 0.25 + 0.75 * Math.abs(Math.sin(t / 1300 + p.p))
        x.fillStyle = `rgba(${k},${a * 0.75})`
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill()
        if (!reduce) { p.y -= p.s; if (p.y < -4) { p.y = V + 4; p.x = Math.random() * W } }
      }
    }
    const size = () => {
      const d = devicePixelRatio || 1
      W = innerWidth; V = innerHeight
      c.width = W * d; c.height = V * d
      x.setTransform(d, 0, 0, d, 0, 0)
      dots = Array.from({ length: Math.min(110, Math.floor(W / 10)) }, () => ({ x: Math.random() * W, y: Math.random() * V, r: Math.random() * 1.3 + 0.3, s: Math.random() * 0.2 + 0.04, p: Math.random() * 6.28 }))
      draw(0)
    }
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop) }
    size()
    addEventListener('resize', size)
    const mo = new MutationObserver(() => draw(0))
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); mo.disconnect() }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
}
