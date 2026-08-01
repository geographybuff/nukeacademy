/** Wild, dumb, official-looking nonsense. Locale-aware getters for UI copy. */

import { copy } from './i18n/copy'

export const BRAND = {
  name: 'NUKE ACADEMY',
  ticker: 'NUKES',
  site: 'https://nuke.academy',
  xHandle: '@nukeacademy',
  get motto() {
    return copy().motto
  },
  get accreditation() {
    return copy().accreditation
  },
  get tagline() {
    return copy().tagline
  },
  get metaDescription() {
    return copy().metaDescription
  },
  get ogDescription() {
    return copy().ogDescription
  },
  get loadoutKicker() {
    return copy().loadoutKicker
  },
  get loadoutTitle() {
    return copy().loadoutTitle
  },
  get loadoutPlaneLabel() {
    return copy().loadoutPlaneLabel
  },
  get loadoutNukeLabel() {
    return copy().loadoutNukeLabel
  },
  get loadoutControls() {
    return copy().loadoutControls
  },
  get shareSuffix() {
    return copy().shareSuffix
  },
}

/** Set in Vercel / .env: VITE_NUKE_CA, VITE_DEX_URL, VITE_X_URL, VITE_GA_MEASUREMENT_ID */
export function tokenLinks() {
  const ca = (import.meta.env.VITE_NUKE_CA as string | undefined)?.trim() ?? ''
  const dex =
    (import.meta.env.VITE_DEX_URL as string | undefined)?.trim() ||
    (ca ? `https://dexscreener.com/solana/${ca}` : 'https://dexscreener.com/')
  const x =
    (import.meta.env.VITE_X_URL as string | undefined)?.trim() || 'https://x.com/nukeacademy'
  return { ca, dex, x }
}
