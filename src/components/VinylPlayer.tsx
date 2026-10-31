'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { FaBackwardStep, FaForwardStep, FaPause, FaPlay, FaShuffle, FaSpotify } from 'react-icons/fa6'
import { useSettings } from '../context/Settings'
import type { Track } from '../data/playlist'

/** Subset of Spotify's iFrame API (https://developer.spotify.com/documentation/embeds/references/iframe-api) used here. */
type PlaybackUpdate = { data: { isPaused: boolean; isBuffering: boolean; duration: number; position: number } }
type EmbedController = {
  addListener(event: 'ready', cb: () => void): void
  addListener(event: 'playback_update', cb: (e: PlaybackUpdate) => void): void
  loadUri(uri: string, preferVideo?: boolean, startAtSeconds?: number): void
  play(): void
  togglePlay(): void
  seek(seconds: number): void
  destroy(): void
}
type IFrameAPI = {
  createController(el: HTMLElement, options: { uri: string; width?: string | number; height?: string | number }, cb: (c: EmbedController) => void): void
}
declare global {
  interface Window { onSpotifyIframeApiReady?: (api: IFrameAPI) => void }
}

const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1'
let apiPromise: Promise<IFrameAPI> | null = null

/** Loads the iFrame API script once per page; later mounts reuse the same promise. */
function loadApi(): Promise<IFrameAPI> {
  if (apiPromise) return apiPromise
  apiPromise = new Promise<IFrameAPI>((resolve, reject) => {
    const s = document.createElement('script')
    // The loader pulls a second script, so a blocked or slow chain also falls back to the plain embed.
    const timer = window.setTimeout(() => fail(), 10000)
    const fail = () => { window.clearTimeout(timer); apiPromise = null; s.remove(); reject(new Error('Spotify iFrame API failed to load')) }
    window.onSpotifyIframeApiReady = (api) => { window.clearTimeout(timer); resolve(api) }
    s.src = API_SRC
    s.async = true
    s.onerror = fail
    document.body.appendChild(s)
  })
  return apiPromise
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Tonearm angles (deg): parked off the record, then from the outer groove to the inner one. */
const ARM_PARK = -22
const ARM_START = 6
const ARM_SWEEP = 18

/**
 * Turntable player: our own deck, controls and tracklist drive a compact Spotify embed (the actual audio source).
 * Visitors not logged in to Spotify hear Spotify's 30-second previews; that limit comes from Spotify.
 */
export default function VinylPlayer({ playlistId, tracks }: { playlistId: string; tracks: readonly Track[] }) {
  const { lang } = useSettings()
  const id = lang === 'id'
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<EmbedController | null>(null)
  const pendingPlay = useRef(false)
  // True once the loaded track is seen playing away from its end; an end reached after that advances once.
  const armed = useRef(false)
  const list = useRef<HTMLOListElement>(null)
  const covers = useRef(new Map<string, string>())
  const advance = useRef<() => void>(() => {})

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [cover, setCover] = useState<string | null>(null)
  const [scrub, setScrub] = useState<number | null>(null)
  const [armDrag, setArmDrag] = useState<number | null>(null)

  const track = tracks[index]
  const length = duration > 0 ? duration : track.ms
  const shown = scrub ?? position
  const progress = length > 0 ? Math.min(1, shown / length) : 0

  // Cover for the current track (oEmbed allows cross-origin reads); cached so going back is instant.
  useEffect(() => {
    const cached = covers.current.get(track.id)
    if (cached) { setCover(cached); return }
    const ctrl = new AbortController()
    fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${track.id}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<{ thumbnail_url?: string }>) : null))
      .then((d) => { if (d?.thumbnail_url) { covers.current.set(track.id, d.thumbnail_url); setCover(d.thumbnail_url) } })
      .catch(() => {})
    return () => ctrl.abort()
  }, [track.id])

  // The API swaps the element it is given for an iframe, so it gets a child node React does not manage.
  useEffect(() => {
    const root = host.current
    if (!root) return
    let alive = true
    const mount = document.createElement('div')
    root.appendChild(mount)
    loadApi()
      .then((api) => {
        if (!alive) return
        api.createController(mount, { uri: `spotify:track:${tracks[0].id}`, width: '100%', height: 80 }, (c) => {
          if (!alive) { c.destroy(); return }
          controller.current = c
          c.addListener('ready', () => {
            setReady(true)
            if (pendingPlay.current) { pendingPlay.current = false; c.play() }
          })
          c.addListener('playback_update', ({ data }) => {
            const nowPlaying = !data.isPaused
            setPlaying(nowPlaying)
            setPosition(data.position)
            setDuration(data.duration)
            // Spotify may not report a pause when a preview runs out, so the end is judged by position alone.
            if (data.duration <= 0) return
            if (data.position < data.duration - 1500) armed.current = true
            else if (armed.current && data.position >= data.duration - 600) { armed.current = false; advance.current() }
          })
        })
      })
      .catch(() => { if (alive) setFailed(true) })
    return () => {
      alive = false
      controller.current?.destroy()
      controller.current = null
      root.replaceChildren()
    }
  }, [tracks])

  const select = useCallback((i: number) => {
    const c = controller.current
    if (!c) return
    const next = (i + tracks.length) % tracks.length
    setIndex(next)
    setPosition(0)
    setDuration(0)
    armed.current = false
    pendingPlay.current = true
    c.loadUri(`spotify:track:${tracks[next].id}`)
  }, [tracks])

  const step = useCallback((dir: 1 | -1) => {
    if (shuffle && tracks.length > 1) {
      let r = index
      while (r === index) r = Math.floor(Math.random() * tracks.length)
      select(r)
    } else select(index + dir)
  }, [index, select, shuffle, tracks.length])

  useEffect(() => { advance.current = () => step(1) }, [step])

  // Keep the current row in view inside the list without scrolling the page.
  useEffect(() => {
    const ol = list.current
    const row = ol?.children[index] as HTMLElement | undefined
    if (!ol || !row) return
    const top = row.offsetTop
    if (top < ol.scrollTop || top + row.offsetHeight > ol.scrollTop + ol.clientHeight) ol.scrollTo({ top: top - ol.clientHeight / 3, behavior: 'smooth' })
  }, [index])

  const toggle = () => controller.current?.togglePlay()
  const prev = () => {
    // Like most players: restart the song unless it has barely begun.
    if (position > 3000) controller.current?.seek(0)
    else step(-1)
  }
  const seekTo = (ms: number) => {
    controller.current?.seek(ms / 1000)
    setPosition(ms)
    if (!playing) controller.current?.togglePlay()
  }

  // Drag the tonearm: drop it on the record to seek, lift it off to pause.
  const armAngle = (e: ReactPointerEvent<HTMLElement>) => {
    const base = e.currentTarget.querySelector('.vinyl__arm-base')?.getBoundingClientRect()
    if (!base) return ARM_PARK
    const dx = e.clientX - (base.left + base.width / 2)
    const dy = e.clientY - (base.top + base.height / 2)
    return Math.max(ARM_PARK, Math.min(ARM_START + ARM_SWEEP, (Math.atan2(-dx, dy) * 180) / Math.PI))
  }
  const onArmDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!ready) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setArmDrag(armAngle(e))
  }
  const onArmMove = (e: ReactPointerEvent<HTMLElement>) => { if (armDrag !== null) setArmDrag(armAngle(e)) }
  const onArmUp = (e: ReactPointerEvent<HTMLElement>) => {
    if (armDrag === null) return
    const a = armAngle(e)
    setArmDrag(null)
    if (a < ARM_START - 4) { if (playing) toggle(); return }
    seekTo(Math.max(0, Math.min(1, (a - ARM_START) / ARM_SWEEP)) * length)
  }

  const armRotation = armDrag ?? (playing ? ARM_START + progress * ARM_SWEEP : ARM_PARK)
  const t = {
    nowPlaying: id ? 'Sedang diputar' : 'Now playing',
    play: id ? 'Putar' : 'Play',
    pause: id ? 'Jeda' : 'Pause',
    prev: id ? 'Lagu sebelumnya' : 'Previous track',
    next: id ? 'Lagu berikutnya' : 'Next track',
    shuffle: id ? 'Acak' : 'Shuffle',
    seek: id ? 'Posisi lagu' : 'Song position',
    list: id ? 'Daftar lagu' : 'Tracklist',
    open: id ? 'Buka playlist di Spotify' : 'Open playlist on Spotify',
    embed: id ? 'Pemutar Spotify' : 'Spotify player',
    preview: id ? 'Belum login Spotify? Kamu akan dengar cuplikan 30 detik.' : 'Not logged in to Spotify? You will hear 30-second previews.',
  }

  if (failed) {
    return (
      <iframe
        title={t.embed}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="about-spotify__frame"
      />
    )
  }

  return (
    <div className={`vinyl${playing ? ' is-playing' : ''}${armDrag !== null ? ' is-dragging' : ''}`}>
      <div className="vinyl__deck">
        <button
          type="button"
          className="vinyl__platter"
          onClick={toggle}
          disabled={!ready}
          aria-pressed={playing}
          aria-label={`${playing ? t.pause : t.play}: ${track.title}`}
        >
          <span className="vinyl__record" aria-hidden="true">
            <span className="vinyl__label">
              {cover && <img key={cover} src={cover} alt="" className="vinyl__cover" />}
              <span className="vinyl__spindle" />
            </span>
          </span>
          <span className="vinyl__hint" aria-hidden="true">{playing ? <FaPause /> : <FaPlay />}</span>
        </button>
        <span
          className="vinyl__arm"
          aria-hidden="true"
          style={{ '--arm': `${armRotation.toFixed(2)}deg` } as CSSProperties}
          onPointerDown={onArmDown}
          onPointerMove={onArmMove}
          onPointerUp={onArmUp}
          onPointerCancel={() => setArmDrag(null)}
        >
          <span className="vinyl__arm-base" />
          <span className="vinyl__arm-rod" />
          <span className="vinyl__arm-head" />
        </span>
        <span className="vinyl__eq" aria-hidden="true"><i /><i /><i /><i /></span>
      </div>

      <div className="vinyl__panel">
        <div className="vinyl__now" aria-live="polite">
          <p className="vinyl__eyebrow">{t.nowPlaying} · {String(index + 1).padStart(2, '0')}/{tracks.length}</p>
          <p key={track.id} className="vinyl__title">{track.title}</p>
          <p className="vinyl__artist">{track.artist}</p>
        </div>

        <div className="vinyl__seek">
          <span>{clock(shown)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(1, Math.round(length))}
            step={500}
            value={Math.round(shown)}
            disabled={!ready}
            aria-label={t.seek}
            aria-valuetext={`${clock(shown)} / ${clock(length)}`}
            style={{ '--p': progress.toFixed(4) } as CSSProperties}
            onChange={(e) => setScrub(Number(e.target.value))}
            onPointerUp={() => { if (scrub !== null) { seekTo(scrub); setScrub(null) } }}
            onKeyUp={() => { if (scrub !== null) { seekTo(scrub); setScrub(null) } }}
          />
          <span>{clock(length)}</span>
        </div>

        <div className="vinyl__controls">
          <button type="button" className={`vinyl__ctl${shuffle ? ' is-on' : ''}`} onClick={() => setShuffle((s) => !s)} aria-pressed={shuffle} aria-label={t.shuffle} title={t.shuffle}><FaShuffle /></button>
          <button type="button" className="vinyl__ctl" onClick={prev} disabled={!ready} aria-label={t.prev} title={t.prev}><FaBackwardStep /></button>
          <button type="button" className="vinyl__ctl vinyl__ctl--main" onClick={toggle} disabled={!ready} aria-label={playing ? t.pause : t.play}>{playing ? <FaPause /> : <FaPlay />}</button>
          <button type="button" className="vinyl__ctl" onClick={() => step(1)} disabled={!ready} aria-label={t.next} title={t.next}><FaForwardStep /></button>
          <a className="vinyl__ctl" href={`https://open.spotify.com/playlist/${playlistId}`} target="_blank" rel="noopener noreferrer" aria-label={t.open} title={t.open}><FaSpotify /></a>
        </div>

        <div ref={host} className="vinyl__host" title={t.embed} />
        <p className="vinyl__note">{t.preview}</p>
      </div>

      <ol ref={list} className="vinyl__list" aria-label={t.list} data-lenis-prevent>
        {tracks.map((s, i) => (
          <li key={s.id}>
            <button type="button" className={`vinyl__row${i === index ? ' is-current' : ''}`} onClick={() => (i === index ? toggle() : select(i))} disabled={!ready} aria-current={i === index ? 'true' : undefined}>
              <span className="vinyl__row-no">{i === index && playing ? <span className="vinyl__row-eq" aria-hidden="true"><i /><i /><i /></span> : String(i + 1).padStart(2, '0')}</span>
              <span className="vinyl__row-main">
                <span className="vinyl__row-title">{s.title}</span>
                <span className="vinyl__row-artist">{s.artist}</span>
              </span>
              <span className="vinyl__row-time">{clock(s.ms)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
