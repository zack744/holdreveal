import { Link } from 'react-router-dom'
import { useEffect, type ReactNode } from 'react'

const items: { q: string; a: ReactNode }[] = [
  {
    q: 'どうして絵が変わるの？',
    a: (
      <>
        透明付き PNG と、X のタイムライン（明るい背景）／画像拡大（暗い背景）の差を使います。画像そのものがアニメになるわけではありません。詳しくは
        <Link to="/how-it-works/">仕組み</Link>
        をどうぞ。
      </>
    ),
  },
  {
    q: '長押し 4K 読み込みとは違う？',
    a: '別物です。HoldReveal は解像度ではなく、白／黒背景で見え方が変わる「変化イラスト」用です。',
  },
  {
    q: 'スマホアプリから投稿してもいい？',
    a: 'アプリだと PNG が JPG に変わり透明が消えることがあります。PC の Web（x.com）から PNG のまま投稿するのがおすすめです。',
  },
  {
    q: 'ダークテーマだと最初から透ける？',
    a: 'あります。タイムライン背景が暗いと「開いた後」の絵が早めに見えることがあります。ライトテーマ向けの遊びだと理解しておくと安心です。',
  },
  {
    q: '画像はサーバーに送られる？',
    a: '送られません。合成はすべてブラウザ内で行われます。詳細はプライバシーページを参照してください。',
  },
  {
    q: 'うまく変わらないときは？',
    a: 'A と B の構図を揃え、コントラストをはっきりさせてください。強度スライダーや RGB モードを試すか、Web から再投稿してください。',
  },
  {
    q: 'PNG-8 と PNG-32 の違いは？',
    a: 'PNG-8 は色数を抑えた軽量形式で、X 上で透過が残りやすい報告があります。色数が足りないときは PNG-32 RGBA を試してください。',
  },
  {
    q: '商用利用はできる？',
    a: 'ツール自体は無料で使えます。出力した画像の権利は、元にした素材の権利に従います。他人の作品を無断で再配布しないでください。',
  },
]

export default function Faq() {
  useEffect(() => {
    document.title = 'FAQ | 長押しで変化メーカー HoldReveal'
    const d = document.querySelector('meta[name="description"]')
    if (d) {
      d.setAttribute(
        'content',
        '長押しで変化・タップで変化イラストのよくある質問。投稿のコツ、ダークテーマ、PNG形式、プライバシーなど。',
      )
    }
  }, [])

  return (
    <article className="prose">
      <h1>よくある質問（FAQ）</h1>
      <p>
        長押しで変化 PNG メーカー「HoldReveal」についての質問です。まだ作っていない方は
        <Link to="/">ホーム</Link>
        からどうぞ。
      </p>
      <div className="faq" style={{ marginTop: '1rem', borderTop: 'none', paddingTop: 0 }}>
        {items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <div className="cta-row">
        <Link className="btn-link primary" to="/">
          メーカーへ
        </Link>
        <Link className="btn-link" to="/how-it-works/">
          仕組みを読む
        </Link>
      </div>
    </article>
  )
}
