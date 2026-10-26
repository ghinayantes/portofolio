import assert from 'node:assert/strict'
import { test } from 'node:test'

const mod = await import(new URL('./logo-fit.ts', import.meta.url).href)
const contentBox = mod.contentBox as (data: ArrayLike<number>, width: number, height: number, tolerance?: number) => { x: number; y: number; w: number; h: number } | null
const fitSize = mod.fitSize as (aspect: number, area?: number, maxW?: number, maxH?: number) => { w: number; h: number }

/** width × height RGBA image filled with `bg`, with the rectangle [x0, x1) × [y0, y1) painted `ink`. */
function image(width: number, height: number, bg: number[], ink: number[], [x0, y0, x1, y1]: number[]) {
  const data: number[] = []
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) data.push(...(x >= x0 && x < x1 && y >= y0 && y < y1 ? ink : bg))
  return data
}

test('finds the visible part of a logo on a transparent background', () => {
  const data = image(10, 10, [0, 0, 0, 0], [20, 40, 200, 255], [2, 3, 6, 9])
  assert.deepEqual(contentBox(data, 10, 10), { x: 0.2, y: 0.3, w: 0.4, h: 0.6 })
})

test('treats a flat opaque backdrop as empty space', () => {
  const data = image(10, 10, [255, 255, 255, 255], [10, 10, 10, 255], [0, 5, 10, 7])
  assert.deepEqual(contentBox(data, 10, 10), { x: 0, y: 0.5, w: 1, h: 0.2 })
})

test('returns null for an empty image', () => {
  assert.equal(contentBox(image(4, 4, [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]), 4, 4), null)
})

test('gives square and wide logos about the same area within the caps', () => {
  assert.deepEqual(fitSize(1), { w: 48, h: 48 })
  const wide = fitSize(3)
  assert.ok(Math.abs(wide.w * wide.h - 2304) < 60, `area ${wide.w * wide.h}`)
  assert.deepEqual(fitSize(10), { w: 104, h: 10 })
  assert.deepEqual(fitSize(0.2), { w: 10, h: 52 })
  assert.deepEqual(fitSize(Number.NaN), { w: 48, h: 48 })
})
