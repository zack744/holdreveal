import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    document.title = 'プライバシーポリシー | HoldReveal'
    const d = document.querySelector('meta[name="description"]')
    if (d) {
      d.setAttribute(
        'content',
        'HoldReveal のプライバシー方針。アップロード画像はブラウザ内処理のみでサーバーに送信しません。Google Analytics について。',
      )
    }
  }, [])

  return (
    <article className="prose">
      <h1>プライバシーポリシー</h1>
      <p>最終更新：2026-07-25</p>

      <h2>画像データの扱い</h2>
      <p>
        HoldReveal（https://holdreveal.com）は、長押しで変化／タップで変化イラスト用の
        PNG をブラウザ上で合成するツールです。
        <strong>
          アップロードした画像ファイルは、ご利用の端末のブラウザ内でのみ処理されます。当サイトのサーバーへ画像を送信・保存しません。
        </strong>
      </p>
      <p>
        合成結果のダウンロードも端末内で完結します。ブラウザを閉じたりキャッシュを消したりすると、メモリ上のデータは破棄されます。
      </p>

      <h2>アクセス解析</h2>
      <p>
        サイトの利用状況を把握するため、Google Analytics 4（測定 ID：
        <code>G-SPFR4DJ4L4</code>
        ）を使用しています。ページビューなどの一般的な利用データが Google
        に送信される場合があります。画像の中身は送信対象ではありません。
      </p>
      <p>
        Google のデータの扱いについては、Google のポリシーをご確認ください。ブラウザのオプトアウトやトラッキング防止機能もご利用いただけます。
      </p>

      <h2>Cookie 等</h2>
      <p>
        解析のために Cookie または類似技術が使用される場合があります。必須のログイン機能や広告ネットワークは現時点で導入していません。
      </p>

      <h2>外部リンク</h2>
      <p>
        当サイトから X（Twitter）等の外部サイトへリンクする場合があります。リンク先のプライバシー方針は各サービスに従います。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは、サイト運営者が公開する連絡手段（今後追記）までご連絡ください。
      </p>

      <div className="cta-row">
        <Link className="btn-link primary" to="/">
          ホームへ戻る
        </Link>
      </div>
    </article>
  )
}
