import type { MetadataRoute } from 'next'
import { projects, projectSlug } from '../data/content'
import { ALL } from '../data/nav'
import { LANGS } from '../lib/i18n'
import { SITE_URL } from '../lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...ALL.map((i) => `/${i.key}`), ...projects.map((p) => `/project/${projectSlug(p)}`)]
  return paths.flatMap((p) => LANGS.map((l) => ({
    url: `${SITE_URL}/${l}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p.startsWith('/project/') ? 0.6 : 0.8,
    alternates: { languages: { ...Object.fromEntries(LANGS.map((x) => [x, `${SITE_URL}/${x}${p}`])), 'x-default': `${SITE_URL}/en${p}` } },
  })))
}
