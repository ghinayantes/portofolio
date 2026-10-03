export const LANGS = ['en', 'id'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'
export const isLang = (x: string): x is Lang => (LANGS as readonly string[]).includes(x)
