import type { Metadata } from 'next'
import Home from '../../views/Home'
import { SITE } from '../../data/site'
import { LANGS, isLang } from '../../lib/i18n'
import { NAME_VARIANTS, SITE_URL, languageAlternates } from '../../lib/seo'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const l = isLang(lang) ? lang : 'en'
  return {
    title: { absolute: `${SITE.name} — Portfolio` },
    description: SITE.lead[l],
    alternates: { canonical: `/${l}`, languages: languageAlternates(LANGS, '') },
    openGraph: {
      type: 'profile',
      firstName: 'Ghina Emelia',
      lastName: 'Yantes',
      siteName: SITE.name,
      title: `${SITE.name} — Portfolio`,
      description: SITE.lead[l],
      url: `/${l}`,
      locale: l === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: l === 'id' ? 'en_US' : 'id_ID',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${SITE.name} — Portfolio` }],
    },
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const l = isLang(lang) ? lang : 'en'
  const sameAs = SITE.contacts.filter((c) => ['linkedin', 'github', 'instagram'].includes(c.key)).map((c) => c.href)
  const personId = `${SITE_URL}/#person`
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: SITE.name,
        alternateName: NAME_VARIANTS.filter((n) => n !== SITE.name),
        givenName: 'Ghina Emelia',
        familyName: 'Yantes',
        url: `${SITE_URL}/${l}`,
        image: `${SITE_URL}${SITE.photos[0]?.src ?? '/og-image.png'}`,
        jobTitle: SITE.role[l],
        description: SITE.lead[l],
        email: `mailto:${SITE.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Bandung', addressCountry: 'ID' },
        affiliation: { '@type': 'CollegeOrUniversity', name: 'Institut Teknologi Bandung', url: 'https://www.itb.ac.id' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Institut Teknologi Bandung', url: 'https://www.itb.ac.id' },
        knowsAbout: ['Software Engineering', 'Web Development', 'UI/UX Design', 'Artificial Intelligence', 'TypeScript', 'React', 'Next.js', 'Python', 'Java'],
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        alternateName: [`${SITE.name} Portfolio`, ...NAME_VARIANTS.filter((n) => n !== SITE.name)],
        inLanguage: [...LANGS],
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/${l}#profile`,
        url: `${SITE_URL}/${l}`,
        name: `${SITE.name} — Portfolio`,
        inLanguage: l,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': personId },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Home />
    </>
  )
}
