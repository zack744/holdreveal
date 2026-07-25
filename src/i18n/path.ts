import { DEFAULT_LOCALE, LOCALES, type Locale } from './types'

export function isLocale(v: string | undefined): v is Locale {
  return !!v && (LOCALES as string[]).includes(v)
}

/** Parse locale from first path segment. `/` and unknown → ja */
export function localeFromPathname(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0]
  if (isLocale(seg)) return seg
  return DEFAULT_LOCALE
}

/** Prefix path with locale. ja stays unprefixed. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) {
    return clean === '' ? '/' : clean
  }
  if (clean === '/') return `/${locale}/`
  return `/${locale}${clean.endsWith('/') ? clean : `${clean}/`}`.replace(
    /\/+/g,
    '/',
  )
}

/** Strip locale prefix for switching languages */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && isLocale(parts[0])) {
    const rest = parts.slice(1).join('/')
    return rest ? `/${rest}/`.replace(/\/+/g, '/') : '/'
  }
  return pathname.endsWith('/') || pathname === '' ? pathname || '/' : `${pathname}/`
}

export function absoluteUrl(locale: Locale, path = '/'): string {
  const p = localePath(locale, path)
  return `https://holdreveal.com${p === '/' ? '/' : p}`
}
