'use client'

import { useState, type FormEvent } from 'react'
import { SITE } from '../data/site'
import { useSettings } from '../context/Settings'

const field = 'w-full rounded-lg border bg-surface px-3.5 py-3 text-base text-fg outline-none focus:border-brand focus:ring-2 focus:ring-brand/40'

export default function Hire() {
  const { t, lang } = useSettings()
  const id = lang === 'id'
  const [err, setErr] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const name = String(f.get('name') ?? '').trim()
    const email = String(f.get('email') ?? '').trim()
    const message = String(f.get('message') ?? '').trim()
    const er: Record<string, string> = {}
    if (!name) er.name = id ? 'Nama wajib diisi.' : 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = id ? 'Masukkan email yang valid, misalnya nama@mail.com.' : 'Enter a valid email, like name@mail.com.'
    if (!message) er.message = id ? 'Tulis pesan singkat.' : 'Write a short message.'
    setErr(er)
    if (Object.keys(er).length) return
    // TODO: send to Formspree / Web3Forms / your API here.
    setSent(true)
    form.reset()
  }

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <p className="max-w-[46ch] text-lg text-fg2">{id ? 'Aku terbuka untuk kesempatan magang dan proyek di bidang pengembangan web dan UI/UX. Kirim pesan, dan aku akan membalas dalam dua hari.' : "I'm open to internships and project work in web development and UI/UX. Send a message and I'll reply within two days."}</p>
        <ul className="mt-6 grid gap-2.5 border-l-2 border-line pl-5">
          {SITE.socials.map(([label, href], i) => <li key={i}><a href={href} className="font-medium text-brand">{t(label)}</a></li>)}
        </ul>
      </div>
      <form onSubmit={submit} noValidate className="grid gap-4">
        {(['name', 'email', 'message'] as const).map((k) => (
          <label key={k} className="grid gap-1.5 text-sm font-medium capitalize">
            {id ? ({ name: 'Nama', email: 'Email', message: 'Pesan' }[k]) : k}
            {k === 'message'
              ? <textarea name={k} rows={5} aria-invalid={!!err[k]} className={`${field} ${err[k] ? 'border-red-500' : 'border-line'}`} />
              : <input name={k} type={k === 'email' ? 'email' : 'text'} aria-invalid={!!err[k]} className={`${field} ${err[k] ? 'border-red-500' : 'border-line'}`} />}
            {err[k] && <span className="text-[13px] text-red-500">{err[k]}</span>}
          </label>
        ))}
        <button type="submit" className="btn-primary justify-self-start">{id ? 'Kirim pesan' : 'Send message'}</button>
        {sent && <p role="status" className="text-sm text-fg2">{id ? 'Pesan terkirim (demo). Hubungkan backend formulir di Hire.tsx.' : 'Message sent (demo). Connect a form backend in Hire.tsx.'}</p>}
      </form>
    </div>
  )
}
