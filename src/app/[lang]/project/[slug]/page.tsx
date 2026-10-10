import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocLink as Link } from '../../../../components/LocLink'
import { projects, projectSlug } from '../../../../data/content'
import { localized } from '../../../../data/nav'
import { getAvailableProjectLinks } from '../../../../lib/project-links'
import { SITE } from '../../../../data/site'
import { SITE_URL, breadcrumbLd, languageAlternates, socialMeta, jsonLd } from '../../../../lib/seo'
import { LANGS, isLang } from '../../../../lib/i18n'

type Props = { params: Promise<{ lang: string; slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  LANGS.flatMap((lang) => projects.map((p) => ({ lang, slug: projectSlug(p) })))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const project = projects.find((p) => projectSlug(p) === slug)
  if (!project || !isLang(lang)) return {}
  return {
    title: localized(project.title, lang),
    description: localized(project.desc, lang),
    alternates: {
      canonical: `/${lang}/project/${slug}`,
      languages: languageAlternates(LANGS, `/project/${slug}`),
    },
    ...socialMeta({
      lang,
      path: `/project/${slug}`,
      title: `${localized(project.title, lang)} — ${SITE.name}`,
      description: localized(project.desc, lang),
      siteName: SITE.name,
      image: project.image,
      type: 'article',
    }),
  }
}

export default async function Page({ params }: Props) {
  const { lang: langParam, slug } = await params
  const lang = isLang(langParam) ? langParam : 'en'
  const project = projects.find((p) => projectSlug(p) === slug)
  if (!project) notFound()
  const id = lang === 'id'
  const url = `${SITE_URL}/${lang}/project/${slug}`
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#project`,
        url,
        name: localized(project.title, lang),
        description: localized(project.desc, lang),
        inLanguage: lang,
        ...(project.image ? { image: `${SITE_URL}${project.image}` } : {}),
        keywords: project.tags.map((g) => localized(g, lang)).join(', '),
        author: { '@id': `${SITE_URL}/#person` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      breadcrumbLd(lang, [[id ? 'Beranda' : 'Home', ''], [id ? 'Proyek' : 'Projects', '/project'], [localized(project.title, lang), `/project/${slug}`]]),
    ],
  }
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <p className="mb-4 text-sm text-fg2">
        <Link to="/" className="hover:text-brand">{id ? 'Beranda' : 'Home'}</Link>
        {' / '}
        <Link to="/project" className="hover:text-brand">{id ? 'Proyek' : 'Projects'}</Link>
        {' / '}
        {localized(project.title, lang)}
      </p>
      <div className="mx-auto max-w-3xl text-center">
        {project.status && (
          <p className="text-[13px] font-medium" style={{ color: project.wip ? 'var(--accent)' : 'var(--ok)' }}>
            {localized(project.status, lang)}
          </p>
        )}
        <h1 className="shine pb-1 font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-.04em]">
          {localized(project.title, lang)}
        </h1>
        <i className="gl" />
        <p className="mx-auto mt-5 max-w-[58ch] text-lg text-fg2">{localized(project.desc, lang)}</p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl">
        {project.image && (
          <img src={project.image} alt={`${localized(project.title, lang)} project preview`} className="w-full rounded-2xl border border-line object-cover" />
        )}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.map((g) => (
            <span key={localized(g, lang)} className="rounded-md border border-brand/25 bg-brand/10 px-3 py-1 text-[13px]">
              {localized(g, lang)}
            </span>
          ))}
        </div>
        {(() => {
          const availableLinks = getAvailableProjectLinks(
            project.links.map((link) => localized(link, lang)),
            project.linkHrefs,
          )
          if (availableLinks.length === 0) return null
          return (
            <div className="mt-6 flex flex-wrap gap-3">
              {availableLinks.map(({ label, href }) => {
                const external = /^https?:/.test(href)
                return (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="btn-ghost"
                  >
                    {label}
                  </a>
                )
              })}
            </div>
          )
        })()}
        <div className="mt-10">
          <Link to="/project" className="font-medium text-brand">
            {id ? '← Kembali ke semua proyek' : '← Back to all projects'}
          </Link>
        </div>
      </div>
    </div>
  )
}
