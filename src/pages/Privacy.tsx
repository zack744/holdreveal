import { Link } from 'react-router-dom'
import { useI18n, usePageSeo } from '../i18n/context'

export default function Privacy() {
  const { t, lp } = useI18n()
  const m = t.privacy
  usePageSeo(m.title, m.description, '/privacy/')

  return (
    <article className="prose">
      <h1>{m.h1}</h1>
      <p>{m.updated}</p>
      <h2>{m.s1}</h2>
      <p>{m.s1p1}</p>
      <p>{m.s1p2}</p>
      <h2>{m.s2}</h2>
      <p>{m.s2p1}</p>
      <p>{m.s2p2}</p>
      <h2>{m.s3}</h2>
      <p>{m.s3p}</p>
      <h2>{m.s4}</h2>
      <p>{m.s4p}</p>
      <h2>{m.s5}</h2>
      <p>{m.s5p}</p>
      <div className="cta-row">
        <Link className="btn-link primary" to={lp('/')}>
          {m.ctaHome}
        </Link>
      </div>
    </article>
  )
}
