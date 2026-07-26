import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/context'
import { LOCALES, LOCALE_META, type Locale } from '../i18n/types'
import './Layout.css'

export default function Layout() {
  const { t, lp, locale, switchLocalePath } = useI18n()
  const navigate = useNavigate()

  const nav = [
    { to: lp('/'), label: t.nav.home, end: true },
    { to: lp('/tap-change/'), label: t.nav.tapChange, end: false },
    { to: lp('/how-it-works/'), label: t.nav.how, end: false },
    { to: lp('/examples/'), label: t.nav.examples, end: false },
    { to: lp('/faq/'), label: t.nav.faq, end: false },
    { to: lp('/privacy/'), label: t.nav.privacy, end: false },
  ]

  return (
    <div className="page">
      <header className="site-header">
        <Link to={lp('/')} className="brand-link">
          <span className="logo">HoldReveal</span>
          <span className="tag">{t.brandTag}</span>
        </Link>
        <div className="header-right">
          <nav className="nav" aria-label="main">
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
          <label className="lang-switch">
            <span className="sr-only">Language</span>
            <select
              value={locale}
              onChange={(e) => {
                const next = e.target.value as Locale
                navigate(switchLocalePath(next))
              }}
              aria-label="Language"
            >
              {LOCALES.map((loc) => (
                <option key={loc} value={loc}>
                  {LOCALE_META[loc].label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <Outlet />
      <footer className="foot">
        <nav className="foot-nav" aria-label="footer">
          {nav.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p>
          HoldReveal · holdreveal.com · {t.footer.localOnly} ·{' '}
          <a
            href="https://x.com/sarasara_aiart/status/2080126609290674237"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footer.viralLink}
          </a>
        </p>
      </footer>
    </div>
  )
}
