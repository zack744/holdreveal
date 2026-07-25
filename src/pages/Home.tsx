import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  composeReveal,
  loadImage,
  type ComposeMode,
  type ComposeResult,
} from '../lib/compose'
import { downloadBlob, exportPngBlob, type ExportFormat } from '../lib/exportPng'

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
  credit,
  sourceUrl,
  sourceLabel,
  onTry,
  tryLabel,
  tryDisabled,
}: {
  title: string
  desc: string
  white: string
  black: string
  credit?: string
  sourceUrl?: string
  sourceLabel?: string
  onTry?: () => void
  tryLabel?: string
  tryDisabled?: boolean
}) {
  const [side, setSide] = useState<'white' | 'black'>('white')
  const src = side === 'white' ? white : black

  return (
    <article className="example-card">
      <div
        className="pair single"
        style={{ background: side === 'white' ? '#fff' : '#111' }}
      >
        <figure>
          <img src={src} alt={`${title}（${side === 'white' ? '白背景' : '黒背景'}）`} />
          <figcaption style={{ color: side === 'black' ? '#ccc' : undefined }}>
            {side === 'white' ? '白 · タイムライン風' : '黒 · 拡大表示風'}
          </figcaption>
        </figure>
      </div>
      <div className="body">
        <div className="tabs" style={{ marginBottom: '0.5rem' }}>
          <button
            type="button"
            className={side === 'white' ? 'on' : ''}
            onClick={() => setSide('white')}
          >
            白
          </button>
          <button
            type="button"
            className={side === 'black' ? 'on' : ''}
            onClick={() => setSide('black')}
          >
            黒
          </button>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="card-actions">
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceLabel ?? 'リンク'}
            </a>
          )}
          {onTry && (
            <button
              type="button"
              className="btn sm"
              disabled={tryDisabled}
              onClick={onTry}
            >
              {tryLabel ?? '試す'}
            </button>
          )}
        </div>
        {credit && <p className="credit">{credit}</p>}
      </div>
    </article>
  )
}

export default function Home() {
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

  useEffect(() => {
    document.title =
      'HoldReveal | 長押しで変化メーカー — タップで変化イラスト PNG 作成'
    const d = document.querySelector('meta[name="description"]')
    if (d) {
      d.setAttribute(
        'content',
        '長押しで変化・タップで変化イラストをブラウザで作成。2枚の画像から白背景／黒背景で見え方が変わる透明 PNG を書き出します。画像は端末内処理、サーバー非送信。',
      )
    }
  }, [])

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
      setError('デモ画像の読み込みに失敗しました')
      setBusy(false)
    }
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
    <>
      <header className="top">
        <h1 className="sr-only">
          HoldReveal — 長押しで変化・タップで変化イラスト PNG メーカー
        </h1>
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
        原理は <Link to="/how-it-works/">仕組み</Link> へ。
      </section>

      {/* V2.0 精品工具页：① 工具功能 */}
      <section className="tool-block" aria-label="メーカー">
        <div className="tool-head">
          <h2 className="tool-title">メーカー</h2>
          <button
            type="button"
            className="btn sm"
            onClick={() => void loadDemo()}
            disabled={busy}
          >
            デモ画像で試す
          </button>
        </div>
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
      </section>

      {/* V2.0：② 结果/样例展示（紧贴工具下方） */}
      <section className="results-block" id="examples" aria-label="事例ギャラリー">
        <div className="results-head">
          <div>
            <h2>変化の事例（結果イメージ）</h2>
            <p className="results-lead">
              白背景（タイムライン）と黒背景（拡大表示）で見え方がどう変わるか。カードの「白／黒」で切り替えて確認できます。
            </p>
          </div>
          <Link to="/examples/" className="results-more">
            すべて見る →
          </Link>
        </div>
        <div className="examples-grid">
          <HomeCaseCard
            title="話題の「長押しで変化？」"
            desc="大きな反響を呼んだ変化イラスト。白 ⇄ 黒で別の見え方になります。"
            white="/examples/case-viral-preview-white.jpg"
            black="/examples/case-viral-preview-black.jpg"
            credit="原作は権利者に帰属 · 説明用表示"
            sourceUrl="https://x.com/sarasara_aiart/status/2080126609290674237"
            sourceLabel="元ポスト"
          />
          <HomeCaseCard
            title="背景差トリックのサンプル"
            desc="透過PNGが背景色に反応する見え方の一例。同系統の合成がメーカーで作れます。"
            white="/examples/dual-preview-white.jpg"
            black="/examples/dual-preview-black.jpg"
            credit="参考サンプル · 説明用"
          />
          <HomeCaseCard
            title="HoldReveal デモ合成"
            desc="当サイトのアルゴリズムで生成したデモ。上の「デモ画像で試す」で同じA/Bを読み込めます。"
            white="/examples/demo-preview-white.png"
            black="/examples/demo-preview-black.png"
            credit="サイト内生成"
            onTry={() => void loadDemo()}
            tryLabel="このデモで試す"
            tryDisabled={busy}
          />
        </div>
      </section>

      {/* V2.0：③ 落地页图文 */}
      <section className="content-block" id="guide">
        <h2>長押しで変化の作り方</h2>
        <p>
          「長押しで変化」「タップで変化イラスト」は、1枚の透過 PNG が X
          の明るいタイムラインと暗い拡大表示で別の絵に見える遊びです。HoldReveal
          では次の手順だけで作成できます。
        </p>
        <ol>
          <li>
            <strong>A</strong>：タイムライン（白っぽい背景）で見せたい絵を用意
          </li>
          <li>
            <strong>B</strong>：画像を開いたあと（黒い背景）で見せたい絵を用意
          </li>
          <li>上のメーカーで合成し、白／黒プレビューで確認</li>
          <li>
            PNG をダウンロードし、<strong>x.com の Web</strong> から投稿
          </li>
        </ol>
        <p>
          詳しい原理（α 合成の逆算・PNG-8・4K 長押しとの違い）は
          <Link to="/how-it-works/">仕組みページ</Link>
          にまとめています。
        </p>

        <h3>投稿時の注意</h3>
        <ul>
          <li>スマホアプリ経由だと透過が消えることがある → Web 投稿を推奨</li>
          <li>ダークテーマの TL では最初から透ける場合がある</li>
          <li>A/B は構図を揃え、変化させたい部分のコントラストをはっきり</li>
        </ul>

        <h3>関連ページ</h3>
        <ul>
          <li>
            <Link to="/how-it-works/">長押しで変化の仕組み</Link>
          </li>
          <li>
            <Link to="/examples/">事例ギャラリー</Link>
          </li>
          <li>
            <Link to="/faq/">よくある質問</Link>
          </li>
          <li>
            <Link to="/privacy/">プライバシー</Link>
          </li>
        </ul>
      </section>

      <section className="faq" id="faq">
        <h2>よくある質問（抜粋）</h2>
        <details open>
          <summary>どうして絵が変わるの？</summary>
          <p>
            透明付き PNG と、X のタイムライン（明るい背景）／画像拡大（暗い背景）の差を使います。
            <Link to="/how-it-works/">仕組みを読む</Link>
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
        <p style={{ marginTop: '0.75rem' }}>
          <Link to="/faq/">FAQ をもっと見る →</Link>
        </p>
      </section>
    </>
  )
}
