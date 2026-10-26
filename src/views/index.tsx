'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FaArrowUpRightFromSquare, FaChevronDown, FaLinkedinIn } from 'react-icons/fa6'
import CareerTimeline from '../components/CareerTimeline'
import EducationPage from '../components/EducationPage'
import ResumePortfolio from '../components/ResumePortfolio'
import { LocLink as Link } from '../components/LocLink'
import * as C from '../data/content'
import { NAV, localized, pair, type Pair } from '../data/nav'
import { SITE } from '../data/site'
import type { Lang } from '../lib/i18n'
import { tagLabel } from '../lib/project-tags'
import type { FilterableProject } from '../lib/project-filters'
import { useProjectFilters } from '../hooks/useProjectFilters'
import { ProjectsToolbar, type TechChip } from '../components/projects/ProjectsToolbar'
import { useSettings } from '../context/Settings'
import { AwardPreview, AwardRow, Empty, FeedItem, OrgLogo, ProjectCard, SkillMarquee, Ticket, Timeline, techIcon } from '../components/cards'
import { Reveal } from '../components/motion'
import { AboutIdentity, AboutNow, currentRoles } from '../components/AboutCard'
import { Section } from '../components/ui'
import Hire from './Hire'
import SitemapGraph from '../components/SitemapGraph'

const Grid2 = ({ children }: { children: ReactNode }) => <div className="grid gap-6 md:grid-cols-2">{children}</div>
const Grid3 = ({ children }: { children: ReactNode }) => <div className="grid gap-5 md:grid-cols-3">{children}</div>
/** Runs shown on About, newest first; copied from Strava by hand (id = strava.com/activities/<id>, date = YYYY-MM-DD, minutes = moving time). */
const STRAVA_ACTIVITIES = [
  { id: '20732358398', title: 'Latman 9', date: '2026-10-26', km: 3.1, minutes: 24 },
  { id: '20431078114', title: 'Latman 6', date: '2026-10-03', km: 5.0, minutes: 49 },
  { id: '20234155721', title: 'Latman 3', date: '2026-09-19', km: 5.0, minutes: 43 },
  { id: '20124037688', title: 'Latman 2', date: '2026-09-11', km: 6.0, minutes: 50 },
  { id: '20013601017', title: 'Latman 1', date: '2026-09-03', km: 4.0, minutes: 36 },
  { id: '19411540850', title: 'ip sampe lulus', date: '2026-07-22', km: 4.0, minutes: 50 },
] as const
/** Playlist id from its open.spotify.com/playlist/<id> link; the playlist must be public or the embed shows "Page not found". */
const SPOTIFY_PLAYLIST = '4hW2esfyNKbnqJbbfZwiHm'

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
type AwardView = 'original' | 'timeline' | 'bento' | 'grid' | 'smooth'

const AWARD_VIEWS: { id: AwardView; label: { en: string; id: string } }[] = [
  { id: 'original', label: { en: 'Index', id: 'Indeks' } },
  { id: 'timeline', label: { en: 'Trace', id: 'Jejak' } },
  { id: 'bento', label: { en: 'Mosaic', id: 'Mosaik' } },
  { id: 'grid', label: { en: 'Grid', id: 'Kisi' } },
  { id: 'smooth', label: { en: 'Flow', id: 'Alur' } },
]

function AwardModeIcon({ mode }: { mode: AwardView }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (mode === 'original') return <svg viewBox="0 0 20 20" aria-hidden="true" {...common}><rect x="2.5" y="3" width="15" height="5" rx="1" /><rect x="2.5" y="11" width="15" height="6" rx="1" /></svg>
  if (mode === 'timeline') return <svg viewBox="0 0 20 20" aria-hidden="true" {...common}><path d="M5 3v14" /><circle cx="5" cy="5" r="1.5" /><circle cx="5" cy="14" r="1.5" /><path d="M9 5h8M9 14h8" /></svg>
  if (mode === 'bento') return <svg viewBox="0 0 20 20" aria-hidden="true" {...common}><rect x="2.5" y="3" width="8" height="7" rx="1" /><rect x="12.5" y="3" width="5" height="4" rx="1" /><rect x="12.5" y="9" width="5" height="8" rx="1" /><rect x="2.5" y="12" width="8" height="5" rx="1" /></svg>
  if (mode === 'grid') return <svg viewBox="0 0 20 20" aria-hidden="true" {...common}><rect x="2.5" y="3" width="6.5" height="6" rx="1" /><rect x="11" y="3" width="6.5" height="6" rx="1" /><rect x="2.5" y="11" width="6.5" height="6" rx="1" /><rect x="11" y="11" width="6.5" height="6" rx="1" /></svg>
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...common}><path d="M3 5h14M3 10h11M3 15h8" /><circle cx="16" cy="10" r="1" /><circle cx="13" cy="15" r="1" /></svg>
}

function AwardViewSwitcher({ view, onChange, isIndonesian, visible }: { view: AwardView; onChange: (next: AwardView) => void; isIndonesian: boolean; visible: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    createPortal(
      <div className="award-view-switcher" data-visible={visible} aria-hidden={!visible} inert={!visible} role="group" aria-label={isIndonesian ? 'Opsi tampilan penghargaan' : 'Award display options'}>
        <div className="award-view-switcher__identity" aria-hidden="true"><span>G</span><small>{isIndonesian ? <>PENGHARGAAN<br />TAMPILAN</> : <>AWARD<br />VIEWS</>}</small></div>
        <span className="award-view-switcher__divider" aria-hidden="true" />
        {AWARD_VIEWS.map(({ id: viewId, label }) => {
          const name = isIndonesian ? label.id : label.en
          return <button key={viewId} type="button" title={name} aria-label={isIndonesian ? `Tampilan ${name}` : `${name} view`} aria-pressed={view === viewId} onClick={() => onChange(viewId)}>
            <AwardModeIcon mode={viewId} /><span>{name}</span>
          </button>
        })}
      </div>,
      document.body,
    )
  )
}

function AwardModeCard({ award, index, className = '' }: { award: C.Award; index: number; className?: string }) {
  const { lang } = useSettings()
  const bullets = award.bullets && award.bullets.length > 0 ? award.bullets : [award.desc]
  return (
    <article data-award-index={String(index + 1).padStart(2, '0')} className={`award-mode-card ${className}`}>
      <div className="award-mode-card__meta">
        <span>{award.date ? localized(award.date, lang) : localized(award.meta, lang)}</span>
        {award.category && <span className="award-row__category">{localized(award.category, lang)}</span>}
      </div>
      <h3>{localized(award.title, lang)}</h3>
      {award.org && <p className="award-mode-card__org">{localized(award.org, lang)}</p>}
      <ul>{bullets.map((bullet) => <li key={`${index}-${localized(bullet, lang)}`}>{localized(bullet, lang)}</li>)}</ul>
    </article>
  )
}

/** Awards grouped by year with a sticky hover preview (desktop); inline bullets on mobile. */
function Awards() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [sel, setSel] = useState(0)
  const [view, setView] = useState<AwardView>('original')
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting))
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
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
  const alternateViews = view === 'timeline' ? (
    <div className="award-mode-timeline">
      {groups.map((group) => <section key={group.year} className="award-mode-timeline__year"><h2>{group.year}</h2><div>{group.items.map(({ award, index }) => <AwardModeCard key={index} award={award} index={index} className="award-mode-card--timeline" />)}</div></section>)}
    </div>
  ) : view === 'bento' ? (
    <div className="award-mode-bento">{C.awards.map((award, index) => <AwardModeCard key={index} award={award} index={index} className={index === 0 ? 'award-mode-card--feature' : ''} />)}</div>
  ) : view === 'grid' ? (
    <div className="award-mode-grid">{C.awards.map((award, index) => <AwardModeCard key={index} award={award} index={index} />)}</div>
  ) : (
    <div className="award-mode-smooth">{C.awards.map((award, index) => <Reveal key={`${view}-${index}`} index={index}><AwardModeCard award={award} index={index} /></Reveal>)}</div>
  )
  return (
    <>
      <div ref={sectionRef} className="award-section-content">
      {view === 'original' ? (
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
          <div>
            {groups.map((g) => (
              <section key={g.year} aria-label={g.year} className="mb-10 last:mb-0">
                <div className="award-year-heading"><h2>{g.year}</h2><span aria-hidden="true" /></div>
                {g.items.map(({ award, index }) => <AwardRow key={index} a={award} selected={index === sel} onSelect={() => setSel(index)} />)}
              </section>
            ))}
          </div>
          <aside className="hidden md:block" aria-hidden="true">
            <div className="sticky top-32">
              <p className="mb-3 text-sm font-semibold text-fg2">{id ? 'Pratinjau' : 'Preview'}</p>
              <AwardPreview a={current} i={currentIndex} />
            </div>
          </aside>
        </div>
      ) : alternateViews}
      </div>
      <AwardViewSwitcher view={view} onChange={setView} isIndonesian={id} visible={sectionVisible} />
    </>
  )
}
const Work = () => {
  const { lang } = useSettings()
  const id = lang === 'id'
  const linkedin = SITE.contacts.find((contact) => contact.key === 'linkedin')
  const currentWorkIndex = C.work.findIndex((job) => job.current)
  const [openWorkIndex, setOpenWorkIndex] = useState<number | null>(() => currentWorkIndex >= 0 ? currentWorkIndex : null)
  return (
    <div className="work-page-content">
      <div className="work-list">
        {C.work.map((job, i) => {
          const expanded = openWorkIndex === i
          const detailsId = `work-details-${i}`
          return (
            <Reveal key={i} index={i} className={`work-timeline-item${expanded ? ' is-active' : ''}`}>
              <article className={`work-card${expanded ? ' work-card--expanded' : ''}`}>
                <button
                  type="button"
                  className="work-card__summary"
                  aria-expanded={expanded}
                  aria-controls={detailsId}
                  onClick={() => setOpenWorkIndex((openIndex) => openIndex === i ? null : i)}
                >
                  <div className="work-card__layout">
                    <OrgLogo name={id ? job.company.id : job.company.en} logo={job.logo} mono={job.mono} />
                    <div className="work-card__main min-w-0">
                      {job.current && (
                        <span className="work-badge">{id ? job.when.id : job.when.en}</span>
                      )}
                      <header className="work-card__header">
                        <div className="min-w-0">
                          <h3 className="work-card__role">{id ? job.role.id : job.role.en}</h3>
                          <p className="work-card__meta">
                            <span className="work-card__company">{id ? job.company.id : job.company.en}</span>
                            {!job.current && (
                              <>
                                <span className="work-card__sep" aria-hidden="true">·</span>
                                <span>{id ? job.when.id : job.when.en}</span>
                              </>
                            )}
                            <span className="work-card__sep" aria-hidden="true">·</span>
                            <span>{id ? job.location.id : job.location.en}</span>
                          </p>
                        </div>
                      </header>
                    </div>
                    <FaChevronDown className={`work-card__chevron${expanded ? ' is-open' : ''}`} aria-hidden="true" />
                  </div>
                </button>
                <div id={detailsId} className={`work-card__details${expanded ? ' is-open' : ''}`} aria-hidden={!expanded}>
                  <div className="work-card__details-inner">
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
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
      <section className="linkedin-post-section" aria-labelledby="linkedin-post-title">
        <h3 className="linkedin-post-section__title" id="linkedin-post-title">LinkedIn</h3>
        <iframe
          className="linkedin-post-frame"
          src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7433071606698106880?collapsed=1"
          height={627}
          title={id ? 'Postingan LinkedIn Ghina Emelia Yantes' : 'Ghina Emelia Yantes LinkedIn post'}
          frameBorder={0}
          allowFullScreen
          loading="lazy"
        />
      </section>
      {linkedin && (
        <a className="linkedin-profile-card" href={linkedin.href} target="_blank" rel="noreferrer">
          <div className="linkedin-profile-card__identity">
            <span className="linkedin-profile-card__icon" aria-hidden="true"><FaLinkedinIn /></span>
            <div className="linkedin-profile-card__copy">
              <h3>{SITE.name}</h3>
              <p>{id ? 'Mahasiswa Informatika di ITB' : 'Informatics student at ITB'}</p>
            </div>
          </div>
          <span className="linkedin-profile-card__action">
            {id ? 'Lihat profil' : 'View profile'}
            <FaArrowUpRightFromSquare aria-hidden="true" />
          </span>
        </a>
      )}
    </div>
  )
}

const runMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`)

function AboutInterests({ id }: { id: boolean }) {
  const locale = id ? 'id-ID' : 'en-GB'
  const km = (n: number) => n.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const total = STRAVA_ACTIVITIES.reduce((sum, run) => sum + run.km, 0)
  const longest = Math.max(...STRAVA_ACTIVITIES.map((run) => run.km))
  return (
    <section className="about-interests" aria-labelledby="about-interests-title">
      <h2 id="about-interests-title" className="home-eyebrow">{id ? 'Di luar layar' : 'Off the clock'}</h2>
      <Reveal index={2}>
        <section className="about-interest" aria-labelledby="about-run-title">
          <div className="about-interest__head">
            <h3 id="about-run-title" className="about-interest__title">{id ? 'Lari' : 'Running'}</h3>
            <p className="about-interest__note">Strava · {id ? `total ${km(total)} km` : `${km(total)} km total`}</p>
          </div>
          <ul className="about-runs">
            {STRAVA_ACTIVITIES.map((run) => (
              <li key={run.id}>
                <a href={`https://www.strava.com/activities/${run.id}`} target="_blank" rel="noopener noreferrer" className="about-run" style={{ '--run': (run.km / longest).toFixed(3) } as CSSProperties}>
                  <span className="about-run__title">{run.title}</span>
                  <span className="about-run__meta">
                    <time dateTime={run.date}>{new Date(`${run.date}T00:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time>
                    <span>{km(run.km)} km</span>
                    <span>{runMinutes(run.minutes)}</span>
                  </span>
                  <span className="about-run__arrow" aria-hidden="true">↗</span>
                  <span className="sr-only">{id ? '(buka di Strava)' : '(opens on Strava)'}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="about-interest" aria-labelledby="about-music-title">
          <div className="about-interest__head">
            <h3 id="about-music-title" className="about-interest__title">{id ? 'Musik' : 'Music'}</h3>
            <p className="about-interest__note">Spotify · {id ? 'teman kerja saya' : 'what I work to'}</p>
          </div>
          <iframe
            title={id ? 'Playlist Spotify' : 'Spotify playlist'}
            src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST}?utm_source=generator`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="about-spotify__frame"
          />
        </section>
      </Reveal>
    </section>
  )
}

function About() {
  const { lang } = useSettings()
  const id = lang === 'id'
  const now = currentRoles(lang)
  return (
    <div className="about-bento">
      <div className="about-bento__intro">
        <Reveal className="about-bento__id">
          <AboutIdentity />
        </Reveal>
        <Reveal index={1} className="about-bento__bio">
          <div className="about-bio">
            <p className="home-eyebrow">{id ? 'Tentang saya' : 'About me'}</p>
            <p className="about-bio__lead">{id ? 'Saya adalah mahasiswa Informatika di Institut Teknologi Bandung yang memiliki ketertarikan pada rekayasa perangkat lunak, kecerdasan buatan, dan proses mengubah ide menjadi produk yang bermanfaat.' : "I'm an Informatics student at Institut Teknologi Bandung, interested in software engineering, artificial intelligence, and the process of turning ideas into useful products."}</p>
            <p>{id ? 'Saya senang menganalisis permasalahan, memahami cara kerja suatu sistem secara mendalam, dan mengeksplorasi berbagai pendekatan untuk menemukan solusi yang efektif. Ketertarikan saya pada matematika turut membentuk cara saya berpikir dalam menghadapi permasalahan yang kompleks, sementara studi Informatika memberi saya kesempatan untuk menerapkan pola pikir tersebut melalui pemrograman, algoritma, dan pengembangan perangkat lunak.' : 'I enjoy approaching problems analytically, understanding how things work beneath the surface, and exploring different ways to build effective solutions. My interest in mathematics has shaped how I think through complex problems, while studying informatics allows me to put that way of thinking into practice through programming, algorithms, and software development.'}</p>
            <p>{id ? 'Di luar perkuliahan, saya menghargai kesempatan untuk berkolaborasi, berkontribusi dalam tim, dan terlibat dalam berbagai kegiatan yang mendorong saya untuk belajar lebih jauh. Pengalaman tersebut mengajarkan saya bahwa membangun sesuatu yang bermakna tidak hanya membutuhkan kemampuan teknis, tetapi juga komunikasi yang baik, kemampuan beradaptasi, dan kemauan untuk terus belajar.' : 'Beyond academics, I value opportunities to collaborate with others, contribute to teams, and take part in projects that challenge me to learn beyond the classroom. These experiences have taught me that building something meaningful takes more than technical ability. It also requires communication, adaptability, and a willingness to keep learning.'}</p>
            <p>{id ? 'Saat ini, saya berfokus pada penguatan fondasi rekayasa perangkat lunak sembari mengeksplorasi bagaimana kecerdasan buatan dapat diterapkan untuk menyelesaikan permasalahan nyata. Portfolio ini menjadi ruang untuk mendokumentasikan pengalaman, proyek, dan perjalanan saya dalam terus berkembang sebagai seorang pengembang perangkat lunak.' : "I'm currently focused on strengthening my foundations in software engineering while exploring how AI can be applied to solve real-world problems. This portfolio is a collection of my experiences, projects, and progress as I continue to grow as a developer."}</p>
          </div>
        </Reveal>
      </div>
      <Reveal className="about-bento__motto">
        <figure className="about-motto">
          <figcaption className="home-eyebrow">{id ? 'Moto hidup' : 'Life motto'}</figcaption>
          <blockquote className="about-motto__quote">{C.motto}</blockquote>
        </figure>
      </Reveal>
      {now.length > 0 && (
        <Reveal index={1} className="about-bento__now">
          <AboutNow roles={now} />
        </Reveal>
      )}
      <AboutInterests id={id} />
    </div>
  )
}

function Skills() {
  const { lang } = useSettings()
  const [code, frameworks, tools, people] = C.skills
  const head = (group: C.SkillGroup) => (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="font-display text-[17px] font-semibold">{localized(group.title, lang)}</h3>
      <span className="skill-count">{group.items.length}</span>
    </div>
  )
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <div className="card flex h-full flex-col p-6">
            {head(code)}
            <ul className="skill-grid flex-1">
              {code.items.map((k) => {
                const label = localized(k, lang)
                return <li key={label} className="skill-tile skill-tile--stack">{techIcon(label)}<span>{label}</span></li>
              })}
            </ul>
          </div>
        </Reveal>
        {[frameworks, tools].map((group, gi) => (
          <Reveal key={localized(group.title, lang)} index={gi + 1}>
            <div className="card h-full p-6">
              {head(group)}
              <ul className="grid grid-cols-2 gap-2.5">
                {group.items.map((k) => {
                  const label = localized(k, lang)
                  return <li key={label} className="skill-tile">{techIcon(label)}<span className="min-w-0">{label}</span></li>
                })}
              </ul>
            </div>
          </Reveal>
        ))}
        <Reveal className="lg:col-span-3">
          <div className="card p-6">
            {head(people)}
            <ol className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {people.items.map((k, i) => <li key={localized(k, lang)} className="skill-tile"><span aria-hidden="true" className="skill-tile__n">{String(i + 1).padStart(2, '0')}</span>{localized(k, lang)}</li>)}
            </ol>
          </div>
        </Reveal>
      </div>
      <SkillMarquee />
    </>
  )
}

function Portfolio() {
  return <ResumePortfolio />
}

/** Sitemap as a discrete-math graph: left/right vertex columns joined by a center trunk. */
function Sitemap() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  return (
    <>
      <SitemapGraph />
      {/* Plain tree of the same links for screen readers and keyboard users who prefer a list. */}
      <nav className="sr-only" aria-label={id ? 'Peta situs' : 'Sitemap'}>
        <Link to="/">{id ? 'Beranda' : 'Home'}</Link>
        {NAV.map((g, i) => (
          <section key={i} aria-label={t(g.title)}>
            <ul>{g.items.map((x) => <li key={x.key}><Link to={'/' + x.key}>{t(x.title)}</Link></li>)}</ul>
          </section>
        ))}
      </nav>
    </>
  )
}

/** Plural-aware count line for compact page headers (Sub A foundation, reused by Sub B-D). */
export function CollectionStats({ total, single, plural }: { total: number; single: Pair; plural: Pair }) {
  const { lang } = useSettings()
  const word = total === 1 ? localized(single, lang) : localized(plural, lang)
  return <>{total} {word}</>
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
    case 'timeline': return <CollectionStats total={C.work.length + C.projects.length + C.awards.length + C.education.length} single={pair('timeline entry', 'entri linimasa')} plural={pair('timeline entries', 'entri linimasa')} />
    case 'design': return <CollectionStats total={C.design.length} single={pair('work', 'karya')} plural={pair('works', 'karya')} />
    case 'writing': return <CollectionStats total={C.writing.length} single={pair('piece', 'tulisan')} plural={pair('pieces', 'tulisan')} />
    default: return null
  }
}

function CareerTimelinePage() {
  const { lang } = useSettings()
  return <CareerTimeline lang={lang} />
}

/** key (from data/nav.ts) -> page component */
export const PAGES: Record<string, () => ReactElement> = {
  about: About,
  portfolio: Portfolio,
  skills: Skills,
  certificate: () => <div className="cert-gallery">{C.certificates.map((n, i) => <Reveal key={i} index={i}><Ticket n={n} i={i} /></Reveal>)}</div>,
  news: () => <div className="grid max-w-3xl gap-5">{C.news.map((n, i) => <FeedItem key={i} n={n} i={i} />)}</div>,
  work: Work,
  project: ProjectPage,
  organization: () => <Timeline items={C.organizations} logos />,
  award: Awards,
  hire: Hire,
  design: () => <Cards list={C.design} />,
  writing: () => <Cards list={C.writing} />,
  education: EducationPage,
  timeline: () => <CareerTimelinePage />,
  sitemap: Sitemap,
}

export function PageBody({ k }: { k: string }) {
  const Page = PAGES[k]
  return Page ? <Page /> : null
}
