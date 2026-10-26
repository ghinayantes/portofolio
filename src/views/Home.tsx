'use client'

import { LocLink as Link } from '../components/LocLink'
import { SITE } from '../data/site'
import { projects } from '../data/content'
import { useSettings } from '../context/Settings'
import { useTypewriter } from '../hooks/useTypewriter'
import Explore from '../components/Explore'
import { FeaturedShowcase } from '../components/FeaturedShowcase'
import FloatingCta from '../components/FloatingCta'
import { Section } from '../components/ui'
import HeroPhoto from '../components/HeroPhoto'
import HeroRings from '../components/HeroRings'
import { HeroAffiliations, HomeBand, HomeExperience, HomeGallery, HomeHighlights, HomeHistory, HomeNow, HomeProgress, HomeStack, HomeStatement, Scrub } from '../components/home'
import { FaDownload, FaGithub } from 'react-icons/fa6'

export default function Home() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const typed = useTypewriter(SITE.roles[lang])
  const flagged = projects.filter((p) => p.featured)
  const featured = flagged.length > 0 ? flagged : projects.slice(0, 1)
  return (
    <>
      <HomeProgress />
      <div className="grid min-h-[78vh] items-center gap-12 py-6 md:grid-cols-[7fr_5fr] md:py-14">
        <div>
          <p className="mono-label mt-6">{t(SITE.greeting)}</p>
          <h1 className="mt-4 font-display text-[clamp(3.25rem,8vw,5.75rem)] leading-[1.02] tracking-tight">{SITE.name}</h1>
          <p className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] italic text-fg2">
            <span aria-hidden>{id ? 'Aku seorang ' : 'I am a '}<span>{typed}</span><i className="caret" /></span>
            <span className="sr-only">{t(SITE.role)}</span>
          </p>
          <p className="mb-10 mt-6 max-w-md text-base font-medium leading-relaxed text-fg/80 sm:text-lg">{t(SITE.lead)}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/project" className="btn-primary">{id ? 'Lihat proyek' : 'View projects'}<span aria-hidden="true" className="btn-arrow">→</span></Link>
            <Link to="/hire" className="btn-ghost">{id ? 'Yuk ngobrol' : "Let's talk"}</Link>
          </div>
          <HeroAffiliations />
        </div>
        <div className="relative order-first md:order-none">
          <HeroRings />
          <HeroPhoto />
        </div>
      </div>

      <Section title={id ? 'Jelajahi' : 'Explore'}><Explore /></Section>
      <HomeBand />
      <HomeStatement />
      <HomeHistory />
      <HomeHighlights />
      <HomeExperience />
      <HomeNow />
      <Scrub><FeaturedShowcase list={featured} /></Scrub>
      <HomeStack />
      <HomeBand back />
      <Scrub from="zoom" range={1.15}>
        <div id="home-cta" className="home-cta relative isolate mt-24 flex min-h-[100svh] flex-col justify-center overflow-hidden border-t border-line py-28 text-center md:py-40">
          <HeroRings className="hero-rings home-cta-rings" count={4} />
          <div className="home-cta-glow" aria-hidden="true" />
          <div className="home-cta-content relative z-10">
            <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-tight">{id ? 'Ayo kerja bareng' : "Let's work together"}</h2>
            <p className="mx-auto mt-5 max-w-md text-fg2">{id ? 'Punya proyek, magang, atau pertanyaan?' : 'Have a project, internship, or question?'}</p>
            <div className="mt-9 flex flex-col items-center gap-3">
              <Link to="/hire" className="btn-primary">{id ? 'Kirim pesan' : 'Send a message'}<span aria-hidden="true" className="btn-arrow">→</span></Link>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={SITE.contacts.find((contact) => contact.key === 'github')?.href} target="_blank" rel="noopener noreferrer" className="btn-ghost"><FaGithub aria-hidden="true" />GitHub</a>
                <a href={SITE.cv} download className="btn-ghost"><FaDownload aria-hidden="true" />{id ? 'Unduh CV' : 'Download CV'}</a>
              </div>
            </div>
          </div>
        </div>
      </Scrub>
      <HomeGallery />
      <FloatingCta />
    </>
  )
}
