import type { MetadataRoute } from 'next'
import { projects, projectSlug } from '../data/content'
import { ALL } from '../data/nav'
import { SITE } from '../data/site'
import { LANGS } from '../lib/i18n'
import { SITE_URL } from '../lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...ALL.map((i) => `/${i.key}`), ...projects.map((p) => `/project/${projectSlug(p)}`)]
  // Images per page so the portrait and project screenshots can surface in image search for the name.
  const images = (p: string): string[] => {
    if (p === '' || p === '/about') return SITE.photos.map((x) => `${SITE_URL}${x.src}`)
    const project = projects.find((x) => p === `/project/${projectSlug(x)}`)
    return project?.image ? [`${SITE_URL}${project.image}`] : []
  }
  return paths.flatMap((p) => LANGS.map((l) => ({
    url: `${SITE_URL}/${l}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p === '/about' ? 0.9 : p.startsWith('/project/') ? 0.6 : 0.8,
    ...(images(p).length > 0 ? { images: images(p) } : {}),
    alternates: { languages: { ...Object.fromEntries(LANGS.map((x) => [x, `${SITE_URL}/${x}${p}`])), 'x-default': `${SITE_URL}/en${p}` } },
  })))
}
