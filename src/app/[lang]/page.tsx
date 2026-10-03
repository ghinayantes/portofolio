import type { Metadata } from 'next'
import Home from '../../views/Home'
import { SITE } from '../../data/site'
import { LANGS, isLang } from '../../lib/i18n'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const l = isLang(lang) ? lang : 'en'
  return {
    title: { absolute: `${SITE.name} — Portfolio` },
    description: SITE.lead[l],
    alternates: { canonical: `/${l}`, languages: Object.fromEntries(LANGS.map((x) => [x, `/${x}`])) },
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  const l = isLang(lang) ? lang : 'en'
  const ld = { '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, jobTitle: SITE.role[l], email: SITE.email }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Home />
    </>
  )
}
