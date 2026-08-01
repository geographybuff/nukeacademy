import { BRAND } from '../brand'
import { copy, t } from './copy'
import { applyDocumentLocale, getLocale, type Locale } from './locale'

export { copy, gradeLabel, t } from './copy'
export { applyDocumentLocale, formatNumber, getLocale, localeBcp47 } from './locale'
export type { Locale }

const FONT_HREF: Partial<Record<Locale, string>> = {
  ru: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap',
  zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700&display=swap',
  ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700&display=swap',
}

function loadLocaleFonts(locale: Locale) {
  const href = FONT_HREF[locale]
  if (!href) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

/** Stamp static DOM + meta from locale. No language selector. */
export function bootI18n() {
  applyDocumentLocale()
  const locale = getLocale()
  loadLocaleFonts(locale)
  const c = copy(locale)

  document.title = BRAND.name
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.setAttribute('content', c.metaDescription)
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', c.ogDescription)
  const twDesc = document.querySelector('meta[name="twitter:description"]')
  if (twDesc) twDesc.setAttribute('content', c.ogDescription)

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id)
    if (el) el.textContent = text
  }

  setText('target-label', c.target)
  setText('mute-btn', c.muteOn)
  document.getElementById('mute-btn')?.setAttribute('aria-label', c.muteAria)
  document.getElementById('mute-btn')?.setAttribute('title', c.soundOn)

  const scoreLabel = document.querySelector('#score-panel .label')
  if (scoreLabel) scoreLabel.textContent = c.score

  setText('hint', c.hint)
  setText('mobile-drop-btn', c.nukeIt)
  document.getElementById('mobile-drop-btn')?.setAttribute('aria-label', c.nukeIt)

  const rangeCap = document.getElementById('range-cap')
  if (rangeCap) rangeCap.textContent = c.toCapital

  setText('overlay-kicker', c.impact)
  setText('casualties-label', c.estCasualties)
  setText('bullseye-stamp', c.bullseyeStamp)
  setText('retry-btn', c.nextExam)
  setText('play-btn', c.beatThis)
  setText('enroll-btn', c.newExam)
  setText('challenge-btn', c.challengeFriend)
  setText('intro-challenge-btn', c.challengeFriend)
  setText('challenge-kicker', c.challengeFriend)
  setText('challenge-title', c.challengePickTitle)
  setText('challenge-sub', c.challengePickSub)
  setText('challenge-back-btn', c.challengeBack)
  const challengeSearch = document.getElementById('challenge-search') as HTMLInputElement | null
  if (challengeSearch) challengeSearch.placeholder = c.challengeSearch
  setText('share-x-btn', c.shareOnX)
  setText('skip-cinematic', c.skip)
  document.getElementById('skip-cinematic')?.setAttribute('aria-label', c.skipAria)

  setText('intro-kicker', c.accreditation)
  const introSub = document.getElementById('intro-sub')
  if (introSub) introSub.textContent = c.tagline

  const dailyLabel = document.querySelector('#daily-exam .label')
  if (dailyLabel) dailyLabel.textContent = c.todaysExam

  setText('intro-nuke-btn', c.loading)
  setText('link-dex', c.buyNukes)

  const loadoutKicker = document.querySelector('#loadout-screen .title-kicker')
  if (loadoutKicker) loadoutKicker.textContent = c.loadoutKicker
  const loadoutBrand = document.querySelector('#loadout-screen .loadout-brand')
  if (loadoutBrand) loadoutBrand.textContent = c.loadoutTitle
  const labels = document.querySelectorAll('#loadout-screen .loadout-label')
  if (labels[0]) labels[0].textContent = c.loadoutPlaneLabel
  if (labels[1]) labels[1].textContent = c.loadoutNukeLabel

  setText('start-btn', c.takeOff)
  const controls = document.querySelector('#loadout-screen .title-controls')
  if (controls) controls.textContent = c.loadoutControls

  setText('briefing-kicker', c.briefingKicker)
  setText('briefing-continue', c.briefingContinue)
}

export function fill(template: string, vars: Record<string, string | number>) {
  return t(template, vars)
}
