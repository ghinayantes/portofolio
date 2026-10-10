import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, projectSlug } from '../../../data/content'
import { ALL, NAV, localized } from '../../../data/nav'
import { SITE } from '../../../data/site'
import { SITE_URL, breadcrumbLd, languageAlternates, socialMeta, jsonLd } from '../../../lib/seo'
import { LANGS, isLang } from '../../../lib/i18n'
import { PageShell } from '../../../components/ui'
import { PageBody, PageStats } from '../../../views'

type Props = { params: Promise<{ lang: string; slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => LANGS.flatMap((lang) => ALL.map((i) => ({ lang, slug: i.key })))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const item = ALL.find((i) => i.key === slug)
  if (!item || !isLang(lang)) return {}
  // Nav descriptions are a few words long; add who the page is about so the snippet stands on its own in search results.
  const description = `${item.title[lang]}: ${item.desc[lang]}. ${SITE.name}, ${SITE.role[lang]}.`
  return {
    title: item.title[lang],
    description,
    alternates: { canonical: `/${lang}/${slug}`, languages: languageAlternates(LANGS, `/${slug}`) },
    ...socialMeta({ lang, path: `/${slug}`, title: `${item.title[lang]} — ${SITE.name}`, description, siteName: SITE.name }),
  }
}

export default async function Page({ params }: Props) {
  const { lang: langParam, slug } = await params
  const lang = isLang(langParam) ? langParam : 'en'
  const item = ALL.find((i) => i.key === slug)
  if (!item) notFound()
  const url = `${SITE_URL}/${lang}/${slug}`
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': slug === 'hire' ? 'ContactPage' : slug === 'about' ? 'AboutPage' : 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: `${item.title[lang]} — ${SITE.name}`,
        description: item.desc[lang],
        inLanguage: lang,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#person` },
        ...(slug === 'about' ? { mainEntity: { '@id': `${SITE_URL}/#person` } } : {}),
        // The project list as structured items, each pointing at its own page.
        ...(slug === 'project' ? { hasPart: projects.map((p) => ({ '@type': 'CreativeWork', name: localized(p.title, lang), description: localized(p.desc, lang), url: `${SITE_URL}/${lang}/project/${projectSlug(p)}` })) } : {}),
      },
      breadcrumbLd(lang, [[lang === 'id' ? 'Beranda' : 'Home', ''], [NAV[item.gi].title[lang], `/${NAV[item.gi].items[0].key}`], [item.title[lang], `/${slug}`]]),
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <PageShell item={item} gi={item.gi} compact={slug !== 'portfolio'} stats={<PageStats k={slug} />}><PageBody k={slug} /></PageShell>
    </>
  )
}
