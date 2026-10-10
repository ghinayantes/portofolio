import assert from 'node:assert/strict'
import { test } from 'node:test'

type PointerLean = (pointerType: string) => { rotateX: number } | null
type CardAction = (links: string[], hrefs?: string[]) => { label: string; href: string } | null

const tiltModuleUrl = new URL('./project-card-motion.ts', import.meta.url).href
const getProjectCardLeanForPointer = await import(tiltModuleUrl)
  .then((module) => module.getProjectCardLeanForPointer as PointerLean | undefined)
  .catch(() => undefined)
const getProjectCardAction = await import(tiltModuleUrl)
  .then((module) => module.getProjectCardAction as CardAction | undefined)
  .catch(() => undefined)

test('reclines straight backward without reacting to the cursor direction', () => {
  assert.equal(typeof getProjectCardLeanForPointer, 'function', 'project-card lean helper should be exported')
  assert.deepEqual(getProjectCardLeanForPointer!('mouse'), { rotateX: 40 })
})

test('does not recline for touch or pen pointers', () => {
  assert.equal(typeof getProjectCardLeanForPointer, 'function', 'project-card lean helper should be exported')
  assert.equal(getProjectCardLeanForPointer!('touch'), null)
  assert.equal(getProjectCardLeanForPointer!('pen'), null)
})

test('prefers a live link and falls back to GitHub for the light-pillar action', () => {
  assert.equal(typeof getProjectCardAction, 'function', 'project-card action helper should be exported')
  assert.deepEqual(getProjectCardAction!(['GitHub', 'Live site'], ['https://github.com/example', 'https://example.com']), {
    label: 'live', href: 'https://example.com',
  })
  assert.deepEqual(getProjectCardAction!(['GitHub'], ['https://github.com/example']), {
    label: 'github', href: 'https://github.com/example',
  })
})

test('falls back to the existing GitHub link label when its URL is still a placeholder', () => {
  assert.equal(typeof getProjectCardAction, 'function', 'project-card action helper should be exported')
  assert.deepEqual(getProjectCardAction!(['Live site', 'GitHub'], ['', 'https://github.com/example']), {
    label: 'github', href: 'https://github.com/example',
  })
  assert.deepEqual(getProjectCardAction!(['GitHub'], ['']), { label: 'github', href: '#' })
  assert.equal(getProjectCardAction!(['Live site'], ['']), null)
})
