/** Dual-vision: white bg shows A, black bg shows B */

export type ComposeMode = 'luma' | 'rgb'

export interface ComposeOptions {
  mode: ComposeMode
  strength: number // 0.5–1.5, default 1
  maxSide: number
}

const DEFAULTS: ComposeOptions = {
  mode: 'luma',
  strength: 1,
  maxSide: 1600,
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function luma(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Load image file into HTMLImageElement */
export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像の読み込みに失敗しました'))
    }
    img.src = url
  })
}

/** Draw image cover-centered into target size */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  tw: number,
  th: number,
) {
  const ir = img.naturalWidth / img.naturalHeight
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

export interface ComposeResult {
  canvas: HTMLCanvasElement
  width: number
  height: number
  rgba: Uint8ClampedArray
}

/**
 * A = timeline look (white bg), B = reveal look (black bg)
 */
export async function composeReveal(
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  opts: Partial<ComposeOptions> = {},
): Promise<ComposeResult> {
  const { mode, strength, maxSide } = { ...DEFAULTS, ...opts }

  let w = Math.max(imgA.naturalWidth, imgB.naturalWidth)
  let h = Math.max(imgA.naturalHeight, imgB.naturalHeight)
  const long = Math.max(w, h)
  if (long > maxSide) {
    const s = maxSide / long
    w = Math.round(w * s)
    h = Math.round(h * s)
  }
  w = Math.max(1, w)
  h = Math.max(1, h)

  const ca = document.createElement('canvas')
  ca.width = w
  ca.height = h
  const cta = ca.getContext('2d', { willReadFrequently: true })!
  cta.fillStyle = '#ffffff'
  cta.fillRect(0, 0, w, h)
  drawCover(cta, imgA, w, h)
  const dataA = cta.getImageData(0, 0, w, h).data

  const cb = document.createElement('canvas')
  cb.width = w
  cb.height = h
  const ctb = cb.getContext('2d', { willReadFrequently: true })!
  ctb.fillStyle = '#000000'
  ctb.fillRect(0, 0, w, h)
  drawCover(ctb, imgB, w, h)
  const dataB = ctb.getImageData(0, 0, w, h).data

  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')!
  const imageData = ctx.createImageData(w, h)
  const d = imageData.data
  const eps = 1e-6
  const str = clamp(strength, 0.5, 1.5)

  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    const Ar = dataA[o]! / 255
    const Ag = dataA[o + 1]! / 255
    const Ab = dataA[o + 2]! / 255
    const Br = dataB[o]! / 255
    const Bg = dataB[o + 1]! / 255
    const Bb = dataB[o + 2]! / 255

    let a: number
    let r: number
    let g: number
    let b: number

    if (mode === 'luma') {
      const W = luma(Ar, Ag, Ab)
      const Bk = luma(Br, Bg, Bb)
      a = clamp((1 - W + Bk) * str, 0, 1)
      if (a > eps) {
        r = clamp(Br / a, 0, 1)
        g = clamp(Bg / a, 0, 1)
        b = clamp(Bb / a, 0, 1)
      } else {
        r = g = b = 0
      }
    } else {
      const ar = clamp((1 - Ar + Br) * str, 0, 1)
      const ag = clamp((1 - Ag + Bg) * str, 0, 1)
      const ab = clamp((1 - Ab + Bb) * str, 0, 1)
      a = Math.max(ar, ag, ab)
      if (a > eps) {
        r = clamp(Br / a, 0, 1)
        g = clamp(Bg / a, 0, 1)
        b = clamp(Bb / a, 0, 1)
      } else {
        r = g = b = 0
      }
    }

    d[o] = Math.round(r * 255)
    d[o + 1] = Math.round(g * 255)
    d[o + 2] = Math.round(b * 255)
    d[o + 3] = Math.round(a * 255)
  }

  ctx.putImageData(imageData, 0, 0)
  return { canvas: out, width: w, height: h, rgba: d }
}

export function canvasToRgbaArray(canvas: HTMLCanvasElement): Uint8Array {
  const ctx = canvas.getContext('2d')!
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return new Uint8Array(data.buffer.slice(0))
}
