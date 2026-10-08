export type AvailableProjectLink = { label: string; href: string }

/** Links with a real destination. Drops empty, whitespace-only, and hash-only hrefs. */
export function getAvailableProjectLinks(links: string[], hrefs: string[] = []): AvailableProjectLink[] {
  const out: AvailableProjectLink[] = []
  links.forEach((label, index) => {
    const href = (hrefs[index] ?? '').trim()
    if (!href || href === '#') return
    out.push({ label, href })
  })
  return out
}
