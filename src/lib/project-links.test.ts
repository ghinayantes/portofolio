import assert from 'node:assert/strict'
import { test } from 'node:test'

const linksModuleUrl = new URL('./project-links.ts', import.meta.url).href
const mod = await import(linksModuleUrl).catch(() => undefined)
const getAvailableProjectLinks = mod?.getAvailableProjectLinks as
  | ((links: string[], hrefs?: string[]) => { label: string; href: string }[])
  | undefined

test('exposes an available-links helper for project cards', () => {
  assert.equal(typeof getAvailableProjectLinks, 'function', 'getAvailableProjectLinks should be exported')
})

test('drops empty, whitespace, and hash-only hrefs', () => {
  assert.equal(typeof getAvailableProjectLinks, 'function')
  assert.deepEqual(
    getAvailableProjectLinks!(['Live site', 'GitHub'], ['', 'https://github.com/example']),
    [{ label: 'GitHub', href: 'https://github.com/example' }],
  )
  assert.deepEqual(getAvailableProjectLinks!(['GitHub'], ['   ']), [])
  assert.deepEqual(getAvailableProjectLinks!(['GitHub'], ['#']), [])
})

test('trims hrefs and keeps order', () => {
  assert.equal(typeof getAvailableProjectLinks, 'function')
  assert.deepEqual(
    getAvailableProjectLinks!(['A', 'B'], ['  https://a.example  ', 'https://b.example']),
    [
      { label: 'A', href: 'https://a.example' },
      { label: 'B', href: 'https://b.example' },
    ],
  )
})
