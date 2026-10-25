'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useRouter } from 'next/navigation'
import { NAV } from '../data/nav'
import { useSettings } from '../context/Settings'

type Kind = 'root' | 'group' | 'page'
type GraphNode = { id: string; label: string; path: string; kind: Kind; group: number; x: number; y: number; vx: number; vy: number; fixed: boolean }
type Edge = [number, number]

const RADIUS: Record<Kind, number> = { root: 22, group: 15, page: 9 }
const LINK: Record<Kind, number> = { root: 0, group: 150, page: 78 }
const W = 760
const H = 600
/** Heat never drops below this, so the layout keeps its shape while the idle drift moves it. */
const IDLE = 0.22

/** Home → nav groups → pages, laid out on rings around the centre as the simulation's starting point. */
function buildGraph(lang: 'en' | 'id', home: string): { nodes: GraphNode[]; edges: Edge[] } {
  const nodes: GraphNode[] = [{ id: 'home', label: home, path: '/', kind: 'root', group: -1, x: W / 2, y: H / 2, vx: 0, vy: 0, fixed: false }]
  const edges: Edge[] = []
  NAV.forEach((g, gi) => {
    const a = (gi / NAV.length) * Math.PI * 2 - Math.PI / 2
    const gIndex = nodes.length
    nodes.push({ id: `g${gi}`, label: g.title[lang], path: '', kind: 'group', group: gi, x: W / 2 + Math.cos(a) * 140, y: H / 2 + Math.sin(a) * 140, vx: 0, vy: 0, fixed: false })
    edges.push([0, gIndex])
    g.items.forEach((it, k) => {
      const b = a + (k - (g.items.length - 1) / 2) * 0.32
      nodes.push({ id: it.key, label: it.title[lang], path: '/' + it.key, kind: 'page', group: gi, x: W / 2 + Math.cos(b) * 230, y: H / 2 + Math.sin(b) * 230, vx: 0, vy: 0, fixed: false })
      edges.push([gIndex, nodes.length - 1])
    })
  })
  return { nodes, edges }
}

/**
 * Sitemap as an interactive force-directed graph: Home in the centre, nav groups around it, pages around their group.
 * The graph keeps floating gently once settled; nodes can be dragged (the layout springs back around them); hovering or focusing a node previews that page live on the right,
 * clicking it opens the page. Group nodes are not pages, so they only highlight their branch.
 */
export default function SitemapGraph() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const router = useRouter()
  const graph = useMemo(() => buildGraph(lang, lang === 'id' ? 'Beranda' : 'Home'), [lang])
  const nodes = useRef<GraphNode[]>(graph.nodes)
  const svg = useRef<SVGSVGElement>(null)
  const [, setFrame] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [preview, setPreview] = useState<GraphNode | null>(null)
  const drag = useRef<{ i: number; moved: boolean } | null>(null)
  const heat = useRef(1)
  const raf = useRef(0)
  const visible = useRef(true)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => { nodes.current = graph.nodes.map((n) => ({ ...n })); heat.current = 1; kick() }, [graph]) // eslint-disable-line react-hooks/exhaustive-deps

  /** One simulation step: pairwise repulsion, edge springs, a pull to the centre, a slow per-node drift, damping. Cools down to the idle heat. */
  const tick = (t = 0) => {
    const ns = nodes.current
    const k = heat.current
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j]
        let dx = b.x - a.x, dy = b.y - a.y
        const d2 = dx * dx + dy * dy || 0.01
        const f = (2600 / d2) * k
        const d = Math.sqrt(d2)
        dx /= d; dy /= d
        a.vx -= dx * f; a.vy -= dy * f
        b.vx += dx * f; b.vy += dy * f
      }
    }
    for (const [s, e] of graph.edges) {
      const a = ns[s], b = ns[e]
      const dx = b.x - a.x, dy = b.y - a.y
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01
      const f = (d - LINK[b.kind]) * 0.02 * k
      a.vx += (dx / d) * f; a.vy += (dy / d) * f
      b.vx -= (dx / d) * f; b.vy -= (dy / d) * f
    }
    ns.forEach((n, i) => {
      if (n.fixed) { n.vx = 0; n.vy = 0; return }
      n.vx += (W / 2 - n.x) * 0.004 * k
      n.vy += (H / 2 - n.y) * 0.004 * k
      // Each node wanders on its own slow orbit (different speed and phase), which makes the whole graph float.
      if (t) {
        n.vx += Math.sin(t / (1500 + (i % 5) * 230) + i * 1.7) * 0.022
        n.vy += Math.cos(t / (1700 + (i % 4) * 260) + i * 2.3) * 0.022
      }
      n.vx *= 0.82; n.vy *= 0.82
      n.x = Math.min(W - 30, Math.max(30, n.x + n.vx))
      n.y = Math.min(H - 30, Math.max(30, n.y + n.vy))
    })
    heat.current = Math.max(IDLE, k - 0.006)
  }

  const kick = () => {
    if (raf.current) return
    const loop = (t: number) => {
      tick(t)
      setFrame((f) => f + 1)
      // Keeps floating while on screen and the tab is visible; resumes from the observers below.
      raf.current = visible.current && !document.hidden ? requestAnimationFrame(loop) : 0
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let i = 0; i < 300; i++) tick()
      setFrame((f) => f + 1)
      return
    }
    raf.current = requestAnimationFrame(loop)
  }
  useEffect(() => {
    const el = box.current
    const io = el ? new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; if (e.isIntersecting) kick() }) : null
    if (el && io) io.observe(el)
    const vis = () => { if (!document.hidden) kick() }
    document.addEventListener('visibilitychange', vis)
    // Reset the frame id too: a cancelled-but-stored id would make kick() think the loop is still running (Strict Mode remounts).
    return () => { cancelAnimationFrame(raf.current); raf.current = 0; io?.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /** Pointer position in the SVG's own coordinate space (accounts for the fitted viewBox). */
  const toSvg = (e: ReactPointerEvent) => {
    const m = svg.current!.getScreenCTM()
    if (!m) return { x: 0, y: 0 }
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    return { x: p.x, y: p.y }
  }

  const show = (i: number) => {
    setHover(i)
    const n = nodes.current[i]
    if (n.kind !== 'group') setPreview(n)
  }

  const down = (i: number) => (e: ReactPointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { i, moved: false }
    nodes.current[i].fixed = true
    show(i)
  }
  const move = (e: ReactPointerEvent<SVGGElement>) => {
    if (!drag.current) return
    const p = toSvg(e)
    const n = nodes.current[drag.current.i]
    if (Math.abs(p.x - n.x) + Math.abs(p.y - n.y) > 2) drag.current.moved = true
    n.x = p.x; n.y = p.y
    heat.current = Math.max(heat.current, 0.5)
    kick()
  }
  const up = (e: ReactPointerEvent<SVGGElement>) => {
    const d = drag.current
    if (!d) return
    drag.current = null
    nodes.current[d.i].fixed = false
    heat.current = Math.max(heat.current, 0.3)
    kick()
    // A tap (no drag) on a page opens it; on touch screens the first tap only previews.
    const n = nodes.current[d.i]
    if (!d.moved && n.kind !== 'group' && (e.pointerType === 'mouse' || preview?.id === n.id)) router.push(`/${lang}${n.path === '/' ? '' : n.path}`)
  }

  const ns = nodes.current
  // Fit the view to the graph (plus room for labels) so it fills the panel on any screen. It eases towards the target
  // so the drift never makes the zoom twitch, and holds still while dragging.
  const fit = useRef<{ x: number; y: number; w: number; h: number } | null>(null)
  if (!drag.current) {
    const xs = ns.map((n) => n.x), ys = ns.map((n) => n.y)
    const pad = 64
    const goal = { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad, w: Math.max(...xs) - Math.min(...xs) + pad * 2, h: Math.max(...ys) - Math.min(...ys) + pad * 2 }
    const f = fit.current
    const e = heat.current > 0.5 || !f ? 1 : 0.06
    fit.current = f ? { x: f.x + (goal.x - f.x) * e, y: f.y + (goal.y - f.y) * e, w: f.w + (goal.w - f.w) * e, h: f.h + (goal.h - f.h) * e } : goal
  }
  const vb = fit.current ?? { x: 0, y: 0, w: W, h: H }
  const branch = hover === null ? null : ns[hover].kind === 'root' ? -2 : ns[hover].group
  const lit = (n: GraphNode) => branch === null || n.kind === 'root' || n.group === branch || branch === -2
  const src = preview ? `/${lang}${preview.path === '/' ? '' : preview.path}` : null

  return (
    <div ref={box} className="sgraph">
      <div className="sgraph__canvas">
        <p className="sgraph__hint">{id ? 'Seret simpul · arahkan untuk pratinjau · klik untuk membuka' : 'Drag nodes · hover to preview · click to open'}</p>
        <svg ref={svg} viewBox={`${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`} role="group" aria-label={id ? 'Peta situs interaktif' : 'Interactive sitemap'}>
          <defs>
            <marker id="sgraph-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" /></marker>
          </defs>
          {graph.edges.map(([s, e]) => {
            const a = ns[s], b = ns[e]
            const d = Math.hypot(b.x - a.x, b.y - a.y) || 1
            const r = RADIUS[b.kind] + 3
            return <line key={`${s}-${e}`} className={lit(b) ? 'sgraph__edge' : 'sgraph__edge is-dim'} x1={a.x} y1={a.y} x2={b.x - ((b.x - a.x) / d) * r} y2={b.y - ((b.y - a.y) / d) * r} markerEnd="url(#sgraph-arrow)" />
          })}
          {ns.map((n, i) => (
            <g
              key={n.id}
              className={`sgraph__node sgraph__node--${n.kind}${lit(n) ? '' : ' is-dim'}${hover === i ? ' is-hover' : ''}${preview?.id === n.id ? ' is-preview' : ''}`}
              transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}
              tabIndex={0}
              role={n.kind === 'group' ? undefined : 'link'}
              aria-label={n.label}
              onPointerDown={down(i)}
              onPointerMove={move}
              onPointerUp={up}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') show(i) }}
              onPointerLeave={() => setHover(null)}
              onFocus={() => show(i)}
              onBlur={() => setHover(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' && n.kind !== 'group') router.push(`/${lang}${n.path === '/' ? '' : n.path}`) }}
            >
              <circle r={RADIUS[n.kind]} />
              <text y={RADIUS[n.kind] + 15}>{n.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <aside className="sgraph__preview" aria-live="polite">
        <div className="sgraph__bar">
          <span className="sgraph__dot" data-on={!!preview} aria-hidden="true" />
          <b>{id ? 'Pratinjau' : 'Preview'}</b>
          {preview
            ? <a href={src ?? '#'} onClick={(e) => { e.preventDefault(); if (src) router.push(src) }} className="sgraph__open">{preview.label} ↗</a>
            : <span className="sgraph__tag">{id ? 'Arahkan ke simpul' : 'Hover over a node'}</span>}
        </div>
        <div className="sgraph__frame">
          {src ? (
            <iframe key={src} src={src} title={`${id ? 'Pratinjau' : 'Preview'}: ${preview?.label}`} loading="lazy" tabIndex={-1} />
          ) : (
            <div className="sgraph__empty">
              <span aria-hidden="true">↗</span>
              <p>{id ? 'Arahkan kursor ke simpul mana pun untuk melihat pratinjau langsung halamannya.' : 'Hover over any node on the graph to see a live preview of that page.'}</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
