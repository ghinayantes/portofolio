'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { useSettings } from '../context/Settings'

type Props = { to: string } & Omit<ComponentProps<typeof Link>, 'href'>
const withLang = (lang: string, to: string) => `/${lang}${to === '/' ? '' : to}`

/** next/link that prefixes the current locale: <LocLink to="/project" /> -> /en/project */
export function LocLink({ to, ...rest }: Props) {
  const { lang } = useSettings()
  return <Link href={withLang(lang, to)} {...rest} />
}

/** Same, but sets aria-current="page" when active (use `end` for exact match). */
export function NavLink({ to, end, ...rest }: Props & { end?: boolean }) {
  const { lang } = useSettings()
  const path = usePathname()
  const href = withLang(lang, to)
  const active = end ? path === href : path === href || path.startsWith(href + '/')
  return <Link href={href} aria-current={active ? 'page' : undefined} {...rest} />
}
