import assert from 'node:assert/strict'
import { test } from 'node:test'

const validationModuleUrl = new URL('./hire-validation.ts', import.meta.url).href
const mod = await import(validationModuleUrl).catch(() => undefined)
const validateHireField = mod?.validateHireField as
  | ((field: 'name' | 'email' | 'message', value: string, lang: 'en' | 'id') => string | null)
  | undefined

test('exposes a per-field hire validator for onBlur use', () => {
  assert.equal(typeof validateHireField, 'function', 'validateHireField should be exported')
})

test('rejects empty name, invalid email, and empty message', () => {
  assert.equal(typeof validateHireField, 'function')
  assert.equal(validateHireField!('name', '   ', 'en'), 'Enter your name.')
  assert.equal(validateHireField!('name', '   ', 'id'), 'Nama wajib diisi.')
  assert.ok((validateHireField!('email', 'not-an-email', 'en') ?? '').length > 0)
  assert.ok((validateHireField!('email', 'nama@mail', 'id') ?? '').length > 0)
  assert.equal(validateHireField!('message', '', 'en'), 'Write a short message.')
})

test('accepts valid input without errors', () => {
  assert.equal(typeof validateHireField, 'function')
  assert.equal(validateHireField!('name', 'Ghina', 'en'), null)
  assert.equal(validateHireField!('email', 'nama@gmail.com', 'en'), null)
  assert.equal(validateHireField!('message', 'Halo, aku tertarik magang.', 'id'), null)
})
