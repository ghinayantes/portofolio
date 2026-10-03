import type { MetadataRoute } from 'next'
import { ALL } from '../data/nav'
import { LANGS } from '../lib/i18n'
import { SITE_URL } from '../lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...ALL.map((i) => `/${i.key}`)]
  return paths.flatMap((p) => LANGS.map((l) => ({
    url: `${SITE_URL}/${l}${p}`,
    lastModified: new Date(),
    alternates: { languages: Object.fromEntries(LANGS.map((x) => [x, `${SITE_URL}/${x}${p}`])) },
  })))
}
