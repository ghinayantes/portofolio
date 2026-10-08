type Localized = string | { en: string; id: string }
type Lang = 'en' | 'id'
type Taggable = { tags?: Localized[] }
type Statusable = Taggable & { wip?: boolean }

/** Real tech tags that may appear as a project stack filter. Anything else is a generic descriptor. */
const TECH_TAGS = new Set([
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'SQL',
  'C',
  'Assembly',
  'Prolog',
  'Next.js',
  'React',
  'Tailwind',
  'Figma',
  'JavaFX',
  'CSS',
  'HTML',
  'Maven',
])

const resolve = (value: Localized, lang: Lang): string =>
  typeof value === 'string' ? value : value[lang]

/** Stack chips for one project: real tech only, order preserved, deduplicated. */
export function getProjectStacks(p: Taggable, lang: Lang): string[] {
  const names: string[] = []
  for (const t of p.tags ?? []) {
    const name = resolve(t, lang)
    if (TECH_TAGS.has(name) && !names.includes(name)) names.push(name)
  }
  return names
}

/** Status + stack filtering shared by the project page and portfolio section. */
export function filterProjects<T extends Statusable>(
  list: T[],
  lang: Lang,
  status: 'all' | 'done' | 'wip',
  stack: string,
): T[] {
  return list.filter((p) => {
    const okStatus = status === 'all' || (status === 'wip' ? p.wip : !p.wip)
    const okStack = stack === 'all' || getProjectStacks(p, lang).includes(stack)
    return okStatus && okStack
  })
}
