import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useI18n, usePageSeo } from '../i18n/context'
import { SHOWCASE_CASES } from '../data/showcase'

function CaseCard({
  title,
  desc,
  before,
  after,
  sourceUrl,
  sourceLabel,
  tabWhite,
  tabBlack,
}: {
  title: string
  desc?: string
  before: string
  after: string
  sourceUrl?: string
  sourceLabel?: string
  tabWhite: string
  tabBlack: string
}) {
  const [bg, setBg] = useState<'before' | 'after'>('before')
  const src = bg === 'before' ? before : after

  return (
    <article className="example-card showcase-card">
      <div
        className="pair single"
        style={{ background: bg === 'before' ? '#fff' : '#000' }}
      >
        <figure>
          <img src={src} alt={title} />
        </figure>
      </div>
      <div className="body">
        <div className="tabs" style={{ marginBottom: '0.45rem' }}>
          <button
            type="button"
            className={bg === 'before' ? 'on' : ''}
            onClick={() => setBg('before')}
          >
            {tabWhite}
          </button>
          <button
            type="button"
            className={bg === 'after' ? 'on' : ''}
            onClick={() => setBg('after')}
          >
            {tabBlack}
          </button>
        </div>
        <h3>{title}</h3>
        {desc && <p>{desc}</p>}
        {sourceUrl?.startsWith('http') && sourceLabel && (
          <p style={{ marginTop: '0.35rem' }}>
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {sourceLabel}
            </a>
          </p>
        )}
      </div>
    </article>
  )
}

export default function Examples() {
  const { t, lp } = useI18n()
  const m = t.examples
  usePageSeo(m.title, m.description, '/examples/')

  return (
    <article className="prose" style={{ maxWidth: '56rem' }}>
      <h1>{m.h1}</h1>
      <p>{m.lead}</p>
      <div className="examples-grid showcase-grid">
        {SHOWCASE_CASES.map((c, i) => {
          const copy = t.home.showcase[i] ?? { title: c.id }
          return (
            <CaseCard
              key={c.id}
              title={copy.title}
              desc={copy.desc}
              before={c.before}
              after={c.after}
              sourceUrl={c.sourceUrl}
              sourceLabel={
                c.author
                  ? `${t.home.caseViralLink} · ${c.author}`
                  : t.home.caseViralLink
              }
              tabWhite={t.home.tabWhite}
              tabBlack={t.home.tabBlack}
            />
          )
        })}
      </div>
      <div className="cta-row">
        <Link className="btn-link primary" to={lp('/')}>
          {m.ctaMake}
        </Link>
        <Link className="btn-link" to={lp('/how-it-works/')}>
          {m.ctaHow}
        </Link>
      </div>
      <p className="credit" style={{ marginTop: '1.5rem' }}>
        {m.disclaimer}
      </p>
    </article>
  )
}
