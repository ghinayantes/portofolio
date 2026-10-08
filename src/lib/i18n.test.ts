import assert from 'node:assert/strict'
import { test } from 'node:test'

const modUrl = new URL('./i18n.ts', import.meta.url).href
const mod = await import(modUrl).catch(() => undefined)
const switchLangPath = mod?.switchLangPath as
  | ((pathname: string, search: string, next: 'en' | 'id') => string)
  | undefined

test('exposes a language-switch path helper that preserves the query string', () => {
  assert.equal(typeof switchLangPath, 'function', 'switchLangPath should be exported')
})

test('keeps filter query when switching languages', () => {
  assert.equal(typeof switchLangPath, 'function')
  assert.equal(switchLangPath!('/en/project', '?tech=python&q=hash', 'id'), '/id/project?tech=python&q=hash')
  assert.equal(switchLangPath!('/id/project', '?status=completed', 'en'), '/en/project?status=completed')
})

test('works without a query string', () => {
  assert.equal(typeof switchLangPath, 'function')
  assert.equal(switchLangPath!('/en/project', '', 'id'), '/id/project')
})
