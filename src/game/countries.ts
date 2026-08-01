import { getLocale, localeBcp47, type Locale } from '../i18n/locale'
import { capitalFor, capitalName } from './capitals'
import { haversineKm } from './geo'

export type Country = {
  id: string
  name: string
  /** Target point for scoring — real capital when known. */
  lat: number
  lon: number
  /** Approximate hit radius in km (from label rank / size) */
  radiusKm: number
  color: number
  /** Country population estimate (Natural Earth). */
  population: number
  continent: string
  /** Localized capital city name, if curated. */
  capitalName: string | null
  /** Approximate capital metro population. */
  capitalPop: number | null
}

const NAME_FIELD: Record<Locale, string> = {
  en: 'NAME_EN',
  es: 'NAME_ES',
  ru: 'NAME_RU',
  zh: 'NAME_ZH',
  ja: 'NAME_JA',
}

/** Prefer short, spoken names over formal UN mouthfuls. */
const SHORT_NAME: Record<string, Partial<Record<Locale, string>>> = {
  CHN: { en: 'China', es: 'China', ru: 'Китай', zh: '中国', ja: '中国' },
  USA: {
    en: 'United States',
    es: 'EE. UU.',
    ru: 'США',
    zh: '美国',
    ja: 'アメリカ',
  },
  GBR: {
    en: 'United Kingdom',
    es: 'Reino Unido',
    ru: 'Британия',
    zh: '英国',
    ja: 'イギリス',
  },
  RUS: { en: 'Russia', es: 'Rusia', ru: 'Россия', zh: '俄罗斯', ja: 'ロシア' },
  KOR: {
    en: 'South Korea',
    es: 'Corea del Sur',
    ru: 'Южная Корея',
    zh: '韩国',
    ja: '韓国',
  },
  CYN: {
    en: 'Northern Cyprus',
    es: 'Chipre del Norte',
    ru: 'Северный Кипр',
    zh: '北塞浦路斯',
    ja: '北キプロス',
  },
  FLK: {
    en: 'Falklands',
    es: 'Malvinas',
    ru: 'Фолкленды',
    zh: '福克兰',
    ja: 'フォークランド',
  },
  PSX: {
    en: 'Palestine',
    es: 'Palestina',
    ru: 'Палестина',
    zh: '巴勒斯坦',
    ja: 'パレスチナ',
  },
  SAH: {
    en: 'Western Sahara',
    es: 'Sáhara Occidental',
    ru: 'Западная Сахара',
    zh: '西撒哈拉',
    ja: '西サハラ',
  },
  PRI: {
    en: 'Puerto Rico',
    es: 'Puerto Rico',
    ru: 'Пуэрто-Рико',
    zh: '波多黎各',
    ja: 'プエルトリコ',
  },
  NCL: {
    en: 'New Caledonia',
    es: 'Nueva Caledonia',
    ru: 'Новая Каледония',
    zh: '新喀里多尼亚',
    ja: 'ニューカレドニア',
  },
}

export type GeoFeature = {
  type: string
  properties: Record<string, unknown>
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

export type CountryGeo = Country & {
  feature: GeoFeature
}

const LAND_PALETTE = [
  0x4f8a45, 0x6d9658, 0x8a9e4e, 0xb89a5c, 0xc4a35a, 0x5f9a6a, 0x9aaa5e, 0xd0b06a,
]

export function colorForCountry(props: Record<string, unknown>): number {
  const idx = Math.abs(Number(props.MAPCOLOR13 ?? props.MAPCOLOR7 ?? 1)) % LAND_PALETTE.length
  return LAND_PALETTE[idx]!
}

export function countryFromFeature(feature: GeoFeature): Country | null {
  const props = feature.properties
  const id = String(props.ADM0_A3 ?? props.ISO_A3 ?? props.NAME_EN ?? '')
  if (!id || id === '-99') return null

  const locale = getLocale()
  const short = SHORT_NAME[id]?.[locale]
  const field = NAME_FIELD[locale]
  const name = String(
    short || props[field] || props.NAME_EN || props.NAME || props.ADMIN || '',
  )
  if (!name) return null

  const capital = capitalFor(id)
  const labelLat = Number(props.LABEL_Y)
  const labelLon = Number(props.LABEL_X)
  const lat = capital?.lat ?? labelLat
  const lon = capital?.lon ?? labelLon
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

  const labelRank = Number(props.LABELRANK ?? 5)
  // Real capitals are precise — slightly tighter bullseye than old label blobs
  const radiusKm = capital
    ? Math.max(90, 720 - labelRank * 70)
    : Math.max(120, 900 - labelRank * 90)

  const population = Math.max(0, Math.round(Number(props.POP_EST ?? 0)))
  const continent = String(props.CONTINENT ?? '')

  return {
    id,
    name,
    lat,
    lon,
    radiusKm,
    color: colorForCountry(props),
    population,
    continent,
    capitalName: capitalName(id, locale),
    capitalPop: capital ? Math.round(capital.pop) : null,
  }
}

/**
 * Contested / awkward map units we still want as exams.
 * Controversy is curriculum.
 */
const FORCE_PLAYABLE_IDS = new Set([
  'PSX', // Palestine
  'SAH', // Western Sahara
  'CYN', // Northern Cyprus
  'FLK', // Falklands / Malvinas
  'PRI', // Puerto Rico
  'NCL', // New Caledonia
])

/** Skip empty Antarctic claims / ultra-remote leases with no capital to hit. */
const UNPLAYABLE_IDS = new Set(['ATA', 'ATF'])

/** Playable targets: sovereign (and similar) countries drawn on the globe. */
export function isPlayableTarget(feature: GeoFeature): boolean {
  const props = feature.properties
  const continent = String(props.CONTINENT ?? '')
  if (continent === 'Antarctica') return false
  const id = String(props.ADM0_A3 ?? props.ISO_A3 ?? '')
  if (!id || id === '-99' || UNPLAYABLE_IDS.has(id)) return false
  if (FORCE_PLAYABLE_IDS.has(id)) return true
  const type = String(props.TYPE ?? '')
  // Skip other deps / leases / indeterminate — forced IDs already returned
  if (/dependency|indeterminate|lease/i.test(type)) return false
  return true
}

export function pickRandomCountry(pool: Country[], excludeId?: string): Country {
  const list = excludeId ? pool.filter((c) => c.id !== excludeId) : pool
  return list[Math.floor(Math.random() * list.length)]!
}

/** Academy day timezone — midnight here rolls the daily exam. */
export const EXAM_TIMEZONE = 'Asia/Yerevan'

/** Calendar day key in academy TZ, e.g. 2026-08-01 */
export function examDayKey(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: EXAM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** @deprecated Use examDayKey — days roll on Asia/Yerevan, not UTC. */
export const utcDayKey = examDayKey

/** First daily exam — pinned so launch opens on Argentina (Yerevan day). */
export const DAILY_LAUNCH_DAY = '2026-08-01'

/** Override hashed picks for specific academy days (ISO keys → ADM0_A3). */
const PINNED_DAILY_TARGETS: Record<string, string> = {
  [DAILY_LAUNCH_DAY]: 'ARG',
  '2026-08-02': 'ISR',
}

/** Same capital for every player on the same academy (Yerevan) day. */
export function pickDailyCountry(pool: Country[], day = examDayKey()): Country {
  if (pool.length === 0) throw new Error('No countries')
  const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id))
  const pinnedId = PINNED_DAILY_TARGETS[day]
  if (pinnedId) {
    const pinned = sorted.find((c) => c.id === pinnedId)
    if (pinned) return pinned
  }
  let h = 2166136261
  for (let i = 0; i < day.length; i++) {
    h ^= day.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return sorted[Math.abs(h) % sorted.length]!
}

/** Absolute km from capital where the score hits zero (past = demerits). */
const SCORE_ZERO_KM = 2000
/** Distance demerits bottom out here. */
const SCORE_MAX_MISS_KM = 5000
const SCORE_MISS_FLOOR = -400
/** Extra slap for open-water exams. */
const OCEAN_PENALTY = 100
const SCORE_CLAMP_MIN = -500

export function scoreDrop(
  impactLat: number,
  impactLon: number,
  country: Country,
  opts: { ocean?: boolean } = {},
): { distanceKm: number; points: number; grade: string } {
  const distanceKm = haversineKm(impactLat, impactLon, country.lat, country.lon)
  const perfect = country.radiusKm * 0.45

  let points: number
  if (distanceKm <= perfect) {
    points = 1000
  } else if (distanceKm <= country.radiusKm) {
    const t = (distanceKm - perfect) / (country.radiusKm - perfect)
    points = Math.round(1000 - t * 250)
  } else if (distanceKm <= SCORE_ZERO_KM) {
    const span = Math.max(1, SCORE_ZERO_KM - country.radiusKm)
    const t = Math.min(1, (distanceKm - country.radiusKm) / span)
    points = Math.round(750 * (1 - t) ** 1.2)
  } else {
    const span = SCORE_MAX_MISS_KM - SCORE_ZERO_KM
    const t = Math.min(1, (distanceKm - SCORE_ZERO_KM) / span)
    points = Math.round(SCORE_MISS_FLOOR * t ** 0.85)
  }

  if (opts.ocean) {
    points -= OCEAN_PENALTY
  }

  points = Math.max(SCORE_CLAMP_MIN, Math.min(1000, points))

  let grade = 'MISS'
  if (points >= 1000) grade = 'BULLSEYE'
  else if (points >= 850) grade = 'DIRECT HIT'
  else if (points >= 600) grade = 'CLOSE CALL'
  else if (points >= 300) grade = 'NEAR MISS'
  else if (points > 0) grade = 'FAR OFF'

  return { distanceKm, points, grade }
}

/** Human-ish population string (locale decimal separator). */
export function formatPop(n: number, _locale: Locale = getLocale()): string {
  if (!Number.isFinite(n) || n <= 0) return '—'
  const tag = localeBcp47()
  const fmt = (v: number, maxFrac: number) =>
    v.toLocaleString(tag, { maximumFractionDigits: maxFrac, minimumFractionDigits: 0 })
  if (n >= 1_000_000_000) {
    const v = n / 1_000_000_000
    return `${fmt(v, v >= 10 ? 0 : 1)}B`
  }
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${fmt(v, v >= 100 ? 0 : 1)}M`
  }
  if (n >= 1_000) return `${fmt(n / 1_000, 0)}K`
  return fmt(n, 0)
}
