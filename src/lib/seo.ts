/** Absolute site origin: explicit env > Vercel production domain (set automatically on Vercel) > localhost. */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')).replace(/\/+$/, '')

/** Name variants people may type into a search engine. */
export const NAME_VARIANTS = ['Ghina Emelia Yantes', 'Ghina Yantes', 'Ghina Emelia', 'ghinayantes']

/** Every word order of a phrase, lower-cased ('ghina emelia yantes', 'yantes ghina emelia', ...), for people who type a name out of order. */
export function keywordScrambles(phrase: string): string[] {
  const out = new Set<string>()
  const permute = (rest: string[], picked: string[]) => {
    if (rest.length === 0) { out.add(picked.join(' ')); return }
    rest.forEach((w, i) => permute([...rest.slice(0, i), ...rest.slice(i + 1)], [...picked, w]))
  }
  permute(phrase.toLowerCase().split(/\s+/).filter(Boolean), [])
  return [...out]
}

/** Spellings people commonly get wrong when typing the name. */
const NAME_MISSPELLINGS = ['Gina Emelia Yantes', 'Ghina Amelia Yantes', 'Ghina Emilia Yantes', 'Ghina Emelya Yantes', 'Ghina Emelia Yantez', 'Gina Yantes', 'Ghina Yantez']

export const SEO_KEYWORDS = [...new Set([
  ...NAME_VARIANTS,
  ...NAME_MISSPELLINGS,
  'Ghina ITB',
  'Ghina Informatika ITB',
  'Ghina Emelia Yantes ITB',
  'Ghina Emelia Yantes portfolio',
  'Ghina Emelia Yantes portofolio',
  'Ghina Emelia Yantes Informatika',
  'Ghina Emelia Yantes HMIF',
  'Ghina Emelia Yantes Padang Panjang',
  'Ghina Emelia Yantes LinkedIn',
  'Ghina Emelia Yantes GitHub',
  'Ghina Emelia Yantes Paragon Scholarship',
  'Ghina Emelia Yantes olimpiade matematika',
  'Ghina Yantes ITB',
  'Ghina Yantes Informatika',
  'Ghina HMIF ITB',
  'Ghina ARKAVIDIA',
  'siapa Ghina Emelia Yantes',
  'who is Ghina Emelia Yantes',
  'hire Ghina Emelia Yantes',
  'Informatics ITB',
  'Informatika ITB',
  'Institut Teknologi Bandung',
  'Bandung Institute of Technology',
  'mahasiswa Informatika ITB',
  'web developer',
  'frontend developer',
  'UI/UX designer',
  'software engineering student',
  'portfolio',
  'portofolio',
  ...keywordScrambles('Ghina Emelia Yantes'),
  ...keywordScrambles('Ghina Yantes ITB'),
])]

/** Home title and description: the full name leads both, since people searching for a person type the name. */
export const SEO_TITLE: Record<'en' | 'id', string> = {
  en: 'Ghina Emelia Yantes — Informatics Student at ITB | Portfolio',
  id: 'Ghina Emelia Yantes — Mahasiswa Informatika ITB | Portofolio',
}
export const SEO_DESCRIPTION: Record<'en' | 'id', string> = {
  en: 'Official portfolio of Ghina Emelia Yantes, an Informatics student at Institut Teknologi Bandung (ITB): projects, experience, awards, skills, and contact.',
  id: 'Portofolio resmi Ghina Emelia Yantes, mahasiswa Informatika Institut Teknologi Bandung (ITB): proyek, pengalaman, penghargaan, keahlian, dan kontak.',
}

/** hreflang map for a path suffix ('' for home), including x-default. */
export function languageAlternates(langs: readonly string[], suffix: string): Record<string, string> {
  return { ...Object.fromEntries(langs.map((x) => [x, `/${x}${suffix}`])), 'x-default': `/en${suffix}` }
}

type SeoLang = 'en' | 'id'

/**
 * Open Graph + Twitter fields for one page. Metadata merges shallowly across segments, so a page that sets
 * `openGraph` must repeat the shared fields (site name, image) instead of inheriting them from the layout.
 */
export function socialMeta({ lang, path, title, description, siteName, image = '/og-image.png', type = 'website' }: {
  lang: SeoLang
  path: string
  title: string
  description: string
  siteName: string
  image?: string
  type?: 'website' | 'article'
}) {
  return {
    openGraph: {
      type,
      siteName,
      title,
      description,
      url: `/${lang}${path}`,
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: lang === 'id' ? 'en_US' : 'id_ID',
      images: [{ url: image, alt: title }],
    },
    twitter: { card: 'summary_large_image' as const, title, description, images: [image] },
  }
}

/** schema.org BreadcrumbList from [name, path] pairs (path is appended to /{lang}). */
export function breadcrumbLd(lang: SeoLang, trail: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}/${lang}${path}` })),
  }
}

/** Serializes JSON-LD for an inline <script>. "<" is escaped so no value can end the script element early. */
export const jsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c')
