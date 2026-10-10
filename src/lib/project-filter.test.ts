import assert from 'node:assert/strict'
import { test } from 'node:test'

type Localized = string | { en: string; id: string }
type Project = { title: Localized; tags: Localized[]; wip?: boolean }

const filterModuleUrl = new URL('./project-filter.ts', import.meta.url).href
const mod = await import(filterModuleUrl).catch(() => undefined)
const getProjectStacks = mod?.getProjectStacks as
  | ((p: Project, lang: 'en' | 'id') => string[])
  | undefined
const filterProjects = mod?.filterProjects as
  | ((list: Project[], lang: 'en' | 'id', status: 'all' | 'done' | 'wip', stack: string) => Project[])
  | undefined

test('exposes stack helpers for the project explorer', () => {
  assert.equal(typeof getProjectStacks, 'function', 'getProjectStacks should be exported')
  assert.equal(typeof filterProjects, 'function', 'filterProjects should be exported')
})

test('includes frameworks and tools, not only programming languages', () => {
  assert.equal(typeof getProjectStacks, 'function')
  const p: Project = { title: 'Portfolio Website', tags: ['Figma', 'Next.js', 'Tailwind', 'TypeScript'] }
  assert.deepEqual(getProjectStacks!(p, 'en'), ['Figma', 'Next.js', 'Tailwind', 'TypeScript'])
})

test('excludes generic descriptors but keeps real tech', () => {
  assert.equal(typeof getProjectStacks, 'function')
  const generic: Project = { title: 'Food Waste Stop', tags: ['Web app', 'Use case design', 'Team of 4'] }
  assert.deepEqual(getProjectStacks!(generic, 'en'), [])
  const desktop: Project = { title: 'Linear Algebra Calculator', tags: ['Desktop app', 'Java', 'JavaFX', 'CSS'] }
  assert.deepEqual(getProjectStacks!(desktop, 'en'), ['Java', 'JavaFX', 'CSS'])
})

test('resolves localized tags per language', () => {
  assert.equal(typeof getProjectStacks, 'function')
  const p: Project = { title: 'x', tags: [{ en: 'Desktop app', id: 'Aplikasi desktop' }, 'Java'] }
  assert.deepEqual(getProjectStacks!(p, 'id'), ['Java'])
})

test('filters by status and stack together', () => {
  assert.equal(typeof filterProjects, 'function')
  const list: Project[] = [
    { title: 'A', tags: ['Next.js'], wip: true },
    { title: 'B', tags: ['Python'] },
  ]
  assert.equal(filterProjects!(list, 'en', 'all', 'Next.js').length, 1)
  assert.equal(filterProjects!(list, 'en', 'done', 'all').length, 1)
  assert.equal(filterProjects!(list, 'en', 'wip', 'all').length, 1)
})
