'use client'

import type { ReactElement, ReactNode } from 'react'
import { LocLink as Link } from '../components/LocLink'
import * as C from '../data/content'
import { NAV } from '../data/nav'
import { useSettings } from '../context/Settings'
import { Empty, FeedItem, Medal, ProjectCard, Ticket, Timeline } from '../components/cards'
import { Section } from '../components/ui'
import Hire from './Hire'

const Grid2 = ({ children }: { children: ReactNode }) => <div className="grid gap-6 md:grid-cols-2">{children}</div>
const Grid3 = ({ children }: { children: ReactNode }) => <div className="grid gap-5 md:grid-cols-3">{children}</div>
const h3 = 'mb-3.5 font-display text-[17px] font-semibold'

const Cards = ({ list, feature }: { list: C.Project[]; feature?: boolean }) => (
  <Grid2>{list.map((p, i) => <ProjectCard key={p.title} p={p} i={i} featured={feature && i === 0} />)}</Grid2>
)
const Awards = () => <Grid3>{C.awards.map((n, i) => <Medal key={n.title + i} n={n} i={i} />)}</Grid3>
const Work = () => <Empty text="No work history yet. Add your first internship or freelance project here, with your role and one result." />

function About() {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="max-w-[62ch] space-y-4 text-[17px] text-fg2">
        <p>I'm an Informatics Engineering student at Institut Teknologi Bandung. I like turning vague problems into small, clear products.</p>
        <p>Outside class I join committees and teams, which taught me to ship on a deadline and listen before building.</p>
      </div>
      <dl className="card self-start">
        {C.about.map(([k, v]) => <div key={k} className="grid grid-cols-[120px_1fr] gap-3 border-b border-line px-5 py-3.5 last:border-0"><dt className="text-fg2">{k}</dt><dd className="font-medium">{v}</dd></div>)}
      </dl>
    </div>
  )
}

function Skills() {
  const [code, tools, people] = C.skills
  return (
    <Grid3>
      <div className="card term p-6">
        <div className="win mb-3.5"><span /><span /><span /></div>
        <p className="mb-3.5 font-mono text-[13px] text-brand">~ skills --code</p>
        <div className="flex flex-wrap gap-2">{code.items.map((k) => <span key={k} className="skill-chip rounded-lg border px-3 py-1 font-mono text-[13px]">{k}</span>)}</div>
      </div>
      <div className="card p-6">
        <h3 className={h3}>{tools.title}</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">{tools.items.map((k) => <span key={k} className="grid aspect-square place-items-center rounded-2xl border border-line bg-fg/5 p-1.5 text-center text-[13px] font-semibold">{k}</span>)}</div>
      </div>
      <div className="card p-6">
        <h3 className={h3}>{people.title}</h3>
        <div className="grid gap-2.5">{people.items.map((k) => <span key={k} className="flex items-center justify-between rounded-full border border-line px-4 py-2.5 text-sm font-medium">{k}<i className="size-2 rounded-full bg-brand/70" /></span>)}</div>
      </div>
    </Grid3>
  )
}

function Portfolio() {
  return (
    <div className="-mt-14">
      <Section title="About"><About /></Section>
      <Section title="Education"><Timeline items={C.education} /></Section>
      <Section title="Work"><Work /></Section>
      <Section title="Projects"><Cards list={C.projects} feature /></Section>
      <Section title="Organizations"><Timeline items={C.organizations} /></Section>
      <Section title="Awards"><Awards /></Section>
      <Section title="Skills"><Skills /></Section>
    </div>
  )
}

function Sitemap() {
  const { t } = useSettings()
  return (
    <ul className="max-w-xl border-l-2 border-line pl-5">
      <li className="my-2"><Link to="/" className="font-medium text-brand">Home</Link></li>
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
  news: () => <div className="max-w-3xl">{C.news.map((n) => <FeedItem key={n.title} n={n} />)}</div>,
  work: Work,
  project: () => <Cards list={C.projects} feature />,
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
