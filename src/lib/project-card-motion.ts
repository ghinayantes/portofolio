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
