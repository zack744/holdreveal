import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useI18n, usePageSeo } from '../i18n/context'

const ASSETS: Record<string, { white: string; black: string; external?: string }> = {
  viral: {
    white: '/examples/case-viral-preview-white.jpg',
    black: '/examples/case-viral-preview-black.jpg',
    external: 'https://x.com/sarasara_aiart/status/2080126609290674237',
  },
  dual: {
    white: '/examples/dual-preview-white.jpg',
    black: '/examples/dual-preview-black.jpg',
  },
  demo: {
    white: '/examples/demo-preview-white.png',
    black: '/examples/demo-preview-black.png',
  },
}

function CaseCard({
  title,
  desc,
  white,
  black,
  credit,
  sourceLabel,
  sourceHref,
  tabWhite,
  tabBlack,
  sideWhite,
  sideBlack,
}: {
  title: string
  desc: string
  white: string
  black: string
  credit: string
  sourceLabel?: string
  sourceHref?: string
  tabWhite: string
  tabBlack: string
  sideWhite: string
  sideBlack: string
}) {
  const [bg, setBg] = useState<'white' | 'black'>('white')
  const src = bg === 'white' ? white : black
  const { lp } = useI18n()

  return (
    <article className="example-card">
      <div
        className="pair single"
        style={{ background: bg === 'white' ? '#fff' : '#000' }}
      >
        <figure>
          <img src={src} alt={title} />
          <figcaption style={{ color: bg === 'black' ? '#ccc' : undefined }}>
            {bg === 'white' ? sideWhite : sideBlack}
          </figcaption>
        </figure>
      </div>
      <div className="body">
        <div className="tabs" style={{ marginBottom: '0.55rem' }}>
          <button
            type="button"
            className={bg === 'white' ? 'on' : ''}
            onClick={() => setBg('white')}
          >
            {tabWhite}
          </button>
          <button
            type="button"
            className={bg === 'black' ? 'on' : ''}
            onClick={() => setBg('black')}
          >
            {tabBlack}
          </button>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
        {sourceLabel && sourceHref && (
          <p style={{ marginTop: '0.45rem' }}>
            {sourceHref.startsWith('http') ? (
              <a href={sourceHref} target="_blank" rel="noopener noreferrer">
                {sourceLabel}
              </a>
            ) : (
              <Link to={lp(sourceHref)}>{sourceLabel}</Link>
            )}
          </p>
        )}
        <p className="credit">{credit}</p>
      </div>
    </article>
  )
}

export default function Examples() {
  const { t, lp } = useI18n()
  const m = t.examples
  usePageSeo(m.title, m.description, '/examples/')

  const linkFor = (id: string) => {
    if (id === 'viral') return ASSETS.viral.external
    if (id === 'dual') return '/how-it-works/'
    return '/'
  }

  return (
    <article className="prose" style={{ maxWidth: '56rem' }}>
      <h1>{m.h1}</h1>
      <p>{m.lead}</p>
      <div className="examples-grid">
        {m.cases.map((c) => {
          const asset = ASSETS[c.id] ?? ASSETS.demo
          return (
            <CaseCard
              key={c.id}
              title={c.title}
              desc={c.desc}
              white={asset.white}
              black={asset.black}
              credit={c.credit}
              sourceLabel={c.sourceLabel}
              sourceHref={linkFor(c.id)}
              tabWhite={t.home.tabWhite}
              tabBlack={t.home.tabBlack}
              sideWhite={t.home.sideWhite}
              sideBlack={t.home.sideBlack}
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
