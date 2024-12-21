import cn from './i18n/cn'
import de from './i18n/de'
import en from './i18n/en'
import es from './i18n/es'
import fr from './i18n/fr'
import mg from './i18n/mg'
import pt from './i18n/pt'
import vi from './i18n/vi'

export type i18nLanguageKey =
  | 'cn'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'mg'
  | 'pt'
  | 'vi'

export type i18nLanguageConfig = {
  months: {
    '0': string
    '1': string
    '2': string
    '3': string
    '4': string
    '5': string
    '6': string
    '7': string
    '8': string
    '9': string
    '10': string
    '11': string
  }
  weekDays: [string, string, string, string, string, string, string]
  accept: string
  cancel: string
}

export const TranslationMap = { cn, de, en, es, fr, mg, pt, vi }
