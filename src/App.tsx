import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  composeReveal,
  loadImage,
  type ComposeMode,
  type ComposeResult,
} from './lib/compose'
import { downloadBlob, exportPngBlob, type ExportFormat } from './lib/exportPng'
import './App.css'

type PreviewBg = 'white' | 'black' | 'card'

const CAPTIONS = [
  '長押しで変化？',
  'タップで変化イラスト',
  'Hold to reveal 👀',
  '長押しして見てみて…',
]

function UploadSlot({
  label,
  hint,
  file,
  onFile,
}: {
  label: string
  hint: string
  file: File | null
  onFile: (f: File | null) => void
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
          <span className="slot-placeholder">クリック / ドロップ</span>
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
          クリア
        </button>
      )}
    </label>
  )
}

export default function App() {
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
      setError('タイムライン用（A）と開いた後（B）の2枚を選んでください')
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
      setError(e instanceof Error ? e.message : '合成に失敗しました')
    } finally {
      setBusy(false)
    }
  }, [fileA, fileB, mode, strength])

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

  const copyCaption = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setError('コピーに失敗しました')
    }
  }

  const bgStyle = useMemo(() => {
    if (bg === 'white') return { background: '#fff' }
    if (bg === 'black') return { background: '#000' }
    return { background: '#e7e9ea' }
  }, [bg])

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <span className="logo">HoldReveal</span>
          <span className="tag">長押しで変化メーカー</span>
        </div>
        <p className="lead">
          2枚の画像から、タイムライン（白）と拡大表示（黒）で見え方が変わる PNG
          を作ります。画像はブラウザ内だけで処理され、サーバーに送信されません。
        </p>
      </header>

      <section className="warn">
        <strong>投稿のコツ：</strong>
        X の<strong>スマホアプリ</strong>だと PNG が JPG に変わり透明が消えることがあります。
        <strong> PC の Web（x.com）から PNG のまま投稿</strong>してください。
        ダークテーマのタイムラインでは最初から透けて見える場合があります。
      </section>

      <main className="grid">
        <div className="col">
          <UploadSlot
            label="A · タイムライン用"
            hint="白背景で見せたい絵"
            file={fileA}
            onFile={setFileA}
          />
          <UploadSlot
            label="B · 開いた後"
            hint="黒背景で見せたい絵"
            file={fileB}
            onFile={setFileB}
          />

          <div className="controls">
            <label className="ctrl">
              <span>モード</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as ComposeMode)}
              >
                <option value="luma">Luma（おすすめ・イラスト向け）</option>
                <option value="rgb">RGB（色差が大きいとき）</option>
              </select>
            </label>
            <label className="ctrl">
              <span>強度 {strength.toFixed(2)}</span>
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
              <span>書き出し</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
              >
                <option value="png8">PNG-8（軽量・推奨）</option>
                <option value="rgba">PNG-32 RGBA</option>
              </select>
            </label>
            <button
              type="button"
              className="btn primary"
              disabled={!fileA || !fileB || busy}
              onClick={() => void runCompose()}
            >
              {busy ? '合成中…' : '再合成'}
            </button>
            <button
              type="button"
              className="btn"
              disabled={!result}
              onClick={onDownload}
            >
              PNG をダウンロード
            </button>
          </div>

          {error && <p className="err">{error}</p>}
        </div>

        <div className="col">
          <div className="preview-bar">
            <span>プレビュー（X の背景を模擬）</span>
            <div className="tabs">
              {(
                [
                  ['white', '白 · TL'],
                  ['black', '黒 · 拡大'],
                  ['card', 'カード灰'],
                ] as const
              ).map(([k, t]) => (
                <button
                  key={k}
                  type="button"
                  className={bg === k ? 'on' : ''}
                  onClick={() => setBg(k)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="preview" style={bgStyle}>
            {previewUrl ? (
              <img src={previewUrl} alt="合成結果" />
            ) : (
              <p className="muted">A と B を選ぶとここに表示されます</p>
            )}
          </div>
          {result && (
            <p className="meta">
              {result.width} × {result.height} px
            </p>
          )}

          <div className="captions">
            <h2>投稿文テンプレ</h2>
            <ul>
              {CAPTIONS.map((c) => (
                <li key={c}>
                  <code>{c}</code>
                  <button type="button" className="btn sm" onClick={() => void copyCaption(c)}>
                    {copied === c ? 'コピー済' : 'コピー'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <section className="faq" id="faq">
        <h2>よくある質問</h2>
        <details open>
          <summary>どうして絵が変わるの？</summary>
          <p>
            透明付き PNG と、X のタイムライン（明るい背景）／画像拡大（暗い背景）の差を使います。
            画像そのものがアニメになるわけではありません。
          </p>
        </details>
        <details>
          <summary>長押し 4K 読み込みとは違う？</summary>
          <p>
            別物です。こちらは解像度ではなく、白／黒背景で見え方が変わる「変化イラスト」用です。
          </p>
        </details>
        <details>
          <summary>うまく変わらないとき</summary>
          <p>
            A と B の構図を揃え、コントラストをはっきりさせてください。強度スライダーや RGB
            モードを試すか、Web から再投稿してください。
          </p>
        </details>
      </section>

      <footer className="foot">
        <p>
          HoldReveal · holdreveal.com · 画像は端末内処理のみ ·{' '}
          <a href="#faq">FAQ</a>
        </p>
      </footer>
    </div>
  )
}
