import { resolve4, resolveMx } from 'node:dns/promises'
import { checkEmail, emailDomain } from '../../../lib/email-check'
import { validateHireField, type HireField } from '../../../lib/hire-validation'

/** Where accepted messages are delivered. Override with FORMSPREE_ENDPOINT; the default is the form already used by the site. */
const ENDPOINT = process.env.FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/xljgdpgw'
const FIELDS: HireField[] = ['name', 'email', 'message']
const MAX: Record<HireField, number> = { name: 120, email: 200, message: 5000 }

/** Best-effort throttle per client address. Memory is per server instance, so this slows bursts rather than enforcing a hard cap. */
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 8
const hits = new Map<string, number[]>()

function throttled(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) { hits.set(key, recent); return true }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  return false
}

/** Largest request body the endpoint will read. A full-length message is ~6 KB, so anything far beyond that is not the form. */
const MAX_BODY_BYTES = 16 * 1024
const NO_STORE = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
const reply = (body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { ...NO_STORE, ...headers } })

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
/** Single-line fields end up in the mail subject and reply-to: drop control characters so nothing can inject extra headers. */
const oneLine = (v: unknown): string => text(v).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim()

/** True when the request comes from this site's own pages (same host in Origin, or in Referer when Origin is absent). */
function sameOrigin(request: Request): boolean {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const source = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !source) return false
  try {
    return new URL(source).host === host
  } catch {
    return false
  }
}

/** Reads the body as text but stops once it passes the size cap, so an oversized upload is never buffered whole. */
async function readCapped(request: Request): Promise<string | null> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return null
  if (!request.body) return ''
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) { await reader.cancel(); return null }
    chunks.push(value)
  }
  return new TextDecoder().decode(Buffer.concat(chunks))
}

/**
 * Does the sender's domain accept mail? Looks up MX records (falling back to an address record, as mail servers do).
 * Only a definite "no such domain / no mail server" counts as invalid; a slow or failing lookup lets the message through.
 */
async function domainAcceptsMail(domain: string): Promise<boolean> {
  const missing = (e: unknown) => typeof e === 'object' && e !== null && 'code' in e && ['ENOTFOUND', 'ENODATA', 'NXDOMAIN'].includes(String((e as { code: unknown }).code))
  const lookup = async (): Promise<boolean> => {
    try {
      const mx = await resolveMx(domain)
      // A single "." exchange is the standard way for a domain to declare it accepts no mail.
      if (mx.length > 0) return mx.some((r) => r.exchange !== '' && r.exchange !== '.')
    } catch (e) {
      if (!missing(e)) return true
    }
    try {
      return (await resolve4(domain)).length > 0
    } catch (e) {
      return !missing(e)
    }
  }
  return Promise.race([lookup(), new Promise<boolean>((done) => setTimeout(() => done(true), 3000))])
}

/**
 * Contact form backend: validates on the server, verifies the sender's address (syntax, typos, throwaway inboxes, and whether the
 * domain accepts mail), drops bot submissions, throttles bursts, then forwards to the mail endpoint.
 * Guards, in order: same-origin only (403), JSON only (415), per-address throttle (429), body size cap (413).
 * Responses: 200 { ok: true } | 400 { ok: false, error: 'invalid', fields } | 502 (delivery failed).
 */
export async function POST(request: Request) {
  // Only this site's own form may post here; other sites cannot submit on a visitor's behalf.
  if (!sameOrigin(request)) return reply({ ok: false, error: 'forbidden' }, 403)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return reply({ ok: false, error: 'unsupported' }, 415)

  // Throttle before doing any work, so floods are cheap to reject.
  const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (throttled(ip)) return reply({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': String(WINDOW_MS / 1000) })

  const raw = await readCapped(request)
  if (raw === null) return reply({ ok: false, error: 'too_large' }, 413)
  let body: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('not an object')
    body = parsed as Record<string, unknown>
  } catch {
    return reply({ ok: false, error: 'invalid', fields: {} }, 400)
  }

  // Honeypot: real visitors never see or fill this field. Answer as if it worked so bots do not retry.
  if (text(body.company) !== '') return reply({ ok: true })

  const lang = body.lang === 'id' ? 'id' : 'en'
  const values = { name: oneLine(body.name), email: oneLine(body.email), message: text(body.message) }
  const fields: Partial<Record<HireField, string>> = {}
  for (const k of FIELDS) {
    const msg = validateHireField(k, values[k], lang)
      ?? (values[k].length > MAX[k] ? (lang === 'id' ? `Maksimal ${MAX[k]} karakter.` : `Keep it under ${MAX[k]} characters.`) : null)
    if (msg) fields[k] = msg
  }
  if (!fields.email) {
    const id = lang === 'id'
    const issue = checkEmail(values.email)
    if (issue?.code === 'syntax') fields.email = id ? 'Masukkan email yang valid, misalnya nama@gmail.com.' : 'Enter a valid email, like name@gmail.com.'
    else if (issue?.code === 'typo') fields.email = id ? `Alamat ini sepertinya salah ketik. Maksudnya ${issue.suggestion}?` : `This address looks mistyped. Did you mean ${issue.suggestion}?`
    else if (issue?.code === 'disposable') fields.email = id ? 'Gunakan email tetap, bukan email sementara, supaya bisa aku balas.' : 'Please use a permanent address, not a temporary inbox, so I can reply.'
    else if (!(await domainAcceptsMail(emailDomain(values.email)))) fields.email = id ? 'Domain email ini tidak dapat menerima email. Periksa lagi alamatnya.' : 'This email domain cannot receive mail. Please check the address.'
  }
  if (Object.keys(fields).length > 0) return reply({ ok: false, error: 'invalid', fields }, 400)

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, _replyto: values.email, _subject: `Portfolio message from ${values.name}` }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`mail endpoint responded ${res.status}`)
    return reply({ ok: true })
  } catch (e) {
    console.error('[hire] delivery failed:', e instanceof Error ? e.message : e)
    return reply({ ok: false, error: 'delivery_failed' }, 502)
  }
}
