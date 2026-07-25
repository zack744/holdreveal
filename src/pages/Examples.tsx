import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

type CaseItem = {
  id: string
  title: string
  desc: string
  white: string
  black: string
  sourceLabel?: string
  sourceUrl?: string
  credit?: string
}

const CASES: CaseItem[] = [
  {
    id: 'viral',
    title: '話題の「長押しで変化？」',
    desc: '2026年7月に大きな反響を呼んだ変化イラストの一例。白背景と黒背景で見え方が変わります（プレビューは当サイトで合成表示）。',
    white: '/examples/case-viral-preview-white.jpg',
    black: '/examples/case-viral-preview-black.jpg',
    sourceLabel: '元ポストを見る',
    sourceUrl: 'https://x.com/sarasara_aiart/status/2080126609290674237',
    credit: '作品権利は原作者に帰属。事例紹介・原理説明目的の表示です。',
  },
  {
    id: 'dual',
    title: '白／黒で別絵になる PNG サンプル',
    desc: 'DualImagePNG 系の公開サンプルに近い「背景差トリック」の見え方。メーカーで同系統の PNG を自作できます。',
    white: '/examples/dual-preview-white.jpg',
    black: '/examples/dual-preview-black.jpg',
    sourceLabel: '仕組みを読む',
    sourceUrl: '/how-it-works/',
    credit: '参考：背景差トリックの公開実装・解説系リポジトリ／記事。',
  },
  {
    id: 'demo',
    title: 'HoldReveal デモ合成',
    desc: '当サイトのアルゴリズムで生成したデモ。A（TL）と B（開いた後）から1枚の透過 PNG を作り、白／黒で切り替わります。',
    white: '/examples/demo-preview-white.png',
    black: '/examples/demo-preview-black.png',
    sourceLabel: '同じ仕組みで作る',
    sourceUrl: '/',
    credit: 'サイト内生成のデモ素材。',
  },
]

function CaseCard({ item }: { item: CaseItem }) {
  const [bg, setBg] = useState<'white' | 'black'>('white')
  const src = bg === 'white' ? item.white : item.black

  return (
    <article className="example-card">
      <div
        className="pair"
        style={{ gridTemplateColumns: '1fr', background: bg === 'white' ? '#fff' : '#000' }}
      >
        <figure>
          <img src={src} alt={`${item.title}（${bg === 'white' ? '白背景' : '黒背景'}）`} />
          <figcaption style={{ color: bg === 'black' ? '#ccc' : undefined }}>
            {bg === 'white' ? '白 · タイムライン風' : '黒 · 拡大表示風'}
          </figcaption>
        </figure>
      </div>
      <div className="body">
        <div className="tabs" style={{ marginBottom: '0.55rem' }}>
          <button type="button" className={bg === 'white' ? 'on' : ''} onClick={() => setBg('white')}>
            白
          </button>
          <button type="button" className={bg === 'black' ? 'on' : ''} onClick={() => setBg('black')}>
            黒
          </button>
        </div>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        {item.sourceUrl && (
          <p style={{ marginTop: '0.45rem' }}>
            {item.sourceUrl.startsWith('http') ? (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                {item.sourceLabel}
              </a>
            ) : (
              <Link to={item.sourceUrl}>{item.sourceLabel}</Link>
            )}
          </p>
        )}
        {item.credit && <p className="credit">{item.credit}</p>}
      </div>
    </article>
  )
}

export default function Examples() {
  useEffect(() => {
    document.title = '事例ギャラリー | 長押しで変化イラスト | HoldReveal'
    const d = document.querySelector('meta[name="description"]')
    if (d) {
      d.setAttribute(
        'content',
        '長押しで変化・タップで変化イラストの事例。白背景／黒背景プレビュー付き。話題の変化PNGを参考にHoldRevealで自作。',
      )
    }
  }, [])

  return (
    <article className="prose" style={{ maxWidth: '56rem' }}>
      <h1>事例ギャラリー</h1>
      <p>
        長押しで変化／タップで変化イラストは、1枚の透過 PNG
        が背景色によって別の絵に見える遊びです。下のカードで
        <strong>白 ⇄ 黒</strong>
        を切り替えて、見え方の差を確認してください。
      </p>
      <div className="examples-grid">
        {CASES.map((c) => (
          <CaseCard key={c.id} item={c} />
        ))}
      </div>
      <div className="cta-row">
        <Link className="btn-link primary" to="/">
          自分の絵で作る
        </Link>
        <Link className="btn-link" to="/how-it-works/">
          原理を読む
        </Link>
      </div>
      <p className="credit" style={{ marginTop: '1.5rem' }}>
        第三者の作品は権利者に帰属します。無断転載・商用再配布は行わず、学習・説明目的のプレビューとして掲載しています。削除依頼があれば対応します。
      </p>
    </article>
  )
}
