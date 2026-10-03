import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Background from './Background'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => {
    // cursor spotlight for .card
    const move = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest?.('.card') as HTMLElement | null
      if (!c) return
      const r = c.getBoundingClientRect()
      c.style.setProperty('--mx', `${e.clientX - r.left}px`)
      c.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [])
  return (
    <>
      <Background />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-28 pt-10 sm:px-8 lg:px-20"><Outlet /></main>
        <Footer />
      </div>
    </>
  )
}
