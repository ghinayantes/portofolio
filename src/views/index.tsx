'use client'

import { useMemo, useState, type ReactElement, type ReactNode } from 'react'
import { LocLink as Link } from '../components/LocLink'
import * as C from '../data/content'
import { NAV, localized, pair } from '../data/nav'
import type { Lang } from '../lib/i18n'
import { useSettings } from '../context/Settings'
import { Empty, FeedItem, Medal, ProjectCard, Ticket, Timeline } from '../components/cards'
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

const KNOWN_LANGS = ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'C', 'Assembly', 'Prolog']

const projectLangs = (p: C.Project, lang: Lang): string[] => {
  const names: string[] = []
  for (const t of p.tags) {
    const name = localized(t, lang)
    if (KNOWN_LANGS.includes(name) && !names.includes(name)) names.push(name)
  }
  return names
}

/** Project grid with status + language filter chips (used on the project page and portfolio section). */
function ProjectsExplorer({ list }: { list: C.Project[] }) {
  const { lang } = useSettings()
  const id = lang === 'id'
  const [status, setStatus] = useState<'all' | 'done' | 'wip'>('all')
  const [stack, setStack] = useState<string>('all')
  const stacks = useMemo(() => {
    const seen: string[] = []
    for (const p of list) for (const name of projectLangs(p, lang)) if (!seen.includes(name)) seen.push(name)
    return seen
  }, [list, lang])
  const filtered = list.filter((p) => {
    const okStatus = status === 'all' || (status === 'wip' ? p.wip : !p.wip)
    const okStack = stack === 'all' || projectLangs(p, lang).includes(stack)
    return okStatus && okStack
  })
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium ${active ? 'border-brand bg-brand text-ink' : 'border-line text-fg2 hover:text-fg'}`
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={id ? 'Filter status' : 'Status filter'}>
        <button type="button" aria-pressed={status === 'all'} onClick={() => setStatus('all')} className={chip(status === 'all')}>{id ? 'Semua' : 'All'}</button>
        <button type="button" aria-pressed={status === 'done'} onClick={() => setStatus('done')} className={chip(status === 'done')}>{id ? 'Selesai' : 'Completed'}</button>
        <button type="button" aria-pressed={status === 'wip'} onClick={() => setStatus('wip')} className={chip(status === 'wip')}>{id ? 'Dikerjakan' : 'In progress'}</button>
      </div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={id ? 'Filter bahasa' : 'Language filter'}>
        <button type="button" aria-pressed={stack === 'all'} onClick={() => setStack('all')} className={chip(stack === 'all')}>{id ? 'Semua bahasa' : 'All languages'}</button>
        {stacks.map((s) => (
          <button key={s} type="button" aria-pressed={stack === s} onClick={() => setStack(s)} className={chip(stack === s)}>{s}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <Empty text={pair('No projects match this filter.', 'Tidak ada proyek yang cocok dengan filter ini.')} />
      ) : (
        <div className="project-cards-grid project-cards-grid--interactive grid gap-x-4 gap-y-8 md:grid-cols-2">
          {filtered.map((p, i) => <ProjectCard key={localized(p.title, lang)} p={p} i={i} featured={i === 0} interactive />)}
        </div>
      )}
    </div>
  )
}
const Awards = () => <Grid3>{C.awards.map((n, i) => <Medal key={i} n={n} i={i} />)}</Grid3>
const Work = () => <Empty text={pair('No work history yet. Add your first internship or freelance project here, with your role and one result.', 'Belum ada pengalaman kerja. Tambahkan pengalaman magang atau proyek lepas pertamamu, beserta peran dan hasilnya.')} />

function About() {
  const { lang } = useSettings()
  const id = lang === 'id'
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="max-w-[62ch] space-y-4 text-[17px] text-fg2">
        <p>{id ? 'Aku mahasiswa Teknik Informatika di Institut Teknologi Bandung. Aku senang mengubah masalah yang masih samar menjadi produk yang sederhana dan jelas.' : "I'm an Informatics Engineering student at Institut Teknologi Bandung. I like turning vague problems into small, clear products."}</p>
        <p>{id ? 'Di luar kelas, aku aktif di kepanitiaan dan tim. Pengalaman itu mengajariku bekerja sesuai tenggat dan mendengarkan sebelum mulai membangun.' : 'Outside class I join committees and teams, which taught me to ship on a deadline and listen before building.'}</p>
      </div>
      <dl className="card self-start">
        {C.about.map(([k, v]) => <div key={localized(k, lang)} className="grid grid-cols-[120px_1fr] gap-3 border-b border-line px-5 py-3.5 last:border-0"><dt className="text-fg2">{localized(k, lang)}</dt><dd className="font-medium">{localized(v, lang)}</dd></div>)}
      </dl>
    </div>
  )
}

function Skills() {
  const { lang } = useSettings()
  const [code, tools, people] = C.skills
  return (
    <Grid3>
      <div className="card term p-6">
        <div className="win mb-3.5"><span /><span /><span /></div>
        <p className="mb-3.5 font-mono text-[13px] text-brand">{lang === 'id' ? '~ keahlian --kode' : '~ skills --code'}</p>
        <div className="flex flex-wrap gap-2">{code.items.map((k) => <span key={localized(k, lang)} className="skill-chip rounded-lg border px-3 py-1 font-mono text-[13px]">{localized(k, lang)}</span>)}</div>
      </div>
      <div className="card p-6">
        <h3 className={h3}>{localized(tools.title, lang)}</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">{tools.items.map((k) => <span key={localized(k, lang)} className="grid aspect-square place-items-center rounded-2xl border border-line bg-fg/5 p-1.5 text-center text-[13px] font-semibold">{localized(k, lang)}</span>)}</div>
      </div>
      <div className="card p-6">
        <h3 className={h3}>{localized(people.title, lang)}</h3>
        <div className="grid gap-2.5">{people.items.map((k) => <span key={localized(k, lang)} className="flex items-center justify-between rounded-full border border-line px-4 py-2.5 text-sm font-medium">{localized(k, lang)}<i className="size-2 rounded-full bg-brand/70" /></span>)}</div>
      </div>
    </Grid3>
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
      <Section title={lang === 'id' ? 'Organisasi' : 'Organizations'}><Timeline items={C.organizations} /></Section>
      <Section title={lang === 'id' ? 'Penghargaan' : 'Awards'}><Awards /></Section>
      <Section title={lang === 'id' ? 'Keahlian' : 'Skills'}><Skills /></Section>
    </div>
  )
}

function Sitemap() {
  const { t, lang } = useSettings()
  return (
    <ul className="max-w-xl border-l-2 border-line pl-5">
      <li className="my-2"><Link to="/" className="font-medium text-brand">{lang === 'id' ? 'Beranda' : 'Home'}</Link></li>
      {NAV.map((g, i) => (
        <li key={i} className="my-2"><b>{t(g.title)}</b>
          <ul className="ml-1 border-l-2 border-line pl-5">{g.items.map((x) => <li key={x.key} className="my-2"><Link to={'/' + x.key} className="font-medium text-brand">{t(x.title)}</Link></li>)}</ul>
        </li>
      ))}
    </ul>
  )
}

/** key (from data/nav.ts) -> page component */
export const PAGES: Record<string, () => ReactElement> = {
  about: About,
  portfolio: Portfolio,
  skills: Skills,
  certificate: () => <Grid2>{C.certificates.map((n, i) => <Ticket key={i} n={n} />)}</Grid2>,
  news: () => <div className="max-w-3xl">{C.news.map((n, i) => <FeedItem key={i} n={n} />)}</div>,
  work: Work,
  project: () => <ProjectsExplorer list={C.projects} />,
  organization: () => <Timeline items={C.organizations} />,
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
