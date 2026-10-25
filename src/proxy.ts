import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LANG, isLang } from './lib/i18n'

export function proxy(request: NextRequest) {
  const savedLang = request.cookies.get('lang')?.value
  const lang = savedLang && isLang(savedLang) ? savedLang : DEFAULT_LANG
  const destination = request.nextUrl.clone()
  destination.pathname = `/${lang}`
  return NextResponse.redirect(destination)
}

export const config = { matcher: ['/'] }
