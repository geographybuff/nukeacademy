/** Compact obfuscated hit codes for /nuke/:code share links. */

export const GRADES = [
  'BULLSEYE',
  'DIRECT HIT',
  'CLOSE CALL',
  'NEAR MISS',
  'FAR OFF',
  'MISS',
] as const

export type Grade = (typeof GRADES)[number]

export type ShareHit = {
  lat: number
  lon: number
  distanceKm: number
  grade: string
  countryId: string
  countryName: string
  points: number
}

const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE = BigInt(CHARSET.length)

/** v2 prefix — signed points (-500..1000). Legacy codes omit this. */
const V2 = 's'
const POINTS_OFFSET = 500
const POINTS_MOD_V2 = 1501 // stores points + 500
const POINTS_MOD_V1 = 1001

function toBase62(n: bigint): string {
  if (n === 0n) return '0'
  let s = ''
  let x = n
  while (x > 0n) {
    s = CHARSET[Number(x % BASE)] + s
    x /= BASE
  }
  return s
}

function fromBase62(s: string): bigint | null {
  let n = 0n
  for (const ch of s) {
    const i = CHARSET.indexOf(ch)
    if (i < 0) return null
    n = n * BASE + BigInt(i)
  }
  return n
}

function encodeCountry(id: string): number {
  const raw = id
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
    .padEnd(3, '0')
    .slice(0, 3)
  let n = 0
  for (const ch of raw) {
    const code = ch >= '0' && ch <= '9' ? ch.charCodeAt(0) - 48 : ch.charCodeAt(0) - 55
    n = n * 36 + Math.max(0, Math.min(35, code))
  }
  return n
}

function decodeCountry(n: number): string {
  let x = n
  let s = ''
  for (let i = 0; i < 3; i++) {
    const d = x % 36
    x = Math.floor(x / 36)
    s = (d < 10 ? String(d) : String.fromCharCode(55 + d)) + s
  }
  return s
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function packHit(hit: ShareHit, pointsQ: number, pointsMod: number): bigint {
  const latQ = clamp(Math.round((hit.lat + 90) * 100), 0, 18000)
  const lonQ = clamp(Math.round((hit.lon + 180) * 100), 0, 36000)
  const distQ = clamp(Math.round(hit.distanceKm), 0, 16383)
  const gi = GRADES.indexOf(hit.grade as Grade)
  const gradeQ = gi < 0 ? 5 : gi
  const countryQ = encodeCountry(hit.countryId)

  let n = 0n
  n = n * 18001n + BigInt(latQ)
  n = n * 36001n + BigInt(lonQ)
  n = n * 16384n + BigInt(distQ)
  n = n * 6n + BigInt(gradeQ)
  n = n * 46656n + BigInt(countryQ)
  n = n * BigInt(pointsMod) + BigInt(pointsQ)
  return n
}

function unpackHit(
  n0: bigint,
  pointsMod: number,
  decodePoints: (q: number) => number,
): Omit<ShareHit, 'countryName'> | null {
  let n = n0
  const pointsQ = Number(n % BigInt(pointsMod))
  n /= BigInt(pointsMod)
  const countryQ = Number(n % 46656n)
  n /= 46656n
  const gradeQ = Number(n % 6n)
  n /= 6n
  const distQ = Number(n % 16384n)
  n /= 16384n
  const lonQ = Number(n % 36001n)
  n /= 36001n
  const latQ = Number(n % 18001n)
  n /= 18001n
  if (n !== 0n) return null

  return {
    lat: latQ / 100 - 90,
    lon: lonQ / 100 - 180,
    distanceKm: distQ,
    grade: GRADES[gradeQ] ?? 'MISS',
    countryId: decodeCountry(countryQ),
    points: decodePoints(pointsQ),
  }
}

/** ~8–12 char obfuscated code from hit data. */
export function encodeHit(hit: ShareHit): string {
  const pointsQ = clamp(hit.points + POINTS_OFFSET, 0, POINTS_MOD_V2 - 1)
  return V2 + toBase62(packHit(hit, pointsQ, POINTS_MOD_V2))
}

export function decodeHit(code: string): Omit<ShareHit, 'countryName'> | null {
  if (!code || code.length > 17) return null

  if (code.startsWith(V2)) {
    const n0 = fromBase62(code.slice(1))
    if (n0 !== null) {
      const hit = unpackHit(n0, POINTS_MOD_V2, (q) => q - POINTS_OFFSET)
      if (hit) return hit
    }
    // Fall through — rare legacy code that happened to start with V2
  }

  // Legacy unsigned 0..1000
  if (code.length > 16) return null
  const n0 = fromBase62(code)
  if (n0 === null) return null
  return unpackHit(n0, POINTS_MOD_V1, (q) => q)
}

/** Path segment under /nuke/ — hit share code or country challenge slug. */
export function parseSharePath(pathname = window.location.pathname): string | null {
  const m = pathname.match(/^\/nuke\/([0-9A-Za-z-]+)$/)
  return m?.[1] ?? null
}

export function shareUrl(code: string, origin = window.location.origin): string {
  return `${origin}/nuke/${code}`
}

export function tweetIntent(hit: ShareHit, url: string, text?: string): string {
  const body =
    text ??
    `BREAKING NEWS: NUCLEAR EXPLOSION at ${Math.round(hit.distanceKm).toLocaleString()} km from ${hit.countryName}\n\nSomeone aimed a nuke at ${hit.countryName}’s capital and missed.`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(body)}&url=${encodeURIComponent(url)}`
}
