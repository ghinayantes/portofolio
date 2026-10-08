export type TagGroup = 'language' | 'framework' | 'tool'
export type TagDef = { id: string; label: { en: string; id: string }; group: TagGroup }

export const PROJECT_TAGS: TagDef[] = [
  { id: 'python', label: { en: 'Python', id: 'Python' }, group: 'language' },
  { id: 'javascript', label: { en: 'JavaScript', id: 'JavaScript' }, group: 'language' },
  { id: 'typescript', label: { en: 'TypeScript', id: 'TypeScript' }, group: 'language' },
  { id: 'java', label: { en: 'Java', id: 'Java' }, group: 'language' },
  { id: 'sql', label: { en: 'SQL', id: 'SQL' }, group: 'language' },
  { id: 'c', label: { en: 'C', id: 'C' }, group: 'language' },
  { id: 'assembly', label: { en: 'Assembly', id: 'Assembly' }, group: 'language' },
  { id: 'prolog', label: { en: 'Prolog', id: 'Prolog' }, group: 'language' },
  { id: 'html', label: { en: 'HTML', id: 'HTML' }, group: 'language' },
  { id: 'css', label: { en: 'CSS', id: 'CSS' }, group: 'language' },
  { id: 'nextjs', label: { en: 'Next.js', id: 'Next.js' }, group: 'framework' },
  { id: 'react', label: { en: 'React', id: 'React' }, group: 'framework' },
  { id: 'tailwind', label: { en: 'Tailwind', id: 'Tailwind' }, group: 'framework' },
  { id: 'javafx', label: { en: 'JavaFX', id: 'JavaFX' }, group: 'framework' },
  { id: 'figma', label: { en: 'Figma', id: 'Figma' }, group: 'tool' },
  { id: 'maven', label: { en: 'Maven', id: 'Maven' }, group: 'tool' },
]

const BY_ID = new Map(PROJECT_TAGS.map((t) => [t.id, t]))
const LEGACY = new Map(PROJECT_TAGS.map((t) => [t.label.en.toLowerCase(), t.id]))

export function isTechTagId(id: string): boolean {
  return BY_ID.has(id)
}

export function tagLabel(id: string, lang: 'en' | 'id'): string {
  const found = BY_ID.get(id)
  if (!found) return id
  return lang === 'id' ? found.label.id : found.label.en
}

export function legacyTagToId(raw: string): string | null {
  const key = raw.trim().toLowerCase()
  return LEGACY.get(key) ?? null
}

/** Keeps only known tag ids so unknown URL tokens fall back instead of matching nothing. */
export function sanitizeTechIds(ids: Set<string>): Set<string> {
  return new Set(Array.from(ids).filter((id) => BY_ID.has(id)))
}
