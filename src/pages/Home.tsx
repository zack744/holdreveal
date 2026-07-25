import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  composeReveal,
  loadImage,
  type ComposeMode,
  type ComposeResult,
} from '../lib/compose'
import { downloadBlob, exportPngBlob, type ExportFormat } from '../lib/exportPng'
import { useI18n, usePageSeo } from '../i18n/context'
import { SHOWCASE_CASES } from '../data/showcase'

type PreviewBg = 'white' | 'black' | 'card'

function UploadSlot({
  label,
  hint,
  file,
  onFile,
  dropLabel,
  clearLabel,
}: {
  label: string
  hint: string
  file: File | null
  onFile: (f: File | null) => void
  dropLabel: string
  clearLabel: string
}) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const u = URL.createObjectURL(file)
    setPreview(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  return (
    <label className="slot">
      <div className="slot-head">
        <span className="slot-label">{label}</span>
        <span className="slot-hint">{hint}</span>
      </div>
      <div className={`slot-body ${preview ? 'has' : ''}`}>
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <span className="slot-placeholder">{dropLabel}</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <button
          type="button"
          className="linkish"
          onClick={(e) => {
            e.preventDefault()
            onFile(null)
          }}
        >
          {clearLabel}
        </button>
      )}
    </label>
  )
}

async function urlToFile(url: string, name: string): Promise<File> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new File([blob], name, { type: blob.type || 'image/png' })
}

function HomeCaseCard({
  title,
  desc,
  white,
  black,
  sourceUrl,
  sourceLabel,
  onTry,
  tryLabel,
  tryDisabled,
  sideWhite,
  sideBlack,
  tabWhite,
  tabBlack,
}: {
  title: string
  desc?: string
  white: string
  black: string
  sourceUrl?: string
  sourceLabel?: string
  onTry?: () => void
  tryLabel?: string
  tryDisabled?: boolean
  sideWhite: string
  sideBlack: string
  tabWhite: string
  tabBlack: string
}) {
  const [side, setSide] = useState<'white' | 'black'>('white')
  const src = side === 'white' ? white : black

  return (
    <article className="example-card showcase-card">
      <div
        className="pair single"
        style={{ background: side === 'white' ? '#fff' : '#111' }}
      >
        <figure>
          <img
            src={src}
            alt={`${title} · ${side === 'white' ? sideWhite : sideBlack}`}
          />
        </figure>
      </div>
      <div className="body">
        <div className="tabs" style={{ marginBottom: '0.45rem' }}>
          <button
            type="button"
            className={side === 'white' ? 'on' : ''}
            onClick={() => setSide('white')}
          >
            {tabWhite}
          </button>
          <button
            type="button"
            className={side === 'black' ? 'on' : ''}
            onClick={() => setSide('black')}
          >
            {tabBlack}
          </button>
        </div>
        <h3>{title}</h3>
        {desc && <p>{desc}</p>}
        <div className="card-actions">
          {sourceUrl?.startsWith('http') && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceLabel}
            </a>
          )}
          {onTry && (
            <button
              type="button"
              className="btn sm"
              disabled={tryDisabled}
              onClick={onTry}
            >
              {tryLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Home() {
  const { t, lp } = useI18n()
  usePageSeo(t.seo.homeTitle, t.seo.homeDescription, '/')

  const [fileA, setFileA] = useState<File | null>(null)
  const [fileB, setFileB] = useState<File | null>(null)
  const [mode, setMode] = useState<ComposeMode>('luma')
  const [strength, setStrength] = useState(1)
  const [format, setFormat] = useState<ExportFormat>('png8')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ComposeResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [bg, setBg] = useState<PreviewBg>('white')
  const [copied, setCopied] = useState<string | null>(null)

  const runCompose = useCallback(async () => {
    if (!fileA || !fileB) {
      setError(t.home.needTwo)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const [imgA, imgB] = await Promise.all([loadImage(fileA), loadImage(fileB)])
      const res = await composeReveal(imgA, imgB, {
        mode,
        strength,
        maxSide: 1600,
      })
      setResult(res)
      res.canvas.toBlob((blob) => {
        if (!blob) return
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return URL.createObjectURL(blob)
        })
      }, 'image/png')
    } catch (e) {
      setError(e instanceof Error ? e.message : t.home.composeFail)
    } finally {
      setBusy(false)
    }
  }, [fileA, fileB, mode, strength, t.home.needTwo, t.home.composeFail])

  useEffect(() => {
    if (fileA && fileB) {
      void runCompose()
    }
  }, [fileA, fileB, mode, strength, runCompose])

  const onDownload = () => {
    if (!result) return
    const blob = exportPngBlob(result.canvas, format)
    const name = `holdreveal-${result.width}x${result.height}-${format}.png`
    downloadBlob(blob, name)
  }

  const loadDemo = async () => {
    setBusy(true)
    setError(null)
    try {
      const [a, b] = await Promise.all([
        urlToFile('/examples/demo-a.png', 'demo-a.png'),
        urlToFile('/examples/demo-b.png', 'demo-b.png'),
      ])
      setFileA(a)
      setFileB(b)
    } catch {
      setError(t.home.demoFail)
      setBusy(false)
    }
  }

  const copyCaption = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setError(t.home.copyFail)
    }
  }

  const bgStyle = useMemo(() => {
    if (bg === 'white') return { background: '#fff' }
    if (bg === 'black') return { background: '#000' }
    return { background: '#e7e9ea' }
  }, [bg])

  const h = t.home

  return (
    <>
      <header className="top">
        <h1 className="sr-only">{h.h1}</h1>
        <p className="lead">{h.lead}</p>
      </header>

      <section className="warn">
        <strong>{h.warn}</strong>{' '}
        <Link to={lp('/how-it-works/')}>{h.warnLink}</Link>
      </section>

      <section className="tool-block" aria-label="maker">
        <div className="tool-head">
          <h2 className="tool-title">{h.toolTitle}</h2>
          <button
            type="button"
            className="btn sm"
            onClick={() => void loadDemo()}
            disabled={busy}
          >
            {h.loadDemo}
          </button>
        </div>
        <main className="grid">
          <div className="col">
            <UploadSlot
              label={h.slotA}
              hint={h.slotAHint}
              file={fileA}
              onFile={setFileA}
              dropLabel={h.drop}
              clearLabel={h.clear}
            />
            <UploadSlot
              label={h.slotB}
              hint={h.slotBHint}
              file={fileB}
              onFile={setFileB}
              dropLabel={h.drop}
              clearLabel={h.clear}
            />

            <div className="controls">
              <label className="ctrl">
                <span>{h.mode}</span>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as ComposeMode)}
                >
                  <option value="luma">{h.modeLuma}</option>
                  <option value="rgb">{h.modeRgb}</option>
                </select>
              </label>
              <label className="ctrl">
                <span>
                  {h.strength} {strength.toFixed(2)}
                </span>
                <input
                  type="range"
                  min={0.6}
                  max={1.4}
                  step={0.02}
                  value={strength}
                  onChange={(e) => setStrength(Number(e.target.value))}
                />
              </label>
              <label className="ctrl">
                <span>{h.export}</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                >
                  <option value="png8">{h.exportPng8}</option>
                  <option value="rgba">{h.exportRgba}</option>
                </select>
              </label>
              <button
                type="button"
                className="btn primary"
                disabled={!fileA || !fileB || busy}
                onClick={() => void runCompose()}
              >
                {busy ? h.composing : h.recompose}
              </button>
              <button
                type="button"
                className="btn"
                disabled={!result}
                onClick={onDownload}
              >
                {h.download}
              </button>
            </div>

            {error && <p className="err">{error}</p>}
          </div>

          <div className="col">
            <div className="preview-bar">
              <span>{h.previewBar}</span>
              <div className="tabs">
                {(
                  [
                    ['white', h.tabWhite],
                    ['black', h.tabBlack],
                    ['card', h.tabCard],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    className={bg === k ? 'on' : ''}
                    onClick={() => setBg(k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="preview" style={bgStyle}>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" />
              ) : (
                <p className="muted">{h.previewEmpty}</p>
              )}
            </div>
            {result && (
              <p className="meta">
                {result.width} × {result.height} px
              </p>
            )}

            <div className="captions">
              <h2>{h.captionsTitle}</h2>
              <ul>
                {h.captions.map((c) => (
                  <li key={c}>
                    <code>{c}</code>
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => void copyCaption(c)}
                    >
                      {copied === c ? h.copied : h.copy}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </section>

      <section className="results-block" id="examples" aria-label="examples">
        <div className="results-head">
          <div>
            <h2>{h.resultsTitle}</h2>
            <p className="results-lead">{h.resultsLead}</p>
          </div>
          <Link to={lp('/examples/')} className="results-more">
            {h.resultsMore}
          </Link>
        </div>
        <div className="examples-grid showcase-grid">
          {SHOWCASE_CASES.map((c, i) => {
            const copy = h.showcase[i] ?? { title: c.id }
            return (
              <HomeCaseCard
                key={c.id}
                title={copy.title}
                desc={copy.desc}
                white={c.before}
                black={c.after}
                sourceUrl={c.sourceUrl}
                sourceLabel={h.caseViralLink}
                onTry={c.demo ? () => void loadDemo() : undefined}
                tryLabel={h.caseDemoTry}
                tryDisabled={busy}
                sideWhite={h.sideWhite}
                sideBlack={h.sideBlack}
                tabWhite={h.tabWhite}
                tabBlack={h.tabBlack}
              />
            )
          })}
        </div>
      </section>

      <section className="content-block" id="guide">
        <h2>{h.guideTitle}</h2>
        <p>{h.guideP1}</p>
        <ol>
          {h.guideSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p>
          {h.guideP2} <Link to={lp('/how-it-works/')}>{h.guideHowLink}</Link>
        </p>

        <h3>{h.tipsTitle}</h3>
        <ul>
          {h.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>

        <h3>{h.relatedTitle}</h3>
        <ul>
          <li>
            <Link to={lp('/how-it-works/')}>{t.nav.how}</Link>
          </li>
          <li>
            <Link to={lp('/examples/')}>{t.nav.examples}</Link>
          </li>
          <li>
            <Link to={lp('/faq/')}>{t.nav.faq}</Link>
          </li>
          <li>
            <Link to={lp('/privacy/')}>{t.nav.privacy}</Link>
          </li>
        </ul>
      </section>

      <section className="faq" id="faq">
        <h2>{h.faqTitle}</h2>
        {h.faqItems.map((item, i) => (
          <details key={item.q} open={i === 0}>
            <summary>{item.q}</summary>
            <p>
              {item.a}{' '}
              {i === 0 && (
                <Link to={lp('/how-it-works/')}>{t.nav.how}</Link>
              )}
            </p>
          </details>
        ))}
        <p style={{ marginTop: '0.75rem' }}>
          <Link to={lp('/faq/')}>{h.faqMore}</Link>
        </p>
      </section>
    </>
  )
}
