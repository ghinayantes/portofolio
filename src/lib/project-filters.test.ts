import assert from 'node:assert/strict'
import { test } from 'node:test'

const modUrl = new URL('./project-filters.ts', import.meta.url).href
const mod = await import(modUrl).catch(() => undefined)
type F = { status: string; tags: Set<string>; q: string; sort: string }
type P = { title: string; desc: string; tags: string[]; status: 'completed' | 'in-progress'; date: string }
const filterProjectsV2 = mod?.filterProjectsV2 as ((list: P[], f: F, lang: 'en' | 'id', labels: (id: string) => string) => P[]) | undefined
const facetCounts = mod?.facetCounts as ((list: P[], f: F, lang: 'en' | 'id', labels: (id: string) => string) => { status: Record<string, number>; tech: Record<string, number> }) | undefined
const parseProjectSearchParams = mod?.parseProjectSearchParams as ((sp: URLSearchParams) => F) | undefined
const serializeProjectFilters = mod?.serializeProjectFilters as ((f: F) => string) | undefined

const labels = (id: string): string => ({ python: 'Python', java: 'Java', nextjs: 'Next.js' }[id] ?? id)
const list: P[] = [
  { title: 'Hash Ring', desc: 'hash distribution', tags: ['python'], status: 'completed', date: '2024-05-01' },
  { title: 'sOS', desc: 'operating system', tags: ['c'], status: 'in-progress', date: '2026-01-10' },
  { title: 'Portfolio', desc: 'built with Next.js', tags: ['nextjs'], status: 'in-progress', date: '2026-08-01' },
]

test('exposes filter helpers', () => {
  assert.equal(typeof filterProjectsV2, 'function')
  assert.equal(typeof facetCounts, 'function')
  assert.equal(typeof parseProjectSearchParams, 'function')
  assert.equal(typeof serializeProjectFilters, 'function')
})

test('OR inside tech, AND across status and query', () => {
  assert.equal(typeof filterProjectsV2, 'function')
  const all = filterProjectsV2!(list, { status: 'all', tags: new Set(['python', 'c']), q: '', sort: 'az' }, 'en', labels)
  assert.equal(all.length, 2)
  const q = filterProjectsV2!(list, { status: 'all', tags: new Set(), q: 'HASH', sort: 'az' }, 'en', labels)
  assert.equal(q.length, 1)
  assert.equal(q[0]?.title, 'Hash Ring')
  const status = filterProjectsV2!(list, { status: 'completed', tags: new Set(), q: '', sort: 'az' }, 'en', labels)
  assert.equal(status.length, 1)
})

test('sorts newest and az', () => {
  assert.equal(typeof filterProjectsV2, 'function')
  const newest = filterProjectsV2!(list, { status: 'all', tags: new Set(), q: '', sort: 'newest' }, 'en', labels)
  assert.equal(newest[0]?.title, 'Portfolio')
  const az = filterProjectsV2!(list, { status: 'all', tags: new Set(), q: '', sort: 'az' }, 'en', labels)
  assert.equal(az[0]?.title, 'Hash Ring')
})

test('facet counts are contextual and parse falls back on invalid input', () => {
  assert.equal(typeof facetCounts, 'function')
  const counts = facetCounts!(list, { status: 'all', tags: new Set(), q: '', sort: 'az' }, 'en', labels)
  assert.equal(counts.tech['python'], 1)
  assert.equal(counts.status['completed'], 1)
  assert.equal(typeof parseProjectSearchParams, 'function')
  const parsed = parseProjectSearchParams!(new URLSearchParams('status=bogus&tech=python,,&sort=nope'))
  assert.equal(parsed.status, 'all')
  assert.equal(parsed.sort, 'newest')
  assert.ok(parsed.tags.has('python'))
  assert.equal(typeof serializeProjectFilters, 'function')
  const qs = serializeProjectFilters!({ status: 'completed', tags: new Set(['python']), q: '', sort: 'newest' })
  assert.ok(qs.includes('status=completed'))
  assert.ok(qs.includes('tech=python'))
})
