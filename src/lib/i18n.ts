export const LANGS = ['en', 'id'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'
export const isLang = (x: string): x is Lang => (LANGS as readonly string[]).includes(x)

/** Language-switch target that preserves the query string (e.g. project filters). */
export function switchLangPath(pathname: string, search: string, next: Lang): string {
  const base = pathname.replace(/^\/(en|id)/, '/' + next)
  if (!search) return base
  return `${base}${search.startsWith('?') ? search : `?${search}`}`
}
