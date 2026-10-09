import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ALL } from '../../../data/nav'
import { languageAlternates } from '../../../lib/seo'
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
  return {
    title: item.title[lang],
    description: item.desc[lang],
    alternates: { canonical: `/${lang}/${slug}`, languages: languageAlternates(LANGS, `/${slug}`) },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const item = ALL.find((i) => i.key === slug)
  if (!item) notFound()
  return <PageShell item={item} gi={item.gi} compact={slug !== 'portfolio'} stats={<PageStats k={slug} />}><PageBody k={slug} /></PageShell>
}
