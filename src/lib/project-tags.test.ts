import assert from 'node:assert/strict'
import { test } from 'node:test'

const modUrl = new URL('./project-tags.ts', import.meta.url).href
const mod = await import(modUrl).catch(() => undefined)
const tagLabel = mod?.tagLabel as ((id: string, lang: 'en' | 'id') => string) | undefined
const legacyTagToId = mod?.legacyTagToId as ((raw: string) => string | null) | undefined
const PROJECT_TAGS = mod?.PROJECT_TAGS as Array<{ id: string; label: { en: string; id: string }; group: string }> | undefined
const sanitizeTechIds = mod?.sanitizeTechIds as ((ids: Set<string>) => Set<string>) | undefined

test('exposes the tag registry helpers', () => {
  assert.equal(typeof tagLabel, 'function', 'tagLabel should be exported')
  assert.equal(typeof legacyTagToId, 'function', 'legacyTagToId should be exported')
  assert.ok(Array.isArray(PROJECT_TAGS), 'PROJECT_TAGS should be exported')
})

test('resolves stable ids per language', () => {
  assert.equal(typeof tagLabel, 'function')
  assert.equal(tagLabel!('nextjs', 'en'), 'Next.js')
  assert.equal(tagLabel!('nextjs', 'id'), 'Next.js')
  assert.equal(tagLabel!('figma', 'en'), 'Figma')
})

test('maps legacy labels to ids and drops generic descriptors', () => {
  assert.equal(typeof legacyTagToId, 'function')
  assert.equal(legacyTagToId!('Python'), 'python')
  assert.equal(legacyTagToId!('Next.js'), 'nextjs')
  assert.equal(legacyTagToId!('Figma'), 'figma')
  assert.equal(legacyTagToId!('Web app'), null)
  assert.equal(legacyTagToId!('Team of 4'), null)
  assert.equal(legacyTagToId!('Aplikasi desktop'), null)
})

test('drops unknown tech ids instead of matching nothing', () => {
  assert.equal(typeof sanitizeTechIds, 'function', 'sanitizeTechIds should be exported')
  const kept = sanitizeTechIds!(new Set(['bogus-id', 'python']))
  assert.ok(!kept.has('bogus-id'))
  assert.ok(kept.has('python'))
  assert.equal(sanitizeTechIds!(new Set(['bogus-id'])).size, 0)
})
