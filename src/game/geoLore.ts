import { copy, t } from '../i18n/copy'
import { getLocale, type Locale } from '../i18n/locale'
import { formatPop, type Country } from './countries'
import { cityDisplayName, type ImpactTerrain } from './cities'

const CONTINENT: Record<string, Record<Locale, string>> = {
  'North America': {
    en: 'North America',
    es: 'Norteamérica',
    ru: 'Северная Америка',
    zh: '北美洲',
    ja: '北アメリカ',
  },
  'South America': {
    en: 'South America',
    es: 'Sudamérica',
    ru: 'Южная Америка',
    zh: '南美洲',
    ja: '南アメリカ',
  },
  Europe: { en: 'Europe', es: 'Europa', ru: 'Европа', zh: '欧洲', ja: 'ヨーロッパ' },
  Asia: { en: 'Asia', es: 'Asia', ru: 'Азия', zh: '亚洲', ja: 'アジア' },
  Africa: { en: 'Africa', es: 'África', ru: 'Африка', zh: '非洲', ja: 'アフリカ' },
  Oceania: { en: 'Oceania', es: 'Oceanía', ru: 'Океания', zh: '大洋洲', ja: 'オセアニア' },
  Antarctica: {
    en: 'Antarctica',
    es: 'Antártida',
    ru: 'Антарктида',
    zh: '南极洲',
    ja: '南極',
  },
}

export function continentLabel(continent: string, locale: Locale = getLocale()): string {
  return CONTINENT[continent]?.[locale] ?? (continent || '—')
}

/** One sentence: where you hit. Roast appended separately. */
export function buildHitClause(opts: {
  target: Country
  landed: Country | null
  terrain: ImpactTerrain
}): string {
  const c = copy()
  const locale = getLocale()
  const { target, landed, terrain } = opts

  if (!landed) return c.hitOcean

  if (landed.id === target.id) {
    if (terrain.kind === 'city' && terrain.city) {
      return t(c.hitNearCity, { city: cityDisplayName(terrain.city, locale) })
    }
    return t(c.hitHomeSoil, { place: landed.name })
  }

  return t(c.hitWrongCountry, {
    place: landed.name,
    pop: formatPop(landed.population, locale),
  })
}

/** HUD / exam: country on one line, national pop on a smaller line. */
export function targetHudParts(country: Country): { place: string; pop: string | null } {
  const locale = getLocale()
  const people = copy().people
  if (country.population > 0) {
    return {
      place: country.name,
      pop: `~${formatPop(country.population, locale)} ${people}`,
    }
  }
  return { place: country.name, pop: null }
}

/** Single-line label (share / legacy). */
export function targetHudLabel(country: Country): string {
  const { place, pop } = targetHudParts(country)
  return pop ? `${place} · ${pop}` : place
}
