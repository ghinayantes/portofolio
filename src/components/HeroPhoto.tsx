'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'
import { LocLink as Link } from './LocLink'

const ICONS: Record<string, IconType> = { email: FaEnvelope, linkedin: FaLinkedinIn, github: FaGithub, instagram: FaInstagram, whatsapp: FaWhatsapp }
const DISMISS_KEY = 'hero-hello-dismissed'
// sample points that get projected from the plane onto the number line (x, y in svg units)
const PTS: [number, number][] = [[-11, -8], [-4, 9], [3, -11], [9, 6], [12, -3], [-8, 12]]

/**
 * Hero photo with three interactions:
 *  - click the photo   -> 3D flip to the next photo (1/3 indicator)
 *  - click the plane   -> contact icons fan out; the plane shears (a linear transformation)
 *  - soft speech bubble with rotating messages next to the plane
 */
export default function HeroPhoto() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const photos = SITE.photos
  const count = photos.length
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState(0)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const hold = useRef(false) // pointer / focus is on the bubble: keep it open
  const last = useRef(-1)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
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

  const flipNext = () => {
    if (count < 2 || flip) return
    setFlip(true)
    timers.current.push(window.setTimeout(() => setI((x) => (x + 1) % count), 260)) // swap while the card is edge-on
    timers.current.push(window.setTimeout(() => setFlip(false), 540))
  }
  const dismiss = () => { setShow(false); setDismissed(true); try { sessionStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ } }

  const photoLabel = count > 1
    ? (id ? `Ganti foto (${i + 1} dari ${count})` : `Next photo (${i + 1} of ${count})`)
    : count === 1 ? t(photos[0].alt) : 'Photo'

  const visible = show && !open
  const m = SITE.hello[msg]
  const body = m && (<><span>{t(m.text)}</span>{m.cta && <b className="ml-1 font-semibold text-brand">{t(m.cta)}</b>}</>)
  const tab = visible ? 0 : -1

  return (
    <div ref={root} className="photo relative order-first mx-auto aspect-square w-full max-w-60 sm:max-w-72 md:order-none md:max-w-110">
      <button
        type="button"
        onClick={flipNext}
        disabled={count < 2}
        aria-label={photoLabel}
        className={`blob absolute inset-0 z-10 block ${count > 1 ? 'cursor-pointer' : 'cursor-default'} ${flip ? 'flip-anim' : ''}`}
      >
        {count === 0 ? (
          <span className="grid h-full place-items-center font-display text-[8rem] font-extrabold text-line">G</span>
        ) : photos.map((p, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.src} src={p.src} alt={k === i ? t(p.alt) : ''} aria-hidden={k !== i} draggable={false}
            style={{ objectPosition: p.pos }} className={`absolute inset-0 h-full w-full object-cover ${k === i ? 'opacity-100' : 'opacity-0'}`} />
        ))}
      </button>

      {count > 1 && (
        <span aria-hidden className="pointer-events-none absolute left-[14.64%] top-[14.64%] z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur-md">
          ↻ {i + 1} / {count}
        </span>
      )}

      <div className="dial absolute z-20" data-open={open}>
        {m && (
          <div
            className="bubble absolute bottom-[calc(100%+12px)] right-0 w-max max-w-[210px] rounded-2xl rounded-br-md border border-line bg-surface/90 px-3.5 py-2.5 text-[13px] leading-snug text-fg shadow-xl backdrop-blur-md md:max-w-[250px]"
            data-show={visible}
            aria-hidden={!visible}
            onMouseEnter={() => { hold.current = true }}
            onMouseLeave={() => { hold.current = false }}
            onFocus={() => { hold.current = true }}
            onBlur={() => { hold.current = false }}
          >
            {m.to ? <Link to={m.to} tabIndex={tab} className="block pr-1">{body}</Link>
              : m.action ? <button type="button" tabIndex={tab} className="block text-left" onClick={() => { if (m.action === 'flip') flipNext(); else setOpen(true); setShow(false) }}>{body}</button>
              : <p className="pr-1">{body}</p>}
            <button type="button" tabIndex={tab} onClick={dismiss} aria-label={id ? 'Tutup pesan' : 'Dismiss message'}
              className="absolute -left-2 -top-2 grid size-5 place-items-center rounded-full border border-line bg-surface text-[11px] leading-none text-fg2 hover:text-fg">×</button>
          </div>
        )}

        <span aria-hidden className="dial-echo" />
        <span aria-hidden className="dial-echo" />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="hero-contacts"
          aria-label={id ? 'Hubungi aku' : 'Contact me'}
          className="dial-btn absolute inset-0 overflow-hidden rounded-2xl border border-line bg-surface/80 text-fg shadow-lg backdrop-blur-md hover:border-brand/60"
        >
          <svg viewBox="-24 -24 48 48" aria-hidden className="size-full p-1.5">
            {/* R^2 plane: grid + basis vectors collapse onto the x-axis (a rank-1 projection), then expand back */}
            <g className="la-grid" stroke="currentColor" strokeOpacity=".22" strokeWidth=".8">
              {[-14, -7, 0, 7, 14].map((n) => (
                <g key={n}><line x1={n} y1={-15} x2={n} y2={15} vectorEffect="non-scaling-stroke" /><line x1={-15} y1={n} x2={15} y2={n} vectorEffect="non-scaling-stroke" /></g>
              ))}
              <g stroke="var(--brand)" strokeOpacity="1" strokeWidth="1.7" strokeLinecap="round" fill="var(--brand)">
                <line x1="0" y1="0" x2="11" y2="0" vectorEffect="non-scaling-stroke" /><polygon points="15,0 10.5,-3 10.5,3" stroke="none" />
                <line x1="0" y1="0" x2="0" y2="-11" vectorEffect="non-scaling-stroke" /><polygon points="0,-15 -3,-10.5 3,-10.5" stroke="none" />
              </g>
            </g>
            {/* R^1: the number line that the plane lands on */}
            <g className="la-line" stroke="var(--brand)" strokeLinecap="round">
              <line x1="-18" y1="0" x2="17" y2="0" strokeWidth="1.8" />
              <polygon points="21,0 16,-3.2 16,3.2" fill="var(--brand)" stroke="none" />
              {[-14, -7, 0, 7, 14].map((n) => <line key={n} x1={n} y1={-3} x2={n} y2={3} strokeWidth="1.2" />)}
            </g>
            {PTS.map(([x, y], k) => (
              <circle key={k} className="la-pt" cx={x} cy={y} r="2.1" fill={k % 2 ? 'currentColor' : 'var(--accent)'} style={{ '--y': y, '--k': k } as CSSProperties} />
            ))}
            <g className="la-label" fontWeight="700" fontSize="8.5" fill="currentColor">
              <text className="la-t2" x="-23" y="-14">R<tspan dy="-3" fontSize="5.4">2</tspan></text>
              <text className="la-t1" x="-23" y="-14">R<tspan dy="-3" fontSize="5.4">1</tspan></text>
            </g>
          </svg>
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
