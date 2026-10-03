import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LANG, LANGS, isLang } from './lib/i18n'

/** Redirects / and un-prefixed paths to /en or /id (cookie > Accept-Language > default). */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next()
  const cookie = req.cookies.get('lang')?.value
  const accept = req.headers.get('accept-language')?.split(',').map((s) => s.split(';')[0].split('-')[0].trim().toLowerCase()).find(isLang)
  const lang = cookie && isLang(cookie) ? cookie : (accept ?? DEFAULT_LANG)
  const url = req.nextUrl.clone()
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] }
