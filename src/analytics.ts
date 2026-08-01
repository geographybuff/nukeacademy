declare global {
  interface Window {
    dataLayer: IArguments[]
    gtag: (...args: unknown[]) => void
  }
}

/** GA4 ID — also inlined in index.html for the install checker / early load. */
const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() || 'G-J92NNN2KW1'

/**
 * Ensure gtag is queued. Prefer the index.html snippet; this is a fallback
 * if the HTML snippet was stripped / cached stale.
 */
export function bootAnalytics() {
  if (typeof window.gtag === 'function' && Array.isArray(window.dataLayer) && window.dataLayer.length > 0) {
    return
  }
  if (!MEASUREMENT_ID || !/^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID)) return

  window.dataLayer = window.dataLayer || []
  // Must push `arguments` — an array breaks the gtag queue.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: true,
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
  })

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    document.head.appendChild(script)
  }
}

/** Optional custom events. No-op if GA isn't loaded. */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
