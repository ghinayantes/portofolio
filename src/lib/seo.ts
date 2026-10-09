/** Absolute site origin: explicit env > Vercel production domain (set automatically on Vercel) > localhost. */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')).replace(/\/+$/, '')

/** Name variants people may type into a search engine. */
export const NAME_VARIANTS = ['Ghina Emelia Yantes', 'Ghina Yantes', 'Ghina Emelia', 'ghinayantes']

export const SEO_KEYWORDS = [
  ...NAME_VARIANTS,
  'Ghina ITB',
  'Ghina Informatika ITB',
  'Ghina Emelia Yantes ITB',
  'Ghina Emelia Yantes portfolio',
  'Informatics ITB',
  'Institut Teknologi Bandung',
  'web developer',
  'UI/UX designer',
  'portfolio',
]

/** hreflang map for a path suffix ('' for home), including x-default. */
export function languageAlternates(langs: readonly string[], suffix: string): Record<string, string> {
  return { ...Object.fromEntries(langs.map((x) => [x, `/${x}${suffix}`])), 'x-default': `/en${suffix}` }
}
