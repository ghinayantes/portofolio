import type { Metadata } from 'next'
import Home from '../../views/Home'
import { SITE } from '../../data/site'
import { LANGS, isLang } from '../../lib/i18n'
import { awards, education, work } from '../../data/content'
import { localized } from '../../data/nav'
import { NAME_VARIANTS, SEO_DESCRIPTION, SEO_TITLE, SITE_URL, languageAlternates, jsonLd } from '../../lib/seo'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const l = isLang(lang) ? lang : 'en'
  return {
    title: { absolute: SEO_TITLE[l] },
    description: SEO_DESCRIPTION[l],
    alternates: { canonical: `/${l}`, languages: languageAlternates(LANGS, '') },
    openGraph: {
      type: 'profile',
      firstName: 'Ghina Emelia',
      lastName: 'Yantes',
      username: 'ghinayantes',
      siteName: SITE.name,
      title: SEO_TITLE[l],
      description: SEO_DESCRIPTION[l],
      url: `/${l}`,
      locale: l === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: l === 'id' ? 'en_US' : 'id_ID',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SEO_TITLE[l] }],
    },
    twitter: { card: 'summary_large_image', title: SEO_TITLE[l], description: SEO_DESCRIPTION[l], images: ['/og-image.png'] },
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
        additionalName: ['Ghina', 'Emelia'],
        url: `${SITE_URL}/${l}`,
        image: `${SITE_URL}${SITE.photos[0]?.src ?? '/og-image.png'}`,
        jobTitle: SITE.role[l],
        description: SEO_DESCRIPTION[l],
        disambiguatingDescription: SITE.lead[l],
        mainEntityOfPage: { '@id': `${SITE_URL}/${l}#profile` },
        email: `mailto:${SITE.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Bandung', addressCountry: 'ID' },
        affiliation: { '@type': 'CollegeOrUniversity', name: 'Institut Teknologi Bandung', alternateName: ['ITB', 'Bandung Institute of Technology'], url: 'https://www.itb.ac.id' },
        // Schools from the education list (the current university is already the affiliation above).
        alumniOf: education.filter((e) => !e.current).map((e) => ({ '@type': 'EducationalOrganization', name: localized(e.title, l) })),
        // Employers from the work list (committee and event entries are not organizations, so they are left out).
        memberOf: [...new Set(work.map((w) => localized(w.company, 'en')))].map((name) => ({ '@type': 'Organization', name })),
        award: awards.map((a) => localized(a.title, l)),
        knowsLanguage: ['Indonesian', 'English'],
        homeLocation: { '@type': 'Place', name: 'Bandung, Indonesia', address: { '@type': 'PostalAddress', addressLocality: 'Bandung', addressRegion: 'West Java', addressCountry: 'ID' } },
        // Current and past roles, so search engines can connect the name to each organization.
        hasOccupation: work.map((w) => ({ '@type': 'Occupation', name: localized(w.role, l), description: localized(w.desc, l) })),
        nationality: { '@type': 'Country', name: 'Indonesia' },
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
        name: SEO_TITLE[l],
        description: SEO_DESCRIPTION[l],
        dateModified: new Date().toISOString(),
        inLanguage: l,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': personId },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Home />
    </>
  )
}
