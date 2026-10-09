'use client'

import { Suspense, useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react'
import { LocLink as Link } from '../components/LocLink'
import * as C from '../data/content'
import { NAV, localized, pair, type Pair } from '../data/nav'
import type { Lang } from '../lib/i18n'
import { tagLabel } from '../lib/project-tags'
import type { FilterableProject } from '../lib/project-filters'
import { useProjectFilters } from '../hooks/useProjectFilters'
import { ProjectsToolbar, type TechChip } from '../components/projects/ProjectsToolbar'
import { useSettings } from '../context/Settings'
import { AwardPreview, AwardRow, Empty, FeedItem, OrgLogo, ProjectCard, SkillMarquee, Ticket, Timeline } from '../components/cards'
import { Reveal } from '../components/motion'
import { AboutCard, AboutHighlights } from '../components/AboutCard'
import { Section } from '../components/ui'
import Hire from './Hire'

const Grid2 = ({ children }: { children: ReactNode }) => <div className="grid gap-6 md:grid-cols-2">{children}</div>
const Grid3 = ({ children }: { children: ReactNode }) => <div className="grid gap-5 md:grid-cols-3">{children}</div>
const h3 = 'mb-3.5 font-display text-[17px] font-semibold'

const Cards = ({ list, feature }: { list: C.Project[]; feature?: boolean }) => (
  <div className={`grid ${feature ? 'project-cards-grid project-cards-grid--interactive gap-x-4 gap-y-8 md:grid-cols-2' : 'gap-6 md:grid-cols-2'}`}>
    {list.map((p, i) => <ProjectCard key={i} p={p} i={i} featured={feature && i === 0} interactive={feature} />)}
  </div>
)

/** Adapter from content projects to the stable filter shape (missing fields fall back safely). */
function toFilterable(p: C.Project): FilterableProject {
  return {
    title: p.title,
    desc: p.desc,
    tags: p.tech ?? [],
    status: p.state ?? (p.wip ? 'in-progress' : 'completed'),
    date: p.date ?? '',
  }
}

/** Project grid with status + tech-stack filters, search, sort, and URL sync (used on the project page and portfolio section). */
function ProjectsExplorerInner({ list, syncUrl }: { list: C.Project[]; syncUrl: boolean }) {
  const { lang } = useSettings()
  const id = lang === 'id'
  const filterable = useMemo(() => list.map(toFilterable), [list])
  const labels = useCallback((tagId: string) => tagLabel(tagId, lang as Lang), [lang])
  const { state, results, counts, setStatus, toggleTag, setQuery, setSort, clear } = useProjectFilters({
    lang: lang as Lang,
    projects: filterable,
    syncUrl,
    tagLabels: labels,
  })
  const resultProjects = useMemo(() => {
    const back = new Map<FilterableProject, C.Project>()
    filterable.forEach((f, i) => {
      const orig = list[i]
      if (orig) back.set(f, orig)
    })
    return results.map((r) => back.get(r)).filter((p): p is C.Project => Boolean(p))
  }, [filterable, list, results])
  const sortedTags = useMemo(() => {
    const all = Array.from(new Set(filterable.flatMap((f) => f.tags)))
    return all.sort((a, b) => (counts.tech[b] ?? 0) - (counts.tech[a] ?? 0))
  }, [filterable, counts])
  const toChip = (tagId: string): TechChip => ({
    id: tagId,
    label: labels(tagId),
    count: counts.tech[tagId] ?? 0,
    disabled: (counts.tech[tagId] ?? 0) === 0,
  })
  const visibleTags = sortedTags.slice(0, 6).map(toChip)
  const overflowTags = sortedTags.slice(6).map(toChip)
  const isDefault = state.status === 'all' && state.tags.size === 0 && state.q.trim() === '' && state.sort === 'newest'
  const featured = isDefault ? resultProjects.filter((p) => p.featured) : []
  const rest = isDefault ? resultProjects.filter((p) => !p.featured) : resultProjects
  const done = filterable.filter((f) => f.status === 'completed').length
  const wip = filterable.length - done
  const grid = 'project-cards-grid project-cards-grid--interactive grid gap-x-4 gap-y-8 md:grid-cols-2'
  return (
    <div>
      <p className="project-stats">
        {id
          ? `${filterable.length} proyek · ${done} selesai · ${wip} berjalan`
          : `${filterable.length} projects · ${done} completed · ${wip} in progress`}
      </p>
      <ProjectsToolbar
        lang={lang as Lang}
        state={state}
        statusCounts={counts.status}
        visibleTags={visibleTags}
        overflowTags={overflowTags}
        resultCount={resultProjects.length}
        totalCount={filterable.length}
        onStatus={setStatus}
        onToggleTag={toggleTag}
        onQuery={setQuery}
        onSort={setSort}
        onClear={clear}
      />
      {featured.length > 0 && (
        <div className={`${grid} projects-featured`}>
          {featured.map((p) => <ProjectCard key={localized(p.title, lang)} p={p} i={0} featured interactive />)}
        </div>
      )}
      {rest.length === 0 ? (
        <div className="projects-empty">
          <Empty text={pair('No projects match this filter.', 'Tidak ada proyek yang cocok dengan filter ini.')} />
          <button type="button" onClick={clear} className="rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-ink">
            {id ? 'Hapus filter' : 'Clear filters'}
          </button>
        </div>
      ) : (
        <div className={grid}>
          {rest.map((p, i) => <ProjectCard key={localized(p.title, lang)} p={p} i={i + featured.length} interactive />)}
        </div>
      )}
    </div>
  )
}

/** Static grid fallback for the Suspense boundary required by URL-synced filtering. */
function ProjectsGridFallback({ list }: { list: C.Project[] }) {
  const { lang } = useSettings()
  return (
    <div className="project-cards-grid project-cards-grid--interactive grid gap-x-4 gap-y-8 md:grid-cols-2">
      {list.map((p, i) => <ProjectCard key={localized(p.title, lang)} p={p} i={i} featured={i === 0} interactive />)}
    </div>
  )
}

function ProjectsExplorer({ list }: { list: C.Project[] }) {
  return (
    <Suspense fallback={<ProjectsGridFallback list={list} />}>
      <ProjectsExplorerInner list={list} syncUrl={false} />
    </Suspense>
  )
}

/** Standalone project page: same explorer with filters synced to the URL. */
function ProjectPage() {
  return (
    <Suspense fallback={<ProjectsGridFallback list={C.projects} />}>
      <ProjectsExplorerInner list={C.projects} syncUrl={true} />
    </Suspense>
  )
}
/** Awards grouped by year with a sticky hover preview (desktop); inline bullets on mobile. */
function Awards() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const [sel, setSel] = useState(0)
  const groups = useMemo(() => {
    const years: string[] = []
    const byYear = new Map<string, { award: C.Award; index: number }[]>()
    C.awards.forEach((award, index) => {
      const year = localized(award.meta, 'en')
      if (!byYear.has(year)) { byYear.set(year, []); years.push(year) }
      byYear.get(year)?.push({ award, index })
    })
    return years.map((year) => ({ year, items: byYear.get(year) ?? [] }))
  }, [])
  if (C.awards.length === 0) return <Empty text={pair('No awards yet.', 'Belum ada penghargaan.')} />
  const currentIndex = Math.min(sel, C.awards.length - 1)
  const current = C.awards[currentIndex] ?? null
  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        {groups.map((g) => (
          <section key={g.year} aria-label={g.year} className="mb-10 last:mb-0">
            <h2 className="mb-2 font-display text-[clamp(1.4rem,3vw,1.75rem)] font-extrabold tracking-tight">{g.year}</h2>
            {g.items.map(({ award, index }) => (
              <AwardRow key={index} a={award} selected={index === sel} onSelect={() => setSel(index)} />
            ))}
          </section>
        ))}
      </div>
      <aside className="hidden lg:block" aria-hidden="true">
        <div className="sticky top-24">
          <p className="mb-3 text-sm font-semibold text-fg2">{id ? 'Pratinjau' : 'Preview'}</p>
          <AwardPreview a={current} i={currentIndex} />
        </div>
      </aside>
    </div>
  )
}
const Work = () => {
  const { lang } = useSettings()
  const id = lang === 'id'
  return (
    <div className="work-list">
      {C.work.map((job, i) => (
        <Reveal key={i} index={i}>
          <article className="work-card">
            {job.current && (
              <span className="work-badge">{id ? 'Sekarang' : 'Current'}</span>
            )}
            <header className="work-card__header">
              <div className="work-card__ident">
                <OrgLogo name={id ? job.company.id : job.company.en} logo={job.logo} mono={job.mono} />
                <div className="min-w-0">
                  <h3 className="work-card__role">{id ? job.role.id : job.role.en}</h3>
                  <p className="work-card__meta">
                    <span className="work-card__company">{id ? job.company.id : job.company.en}</span>
                    <span className="work-card__sep" aria-hidden="true">·</span>
                    <span>{id ? job.when.id : job.when.en}</span>
                    <span className="work-card__sep" aria-hidden="true">·</span>
                    <span>{id ? job.location.id : job.location.en}</span>
                  </p>
                </div>
              </div>
            </header>
            <p className="work-card__desc">{id ? job.desc.id : job.desc.en}</p>
            {job.highlights.length > 0 && (
              <ul className="work-card__highlights" aria-label={id ? 'Pencapaian' : 'Highlights'}>
                {job.highlights.map((h, j) => (
                  <li key={j}>{id ? h.id : h.en}</li>
                ))}
              </ul>
            )}
            {job.tech.length > 0 && (
              <ul className="work-card__tech" aria-label={id ? 'Teknologi' : 'Tech stack'}>
                {job.tech.map((t) => (
                  <li key={t} className="work-chip">{t}</li>
                ))}
              </ul>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  )
}

function About() {
  const { lang } = useSettings()
  const id = lang === 'id'
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Reveal>
        <div className="max-w-[62ch] space-y-4 text-[17px] text-fg2">
          <p>{id ? 'Saya adalah mahasiswa Informatika di Institut Teknologi Bandung yang memiliki ketertarikan pada rekayasa perangkat lunak, kecerdasan buatan, dan proses mengubah ide menjadi produk yang bermanfaat.' : "I'm an Informatics student at Institut Teknologi Bandung, interested in software engineering, artificial intelligence, and the process of turning ideas into useful products."}</p>
          <p>{id ? 'Saya senang menganalisis permasalahan, memahami cara kerja suatu sistem secara mendalam, dan mengeksplorasi berbagai pendekatan untuk menemukan solusi yang efektif. Ketertarikan saya pada matematika turut membentuk cara saya berpikir dalam menghadapi permasalahan yang kompleks, sementara studi Informatika memberi saya kesempatan untuk menerapkan pola pikir tersebut melalui pemrograman, algoritma, dan pengembangan perangkat lunak.' : 'I enjoy approaching problems analytically, understanding how things work beneath the surface, and exploring different ways to build effective solutions. My interest in mathematics has shaped how I think through complex problems, while studying informatics allows me to put that way of thinking into practice through programming, algorithms, and software development.'}</p>
          <p>{id ? 'Di luar perkuliahan, saya menghargai kesempatan untuk berkolaborasi, berkontribusi dalam tim, dan terlibat dalam berbagai kegiatan yang mendorong saya untuk belajar lebih jauh. Pengalaman tersebut mengajarkan saya bahwa membangun sesuatu yang bermakna tidak hanya membutuhkan kemampuan teknis, tetapi juga komunikasi yang baik, kemampuan beradaptasi, dan kemauan untuk terus belajar.' : 'Beyond academics, I value opportunities to collaborate with others, contribute to teams, and take part in projects that challenge me to learn beyond the classroom. These experiences have taught me that building something meaningful takes more than technical ability. It also requires communication, adaptability, and a willingness to keep learning.'}</p>
          <p>{id ? 'Saat ini, saya berfokus pada penguatan fondasi rekayasa perangkat lunak sembari mengeksplorasi bagaimana kecerdasan buatan dapat diterapkan untuk menyelesaikan permasalahan nyata. Portfolio ini menjadi ruang untuk mendokumentasikan pengalaman, proyek, dan perjalanan saya dalam terus berkembang sebagai seorang pengembang perangkat lunak.' : "I'm currently focused on strengthening my foundations in software engineering while exploring how AI can be applied to solve real-world problems. This portfolio is a collection of my experiences, projects, and progress as I continue to grow as a developer."}</p>
        </div>
        <figure className="about-motto">
          <figcaption className="about-motto__label">{id ? 'Moto hidup' : 'Life motto'}</figcaption>
          <blockquote className="about-motto__quote">{C.motto}</blockquote>
        </figure>
        <AboutHighlights />
      </Reveal>
      <Reveal index={1}>
        <AboutCard />
      </Reveal>
    </div>
  )
}

function Skills() {
  const { lang } = useSettings()
  const [code, tools, people] = C.skills
  return (
    <>
      <Grid3>
        <Reveal>
          <div className="card term h-full p-6">
            <div className="win mb-3.5"><span /><span /><span /></div>
            <p className="mb-3.5 font-mono text-[13px] text-brand">{lang === 'id' ? '~ keahlian --kode' : '~ skills --code'}</p>
            <div className="flex flex-wrap gap-2">{code.items.map((k) => <span key={localized(k, lang)} className="skill-chip rounded-lg border px-3 py-1 font-mono text-[13px]">{localized(k, lang)}</span>)}</div>
          </div>
        </Reveal>
        <Reveal index={1}>
          <div className="card term h-full p-6">
            <div className="win mb-3.5"><span /><span /><span /></div>
            <p className="mb-3.5 font-mono text-[13px] text-brand">{lang === 'id' ? '~ keahlian --tools' : '~ skills --tools'}</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">{tools.items.map((k) => <span key={localized(k, lang)} className="grid aspect-square place-items-center rounded-2xl border border-brand/25 bg-brand/10 p-1.5 text-center text-[13px] font-semibold">{localized(k, lang)}</span>)}</div>
          </div>
        </Reveal>
        <Reveal index={2}>
          <div className="card h-full p-6">
            <h3 className={h3}>{localized(people.title, lang)}</h3>
            <div className="grid gap-2.5">{people.items.map((k) => <span key={localized(k, lang)} className="flex items-center justify-between rounded-full border border-brand/25 px-4 py-2.5 text-sm font-medium">{localized(k, lang)}<i className="size-2 rounded-full bg-brand/70" /></span>)}</div>
          </div>
        </Reveal>
      </Grid3>
      <SkillMarquee />
    </>
  )
}

function Portfolio() {
  const { lang } = useSettings()
  return (
    <div className="-mt-14">
      <Section title={lang === 'id' ? 'Tentang' : 'About'}><About /></Section>
      <Section title={lang === 'id' ? 'Pendidikan' : 'Education'}><Timeline items={C.education} /></Section>
      <Section title={lang === 'id' ? 'Pengalaman kerja' : 'Work'}><Work /></Section>
      <Section title={lang === 'id' ? 'Proyek' : 'Projects'}><ProjectsExplorer list={C.projects} /></Section>
      <Section title={lang === 'id' ? 'Organisasi' : 'Organizations'}><Timeline items={C.organizations} logos /></Section>
      <Section title={lang === 'id' ? 'Penghargaan' : 'Awards'}><Awards /></Section>
      <Section title={lang === 'id' ? 'Keahlian' : 'Skills'}><Skills /></Section>
    </div>
  )
}

/** Sitemap as a discrete-math graph: left/right vertex columns joined by a center trunk. */
function Sitemap() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const half = Math.ceil(NAV.length / 2)
  const cols = [NAV.slice(0, half), NAV.slice(half)]
  return (
    <div className="sitemap-graph mx-auto max-w-5xl">
      <div className="flex flex-col items-center">
        <Link to="/" className="sitemap-root font-display text-lg font-bold">{id ? 'Beranda' : 'Home'}</Link>
      </div>
      <div className="sitemap-cols">
        {cols.map((col, ci) => (
          <div key={ci}>
            {col.map((g, i) => (
              <section key={i} aria-label={t(g.title)} className="sitemap-group">
                <h3><span>{t(g.title)}</span><i>{g.items.length}</i></h3>
                <ul>
                  {g.items.map((x) => (
                    <li key={x.key}><Link to={'/' + x.key}>{t(x.title)}</Link></li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Plural-aware count line for compact page headers (Sub A foundation, reused by Sub B-D). */
export function CollectionStats({ total, single, plural }: { total: number; single: Pair; plural: Pair }) {
  const { lang } = useSettings()
  const word = total === 1 ? localized(single, lang) : localized(plural, lang)
  return <>{total} {word}</>
}

/** Availability badge for the Hire header, reusing the About status pattern. */
export function HireStats() {
  const { lang } = useSettings()
  const statusEntry = C.about.find(([k]) => k.en === 'Status')
  if (!statusEntry) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold"><i className="dot" />{localized(statusEntry[1], lang)}</span>
  )
}

/** Per-page stats line for the compact header. `project` renders its own line; pages without a meaningful metric return null. */
export function PageStats({ k }: { k: string }) {
  switch (k) {
    case 'award': return <CollectionStats total={C.awards.length} single={pair('award', 'penghargaan')} plural={pair('awards', 'penghargaan')} />
    case 'certificate': return <CollectionStats total={C.certificates.length} single={pair('credential', 'kredensial')} plural={pair('credentials', 'kredensial')} />
    case 'news': return <CollectionStats total={C.news.length} single={pair('note', 'catatan')} plural={pair('notes', 'catatan')} />
    case 'skills': {
      const total = C.skills.reduce((n, g) => n + g.items.length, 0)
      return <CollectionStats total={total} single={pair('skill', 'keahlian')} plural={pair('skills', 'keahlian')} />
    }
    case 'organization': return <CollectionStats total={C.organizations.length} single={pair('organization', 'organisasi')} plural={pair('organizations', 'organisasi')} />
    case 'education': return <CollectionStats total={C.education.length} single={pair('school', 'sekolah')} plural={pair('schools', 'sekolah')} />
    case 'timeline': return <CollectionStats total={C.milestones.length} single={pair('milestone', 'tonggak')} plural={pair('milestones', 'tonggak')} />
    case 'design': return <CollectionStats total={C.design.length} single={pair('work', 'karya')} plural={pair('works', 'karya')} />
    case 'writing': return <CollectionStats total={C.writing.length} single={pair('piece', 'tulisan')} plural={pair('pieces', 'tulisan')} />
    case 'hire': return <HireStats />
    default: return null
  }
}

/** key (from data/nav.ts) -> page component */
export const PAGES: Record<string, () => ReactElement> = {
  about: About,
  portfolio: Portfolio,
  skills: Skills,
  certificate: () => <Grid3>{C.certificates.map((n, i) => <Ticket key={i} n={n} i={i} />)}</Grid3>,
  news: () => <div className="grid max-w-3xl gap-5">{C.news.map((n, i) => <FeedItem key={i} n={n} i={i} />)}</div>,
  work: Work,
  project: ProjectPage,
  organization: () => <Timeline items={C.organizations} logos />,
  award: Awards,
  hire: Hire,
  design: () => <Cards list={C.design} />,
  writing: () => <Cards list={C.writing} />,
  education: () => <Timeline items={C.education} />,
  timeline: () => <Timeline items={C.milestones} />,
  sitemap: Sitemap,
}

export function PageBody({ k }: { k: string }) {
  const Page = PAGES[k]
  return Page ? <Page /> : null
}
