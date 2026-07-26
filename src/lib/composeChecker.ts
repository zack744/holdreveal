/**
 * Tap-change (市松) style — same family as rakuraku-image-splitter:
 * Base image: border-connected pure white → transparent, then 1px checkerboard alpha.
 * Front layer: force fully opaque where painted (timeline-visible overlay).
 */

export interface CheckerComposeResult {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

function setCanvasSize(canvas: HTMLCanvasElement, w: number, h: number) {
  canvas.width = Math.max(1, Math.round(w))
  canvas.height = Math.max(1, Math.round(h))
}

function isTransparentByChecker(x: number, y: number) {
  return ((x + y) & 1) === 1
}

/** Border-connected pure white (255,255,255) flood → mask for knockout */
function getBorderConnectedWhiteMask(
  data: Uint8ClampedArray,
  w: number,
  h: number,
): Uint8Array {
  const mask = new Uint8Array(w * h)
  const queue: number[] = []
  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const p = y * w + x
    if (mask[p]) return
    const i = p * 4
    if (data[i + 3]! === 0) return
    if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) return
    mask[p] = 1
    queue.push(p)
  }
  for (let x = 0; x < w; x++) {
    push(x, 0)
    push(x, h - 1)
  }
  for (let y = 1; y < h - 1; y++) {
    push(0, y)
    push(w - 1, y)
  }
  for (let qi = 0; qi < queue.length; qi++) {
    const p = queue[qi]!
    const x = p % w
    const y = (p / w) | 0
    push(x - 1, y)
    push(x + 1, y)
    push(x, y - 1)
    push(x, y + 1)
  }
  return mask
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  tw: number,
  th: number,
) {
  const iw =
    img instanceof HTMLImageElement ? img.naturalWidth : img.width
  const ih =
    img instanceof HTMLImageElement ? img.naturalHeight : img.height
  const ir = iw / ih
  const tr = tw / th
  let dw: number
  let dh: number
  if (ir > tr) {
    dh = th
    dw = th * ir
  } else {
    dw = tw
    dh = tw / ir
  }
  const dx = (tw - dw) / 2
  const dy = (th - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

function processBaseLayer(layer: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = layer.getContext('2d', { willReadFrequently: true })!
  const im = ctx.getImageData(0, 0, layer.width, layer.height)
  const d = im.data
  const whiteMask = getBorderConnectedWhiteMask(d, layer.width, layer.height)
  for (let y = 0; y < layer.height; y++) {
    for (let x = 0; x < layer.width; x++) {
      const p = y * layer.width + x
      const i = p * 4
      if (d[i + 3]! === 0) continue
      if (whiteMask[p]) {
        d[i + 3] = 0
        continue
      }
      d[i + 3] = isTransparentByChecker(x, y) ? 0 : 255
    }
  }
  ctx.putImageData(im, 0, 0)
  return layer
}

function processFrontLayer(layer: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = layer.getContext('2d', { willReadFrequently: true })!
  const im = ctx.getImageData(0, 0, layer.width, layer.height)
  const d = im.data
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3]! !== 0) d[i + 3] = 255
  }
  ctx.putImageData(im, 0, 0)
  return layer
}

function imageToSizedCanvas(
  img: HTMLImageElement,
  w: number,
  h: number,
  fill?: string,
): HTMLCanvasElement {
  const c = document.createElement('canvas')
  setCanvasSize(c, w, h)
  const ctx = c.getContext('2d')!
  if (fill) {
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, w, h)
  } else {
    ctx.clearRect(0, 0, w, h)
  }
  drawCover(ctx, img, w, h)
  return c
}

/**
 * @param baseImg full art (revealed on black / long-press)
 * @param frontImg optional timeline-visible overlay (opaque stamp layer)
 */
export function composeChecker(
  baseImg: HTMLImageElement,
  frontImg: HTMLImageElement | null,
  maxSide = 1600,
): CheckerComposeResult {
  let w = baseImg.naturalWidth || baseImg.width
  let h = baseImg.naturalHeight || baseImg.height
  if (frontImg) {
    w = Math.max(w, frontImg.naturalWidth || frontImg.width)
    h = Math.max(h, frontImg.naturalHeight || frontImg.height)
  }
  const long = Math.max(w, h)
  if (long > maxSide) {
    const s = maxSide / long
    w = Math.round(w * s)
    h = Math.round(h * s)
  }
  w = Math.max(1, w)
  h = Math.max(1, h)

  const base = processBaseLayer(imageToSizedCanvas(baseImg, w, h))
  let front: HTMLCanvasElement | null = null
  if (frontImg) {
    front = processFrontLayer(imageToSizedCanvas(frontImg, w, h))
  }

  const out = document.createElement('canvas')
  setCanvasSize(out, w, h)
  const ctx = out.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(base, 0, 0)
  if (front) ctx.drawImage(front, 0, 0)

  return { canvas: out, width: w, height: h }
}
