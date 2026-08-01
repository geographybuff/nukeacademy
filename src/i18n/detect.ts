import type { Locale } from './locale'

/** Server-side Accept-Language → locale (for middleware OG pages). */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return 'en'
  const parts = header.split(',').map((p) => {
    const [tag, ...rest] = p.trim().split(';')
    let q = 1
    for (const r of rest) {
      const m = r.trim().match(/^q=([0-9.]+)$/i)
      if (m) q = Number(m[1]) || 0
    }
    return { tag: (tag ?? '').toLowerCase(), q }
  })
  parts.sort((a, b) => b.q - a.q)
  for (const { tag } of parts) {
    if (tag === 'en' || tag.startsWith('en-')) return 'en'
    if (tag === 'es' || tag.startsWith('es-')) return 'es'
    if (tag === 'ru' || tag.startsWith('ru-')) return 'ru'
    if (tag === 'zh' || tag.startsWith('zh-')) return 'zh'
    if (tag === 'ja' || tag.startsWith('ja-')) return 'ja'
  }
  return 'en'
}
