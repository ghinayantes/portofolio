/**
 * Optical sizing for logo rows: logos ship with different amounts of empty margin and very different shapes,
 * so the same box makes some look tiny. These helpers find the visible part of a logo and size it to a shared area.
 */

/** Visible part of an image, as fractions (0–1) of its width and height. */
export type ContentBox = { x: number; y: number; w: number; h: number }

/**
 * Bounding box of the pixels that differ from the background in RGBA data (as from canvas getImageData).
 * The background is transparency when the top-left pixel is transparent, otherwise that pixel's colour (a flat backdrop).
 * Returns null when nothing stands out.
 */
export function contentBox(data: ArrayLike<number>, width: number, height: number, tolerance = 40): ContentBox | null {
  const [br, bg, bb, ba] = [data[0], data[1], data[2], data[3]]
  const clear = ba < 16
  let x0 = width, y0 = height, x1 = -1, y1 = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const a = data[i + 3]
      const ink = clear
        ? a >= 16
        : a >= 16 && Math.abs(data[i] - br) + Math.abs(data[i + 1] - bg) + Math.abs(data[i + 2] - bb) > tolerance
      if (!ink) continue
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  if (x1 < 0) return null
  return { x: x0 / width, y: y0 / height, w: (x1 - x0 + 1) / width, h: (y1 - y0 + 1) / height }
}

/**
 * Display size for a logo whose visible part has the given aspect ratio (width / height):
 * every logo gets roughly the same area, capped so wide wordmarks and tall marks stay within bounds.
 */
export function fitSize(aspect: number, area = 2304, maxW = 104, maxH = 52): { w: number; h: number } {
  const a = aspect > 0 && Number.isFinite(aspect) ? aspect : 1
  let h = Math.sqrt(area / a)
  let w = h * a
  if (w > maxW) { w = maxW; h = w / a }
  if (h > maxH) { h = maxH; w = h * a }
  return { w: Math.round(w), h: Math.round(h) }
}
