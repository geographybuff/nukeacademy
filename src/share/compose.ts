import { copy, t } from '../i18n/copy'
import type { Locale } from '../i18n/locale'
import { getLocale } from '../i18n/locale'

/** Hit / near / miss verb phrase for share + OG body. */
export function shareOutcome(grade: string, locale: Locale = getLocale()): string {
  const c = copy(locale)
  if (grade === 'BULLSEYE' || grade === 'DIRECT HIT') return c.shareOutcomeHit
  if (grade === 'CLOSE CALL' || grade === 'NEAR MISS') return c.shareOutcomeClose
  return c.shareOutcomeMiss
}

function kmLabel(km: number, locale: Locale): string {
  return Math.round(km).toLocaleString(locale === 'zh' ? 'zh-CN' : locale)
}

function fillShare(
  template: string,
  opts: { km: number; place: string; grade: string; locale: Locale },
): string {
  return t(template, {
    km: kmLabel(opts.km, opts.locale),
    place: opts.place,
    outcome: shareOutcome(opts.grade, opts.locale),
  })
}

/** Tweet body — headline + one sentence. URL attached separately by intent. */
export function composeShareTweet(
  grade: string,
  km: number,
  place: string,
  locale: Locale = getLocale(),
): string {
  return fillShare(copy(locale).shareTweet, { km, place, grade, locale })
}

export function composeShareOg(
  grade: string,
  km: number,
  place: string,
  locale: Locale = getLocale(),
): { title: string; description: string } {
  const c = copy(locale)
  const vars = { km, place, grade, locale }
  return {
    title: fillShare(c.ogShareTitle, vars),
    description: fillShare(c.ogShareDescription, vars),
  }
}
