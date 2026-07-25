import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import { getMessages } from './index'
import {
  absoluteUrl,
  localeFromPathname,
  localePath,
  stripLocale,
} from './path'
import {
  LOCALES,
  LOCALE_META,
  X_DEFAULT_LOCALE,
  type Locale,
  type Messages,
} from './types'

type I18nValue = {
  locale: Locale
  t: Messages
  lp: (path?: string) => string
  switchLocalePath: (next: Locale) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function setMetaDescription(content: string) {
  let el = document.querySelector('meta[name="description"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'description')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkRel(rel: string, href: string, hreflang?: string) {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.querySelector(sel) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

function syncHead(locale: Locale, title: string, description: string, path: string) {
  document.title = title
  document.documentElement.lang = LOCALE_META[locale].htmlLang
  setMetaDescription(description)
  const canonical = absoluteUrl(locale, path)
  setLinkRel('canonical', canonical)
  for (const loc of LOCALES) {
    setLinkRel('alternate', absoluteUrl(loc, path), LOCALE_META[loc].hreflang)
  }
  setLinkRel('alternate', absoluteUrl(X_DEFAULT_LOCALE, path), 'x-default')
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const locale = localeFromPathname(pathname)
  const t = useMemo(() => getMessages(locale), [locale])
  const bare = stripLocale(pathname)

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      t,
      lp: (path = '/') => localePath(locale, path),
      switchLocalePath: (next: Locale) => localePath(next, bare),
    }),
    [locale, t, bare],
  )

  useEffect(() => {
    // Default home SEO; pages override title/description themselves
    if (bare === '/' || bare === '') {
      syncHead(locale, t.seo.homeTitle, t.seo.homeDescription, '/')
    }
  }, [locale, t, bare])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n outside provider')
  return ctx
}

export function usePageSeo(
  title: string,
  description: string,
  path: string,
) {
  const { locale } = useI18n()
  useEffect(() => {
    syncHead(locale, title, description, path)
  }, [locale, title, description, path])
}
