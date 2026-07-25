import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function HowItWorks() {
  useEffect(() => {
    document.title =
      '長押しで変化の仕組み | 透過PNGと白黒背景 | HoldReveal'
    const d = document.querySelector('meta[name="description"]')
    if (d) {
      d.setAttribute(
        'content',
        '長押しで変化・タップで変化イラストの原理を解説。Xのタイムライン（白）と拡大表示（黒）の背景差と透過PNGのα合成で絵が変わる仕組み。4K長押しとは別物。',
      )
    }
  }, [])

  return (
    <article className="prose">
      <h1>長押しで変化の仕組み</h1>
      <p>
        「長押しで変化？」「タップで変化イラスト」は、
        <strong>動画やAPNGではありません</strong>
        。1枚の<strong>透過付きPNG</strong>が、X（旧Twitter）の
        <strong>タイムラインの明るい背景</strong>と
        <strong>画像を開いたあとの暗い背景</strong>
        で別の絵に見えるトリックです。
      </p>

      <div className="cta-row">
        <Link className="btn-link primary" to="/">
          メーカーで作る
        </Link>
        <Link className="btn-link" to="/examples/">
          事例を見る
        </Link>
      </div>

      <h2>1. 何が起きているか（UI背景差）</h2>
      <p>多くのライトテーマでは、だいたい次のように見えます。</p>
      <ul>
        <li>
          <strong>タイムライン（TL）</strong>：カード／背景が明るい（近い白）
        </li>
        <li>
          <strong>画像拡大・lightbox</strong>：背景が暗い（近い黒）
        </li>
      </ul>
      <p>
        同じ透過PNGを載せると、透明に近い画素は背景色が透けます。白の上では「隠したい線」が溶け、黒の上では「見せたい線」が浮く——これが「長押し／タップで変わった」ように感じる正体です。
      </p>
      <p>
        投稿文の「長押し」は、スマホで画像を拡大・メニューを開く動作への
        <strong>誘導コピー</strong>
        であることが多く、必須のジェスチャー仕様ではありません。
      </p>

      <h2>2. 数式（α合成の逆算）</h2>
      <p>
        画面上の色は、次の標準的な合成で決まります（0〜1、背景は不透明と仮定）。
      </p>
      <pre className="formula">{`表示色 = ピクセル色 × α + 背景色 × (1 − α)`}</pre>
      <p>
        白背景で見せたい色を <code>W</code>、黒背景で見せたい色を{' '}
        <code>B</code> とすると：
      </p>
      <pre className="formula">{`白背景: W = C × α + 1 × (1 − α)
黒背景: B = C × α + 0 × (1 − α) = C × α

→ α = clamp(1 − W + B)
→ C = B / α  （α が十分大きいとき）`}</pre>
      <p>
        HoldReveal は、タイムライン用画像 A（=W）と開いた後用画像
        B（=B）を入力し、各画素で上式から <code>α</code> と前景色{' '}
        <code>C</code> を求めて1枚の透過PNGに書き出します。輝度ベース（Luma）とチャンネル別（RGB）の2モードがあります。
      </p>
      <p>
        同系統の解説・実装は、Qiita の「背景色で見え方が変わる透過PNG」や
        GitHub の DualImagePNG-for-X などでも公開されています。HoldReveal
        はその考え方をブラウザだけで完結させたメーカーです。
      </p>

      <h2>3. なぜ PNG-8 をすすめるか</h2>
      <p>
        X に大きな RGBA PNG
        を上げると、再圧縮で透過が弱まったり見え方が崩れることがあります。コミュニティでは
        <strong>PNG-8（256色パレット + 透過）</strong>
        のほうが透過が残りやすい、という報告があります。HoldReveal
        は既定で PNG-8 出力を選べます。
      </p>

      <h2>4. 長押し 4K 読み込みとは別物</h2>
      <ul>
        <li>
          <strong>長押しで変化（本サイト）</strong>：透過と背景色で絵が変わる
        </li>
        <li>
          <strong>長押し 4K</strong>
          ：別の流行。高解像度／読み込み演出系の話で、仕組みが違います
        </li>
      </ul>

      <h2>5. うまく見せるコツ</h2>
      <ul>
        <li>A と B は同じ構図・同じサイズ感で揃える</li>
        <li>変化させたい部分のコントラストをはっきりさせる</li>
        <li>
          <strong>PC の x.com（Web）から PNG のまま投稿</strong>
          （アプリだと JPG 化で透過が消えることがある）
        </li>
        <li>
          ダークテーマのタイムラインでは、最初から透けて見える場合がある
        </li>
      </ul>

      <h2>6. 作り方（HoldReveal）</h2>
      <ol>
        <li>A：白背景で見せたい絵をアップロード</li>
        <li>B：黒背景で見せたい絵をアップロード</li>
        <li>白／黒プレビューで確認し、強度やモードを調整</li>
        <li>PNG をダウンロード → X Web から投稿</li>
      </ol>

      <div className="cta-row">
        <Link className="btn-link primary" to="/">
          今すぐ作る
        </Link>
        <Link className="btn-link" to="/faq/">
          FAQ を読む
        </Link>
      </div>
    </article>
  )
}
