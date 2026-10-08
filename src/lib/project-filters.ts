export type ProjectStatus = 'completed' | 'in-progress'
export type SortKey = 'newest' | 'az' | 'status'
export type FilterState = { status: 'all' | ProjectStatus; tags: Set<string>; q: string; sort: SortKey }
export type FilterableProject = {
  title: string | { en: string; id: string }
  desc: string | { en: string; id: string }
  tags: string[]
  status: ProjectStatus
  date: string
}

type Lang = 'en' | 'id'

const resolve = (v: string | { en: string; id: string }, lang: Lang): string =>
  typeof v === 'string' ? v : v[lang]

export function normalizeQuery(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

function matchesQuery(p: FilterableProject, q: string, lang: Lang, tagLabels: (id: string) => string): boolean {
  const needle = normalizeQuery(q)
  if (!needle) return true
  const hay = normalizeQuery(
    [resolve(p.title, lang), resolve(p.desc, lang), ...p.tags.map(tagLabels)].join(' '),
  )
  return hay.includes(needle)
}

export function sortProjectsV2(list: FilterableProject[], sort: SortKey, lang: Lang): FilterableProject[] {
  const copy = [...list]
  if (sort === 'newest') copy.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  else if (sort === 'az') copy.sort((a, b) => resolve(a.title, lang).localeCompare(resolve(b.title, lang)))
  else copy.sort((a, b) => Number(a.status === 'in-progress') - Number(b.status === 'in-progress') || resolve(a.title, lang).localeCompare(resolve(b.title, lang)))
  return copy
}

export function filterProjectsV2(
  list: FilterableProject[],
  f: FilterState,
  lang: Lang,
  tagLabels: (id: string) => string,
): FilterableProject[] {
  const matched = list.filter((p) => {
    const okStatus = f.status === 'all' || p.status === f.status
    const okTags = f.tags.size === 0 || p.tags.some((t) => f.tags.has(t))
    return okStatus && okTags && matchesQuery(p, f.q, lang, tagLabels)
  })
  return sortProjectsV2(matched, f.sort, lang)
}

export function facetCounts(
  list: FilterableProject[],
  f: FilterState,
  lang: Lang,
  tagLabels: (id: string) => string,
): { status: Record<string, number>; tech: Record<string, number> } {
  const allTags = Array.from(new Set(list.flatMap((p) => p.tags)))
  const tech: Record<string, number> = {}
  for (const id of allTags) {
    tech[id] = list.filter((p) => {
      const okStatus = f.status === 'all' || p.status === f.status
      return okStatus && p.tags.includes(id) && matchesQuery(p, f.q, lang, tagLabels)
    }).length
  }
  const status: Record<string, number> = {
    all: filterProjectsV2(list, { ...f, status: 'all' }, lang, tagLabels).length,
    completed: filterProjectsV2(list, { ...f, status: 'completed' }, lang, tagLabels).length,
    'in-progress': filterProjectsV2(list, { ...f, status: 'in-progress' }, lang, tagLabels).length,
  }
  return { status, tech }
}

const VALID_STATUS = new Set(['all', 'completed', 'in-progress'])
const VALID_SORT = new Set(['newest', 'az', 'status'])

export function parseProjectSearchParams(sp: URLSearchParams): FilterState {
  const rawStatus = sp.get('status') ?? 'all'
  const rawSort = sp.get('sort') ?? 'newest'
  const rawTech = sp.get('tech') ?? ''
  const status = (VALID_STATUS.has(rawStatus) ? rawStatus : 'all') as FilterState['status']
  const sort = (VALID_SORT.has(rawSort) ? rawSort : 'newest') as SortKey
  const tags = new Set(rawTech.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))
  return { status, tags, q: sp.get('q') ?? '', sort }
}

export function serializeProjectFilters(f: FilterState): string {
  const sp = new URLSearchParams()
  if (f.status !== 'all') sp.set('status', f.status)
  if (f.tags.size > 0) sp.set('tech', Array.from(f.tags).sort().join(','))
  if (f.q.trim()) sp.set('q', f.q.trim())
  if (f.sort !== 'newest') sp.set('sort', f.sort)
  return sp.toString()
}
