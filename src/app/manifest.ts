import type { MetadataRoute } from 'next'
import { SITE } from '../data/site'
import { SEO_DESCRIPTION } from '../lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Portfolio`,
    short_name: 'Ghina Yantes',
    description: SEO_DESCRIPTION.en,
    start_url: '/',
    display: 'standalone',
    background_color: '#05060f',
    theme_color: '#05060f',
    icons: [{ src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }],
  }
}
