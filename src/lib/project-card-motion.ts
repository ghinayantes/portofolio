export function getProjectCardLeanForPointer(pointerType: string): { rotateX: number } | null {
  if (pointerType !== 'mouse') return null
  return { rotateX: 40 }
}

export function getProjectCardAction(
  links: string[],
  hrefs: string[] = [],
): { label: 'live' | 'github'; href: string } | null {
  const available = links.map((label, index) => ({ label: label.toLowerCase(), href: hrefs[index]?.trim() ?? '' }))

  const live = available.find(({ label, href }) => (label.includes('live') || label.includes('situs langsung')) && href.length > 0)
  if (live) return { label: 'live', href: live.href }

  const github = available.find(({ label }) => label.includes('github'))
  return github ? { label: 'github', href: github.href || '#' } : null
}

/**
 * Drives the 3D "lean back" of a project card. Writes three CSS variables on the hitbox:
 *   --p  (0..1)   how far the card has leaned back (eased, frame-rate independent)
 *   --px / --py   pointer position over the card, -1..1 (smoothed), for the fine tilt and parallax
 * and data-active="true" while the card is leaning or recovering (the beacon uses it).
 * All geometry lives in CSS (globals.css) so it can be tuned without touching this file.
 * Only runs for a real mouse/pen pointer and when reduced motion is off; keyboard focus also leans the card.
 */
export function attachProjectLean(hit: HTMLElement): (() => void) | undefined {
  if (typeof matchMedia === 'undefined') return
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const stage = hit.querySelector('.project-card-stage') as HTMLElement | null
  if (!stage) return

  const cur = { p: 0, px: 0, py: 0 }
  const tgt = { p: 0, px: 0, py: 0 }
  let raf = 0
  let last = 0

  const frame = (now: number) => {
    const dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 1 / 60
    last = now
    const kLean = 1 - Math.exp(-dt * 7)
    const kPointer = 1 - Math.exp(-dt * 12)
    let moving = false
    for (const key of ['p', 'px', 'py'] as const) {
      const d = tgt[key] - cur[key]
      if (Math.abs(d) > 0.0007) { cur[key] += d * (key === 'p' ? kLean : kPointer); moving = true } else cur[key] = tgt[key]
    }
    hit.style.setProperty('--p', cur.p.toFixed(4))
    hit.style.setProperty('--px', cur.px.toFixed(4))
    hit.style.setProperty('--py', cur.py.toFixed(4))
    hit.dataset.active = cur.p > 0.004 || tgt.p > 0 ? 'true' : 'false'
    raf = moving ? requestAnimationFrame(frame) : 0
  }
  const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame) } }
  const isPointer = (e: PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen'

  const enter = (e: PointerEvent) => { if (!isPointer(e)) return; tgt.p = 1; kick() }
  const move = (e: PointerEvent) => {
    if (!isPointer(e)) return
    const r = stage.getBoundingClientRect()
    tgt.px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
    tgt.py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
    tgt.p = 1
    kick()
  }
  const leave = () => { tgt.p = 0; tgt.px = 0; tgt.py = 0; kick() }
  const focusIn = () => { tgt.p = 1; kick() }
  const focusOut = () => { if (!hit.matches(':hover')) leave() }

  hit.addEventListener('pointerenter', enter)
  hit.addEventListener('pointermove', move)
  hit.addEventListener('pointerleave', leave)
  hit.addEventListener('focusin', focusIn)
  hit.addEventListener('focusout', focusOut)
  return () => {
    cancelAnimationFrame(raf)
    hit.removeEventListener('pointerenter', enter)
    hit.removeEventListener('pointermove', move)
    hit.removeEventListener('pointerleave', leave)
    hit.removeEventListener('focusin', focusIn)
    hit.removeEventListener('focusout', focusOut)
  }
}

