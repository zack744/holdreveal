import { Link } from 'react-router-dom'
import { useI18n, usePageSeo } from '../i18n/context'

export default function Faq() {
  const { t, lp } = useI18n()
  const m = t.faq
  usePageSeo(m.title, m.description, '/faq/')

  return (
    <article className="prose">
      <h1>{m.h1}</h1>
      <p>
        {m.lead}{' '}
        <Link to={lp('/')}>{m.homeLink}</Link>
      </p>
      <div
        className="faq"
        style={{ marginTop: '1rem', borderTop: 'none', paddingTop: 0 }}
      >
        {m.items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <div className="cta-row">
        <Link className="btn-link primary" to={lp('/')}>
          {m.ctaMake}
        </Link>
        <Link className="btn-link" to={lp('/how-it-works/')}>
          {m.ctaHow}
        </Link>
      </div>
    </article>
  )
}
