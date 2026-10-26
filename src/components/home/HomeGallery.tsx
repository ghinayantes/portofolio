'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { localized } from '../../data/nav'
import { SITE } from '../../data/site'
import { useSettings } from '../../context/Settings'
import { Head } from './shared'

/** Home gallery: square campus and activity tiles revealed bottom-to-top as they enter view. */
export function HomeGallery() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const grid = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ul = grid.current
    if (!ul) return
    const items = Array.from(ul.querySelectorAll('li'))
    const cleanups: (() => void)[] = []
    const markLoaded = (img: HTMLImageElement) => {
      const item = img.closest('li')
      if (!item) return
      if (img.naturalWidth > img.naturalHeight * 1.5) item.classList.add('is-wide')
      item.dataset.imageLoaded = 'true'
      if (item.dataset.inView === 'true') item.dataset.revealed = 'true'
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const item = entry.target
        if (!(item instanceof HTMLLIElement)) return
        item.dataset.inView = 'true'
        if (item.dataset.imageLoaded === 'true') item.dataset.revealed = 'true'
      })
    })
    const section = ul.closest('section')
    const sectionObserver = section ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return
        items.forEach((item) => {
          delete item.dataset.inView
          delete item.dataset.revealed
        })
      })
    }) : null
    if (section) sectionObserver?.observe(section)
    ul.dataset.motionReady = 'true'
    items.forEach((item) => {
      observer.observe(item)
      const img = item.querySelector('img')
      if (!img) return
      if (img.complete) markLoaded(img)
      else {
        const onLoad = () => markLoaded(img)
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onLoad, { once: true })
        cleanups.push(() => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onLoad)
        })
      }
    })
    return () => {
      observer.disconnect()
      sectionObserver?.disconnect()
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  if (SITE.gallery.length === 0) return null
  return (
    <section className="home-section" aria-labelledby="home-gallery-title">
      <Head n="07" label={id ? 'Galeri' : 'Gallery'} title={id ? 'Kuliah dan kegiatan' : 'Campus life and activities'} titleId="home-gallery-title" />
      <ul ref={grid} className="home-gallery">
        {SITE.gallery.map((g, i) => (
          <li key={g.src} className={g.wide ? 'is-wide' : undefined} style={{ '--gallery-order': i } as CSSProperties}>
            <figure className="home-shot">
              <Image src={g.src} alt={localized(g.caption, lang)} fill
                sizes={g.wide
                  ? '(max-width: 639px) 100vw, (max-width: 1103px) 66vw, 50vw'
                  : '(max-width: 639px) 50vw, (max-width: 1103px) 33vw, 25vw'}
                loading="lazy" decoding="async" />
              <figcaption>{localized(g.caption, lang)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
