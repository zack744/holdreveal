import type { Locale, Messages } from './types'
import { ja } from './messages/ja'
import { en } from './messages/en'
import { ko } from './messages/ko'
import { zh } from './messages/zh'
import { tr } from './messages/tr'

export * from './types'
export * from './path'

const catalog: Record<Locale, Messages> = { ja, en, ko, zh, tr }

export function getMessages(locale: Locale): Messages {
  return catalog[locale] ?? catalog.ja
}
