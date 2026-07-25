import { Link, NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const nav = [
  { to: '/', label: 'ホーム', end: true },
  { to: '/how-it-works/', label: '仕組み' },
  { to: '/examples/', label: '事例' },
  { to: '/faq/', label: 'FAQ' },
  { to: '/privacy/', label: 'プライバシー' },
]

export default function Layout() {
  return (
    <div className="page">
      <header className="site-header">
        <Link to="/" className="brand-link">
          <span className="logo">HoldReveal</span>
          <span className="tag">長押しで変化メーカー</span>
        </Link>
        <nav className="nav" aria-label="メイン">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-a on' : 'nav-a')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
      <footer className="foot">
        <nav className="foot-nav" aria-label="フッター">
          {nav.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p>
          HoldReveal · holdreveal.com · 画像は端末内処理のみ ·{' '}
          <a
            href="https://x.com/sarasara_aiart/status/2080126609290674237"
            target="_blank"
            rel="noopener noreferrer"
          >
            話題の長押しで変化
          </a>
        </p>
      </footer>
    </div>
  )
}
