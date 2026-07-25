/**
 * Node e2e: load demo A/B via undici, run same math as compose (approx via pure JS canvas-less),
 * and verify UPNG export produces a valid PNG with alpha.
 * For pixel path we re-implement compose on ImageData using pure arrays from PNG decode via UPNG.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import UPNG from 'upng-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const examples = path.join(root, 'public', 'examples')

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}
function luma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function decodePng(file) {
  const buf = fs.readFileSync(file)
  const img = UPNG.decode(buf)
  const rgba = new Uint8Array(UPNG.toRGBA8(img)[0])
  return { w: img.width, h: img.height, rgba }
}

function compose(a, b, strength = 1) {
  const w = Math.min(a.w, b.w)
  const h = Math.min(a.h, b.h)
  const out = new Uint8ClampedArray(w * h * 4)
  const str = clamp(strength, 0.5, 1.5)
  const eps = 1e-6
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const oi = (y * w + x) * 4
      const ai = (y * a.w + x) * 4
      const bi = (y * b.w + x) * 4
      const Ar = a.rgba[ai] / 255
      const Ag = a.rgba[ai + 1] / 255
      const Ab = a.rgba[ai + 2] / 255
      const Br = b.rgba[bi] / 255
      const Bg = b.rgba[bi + 1] / 255
      const Bb = b.rgba[bi + 2] / 255
      const W = luma(Ar, Ag, Ab)
      const Bk = luma(Br, Bg, Bb)
      let alpha = clamp((1 - W + Bk) * str, 0, 1)
      let r = 0,
        g = 0,
        bv = 0
      if (alpha > eps) {
        r = clamp(Br / alpha, 0, 1)
        g = clamp(Bg / alpha, 0, 1)
        bv = clamp(Bb / alpha, 0, 1)
      }
      out[oi] = Math.round(r * 255)
      out[oi + 1] = Math.round(g * 255)
      out[oi + 2] = Math.round(bv * 255)
      out[oi + 3] = Math.round(alpha * 255)
    }
  }
  return { w, h, rgba: out }
}

function composite(rgba, w, h, bg) {
  const out = new Uint8ClampedArray(w * h * 3)
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    const a = rgba[o + 3] / 255
    out[i * 3] = Math.round(rgba[o] * a + bg[0] * (1 - a))
    out[i * 3 + 1] = Math.round(rgba[o + 1] * a + bg[1] * (1 - a))
    out[i * 3 + 2] = Math.round(rgba[o + 2] * a + bg[2] * (1 - a))
  }
  return out
}

const imgA = decodePng(path.join(examples, 'demo-a.png'))
const imgB = decodePng(path.join(examples, 'demo-b.png'))
const composed = compose(imgA, imgB, 1)
const ab = composed.rgba.buffer.slice(
  composed.rgba.byteOffset,
  composed.rgba.byteOffset + composed.rgba.byteLength,
)
const png8 = UPNG.encode([ab], composed.w, composed.h, 256)
const png32 = UPNG.encode([ab], composed.w, composed.h, 0)
const outDir = path.join(root, 'public', 'examples')
fs.writeFileSync(path.join(outDir, 'e2e-out-png8.png'), Buffer.from(png8))
fs.writeFileSync(path.join(outDir, 'e2e-out-rgba.png'), Buffer.from(png32))

const onW = composite(composed.rgba, composed.w, composed.h, [255, 255, 255])
const onB = composite(composed.rgba, composed.w, composed.h, [0, 0, 0])
let diff = 0
for (let i = 0; i < onW.length; i++) diff += Math.abs(onW[i] - onB[i])
const meanDiff = diff / onW.length
const alphaMean =
  [...composed.rgba].filter((_, i) => i % 4 === 3).reduce((s, v) => s + v, 0) /
  (composed.w * composed.h)

console.log({
  size: `${composed.w}x${composed.h}`,
  png8Bytes: png8.byteLength,
  png32Bytes: png32.byteLength,
  meanDiffWhiteBlack: meanDiff.toFixed(2),
  alphaMean: alphaMean.toFixed(1),
  png8Header: Buffer.from(png8).subarray(0, 8).toString('hex'),
})

if (meanDiff < 5) throw new Error('white/black too similar — compose failed')
if (png8.byteLength < 100) throw new Error('png8 too small')
if (Buffer.from(png8)[0] !== 0x89) throw new Error('not a PNG')
console.log('E2E EXPORT OK')
