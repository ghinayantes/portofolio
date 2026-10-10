/** Sender-address checks that need no network: strict syntax, common typos, and throwaway providers. */

const SYNTAX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i

/** Mistyped domain -> the provider that was almost certainly meant. */
const TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gnail.com': 'gmail.com', 'gamil.com': 'gmail.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outloook.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com', 'icloud.con': 'icloud.com',
}

/** Throwaway inbox providers; a reply sent there reaches nobody. */
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
  'yopmail.com', 'trashmail.com', 'getnada.com', 'throwawaymail.com', 'maildrop.cc', 'dispostable.com', 'fakeinbox.com', 'tempinbox.com', 'mintemail.com',
])

export type EmailIssue = { code: 'syntax' } | { code: 'typo'; suggestion: string } | { code: 'disposable' }

/** Returns the first problem with the address, or null when it looks deliverable on paper. */
export function checkEmail(raw: string): EmailIssue | null {
  const email = raw.trim()
  if (email.length > 254 || !SYNTAX.test(email) || email.includes('..')) return { code: 'syntax' }
  const [local, domain] = [email.slice(0, email.lastIndexOf('@')), email.slice(email.lastIndexOf('@') + 1).toLowerCase()]
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.')) return { code: 'syntax' }
  if (TYPOS[domain]) return { code: 'typo', suggestion: `${local}@${TYPOS[domain]}` }
  if (DISPOSABLE.has(domain)) return { code: 'disposable' }
  return null
}

export const emailDomain = (email: string): string => email.trim().slice(email.lastIndexOf('@') + 1).toLowerCase()
