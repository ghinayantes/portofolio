'use client'

import { LocLink as Link } from '../components/LocLink'
import { SITE } from '../data/site'
import { awards, organizations, projects } from '../data/content'
import { useSettings } from '../context/Settings'
import { useTypewriter } from '../hooks/useTypewriter'
import Explore from '../components/Explore'
import { ProjectCard } from '../components/cards'
import { Section } from '../components/ui'
import HeroPhoto from '../components/HeroPhoto'

export default function Home() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const typed = useTypewriter(SITE.roles[lang])
  const stats: [number, string][] = [
    [projects.length, id ? 'Proyek' : 'Projects'],
    [organizations.length, id ? 'Organisasi' : 'Organizations'],
    [awards.length, id ? 'Penghargaan' : 'Awards'],
  ]
  return (
    <>
      <div className="grid items-center gap-12 py-6 md:grid-cols-[7fr_5fr] md:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-fg2">
            <i className="dot" />{id ? 'Terbuka untuk peluang' : 'Open to opportunities'}
          </span>
          <p className="mt-6 text-[clamp(1rem,2vw,1.3rem)] font-semibold text-fg2">{t(SITE.greeting)}</p>
          <h1 className="shine pb-1 font-display text-name font-extrabold leading-[1.05] tracking-[-.045em]">{SITE.name}</h1>
          <i className="gl gl-left" />
          <p className="font-display text-[clamp(1.4rem,3.2vw,2.2rem)] font-bold">
            <span aria-hidden>{id ? 'Aku seorang ' : 'I am a '}<span className="shine-brand">{typed}</span><i className="caret" /></span>
            <span className="sr-only">{t(SITE.role)}</span>
          </p>
          <p className="mb-7 mt-4 max-w-[58ch] text-lg text-fg2">{t(SITE.lead)}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/project" className="btn-primary">{id ? 'Lihat proyek' : 'View projects'}</Link>
            <Link to="/hire" className="btn-ghost">{id ? 'Hubungi aku' : 'Hire me'}</Link>
          </div>
          <div className="mt-10 flex gap-10">
            {stats.map(([n, label]) => <div key={label}><b className="block font-display text-3xl font-extrabold">{n}</b><span className="text-sm text-fg2">{label}</span></div>)}
          </div>
        </div>
        <HeroPhoto />
      </div>

      <Section title={id ? 'Jelajahi' : 'Explore'}><Explore /></Section>
      <Section title={id ? 'Proyek unggulan' : 'Featured project'}>
        <div className="home-featured-project grid gap-6 md:grid-cols-2"><ProjectCard p={projects[0]} i={0} featured interactive tilt={false} reveal={false} /></div>
      </Section>
      <div className="mt-16 rounded-3xl p-8 text-white md:p-14" style={{ background: 'linear-gradient(135deg,#1B1A5E,#4338CA 70%,#7C3AED)' }}>
        <h2 className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold">{id ? 'Ayo kerja bareng' : "Let's work together"}</h2>
        <p className="mt-2 opacity-90">{id ? 'Punya proyek, magang, atau pertanyaan?' : 'Have a project, internship, or question?'}</p>
        <Link to="/hire" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-[#1B1A5E]">{id ? 'Kirim pesan' : 'Send a message'}</Link>
      </div>
    </>
  )
}
