export type Locale = 'en' | 'es' | 'ru' | 'zh' | 'ja'

const SUPPORTED: Locale[] = ['en', 'es', 'ru', 'zh', 'ja']

function mapTag(tag: string): Locale | null {
  const t = tag.toLowerCase().replace('_', '-')
  if (t === 'en' || t.startsWith('en-')) return 'en'
  if (t === 'es' || t.startsWith('es-')) return 'es'
  if (t === 'ru' || t.startsWith('ru-')) return 'ru'
  if (t === 'zh' || t.startsWith('zh-') || t === 'zh-cn' || t === 'zh-hans') return 'zh'
  if (t === 'ja' || t.startsWith('ja-')) return 'ja'
  return null
}

function detect(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const candidates = [...(navigator.languages ?? []), navigator.language]
  for (const c of candidates) {
    if (!c) continue
    const hit = mapTag(c)
    if (hit) return hit
  }
  return 'en'
}

let locale: Locale = detect()

export function getLocale(): Locale {
  return locale
}

export function localeBcp47(): string {
  switch (locale) {
    case 'es':
      return 'es'
    case 'ru':
      return 'ru'
    case 'zh':
      return 'zh-CN'
    case 'ja':
      return 'ja'
    default:
      return 'en'
  }
}

/** Apply <html lang> + body class for font stacks. Call once at boot. */
export function applyDocumentLocale(): void {
  document.documentElement.lang = localeBcp47()
  document.documentElement.dataset.locale = locale
  for (const l of SUPPORTED) {
    document.documentElement.classList.toggle(`locale-${l}`, l === locale)
  }
}

export function formatNumber(n: number): string {
  try {
    return n.toLocaleString(localeBcp47())
  } catch {
    return String(n)
  }
}
