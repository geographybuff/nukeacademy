import { haversineKm } from './geo'
import { CAPITALS } from './capitals'
import type { Locale } from '../i18n/locale'
import { getLocale } from '../i18n/locale'

export type MajorCity = {
  id: string
  countryId: string
  lat: number
  lon: number
  pop: number
  name: Partial<Record<Locale, string>> & { en: string }
}

/** Big-city hits for low-poly urban vignettes (not exhaustive — vibes over census). */
export const MAJOR_CITIES: MajorCity[] = [
  { id: 'nyc', countryId: 'USA', lat: 40.7128, lon: -74.006, pop: 19e6, name: { en: 'New York', es: 'Nueva York', ru: 'Нью-Йорк', zh: '纽约', ja: 'ニューヨーク' } },
  { id: 'lax', countryId: 'USA', lat: 34.0522, lon: -118.2437, pop: 13e6, name: { en: 'Los Angeles', es: 'Los Ángeles', ru: 'Лос-Анджелес', zh: '洛杉矶', ja: 'ロサンゼルス' } },
  { id: 'chi', countryId: 'USA', lat: 41.8781, lon: -87.6298, pop: 9e6, name: { en: 'Chicago', es: 'Chicago', ru: 'Чикаго', zh: '芝加哥', ja: 'シカゴ' } },
  { id: 'lon', countryId: 'GBR', lat: 51.5074, lon: -0.1278, pop: 9.5e6, name: { en: 'London', es: 'Londres', ru: 'Лондон', zh: '伦敦', ja: 'ロンドン' } },
  { id: 'par', countryId: 'FRA', lat: 48.8566, lon: 2.3522, pop: 12e6, name: { en: 'Paris', es: 'París', ru: 'Париж', zh: '巴黎', ja: 'パリ' } },
  { id: 'ber', countryId: 'DEU', lat: 52.52, lon: 13.405, pop: 3.7e6, name: { en: 'Berlin', es: 'Berlín', ru: 'Берлин', zh: '柏林', ja: 'ベルリン' } },
  { id: 'mad', countryId: 'ESP', lat: 40.4168, lon: -3.7038, pop: 6.7e6, name: { en: 'Madrid', es: 'Madrid', ru: 'Мадрид', zh: '马德里', ja: 'マドリード' } },
  { id: 'rom', countryId: 'ITA', lat: 41.9028, lon: 12.4964, pop: 4.3e6, name: { en: 'Rome', es: 'Roma', ru: 'Рим', zh: '罗马', ja: 'ローマ' } },
  { id: 'mil', countryId: 'ITA', lat: 45.4642, lon: 9.19, pop: 3.2e6, name: { en: 'Milan', es: 'Milán', ru: 'Милан', zh: '米兰', ja: 'ミラノ' } },
  { id: 'mos', countryId: 'RUS', lat: 55.7558, lon: 37.6173, pop: 12e6, name: { en: 'Moscow', es: 'Moscú', ru: 'Москва', zh: '莫斯科', ja: 'モスクワ' } },
  { id: 'ist', countryId: 'TUR', lat: 41.0082, lon: 28.9784, pop: 15e6, name: { en: 'Istanbul', es: 'Estambul', ru: 'Стамбул', zh: '伊斯坦布尔', ja: 'イスタンブール' } },
  { id: 'cai', countryId: 'EGY', lat: 30.0444, lon: 31.2357, pop: 20e6, name: { en: 'Cairo', es: 'El Cairo', ru: 'Каир', zh: '开罗', ja: 'カイロ' } },
  { id: 'lag', countryId: 'NGA', lat: 6.5244, lon: 3.3792, pop: 21e6, name: { en: 'Lagos', es: 'Lagos', ru: 'Лагос', zh: '拉各斯', ja: 'ラゴス' } },
  { id: 'jhb', countryId: 'ZAF', lat: -26.2041, lon: 28.0473, pop: 5.6e6, name: { en: 'Johannesburg', es: 'Johannesburgo', ru: 'Йоханнесбург', zh: '约翰内斯堡', ja: 'ヨハネスブルグ' } },
  { id: 'nbo', countryId: 'KEN', lat: -1.2921, lon: 36.8219, pop: 4.7e6, name: { en: 'Nairobi', es: 'Nairobi', ru: 'Найроби', zh: '内罗毕', ja: 'ナイロビ' } },
  { id: 'dxb', countryId: 'ARE', lat: 25.2048, lon: 55.2708, pop: 3.5e6, name: { en: 'Dubai', es: 'Dubái', ru: 'Дубай', zh: '迪拜', ja: 'ドバイ' } },
  { id: 'riy', countryId: 'SAU', lat: 24.7136, lon: 46.6753, pop: 7e6, name: { en: 'Riyadh', es: 'Riad', ru: 'Эр-Рияд', zh: '利雅得', ja: 'リヤド' } },
  { id: 'teh', countryId: 'IRN', lat: 35.6892, lon: 51.389, pop: 15e6, name: { en: 'Tehran', es: 'Teherán', ru: 'Тегеран', zh: '德黑兰', ja: 'テヘラン' } },
  { id: 'del', countryId: 'IND', lat: 28.6139, lon: 77.209, pop: 32e6, name: { en: 'Delhi', es: 'Delhi', ru: 'Дели', zh: '德里', ja: 'デリー' } },
  { id: 'mum', countryId: 'IND', lat: 19.076, lon: 72.8777, pop: 20e6, name: { en: 'Mumbai', es: 'Bombay', ru: 'Мумбаи', zh: '孟买', ja: 'ムンバイ' } },
  { id: 'blr', countryId: 'IND', lat: 12.9716, lon: 77.5946, pop: 12e6, name: { en: 'Bengaluru', es: 'Bangalore', ru: 'Бенгалуру', zh: '班加罗尔', ja: 'ベンガルール' } },
  { id: 'bkk', countryId: 'THA', lat: 13.7563, lon: 100.5018, pop: 10e6, name: { en: 'Bangkok', es: 'Bangkok', ru: 'Бангкок', zh: '曼谷', ja: 'バンコク' } },
  { id: 'sgp', countryId: 'SGP', lat: 1.3521, lon: 103.8198, pop: 5.9e6, name: { en: 'Singapore', es: 'Singapur', ru: 'Сингапур', zh: '新加坡', ja: 'シンガポール' } },
  { id: 'jkt', countryId: 'IDN', lat: -6.2088, lon: 106.8456, pop: 10e6, name: { en: 'Jakarta', es: 'Yakarta', ru: 'Джакарта', zh: '雅加达', ja: 'ジャカルタ' } },
  { id: 'mnl', countryId: 'PHL', lat: 14.5995, lon: 120.9842, pop: 13e6, name: { en: 'Manila', es: 'Manila', ru: 'Манила', zh: '马尼拉', ja: 'マニラ' } },
  { id: 'hkg', countryId: 'CHN', lat: 22.3193, lon: 114.1694, pop: 7.5e6, name: { en: 'Hong Kong', es: 'Hong Kong', ru: 'Гонконг', zh: '香港', ja: '香港' } },
  { id: 'sha', countryId: 'CHN', lat: 31.2304, lon: 121.4737, pop: 26e6, name: { en: 'Shanghai', es: 'Shanghái', ru: 'Шанхай', zh: '上海', ja: '上海' } },
  { id: 'bej', countryId: 'CHN', lat: 39.9042, lon: 116.4074, pop: 21e6, name: { en: 'Beijing', es: 'Pekín', ru: 'Пекин', zh: '北京', ja: '北京' } },
  { id: 'szx', countryId: 'CHN', lat: 22.5431, lon: 114.0579, pop: 17e6, name: { en: 'Shenzhen', es: 'Shenzhen', ru: 'Шэньчжэнь', zh: '深圳', ja: '深セン' } },
  { id: 'tyo', countryId: 'JPN', lat: 35.6762, lon: 139.6503, pop: 37e6, name: { en: 'Tokyo', es: 'Tokio', ru: 'Токио', zh: '东京', ja: '東京' } },
  { id: 'osa', countryId: 'JPN', lat: 34.6937, lon: 135.5023, pop: 19e6, name: { en: 'Osaka', es: 'Osaka', ru: 'Осака', zh: '大阪', ja: '大阪' } },
  { id: 'sel', countryId: 'KOR', lat: 37.5665, lon: 126.978, pop: 9.7e6, name: { en: 'Seoul', es: 'Seúl', ru: 'Сеул', zh: '首尔', ja: 'ソウル' } },
  { id: 'syd', countryId: 'AUS', lat: -33.8688, lon: 151.2093, pop: 5.3e6, name: { en: 'Sydney', es: 'Sídney', ru: 'Сидней', zh: '悉尼', ja: 'シドニー' } },
  { id: 'mel', countryId: 'AUS', lat: -37.8136, lon: 144.9631, pop: 5.0e6, name: { en: 'Melbourne', es: 'Melbourne', ru: 'Мельбурн', zh: '墨尔本', ja: 'メルボルン' } },
  { id: 'sao', countryId: 'BRA', lat: -23.5505, lon: -46.6333, pop: 22e6, name: { en: 'São Paulo', es: 'São Paulo', ru: 'Сан-Паулу', zh: '圣保罗', ja: 'サンパウロ' } },
  { id: 'rio', countryId: 'BRA', lat: -22.9068, lon: -43.1729, pop: 13e6, name: { en: 'Rio de Janeiro', es: 'Río de Janeiro', ru: 'Рио-де-Жанейро', zh: '里约热内卢', ja: 'リオデジャネイロ' } },
  { id: 'bue', countryId: 'ARG', lat: -34.6037, lon: -58.3816, pop: 15e6, name: { en: 'Buenos Aires', es: 'Buenos Aires', ru: 'Буэнос-Айрес', zh: '布宜诺斯艾利斯', ja: 'ブエノスアイレス' } },
  { id: 'mex', countryId: 'MEX', lat: 19.4326, lon: -99.1332, pop: 21e6, name: { en: 'Mexico City', es: 'Ciudad de México', ru: 'Мехико', zh: '墨西哥城', ja: 'メキシコシティ' } },
  { id: 'bog', countryId: 'COL', lat: 4.711, lon: -74.0721, pop: 10e6, name: { en: 'Bogotá', es: 'Bogotá', ru: 'Богота', zh: '波哥大', ja: 'ボゴタ' } },
  { id: 'lim', countryId: 'PER', lat: -12.0464, lon: -77.0428, pop: 10e6, name: { en: 'Lima', es: 'Lima', ru: 'Лима', zh: '利马', ja: 'リマ' } },
  { id: 'tor', countryId: 'CAN', lat: 43.6532, lon: -79.3832, pop: 6.2e6, name: { en: 'Toronto', es: 'Toronto', ru: 'Торонто', zh: '多伦多', ja: 'トロント' } },
  { id: 'van', countryId: 'CAN', lat: 49.2827, lon: -123.1207, pop: 2.6e6, name: { en: 'Vancouver', es: 'Vancouver', ru: 'Ванкувер', zh: '温哥华', ja: 'バンクーバー' } },
  { id: 'waw', countryId: 'POL', lat: 52.2297, lon: 21.0122, pop: 1.8e6, name: { en: 'Warsaw', es: 'Varsovia', ru: 'Варшава', zh: '华沙', ja: 'ワルシャワ' } },
  { id: 'vie', countryId: 'AUT', lat: 48.2082, lon: 16.3738, pop: 1.9e6, name: { en: 'Vienna', es: 'Viena', ru: 'Вена', zh: '维也纳', ja: 'ウィーン' } },
  { id: 'ams', countryId: 'NLD', lat: 52.3676, lon: 4.9041, pop: 1.1e6, name: { en: 'Amsterdam', es: 'Ámsterdam', ru: 'Амстердам', zh: '阿姆斯特丹', ja: 'アムステルダム' } },
  { id: 'ath', countryId: 'GRC', lat: 37.9838, lon: 23.7275, pop: 3.7e6, name: { en: 'Athens', es: 'Atenas', ru: 'Афины', zh: '雅典', ja: 'アテネ' } },
  { id: 'lis', countryId: 'PRT', lat: 38.7223, lon: -9.1393, pop: 2.9e6, name: { en: 'Lisbon', es: 'Lisboa', ru: 'Лиссабон', zh: '里斯本', ja: 'リスボン' } },
  { id: 'sto', countryId: 'SWE', lat: 59.3293, lon: 18.0686, pop: 1.6e6, name: { en: 'Stockholm', es: 'Estocolmo', ru: 'Стокгольм', zh: '斯德哥尔摩', ja: 'ストックホルム' } },
  { id: 'osl', countryId: 'NOR', lat: 59.9139, lon: 10.7522, pop: 1.0e6, name: { en: 'Oslo', es: 'Oslo', ru: 'Осло', zh: '奥斯陆', ja: 'オスロ' } },
  { id: 'hel', countryId: 'FIN', lat: 60.1699, lon: 24.9384, pop: 1.3e6, name: { en: 'Helsinki', es: 'Helsinki', ru: 'Хельсинки', zh: '赫尔辛基', ja: 'ヘルシンキ' } },
  { id: 'cph', countryId: 'DNK', lat: 55.6761, lon: 12.5683, pop: 1.3e6, name: { en: 'Copenhagen', es: 'Copenhague', ru: 'Копенгаген', zh: '哥本哈根', ja: 'コペンハーゲン' } },
  { id: 'bud', countryId: 'HUN', lat: 47.4979, lon: 19.0402, pop: 1.8e6, name: { en: 'Budapest', es: 'Budapest', ru: 'Будапешт', zh: '布达佩斯', ja: 'ブダペスト' } },
  { id: 'prg', countryId: 'CZE', lat: 50.0755, lon: 14.4378, pop: 1.3e6, name: { en: 'Prague', es: 'Praga', ru: 'Прага', zh: '布拉格', ja: 'プラハ' } },
  { id: 'buk', countryId: 'ROU', lat: 44.4268, lon: 26.1025, pop: 1.8e6, name: { en: 'Bucharest', es: 'Bucarest', ru: 'Бухарест', zh: '布加勒斯特', ja: 'ブカレスト' } },
  { id: 'kyi', countryId: 'UKR', lat: 50.4501, lon: 30.5234, pop: 3.0e6, name: { en: 'Kyiv', es: 'Kiev', ru: 'Киев', zh: '基辅', ja: 'キーウ' } },
  { id: 'ank', countryId: 'TUR', lat: 39.9334, lon: 32.8597, pop: 5.5e6, name: { en: 'Ankara', es: 'Ankara', ru: 'Анкара', zh: '安卡拉', ja: 'アンカラ' } },
  { id: 'isb', countryId: 'PAK', lat: 33.6844, lon: 73.0479, pop: 1.1e6, name: { en: 'Islamabad', es: 'Islamabad', ru: 'Исламабад', zh: '伊斯兰堡', ja: 'イスラマバード' } },
  { id: 'khi', countryId: 'PAK', lat: 24.8607, lon: 67.0011, pop: 16e6, name: { en: 'Karachi', es: 'Karachi', ru: 'Карачи', zh: '卡拉奇', ja: 'カラチ' } },
  { id: 'dac', countryId: 'BGD', lat: 23.8103, lon: 90.4125, pop: 21e6, name: { en: 'Dhaka', es: 'Daca', ru: 'Дакка', zh: '达卡', ja: 'ダッカ' } },
  { id: 'han', countryId: 'VNM', lat: 21.0278, lon: 105.8342, pop: 4.5e6, name: { en: 'Hanoi', es: 'Hanói', ru: 'Ханой', zh: '河内', ja: 'ハノイ' } },
  { id: 'sgn', countryId: 'VNM', lat: 10.8231, lon: 106.6297, pop: 9e6, name: { en: 'Ho Chi Minh City', es: 'Ciudad Ho Chi Minh', ru: 'Хошимин', zh: '胡志明市', ja: 'ホーチミン' } },
  { id: 'tpe', countryId: 'TWN', lat: 25.033, lon: 121.5654, pop: 2.6e6, name: { en: 'Taipei', es: 'Taipéi', ru: 'Тайбэй', zh: '台北', ja: '台北' } },
  { id: 'scl', countryId: 'CHL', lat: -33.4489, lon: -70.6693, pop: 6.8e6, name: { en: 'Santiago', es: 'Santiago', ru: 'Сантьяго', zh: '圣地亚哥', ja: 'サンティアゴ' } },
  { id: 'car', countryId: 'VEN', lat: 10.4806, lon: -66.9036, pop: 2.9e6, name: { en: 'Caracas', es: 'Caracas', ru: 'Каракас', zh: '加拉加斯', ja: 'カラカス' } },
  { id: 'hav', countryId: 'CUB', lat: 23.1136, lon: -82.3666, pop: 2.1e6, name: { en: 'Havana', es: 'La Habana', ru: 'Гавана', zh: '哈瓦那', ja: 'ハバナ' } },
  { id: 'cas', countryId: 'MAR', lat: 33.5731, lon: -7.5898, pop: 3.7e6, name: { en: 'Casablanca', es: 'Casablanca', ru: 'Касабланка', zh: '卡萨布兰卡', ja: 'カサブランカ' } },
  { id: 'alg', countryId: 'DZA', lat: 36.7538, lon: 3.0588, pop: 3.9e6, name: { en: 'Algiers', es: 'Argel', ru: 'Алжир', zh: '阿尔及尔', ja: 'アルジェ' } },
  { id: 'add', countryId: 'ETH', lat: 9.032, lon: 38.7469, pop: 5e6, name: { en: 'Addis Ababa', es: 'Adís Abeba', ru: 'Аддис-Абеба', zh: '亚的斯亚贝巴', ja: 'アディスアベバ' } },
  { id: 'kin', countryId: 'COD', lat: -4.4419, lon: 15.2663, pop: 14e6, name: { en: 'Kinshasa', es: 'Kinshasa', ru: 'Киншаса', zh: '金沙萨', ja: 'キンシャサ' } },
  { id: 'wsh', countryId: 'USA', lat: 38.9072, lon: -77.0369, pop: 0.7e6, name: { en: 'Washington, D.C.', es: 'Washington D. C.', ru: 'Вашингтон', zh: '华盛顿', ja: 'ワシントンD.C.' } },
]

export type TerrainKind = 'city' | 'land' | 'ocean' | 'mountain'

export type ImpactTerrain = {
  kind: TerrainKind
  city: MajorCity | null
  distKm: number
}

/** Metro / capital proximity for urban POV — generous on purpose. */
const CITY_HIT_KM = 280
const CAPITAL_HIT_KM = 160

export function classifyImpact(
  lat: number,
  lon: number,
  landedCountryId: string | null,
): ImpactTerrain {
  if (!landedCountryId) {
    return { kind: 'ocean', city: null, distKm: Infinity }
  }

  let best: MajorCity | null = null
  let bestDist = Infinity
  for (const city of MAJOR_CITIES) {
    const d = haversineKm(lat, lon, city.lat, city.lon)
    if (d < bestDist) {
      bestDist = d
      best = city
    }
  }

  // Near any curated capital → urban skyline (even if not in MAJOR_CITIES)
  let capitalDist = Infinity
  let capitalAsCity: MajorCity | null = null
  for (const [id, cap] of Object.entries(CAPITALS)) {
    const d = haversineKm(lat, lon, cap.lat, cap.lon)
    if (d < capitalDist) {
      capitalDist = d
      capitalAsCity = {
        id: `cap-${id}`,
        countryId: id,
        lat: cap.lat,
        lon: cap.lon,
        pop: cap.pop,
        name: cap.name,
      }
    }
  }

  if (best && bestDist <= CITY_HIT_KM) {
    return { kind: 'city', city: best, distKm: bestDist }
  }
  if (capitalAsCity && capitalDist <= CAPITAL_HIT_KM) {
    return { kind: 'city', city: capitalAsCity, distKm: capitalDist }
  }

  // Mostly countryside; mountains less often
  const h = Math.abs(Math.sin(lat * 17.23 + lon * 41.7) * 10000)
  const kind: TerrainKind = h % 1 > 0.72 ? 'mountain' : 'land'
  return { kind, city: null, distKm: bestDist }
}

export function cityDisplayName(city: MajorCity, locale: Locale = getLocale()): string {
  return city.name[locale] ?? city.name.en
}
