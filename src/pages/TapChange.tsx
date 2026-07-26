import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import UploadSlot from '../components/UploadSlot'
import { loadImage } from '../lib/compose'
import { composeChecker } from '../lib/composeChecker'
import {
  downloadBlob,
  exportPngBlob,
  type ExportFormat,
} from '../lib/exportPng'
import { useI18n, usePageSeo } from '../i18n/context'

type PreviewBg = 'white' | 'black' | 'card'

async function urlToFile(url: string, name: string): Promise<File> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new File([blob], name, { type: blob.type || 'image/png' })
}

export default function TapChange() {
  const { t, lp } = useI18n()
  const m = t.tapChange
  usePageSeo(m.title, m.description, '/tap-change/')

  const [baseFile, setBaseFile] = useState<File | null>(null)
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ExportFormat>('png8')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    canvas: HTMLCanvasElement
    width: number
    height: number
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [bg, setBg] = useState<PreviewBg>('white')

  const run = useCallback(async () => {
    if (!baseFile) {
      setError(m.needBase)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const baseImg = await loadImage(baseFile)
      const frontImg = frontFile ? await loadImage(frontFile) : null
      const res = composeChecker(baseImg, frontImg, 1600)
      setResult(res)
      res.canvas.toBlob((blob) => {
        if (!blob) return
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return URL.createObjectURL(blob)
        })
      }, 'image/png')
    } catch (e) {
      setError(e instanceof Error ? e.message : m.fail)
    } finally {
      setBusy(false)
    }
  }, [baseFile, frontFile, m.needBase, m.fail])

  useEffect(() => {
    if (baseFile) void run()
  }, [baseFile, frontFile, run])

  const onDownload = () => {
    if (!result) return
    const blob = exportPngBlob(result.canvas, format)
    downloadBlob(
      blob,
      `holdreveal-tap-${result.width}x${result.height}-${format}.png`,
    )
  }

  const loadDemo = async () => {
    setBusy(true)
    setError(null)
    try {
      const f = await urlToFile(
        '/examples/case01-angel-source.png',
        'demo-base.png',
      )
      setFrontFile(null)
      setBaseFile(f)
    } catch {
      setError(m.demoFail)
      setBusy(false)
    }
  }

  const bgStyle = useMemo(() => {
    if (bg === 'white') return { background: '#fff' }
    if (bg === 'black') return { background: '#000' }
    return { background: '#e7e9ea' }
  }, [bg])

  return (
    <article style={{ maxWidth: '56rem' }}>
      <header className="top">
        <h1>{m.h1}</h1>
        <p className="lead">{m.lead}</p>
      </header>

      <section className="warn">
        <strong>{m.warn}</strong>{' '}
        <Link to={lp('/how-it-works/')}>{m.warnLink}</Link>
        {' · '}
        <Link to={lp('/')}>{m.linkDual}</Link>
      </section>

      <section className="tool-block" aria-label="tap-change">
        <div className="tool-head">
          <h2 className="tool-title">{m.toolTitle}</h2>
          <button
            type="button"
            className="btn sm"
            onClick={() => void loadDemo()}
            disabled={busy}
          >
            {m.loadDemo}
          </button>
        </div>
        <main className="grid">
          <div className="col">
            <UploadSlot
              label={m.slotBase}
              hint={m.slotBaseHint}
              file={baseFile}
              onFile={setBaseFile}
              dropLabel={t.home.drop}
              clearLabel={t.home.clear}
            />
            <UploadSlot
              label={m.slotFront}
              hint={m.slotFrontHint}
              file={frontFile}
              onFile={setFrontFile}
              dropLabel={t.home.drop}
              clearLabel={t.home.clear}
            />
            <div className="controls">
              <label className="ctrl">
                <span>{t.home.export}</span>
                <select
                  value={format}
                  onChange={(e) =>
                    setFormat(e.target.value as ExportFormat)
                  }
                >
                  <option value="png8">{t.home.exportPng8}</option>
                  <option value="rgba">{t.home.exportRgba}</option>
                </select>
              </label>
              <button
                type="button"
                className="btn"
                disabled={busy || !baseFile}
                onClick={() => void run()}
              >
                {busy ? t.home.composing : t.home.recompose}
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={!result || busy}
                onClick={onDownload}
              >
                {t.home.download}
              </button>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="content-block" style={{ marginTop: '1rem' }}>
              <h3>{m.howTitle}</h3>
              <ol>
                {m.howSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="credit">{m.diffNote}</p>
            </div>
          </div>
          <div className="col">
            <div className="preview-bar">
              <span>{t.home.previewBar}</span>
              <div className="tabs">
                <button
                  type="button"
                  className={bg === 'white' ? 'on' : ''}
                  onClick={() => setBg('white')}
                >
                  {t.home.tabWhite}
                </button>
                <button
                  type="button"
                  className={bg === 'black' ? 'on' : ''}
                  onClick={() => setBg('black')}
                >
                  {t.home.tabBlack}
                </button>
                <button
                  type="button"
                  className={bg === 'card' ? 'on' : ''}
                  onClick={() => setBg('card')}
                >
                  {t.home.tabCard}
                </button>
              </div>
            </div>
            <div className="preview" style={bgStyle}>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" />
              ) : (
                <p className="preview-empty">{m.previewEmpty}</p>
              )}
            </div>
          </div>
        </main>
      </section>
    </article>
  )
}
