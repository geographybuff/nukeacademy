import { CAPITALS } from './capitals'
import { MAJOR_CITIES, type ImpactTerrain } from './cities'
import { formatPop, type Country } from './countries'
import { haversineKm } from './geo'
import { formatNumber } from '../i18n/locale'

/**
 * Academy casualty math — directional, not NUKEMAP.
 * Orbital-curriculum yields are fat on purpose so desert strays
 * don't read as "4 people and a goat."
 */
export function estimateCasualties(opts: {
  lat: number
  lon: number
  blastScale: number
  landed: Country | null
  terrain: ImpactTerrain
}): number {
  const { lat, lon, landed, terrain } = opts
  if (!landed || terrain.kind === 'ocean') return 0

  const yieldMul = Math.max(0.6, opts.blastScale)
  // Strategic-ish rings at blastScale=1 (km)
  const rPeak = 12 * Math.pow(yieldMul, 0.55) // near-total metro wipe
  const rFade = 220 * Math.pow(yieldMul, 0.45) // thermal / fallout / towns

  let killed = 0
  const seen = new Set<string>()

  const addCity = (key: string, pop: number, cLat: number, cLon: number) => {
    if (seen.has(key) || pop <= 0) return
    const d = haversineKm(lat, lon, cLat, cLon)
    if (d > rFade) return
    seen.add(key)
    killed += pop * softKillFrac(d, rPeak, rFade, yieldMul)
  }

  for (const city of MAJOR_CITIES) {
    addCity(city.id, city.pop, city.lat, city.lon)
  }
  for (const [id, cap] of Object.entries(CAPITALS)) {
    addCity(`cap-${id}`, cap.pop, cap.lat, cap.lon)
  }
  if (terrain.kind === 'city' && terrain.city) {
    addCity(terrain.city.id, terrain.city.pop, terrain.city.lat, terrain.city.lon)
  }

  // Hitting a country always cooks a slice of national population
  // (towns, roads, camps — even when our city list is empty).
  if (landed.population > 0) {
    let splash =
      terrain.kind === 'city' ? 0.045 : terrain.kind === 'mountain' ? 0.012 : 0.022
    splash *= 0.75 + 0.4 * Math.min(1.4, yieldMul)
    // Sparse / tiny territories: don't let the % floor to comedy numbers
    const floor = Math.min(landed.population * 0.12, 2_500 * yieldMul)
    const national = Math.max(floor, landed.population * splash)
    killed += national
  }

  // Hard cap so a rural China hit doesn't erase the species
  const cap = Math.max(50_000, landed.population * 0.42)
  return Math.max(0, Math.round(Math.min(killed, cap)))
}

/** Fatality fraction for a metro at distance d from ground zero. */
function softKillFrac(dKm: number, rPeak: number, rFade: number, yieldMul: number): number {
  const peak = Math.min(0.88, 0.55 + 0.2 * Math.min(1.2, yieldMul))
  if (dKm <= rPeak) return peak
  if (dKm >= rFade) return 0
  const t = (dKm - rPeak) / (rFade - rPeak)
  // Steep then long tail — outskirts still count
  return peak * Math.pow(1 - t, 1.65)
}

export function formatCasualties(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0'
  if (n < 1000) return formatNumber(Math.round(n))
  if (n < 10_000) return formatNumber(Math.round(n / 50) * 50)
  return `~${formatPop(n)}`
}
