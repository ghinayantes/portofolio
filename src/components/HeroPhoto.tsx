'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'
import { LocLink as Link } from './LocLink'

const ICONS: Record<string, IconType> = { email: FaEnvelope, linkedin: FaLinkedinIn, github: FaGithub, instagram: FaInstagram, whatsapp: FaWhatsapp }
const DISMISS_KEY = 'hero-hello-dismissed'

/* ---- icon: the unit circle under a linear map M = Rot(theta) * diag(s1, s2) (SVD-style) ----
   circle -> ellipse -> a line segment (rank 1: det -> 0) -> back. Dots travel along the image; the gold dot is v and its image Mv. */
const R = 13
const CYCLE = 11000 // ms
const N = 12
const KF: [number, number, number, number][] = [ // [u, s1, s2, theta in degrees]
  [0, 1, 1, 0], [0.1, 1, 1, 0], [0.34, 1.2, 0.5, -26], [0.48, 1.2, 0.5, -26],
  [0.66, 1.3, 0.012, -26], [0.76, 1.3, 0.012, -26], [0.94, 1, 1, 0], [1, 1, 1, 0],
]
const smooth = (x: number) => x * x * (3 - 2 * x)
function stateAt(u: number): [number, number, number] {
  for (let i = 0; i < KF.length - 1; i++) {
    const a = KF[i], b = KF[i + 1]
    if (u <= b[0]) {
      const k = smooth((u - a[0]) / (b[0] - a[0] || 1))
      return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k]
    }
  }
  return [1, 1, 0]
}

function LinearMapIcon() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current!
    const q = (sel: string) => svg.querySelector(sel) as SVGElement
    const ell = q('[data-ell]'), ax1 = q('[data-ax1]'), ax2 = q('[data-ax2]'), link = q('[data-link]'), pre = q('[data-pre]'), vec = q('[data-vec]')
    const dots = Array.from(svg.querySelectorAll('[data-dot]'))
    const rings = Array.from(svg.closest('.dial')?.querySelectorAll('.dial-echo') ?? [])
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const set = (el: Element, o: Record<string, number | string>) => { for (const k in o) el.setAttribute(k, typeof o[k] === 'number' ? (o[k] as number).toFixed(2) : String(o[k])) }

    const draw = (t: number) => {
      const [s1, s2, deg] = stateAt((t % CYCLE) / CYCLE)
      const th = (deg * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th)
      const phi0 = (t / CYCLE) * Math.PI * 2
      const map = (phi: number): [number, number] => { const a = R * s1 * Math.cos(phi), b = R * s2 * Math.sin(phi); return [a * c - b * s, a * s + b * c] }
      set(ell, { rx: R * s1, ry: Math.max(R * s2, 0.01), transform: `rotate(${deg.toFixed(2)})` })
      set(ax1, { x1: -R * s1, x2: R * s1, transform: `rotate(${deg.toFixed(2)})` })
      set(ax2, { y1: -R * s2, y2: R * s2, transform: `rotate(${deg.toFixed(2)})` })
      dots.forEach((d, k) => { const [x, y] = map(phi0 + (k * Math.PI * 2) / N); set(d, { cx: x, cy: y }) })
      const [hx, hy] = map(phi0), px = R * Math.cos(phi0), py = R * Math.sin(phi0)
      set(vec, { x2: hx, y2: hy })
      set(pre, { cx: px, cy: py })
      set(link, { x1: px, y1: py, x2: hx, y2: hy })
    }

    if (reduce) { draw(CYCLE * 0.3); return }
    let raf = 0, t0 = 0, prev = 0, running = true
    const echo = () => rings.forEach((r, i) => r.animate([{ opacity: 0.45, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.7)' }], { duration: 2200, delay: i * 450, easing: 'cubic-bezier(.2,.6,.3,1)' }))
    const loop = (ts: number) => {
      if (!running) return
      if (!t0) t0 = ts
      const t = ts - t0, u = (t % CYCLE) / CYCLE
      draw(t)
      if (prev < 0.5 && u >= 0.5 && !svg.closest('.dial')?.matches("[data-open='true']")) echo() // an echo ring leaves the card as the plane collapses
      prev = u
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !running) { running = true; t0 = 0; raf = requestAnimationFrame(loop) } else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf) } })
    io.observe(svg)
    raf = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect() }
  }, [])

  return (
    <svg ref={ref} viewBox="-24 -24 48 48" aria-hidden className="size-full p-1.5">
      <circle r={R} fill="none" stroke="currentColor" strokeOpacity=".16" strokeWidth=".7" />
      <ellipse data-ell rx={R} ry={R} fill="var(--brand)" fillOpacity=".1" stroke="var(--brand)" strokeWidth="1.3" />
      <g stroke="var(--brand)" strokeOpacity=".4" strokeWidth=".6" strokeDasharray="1.2 1.6">
        <line data-ax1 x1={-R} x2={R} y1="0" y2="0" />
        <line data-ax2 x1="0" x2="0" y1={-R} y2={R} />
      </g>
      <line data-link stroke="var(--accent)" strokeOpacity=".5" strokeWidth=".6" strokeDasharray="1 1.4" />
      <circle data-pre r="1.6" fill="none" stroke="var(--accent)" strokeOpacity=".8" strokeWidth=".8" />
      <line data-vec x1="0" y1="0" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
      {Array.from({ length: N }, (_, k) => k === 0
        ? <circle key={k} data-dot r="2.1" fill="var(--accent)" />
        : <circle key={k} data-dot r="1.05" fill="currentColor" fillOpacity=".7" />)}
      <circle r="1.2" fill="currentColor" fillOpacity=".8" />
    </svg>
  )
}

/**
 * Hero photo with two interactions:
 *  - click the plane   -> contact icons fan out; the plane shears (a linear transformation)
 *  - soft speech bubble with rotating messages next to the plane
 */
export default function HeroPhoto() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const photo = SITE.photos[0]
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState(0)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const hold = useRef(false) // pointer / focus is on the bubble: keep it open
  const last = useRef(-1)

  useEffect(() => { try { if (sessionStorage.getItem(DISMISS_KEY)) setDismissed(true) } catch { /* ignore */ } }, [])

  // close the dial on outside click / Escape
  useEffect(() => {
    if (!open) return
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('pointerdown', down)
    addEventListener('keydown', key)
    return () => { removeEventListener('pointerdown', down); removeEventListener('keydown', key) }
  }, [open])

  // bubble schedule: first greeting after ~2.5s, shown ~6s, then a random different message every 9-15s
  useEffect(() => {
    const list = SITE.hello
    if (dismissed || open || list.length === 0) { setShow(false); return }
    const ids: number[] = []
    const later = (fn: () => void, ms: number) => { ids.push(window.setTimeout(fn, ms)) }
    const hide = () => {
      if (hold.current) return later(hide, 1500)
      setShow(false)
      later(next, 9000 + Math.random() * 6000)
    }
    const next = () => {
      if (document.hidden) return later(next, 4000)
      let k = 0
      if (last.current >= 0) do { k = Math.floor(Math.random() * list.length) } while (k === last.current && list.length > 1)
      last.current = k
      setMsg(k)
      setShow(true)
      later(hide, 6000)
    }
    later(next, 2500)
    return () => ids.forEach(clearTimeout)
  }, [open, dismissed])

  const dismiss = () => { setShow(false); setDismissed(true); try { sessionStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ } }

  const visible = show && !open
  const m = SITE.hello[msg]
  const body = m && (<><span>{t(m.text)}</span>{m.cta && <b className="ml-1 font-semibold text-brand">{t(m.cta)}</b>}</>)
  const tab = visible ? 0 : -1

  return (
    <div ref={root} className="photo relative order-first mx-auto aspect-square w-full mb-4 max-w-72 sm:max-w-80 md:order-none md:mb-0 md:max-w-[32rem]">
      <div className="blob absolute inset-0 z-10 block">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={t(photo.alt)} draggable={false} loading="eager" decoding="sync" fetchPriority="high"
            style={{ objectPosition: photo.pos }} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="grid h-full place-items-center font-display text-[8rem] font-extrabold text-line">G</span>
        )}
      </div>

      {m && (
        <div
          className="bubble w-max max-w-[210px] rounded-2xl rounded-tr-md border border-line bg-surface/90 px-3.5 py-2.5 text-[13px] leading-snug text-fg shadow-xl backdrop-blur-md md:max-w-[250px]"
          data-show={visible}
          aria-hidden={!visible}
          onMouseEnter={() => { hold.current = true }}
          onMouseLeave={() => { hold.current = false }}
          onFocus={() => { hold.current = true }}
          onBlur={() => { hold.current = false }}
        >
          {m.to ? <Link to={m.to} tabIndex={tab} className="block pr-1">{body}</Link>
            : m.action ? <button type="button" tabIndex={tab} className="block text-left" onClick={() => { setOpen(true); setShow(false) }}>{body}</button>
            : <p className="pr-1">{body}</p>}
          <button type="button" tabIndex={tab} onClick={dismiss} aria-label={id ? 'Tutup pesan' : 'Dismiss message'}
            className="absolute -left-2 -top-2 grid size-5 place-items-center rounded-full border border-line bg-surface text-[11px] leading-none text-fg2 hover:text-fg">×</button>
        </div>
      )}

      <div className="dial absolute z-20" data-open={open}>
        <span aria-hidden className="dial-echo" />
        <span aria-hidden className="dial-echo" />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="hero-contacts"
          aria-label={id ? 'Hubungi aku' : 'Contact me'}
          className="dial-btn absolute inset-0 overflow-hidden rounded-full border border-line/70 bg-surface/45 text-fg shadow-lg backdrop-blur-md hover:border-brand/60"
        >
          <LinearMapIcon />
        </button>

        <ul id="hero-contacts" className="dial-list">
          {SITE.contacts.map((c, k) => {
            const Icon = ICONS[c.key]
            return (
              <li key={c.key} className="dial-item" style={{ '--i': k } as CSSProperties}>
                <a
                  href={c.href}
                  target={c.key === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={t(c.label)}
                  title={t(c.label)}
                  tabIndex={open ? 0 : -1}
                  className="grid size-full place-items-center rounded-full border border-line bg-surface/90 text-base text-fg shadow-lg backdrop-blur-md transition hover:bg-brand hover:text-ink"
                >
                  {Icon && <Icon aria-hidden />}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}