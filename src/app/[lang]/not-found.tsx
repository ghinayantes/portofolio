'use client'

import { useSettings } from '../../context/Settings'
import { LocLink } from '../../components/LocLink'

export default function NotFound() {
  const { lang } = useSettings()
  return (
    <div className="py-24 text-center">
      <h1 className="grad-text font-display text-7xl font-extrabold">404</h1>
      <p className="mt-3 text-fg2">{lang === 'id' ? 'Halaman ini tidak ditemukan.' : 'This page does not exist.'}</p>
      <LocLink to="/" className="btn-primary mt-6">{lang === 'id' ? 'Kembali ke beranda' : 'Back home'}</LocLink>
    </div>
  )
}
