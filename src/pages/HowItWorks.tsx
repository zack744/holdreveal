import { Link } from 'react-router-dom'
import { useI18n, usePageSeo } from '../i18n/context'

export default function HowItWorks() {
  const { t, lp } = useI18n()
  const m = t.how
  usePageSeo(m.title, m.description, '/how-it-works/')

  return (
    <article className="prose">
      <h1>{m.h1}</h1>
      <p>{m.intro}</p>

      <div className="cta-row">
        <Link className="btn-link primary" to={lp('/')}>
          {m.ctaMake}
        </Link>
        <Link className="btn-link" to={lp('/examples/')}>
          {m.ctaExamples}
        </Link>
      </div>

      <h2>{m.s1}</h2>
      <p>{m.s1p}</p>
      <ul>
        <li>
          <strong>{m.s1li1}</strong>
        </li>
        <li>
          <strong>{m.s1li2}</strong>
        </li>
      </ul>
      <p>{m.s1p2}</p>
      <p>{m.s1p3}</p>

      <h2>{m.s2}</h2>
      <p>{m.s2p}</p>
      <pre className="formula">{`display = pixel × α + background × (1 − α)`}</pre>
      <p>{m.s2p2}</p>
      <pre className="formula">{`α = clamp(1 − W + B)
C = B / α`}</pre>
      <p>{m.s2p3}</p>

      <h2>{m.s3}</h2>
      <p>{m.s3p}</p>

      <h2>{m.s4}</h2>
      <ul>
        <li>{m.s4li1}</li>
        <li>{m.s4li2}</li>
      </ul>

      <h2>{m.s5}</h2>
      <ul>
        {m.s5li.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <h2>{m.s6}</h2>
      <ol>
        {m.s6ol.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>

      <div className="cta-row">
        <Link className="btn-link primary" to={lp('/')}>
          {m.ctaNow}
        </Link>
        <Link className="btn-link" to={lp('/faq/')}>
          {m.ctaFaq}
        </Link>
      </div>
    </article>
  )
}
