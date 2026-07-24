import UPNG from 'upng-js'
import { canvasToRgbaArray } from './compose'

export type ExportFormat = 'png8' | 'rgba'

export function exportPngBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat = 'png8',
  colors = 256,
): Blob {
  const w = canvas.width
  const h = canvas.height
  const rgba = canvasToRgbaArray(canvas)
  const ab = rgba.buffer.slice(
    rgba.byteOffset,
    rgba.byteOffset + rgba.byteLength,
  ) as ArrayBuffer

  if (format === 'rgba') {
    const buf = UPNG.encode([ab], w, h, 0)
    return new Blob([buf], { type: 'image/png' })
  }

  const buf = UPNG.encode([ab], w, h, colors)
  return new Blob([buf], { type: 'image/png' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
