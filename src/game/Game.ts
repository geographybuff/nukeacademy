import * as THREE from 'three'
import { Airplane } from './airplane'
import { Nuke, GROUND_POV_UNTIL } from './nuke'
import { World } from './world'
import { pickDailyCountry, pickRandomCountry, scoreDrop, type Country } from './countries'
import { EARTH_RADIUS, enuFrame, latLonToVector3 } from './geo'
import { classifyImpact, type ImpactTerrain } from './cities'
import { ImpactVignette } from './ImpactVignette'
import { estimateCasualties, formatCasualties } from './casualties'
import { buildHitClause, targetHudParts } from './geoLore'
import { NUKES, PLANES, type NukeLoadout, type PlaneLoadout } from './loadouts'
import { LoadoutSlider } from './LoadoutSlider'
import { HeroPreview } from './HeroPreview'
import {
  decodeHit,
  encodeHit,
  parseSharePath,
  shareUrl,
  tweetIntent,
  type ShareHit,
} from '../share/codec'
import { countryChallengeUrl, countryIdFromSlug, countrySlug } from '../share/countryNames'
import { GameAudio } from '../audio/GameAudio'
import { BRAND, tokenLinks } from '../brand'
import { copy, gradeLabel, t } from '../i18n/copy'
import { formatNumber } from '../i18n/locale'
import {
  introKicker,
  introTagline,
  loadoutSub,
  reportKicker,
  roastLine,
  shareJoke,
} from './jokes'
import {
  BRIEFING_CORRECT_PTS,
  BRIEFING_EVERY,
  BRIEFING_WRONG_PTS,
  pickBriefingQuestion,
  shuffleBriefingChoices,
  type BriefingQuestion,
} from './briefings'

type Phase = 'loading' | 'intro' | 'title' | 'flying' | 'cinematic' | 'result' | 'briefing'

export class Game {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(55, 1, 0.1, 900)
  private timer = new THREE.Timer()

  private world = new World()
  private plane = new Airplane()
  private nuke = new Nuke()
  private vignette = new ImpactVignette()

  private phase: Phase = 'loading'
  private target: Country | null = null
  private totalScore = 0
  private examsCompleted = 0
  private usedBriefings = new Set<string>()
  private pendingNextTarget: Country | null = null
  private briefingAnswer: string | null = null
  private briefingAboutNext = true
  private canDrop = true
  private revealHold = 0
  private lastTerrain: ImpactTerrain | null = null
  private lastLanded: Country | null = null

  private selectedPlane: PlaneLoadout = PLANES[0]!
  private selectedNuke: NukeLoadout = NUKES[1]!
  private planeSlider: LoadoutSlider | null = null
  private nukeSlider: LoadoutSlider | null = null
  private heroPreview: HeroPreview | null = null

  private keys = {
    forward: false,
    back: false,
    left: false,
    right: false,
  }

  private touch = {
    active: false,
    id: -1,
    startX: 0,
    startY: 0,
  }

  private cinematic = { t: 0 }
  private camPos = new THREE.Vector3(0, 40, 120)
  private camLook = new THREE.Vector3()
  /** After surface POV — snap once into orbital mushroom cam, then ease. */
  private orbitCamSnap = false
  private sun!: THREE.DirectionalLight
  private fillLight!: THREE.DirectionalLight
  private exposurePunch = 0
  private fovPunch = 0
  private baseFov = 55
  private rangeRevealed = false
  private pendingImpact: {
    distanceKm: number
    points: number
    grade: string
  } | null = null
  private shareHit: ShareHit | null = null
  private shareCode: string | null = null
  private viewingShared = false
  private dailyCapital: Country | null = null
  /** Opened via /nuke/{country-slug} — show assigned exam on intro. */
  private assignedChallenge = false
  /** Where to return after closing the country challenge picker. */
  private challengePickerFrom: 'intro' | 'result' = 'intro'
  private toastTimer = 0
  /** Beat a shared transcript — same capital, their km to crush. */
  private challenge: {
    countryId: string
    countryName: string
    distanceKm: number
    grade: string
    points: number
  } | null = null
  private audio = new GameAudio()
  private shake = { t: 0, amp: 0 }

  private els: {
    targetName: HTMLElement
    targetPop: HTMLElement
    targetLabel: HTMLElement
    scoreValue: HTMLElement
    overlay: HTMLElement
    overlayKicker: HTMLElement
    overlayTitle: HTMLElement
    overlayDetail: HTMLElement
    overlayRoast: HTMLElement
    casualtiesLabel: HTMLElement
    casualtiesValue: HTMLElement
    overlayVs: HTMLElement
    overlayPoints: HTMLElement
    bullseyeStamp: HTMLElement
    dailyExam: HTMLElement
    dailyCapitalName: HTMLElement
    dailyCapitalPop: HTMLElement
    introScreen: HTMLElement
    loadoutScreen: HTMLElement
    introNukeBtn: HTMLButtonElement
    hud: HTMLElement
    startBtn: HTMLButtonElement
    planeSelect: HTMLElement
    nukeSelect: HTMLElement
    rangeLabel: HTMLElement
    rangeKm: HTMLElement
    rangeCap: HTMLElement
    canvas: HTMLCanvasElement
    shareXBtn: HTMLButtonElement
    challengeBtn: HTMLButtonElement
    introChallengeBtn: HTMLButtonElement
    challengeScreen: HTMLElement
    challengeSearch: HTMLInputElement
    challengeList: HTMLElement
    challengeBackBtn: HTMLButtonElement
    toast: HTMLElement
    retryBtn: HTMLButtonElement
    playBtn: HTMLButtonElement
    enrollBtn: HTMLButtonElement
    mobileDropBtn: HTMLButtonElement
    skipBtn: HTMLButtonElement
    briefingScreen: HTMLElement
    briefingSubject: HTMLElement
    briefingPrompt: HTMLElement
    briefingChoices: HTMLElement
    briefingFeedback: HTMLElement
    briefingContinue: HTMLButtonElement
  }

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1

    this.els = {
      targetName: document.getElementById('target-name')!,
      targetPop: document.getElementById('target-pop')!,
      targetLabel: document.getElementById('target-label')!,
      scoreValue: document.getElementById('score-value')!,
      overlay: document.getElementById('overlay')!,
      overlayKicker: document.getElementById('overlay-kicker')!,
      overlayTitle: document.getElementById('overlay-title')!,
      overlayDetail: document.getElementById('overlay-detail')!,
      overlayRoast: document.getElementById('overlay-roast')!,
      casualtiesLabel: document.getElementById('casualties-label')!,
      casualtiesValue: document.getElementById('casualties-value')!,
      overlayVs: document.getElementById('overlay-vs')!,
      overlayPoints: document.getElementById('overlay-points')!,
      bullseyeStamp: document.getElementById('bullseye-stamp')!,
      dailyExam: document.getElementById('daily-exam')!,
      dailyCapitalName: document.getElementById('daily-capital-name')!,
      dailyCapitalPop: document.getElementById('daily-capital-pop')!,
      introScreen: document.getElementById('intro-screen')!,
      loadoutScreen: document.getElementById('loadout-screen')!,
      introNukeBtn: document.getElementById('intro-nuke-btn') as HTMLButtonElement,
      hud: document.getElementById('hud')!,
      startBtn: document.getElementById('start-btn') as HTMLButtonElement,
      planeSelect: document.getElementById('plane-select')!,
      nukeSelect: document.getElementById('nuke-select')!,
      rangeLabel: document.getElementById('range-label')!,
      rangeKm: document.getElementById('range-km')!,
      rangeCap: document.getElementById('range-cap')!,
      canvas,
      shareXBtn: document.getElementById('share-x-btn') as HTMLButtonElement,
      challengeBtn: document.getElementById('challenge-btn') as HTMLButtonElement,
      introChallengeBtn: document.getElementById('intro-challenge-btn') as HTMLButtonElement,
      challengeScreen: document.getElementById('challenge-screen')!,
      challengeSearch: document.getElementById('challenge-search') as HTMLInputElement,
      challengeList: document.getElementById('challenge-list')!,
      challengeBackBtn: document.getElementById('challenge-back-btn') as HTMLButtonElement,
      toast: document.getElementById('toast')!,
      retryBtn: document.getElementById('retry-btn') as HTMLButtonElement,
      playBtn: document.getElementById('play-btn') as HTMLButtonElement,
      enrollBtn: document.getElementById('enroll-btn') as HTMLButtonElement,
      mobileDropBtn: document.getElementById('mobile-drop-btn') as HTMLButtonElement,
      skipBtn: document.getElementById('skip-cinematic') as HTMLButtonElement,
      briefingScreen: document.getElementById('briefing-screen')!,
      briefingSubject: document.getElementById('briefing-subject')!,
      briefingPrompt: document.getElementById('briefing-prompt')!,
      briefingChoices: document.getElementById('briefing-choices')!,
      briefingFeedback: document.getElementById('briefing-feedback')!,
      briefingContinue: document.getElementById('briefing-continue') as HTMLButtonElement,
    }

    this.els.introNukeBtn.disabled = true
    this.els.introNukeBtn.textContent = copy().loading
    this.els.startBtn.disabled = true
    this.els.hud.style.opacity = '0'

    this.heroPreview = new HeroPreview(
      document.getElementById('intro-plane') as HTMLCanvasElement,
      this.selectedPlane,
    )

    this.setupScene()
    this.bindInput()
    this.bindUi()
    this.bindBrand()
    this.resize()
    window.addEventListener('resize', () => this.resize())

    void this.init()
    this.tick()
  }

  private bindBrand() {
    const { dex, x } = tokenLinks()
    const linkX = document.getElementById('link-x') as HTMLAnchorElement | null
    const linkDex = document.getElementById('link-dex') as HTMLAnchorElement | null
    const introKickerEl = document.getElementById('intro-kicker')
    const introSub = document.getElementById('intro-sub')
    const loadoutSubEl = document.querySelector('.loadout-sub')

    if (introKickerEl) introKickerEl.textContent = introKicker()
    if (introSub) introSub.textContent = introTagline()
    if (loadoutSubEl) loadoutSubEl.textContent = loadoutSub()

    if (linkX) linkX.href = x
    if (linkDex) {
      linkDex.href = dex
      linkDex.setAttribute('aria-label', t(copy().onDex, { ticker: BRAND.ticker }))
      linkDex.title = t(copy().onDex, { ticker: BRAND.ticker })
    }
  }

  private refreshMenuCopy() {
    const introKickerEl = document.getElementById('intro-kicker')
    const introSub = document.getElementById('intro-sub')
    const loadoutSubEl = document.querySelector('.loadout-sub')
    if (introKickerEl) introKickerEl.textContent = introKicker()
    if (introSub) introSub.textContent = introTagline()
    if (loadoutSubEl) loadoutSubEl.textContent = loadoutSub()
  }

  private buildLoadoutUi() {
    if (this.planeSlider) return

    const tickUi = () => this.audio.ui()

    this.planeSlider = new LoadoutSlider({
      root: this.els.planeSelect,
      kind: 'plane',
      items: PLANES,
      initialIndex: Math.max(0, PLANES.findIndex((p) => p.id === this.selectedPlane.id)),
      onChange: (_i, item) => {
        this.selectedPlane = item as PlaneLoadout
        this.plane.applyLoadout(this.selectedPlane)
      },
      onInteract: tickUi,
    })

    this.nukeSlider = new LoadoutSlider({
      root: this.els.nukeSelect,
      kind: 'nuke',
      items: NUKES,
      initialIndex: Math.max(0, NUKES.findIndex((n) => n.id === this.selectedNuke.id)),
      onChange: (_i, item) => {
        this.selectedNuke = item as NukeLoadout
        this.nuke.applyLoadout(this.selectedNuke)
      },
      onInteract: tickUi,
    })
  }

  private async init() {
    await this.world.load()

    this.dailyCapital = pickDailyCountry(this.world.targets)
    this.refreshDailyExamUi()

    const code = parseSharePath()
    if (code) {
      // Country slugs first — words like "argentina" falsely decode as hit codes.
      if (this.openCountryChallenge(code)) return
      const opened = this.openSharedHit(code)
      if (opened) return
    }

    this.challenge = null
    this.assignedChallenge = false
    this.setTarget(this.dailyCapital, copy().target)
    this.phase = 'intro'
    this.els.introNukeBtn.disabled = false
    this.els.introNukeBtn.textContent = copy().nukeIt
    this.audio.setMode('menu')
  }

  private refreshDailyExamUi() {
    const exam = this.target ?? this.dailyCapital
    const dailyLabel = this.els.dailyExam.querySelector('.label')
    if (dailyLabel) {
      dailyLabel.textContent = this.assignedChallenge
        ? copy().assignedExam
        : copy().todaysExam
    }
    if (!exam) {
      this.els.dailyCapitalName.textContent = '—'
      this.els.dailyCapitalPop.textContent = ''
      return
    }
    const { place, pop } = targetHudParts(exam)
    this.els.dailyCapitalName.textContent = place.toUpperCase()
    this.els.dailyCapitalPop.textContent = pop ? pop.toUpperCase() : ''
    this.els.dailyExam.classList.remove('hidden')
  }

  /** Deep link /nuke/{country-slug} — assign that capital as the exam. */
  private openCountryChallenge(slug: string): boolean {
    const id = countryIdFromSlug(slug)
    if (!id) return false

    const country =
      this.world.targets.find((c) => c.id === id) ??
      this.world.countries.find((c) => c.id === id)
    if (!country) return false

    this.assignedChallenge = true
    this.challenge = null
    this.shareHit = null
    this.shareCode = null
    this.viewingShared = false
    this.dailyCapital = country
    this.setTarget(country, copy().target)
    this.refreshDailyExamUi()
    this.phase = 'intro'
    this.els.introNukeBtn.disabled = false
    this.els.introNukeBtn.textContent = copy().nukeIt
    this.audio.setMode('menu')
    document.title = `${country.name} | NUKE ACADEMY`
    return true
  }

  private openSharedHit(code: string): boolean {
    const decoded = decodeHit(code)
    if (!decoded) return false

    const country =
      this.world.targets.find((c) => c.id === decoded.countryId) ??
      this.world.countries.find((c) => c.id === decoded.countryId)
    if (!country) return false

    this.shareHit = { ...decoded, countryName: country.name }
    this.shareCode = code
    this.viewingShared = true
    this.target = country
    this.setTarget(country)
    this.pendingImpact = {
      distanceKm: decoded.distanceKm,
      points: decoded.points,
      grade: decoded.grade,
    }
    this.rangeRevealed = false
    this.totalScore = decoded.points
    this.els.scoreValue.textContent = String(decoded.points)

    this.heroPreview?.stop()
    this.heroPreview = null
    this.els.introScreen.classList.add('hidden')
    this.els.loadoutScreen.classList.add('hidden')
    this.els.challengeScreen.classList.add('hidden')
    this.els.overlay.classList.add('hidden')
    this.els.rangeLabel.classList.add('hidden')
    this.els.shareXBtn.classList.add('hidden')
    this.hideResultActions()
    this.els.overlayVs.classList.add('hidden')
    this.els.hud.style.opacity = '1'
    this.plane.group.visible = false
    this.setMobileDropVisible(false)
    this.world.clearImpactRange()

    // Replay the dive + blast, then reveal the shared report
    this.nuke.applyLoadout(this.selectedNuke)
    this.nuke.replayDrop(decoded.lat, decoded.lon)
    this.phase = 'cinematic'
    this.cinematic.t = 0
    this.audio.setMode('cinematic')
    this.audio.drop()

    const km = Math.round(decoded.distanceKm)
    document.title = `${gradeLabel(decoded.grade)} · ${formatNumber(km)} km | NUKE ACADEMY`
    return true
  }

  private openLoadout() {
    if (this.phase !== 'intro') return
    void this.audio.unlock()
    this.audio.ui()
    this.audio.setMode('menu')
    this.heroPreview?.stop()
    this.heroPreview = null
    this.els.introScreen.classList.add('hidden')
    this.els.loadoutScreen.classList.remove('hidden')
    const loadoutSubEl = document.querySelector('.loadout-sub')
    if (loadoutSubEl) loadoutSubEl.textContent = loadoutSub()
    this.buildLoadoutUi()
    this.els.startBtn.disabled = false
    this.els.startBtn.textContent = copy().takeOff
    this.phase = 'title'
  }

  private setupScene() {
    this.scene.background = new THREE.Color(0x050e14)
    this.scene.fog = new THREE.FogExp2(0x061218, 0.0016)

    const starCount = 2200
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 260 + Math.random() * 280
      const v = new THREE.Vector3().randomDirection().multiplyScalar(r)
      starPos[i * 3] = v.x
      starPos[i * 3 + 1] = v.y
      starPos[i * 3 + 2] = v.z
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    this.scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0xe0f2f5,
          size: 0.7,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
        }),
      ),
    )
    // Brighter near stars for depth
    const nearCount = 180
    const nearPos = new Float32Array(nearCount * 3)
    for (let i = 0; i < nearCount; i++) {
      const r = 120 + Math.random() * 80
      const v = new THREE.Vector3().randomDirection().multiplyScalar(r)
      nearPos[i * 3] = v.x
      nearPos[i * 3 + 1] = v.y
      nearPos[i * 3 + 2] = v.z
    }
    this.scene.add(
      new THREE.Points(
        new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(nearPos, 3)),
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1.1,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    )

    this.scene.add(new THREE.AmbientLight(0x8ab8c4, 0.55))
    this.scene.add(new THREE.HemisphereLight(0xd4eef4, 0x122830, 0.55))

    this.sun = new THREE.DirectionalLight(0xfff0d8, 1.75)
    this.sun.position.set(120, 90, 40)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.bias = -0.0004
    this.sun.shadow.normalBias = 0.02
    this.sun.shadow.camera.near = 10
    this.sun.shadow.camera.far = 280
    this.sun.shadow.camera.left = -70
    this.sun.shadow.camera.right = 70
    this.sun.shadow.camera.top = 70
    this.sun.shadow.camera.bottom = -70
    this.scene.add(this.sun)
    this.scene.add(this.sun.target)

    this.fillLight = new THREE.DirectionalLight(0x5a90a8, 0.65)
    this.fillLight.position.set(-90, -20, -70)
    this.scene.add(this.fillLight)

    const rim = new THREE.DirectionalLight(0xffb080, 0.35)
    rim.position.set(-40, 30, 100)
    this.scene.add(rim)

    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMappingExposure = 1.15

    this.scene.add(this.world.group)
    this.plane.group.visible = false
    this.scene.add(this.plane.group)
    this.scene.add(this.nuke.group)
    this.scene.add(this.vignette.group)
  }

  private bindInput() {
    const setKey = (code: string, down: boolean) => {
      if (code === 'KeyW' || code === 'ArrowUp') this.keys.forward = down
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.back = down
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = down
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = down
    }

    window.addEventListener('keydown', (e) => {
      setKey(e.code, true)
      if (e.code === 'Space') {
        e.preventDefault()
        this.tryDrop()
      }
      if (e.code === 'KeyR' && (this.phase === 'result' || this.phase === 'flying')) {
        this.nextRound()
      }
      if (e.code === 'Enter' && this.phase === 'briefing') {
        if (!this.els.briefingContinue.classList.contains('hidden')) this.finishBriefing()
      }
    })
    window.addEventListener('keyup', (e) => setKey(e.code, false))

    this.bindTouchFlight()
  }

  /** Drag / swipe to steer — drop is Space (desktop) or NUKE IT button (mobile) only. */
  private bindTouchFlight() {
    const canvas = this.els.canvas
    const dead = 28

    const clearSteer = () => {
      this.keys.forward = false
      this.keys.back = false
      this.keys.left = false
      this.keys.right = false
    }

    const applySteer = (x: number, y: number) => {
      const dx = x - this.touch.startX
      const dy = y - this.touch.startY
      this.keys.left = dx < -dead
      this.keys.right = dx > dead
      this.keys.forward = dy < -dead
      this.keys.back = dy > dead
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (this.phase !== 'flying') return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      this.touch.active = true
      this.touch.id = e.pointerId
      this.touch.startX = e.clientX
      this.touch.startY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    })

    canvas.addEventListener('pointermove', (e) => {
      if (!this.touch.active || e.pointerId !== this.touch.id) return
      if (this.phase !== 'flying') return
      e.preventDefault()
      applySteer(e.clientX, e.clientY)
    })

    const endTouch = (e: PointerEvent) => {
      if (!this.touch.active || e.pointerId !== this.touch.id) return
      this.touch.active = false
      this.touch.id = -1
      clearSteer()
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* already released */
      }
    }

    canvas.addEventListener('pointerup', endTouch)
    canvas.addEventListener('pointercancel', endTouch)
    canvas.addEventListener('lostpointercapture', () => {
      if (!this.touch.active) return
      this.touch.active = false
      this.touch.id = -1
      clearSteer()
    })
  }

  private bindUi() {
    this.els.introNukeBtn.addEventListener('click', () => this.openLoadout())
    this.els.startBtn.addEventListener('click', () => this.start())
    this.els.retryBtn.addEventListener('click', () => this.nextRound())
    this.els.playBtn.addEventListener('click', () => this.beatThis())
    this.els.enrollBtn.addEventListener('click', () => this.enrollFresh())
    this.els.shareXBtn.addEventListener('click', () => {
      void this.audio.unlock()
      this.audio.ui()
      this.shareOnX()
    })
    this.els.challengeBtn.addEventListener('click', () => {
      void this.audio.unlock()
      this.audio.ui()
      this.openChallengePicker('result')
    })
    this.els.introChallengeBtn.addEventListener('click', () => {
      void this.audio.unlock()
      this.audio.ui()
      this.openChallengePicker('intro')
    })
    this.els.challengeBackBtn.addEventListener('click', () => {
      void this.audio.unlock()
      this.audio.ui()
      this.closeChallengePicker()
    })
    this.els.challengeSearch.addEventListener('input', () => {
      this.renderChallengeList(this.els.challengeSearch.value)
    })
    this.els.mobileDropBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.tryDrop()
    })
    this.els.skipBtn.addEventListener('click', () => this.skipCinematic())
    this.els.briefingContinue.addEventListener('click', () => this.finishBriefing())
  }

  private setMobileDropVisible(visible: boolean) {
    this.els.mobileDropBtn.classList.toggle('hidden', !visible)
    this.els.mobileDropBtn.disabled = !this.canDrop
  }

  private shareOnX() {
    if (!this.shareHit || !this.shareCode) return
    const url = shareUrl(this.shareCode)
    const joke = shareJoke(this.shareHit.grade, this.shareHit.distanceKm, this.shareHit.countryName)
    window.open(tweetIntent(this.shareHit, url, joke), '_blank', 'noopener,noreferrer')
  }

  /** Country picker — pick Denmark, share /nuke/denmark, etc. */
  private openChallengePicker(from: 'intro' | 'result') {
    this.challengePickerFrom = from
    this.els.introScreen.classList.add('hidden')
    this.els.overlay.classList.add('hidden')
    this.els.challengeSearch.value = ''
    this.renderChallengeList('')
    this.els.challengeScreen.classList.remove('hidden')
    // Defer focus so the panel is visible first (esp. mobile).
    window.setTimeout(() => this.els.challengeSearch.focus(), 40)
  }

  private closeChallengePicker() {
    this.els.challengeScreen.classList.add('hidden')
    if (this.challengePickerFrom === 'result') {
      this.els.overlay.classList.remove('hidden')
    } else {
      this.els.introScreen.classList.remove('hidden')
    }
  }

  private renderChallengeList(filter: string) {
    const q = filter.trim().toLowerCase()
    const countries = [...this.world.targets]
      .filter((c) => countrySlug(c.id))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      .filter((c) => {
        if (!q) return true
        const slug = countrySlug(c.id) ?? ''
        return c.name.toLowerCase().includes(q) || slug.includes(q)
      })

    this.els.challengeList.replaceChildren()
    for (const country of countries) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = country.name.toUpperCase()
      btn.addEventListener('click', () => {
        void this.audio.unlock()
        this.audio.ui()
        void this.shareCountryChallenge(country, btn)
      })
      this.els.challengeList.appendChild(btn)
    }
  }

  /** Native share sheet only on phones — desktop gets clipboard + toast. */
  private prefersNativeShare(): boolean {
    if (typeof navigator.share !== 'function') return false
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return true
    try {
      return window.matchMedia('(hover: none) and (pointer: coarse)').matches
    } catch {
      return false
    }
  }

  private showToast(message: string) {
    const el = this.els.toast
    el.textContent = message
    el.classList.remove('hidden')
    window.clearTimeout(this.toastTimer)
    this.toastTimer = window.setTimeout(() => {
      el.classList.add('hidden')
    }, 1800)
  }

  /** Share a direct /nuke/{country} challenge link. */
  private async shareCountryChallenge(country: Country, btn?: HTMLButtonElement) {
    const url = countryChallengeUrl(country.id, window.location.origin)
    if (!url) return

    const c = copy()
    const text = t(c.challengeShare, { place: country.name })

    if (this.prefersNativeShare()) {
      try {
        await navigator.share({ title: 'NUKE ACADEMY', text, url })
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      this.showToast(c.linkCopied)
      if (btn) {
        const label = btn.textContent
        btn.textContent = c.copied
        btn.classList.add('copied')
        window.setTimeout(() => {
          btn.textContent = label
          btn.classList.remove('copied')
        }, 1400)
      }
    } catch {
      window.prompt(c.copyCaPrompt, url)
    }
  }

  /** Same capital as the shared transcript — try to crush their km. */
  private beatThis() {
    if (!this.shareHit || !this.target) return
    void this.audio.unlock()
    this.audio.ui()
    this.challenge = {
      countryId: this.shareHit.countryId,
      countryName: this.shareHit.countryName,
      distanceKm: this.shareHit.distanceKm,
      grade: this.shareHit.grade,
      points: this.shareHit.points,
    }
    history.replaceState({}, '', '/')
    document.title = 'NUKE ACADEMY'
    this.viewingShared = false
    this.shareHit = null
    this.shareCode = null
    this.pendingImpact = null
    this.rangeRevealed = false
    this.clearExamUi()
    this.world.clearImpactRange()
    this.nuke.reset()
    this.els.overlay.classList.add('hidden')
    this.els.rangeLabel.classList.add('hidden')
    this.hideResultActions()
    this.els.overlayVs.classList.add('hidden')
    this.els.hud.style.opacity = '0'
    this.setTarget(this.target, copy().rival)
    this.els.loadoutScreen.classList.remove('hidden')
    this.buildLoadoutUi()
    this.els.startBtn.disabled = false
    this.els.startBtn.textContent = copy().takeOff
    this.phase = 'title'
    this.audio.setMode('menu')
  }

  /** Fresh enrollment — today's exam on the intro. */
  private enrollFresh() {
    void this.audio.unlock()
    this.audio.ui()
    history.replaceState({}, '', '/')
    document.title = 'NUKE ACADEMY'
    this.viewingShared = false
    this.assignedChallenge = false
    this.challenge = null
    this.shareHit = null
    this.shareCode = null
    this.pendingImpact = null
    this.rangeRevealed = false
    this.clearExamUi()
    this.totalScore = 0
    this.examsCompleted = 0
    this.usedBriefings.clear()
    this.pendingNextTarget = null
    this.briefingAnswer = null
    this.els.scoreValue.textContent = '0'
    this.world.clearImpactRange()
    this.world.clearScars()
    this.nuke.reset()
    this.els.overlay.classList.add('hidden')
    this.els.briefingScreen.classList.add('hidden')
    this.els.rangeLabel.classList.add('hidden')
    this.hideResultActions()
    this.els.overlayVs.classList.add('hidden')
    this.els.hud.style.opacity = '0'
    this.plane.group.visible = false
    this.setMobileDropVisible(false)

    this.dailyCapital = pickDailyCountry(this.world.targets)
    this.setTarget(this.dailyCapital, copy().target)
    this.refreshDailyExamUi()
    this.els.loadoutScreen.classList.add('hidden')
    this.els.challengeScreen.classList.add('hidden')
    this.els.introScreen.classList.remove('hidden')
    this.heroPreview?.stop()
    this.heroPreview = new HeroPreview(
      document.getElementById('intro-plane') as HTMLCanvasElement,
      this.selectedPlane,
    )
    this.els.introNukeBtn.disabled = false
    this.els.introNukeBtn.textContent = copy().nukeIt
    this.phase = 'intro'
    this.refreshMenuCopy()
    this.audio.setMode('menu')
  }

  private hideResultActions() {
    this.els.playBtn.classList.add('hidden')
    this.els.enrollBtn.classList.add('hidden')
    this.els.retryBtn.classList.add('hidden')
    this.els.challengeBtn.classList.add('hidden')
    this.els.shareXBtn.classList.add('hidden')
  }

  private start() {
    if (this.phase !== 'title' || !this.target) return
    void this.audio.unlock()
    this.audio.ui()
    this.audio.takeoff()
    this.plane.applyLoadout(this.selectedPlane)
    this.nuke.applyLoadout(this.selectedNuke)
    this.planeSlider?.stop()
    this.nukeSlider?.stop()
    this.planeSlider = null
    this.nukeSlider = null
    this.els.loadoutScreen.classList.add('hidden')
    this.els.hud.style.opacity = '1'
    this.phase = 'flying'
    this.canDrop = true
    this.nuke.reset()
    this.plane.closeBay()
    this.els.overlay.classList.add('hidden')
    this.spawnAwayFromTarget()
    this.plane.group.visible = true
    this.setMobileDropVisible(true)
    this.audio.setMode('flight')
  }

  private setTarget(country: Country, label = copy().target) {
    this.target = country
    const { place, pop } = targetHudParts(country)
    this.els.targetName.textContent = place.toUpperCase()
    this.els.targetPop.textContent = pop ? pop.toUpperCase() : ''
    this.els.targetLabel.textContent = label
  }

  private tryDrop() {
    if (this.phase !== 'flying' || !this.canDrop) return
    this.canDrop = false
    this.keys.forward = false
    this.keys.back = false
    this.keys.left = false
    this.keys.right = false
    void this.audio.unlock()
    this.audio.setEngine(false)
    this.audio.drop()
    this.plane.openBay()
    this.nuke.drop(this.plane.dropPoint(), this.plane.forward())
    this.phase = 'cinematic'
    this.cinematic.t = 0
    this.revealHold = 0
    this.fovPunch = 8
    this.setMobileDropVisible(false)
    this.setSkipVisible(false)
    this.audio.setMode('cinematic')
  }

  private clearExamUi() {
    this.vignette.dismiss()
    this.world.group.visible = true
    this.orbitCamSnap = false
    this.setSkipVisible(false)
    this.revealHold = 0
    this.lastTerrain = null
    this.lastLanded = null
  }

  private nextRound() {
    if (!this.target || this.world.targets.length === 0) return
    if (this.viewingShared) {
      this.enrollFresh()
      return
    }
    void this.audio.unlock()
    this.audio.ui()
    this.audio.setFall(false)
    this.nuke.reset()
    this.world.clearImpactRange()
    this.els.rangeLabel.classList.add('hidden')
    this.els.overlay.classList.add('hidden')
    this.hideResultActions()
    this.els.overlayVs.classList.add('hidden')
    this.clearExamUi()
    this.rangeRevealed = false
    this.pendingImpact = null
    this.shareHit = null
    this.shareCode = null
    this.challenge = null
    history.replaceState({}, '', '/')
    document.title = 'NUKE ACADEMY'

    this.examsCompleted++
    const previous = this.target
    const next = pickRandomCountry(this.world.targets, previous.id)

    if (this.examsCompleted % BRIEFING_EVERY === 0) {
      // Quiz on the upcoming target — every country has generated (or handmade) intel.
      const picked = pickBriefingQuestion(next, this.world.targets, this.usedBriefings)
      if (picked) {
        this.pendingNextTarget = next
        this.briefingAboutNext = true
        this.openBriefing(next.id, picked.question, picked.key)
        return
      }
    }

    this.beginNextExam(next)
  }

  private openBriefing(countryId: string, question: BriefingQuestion, key: string) {
    const country =
      this.world.targets.find((c) => c.id === countryId) ??
      this.world.countries.find((c) => c.id === countryId)
    const place = (country?.name ?? countryId).toUpperCase()
    const c = copy()
    const { choices, answer } = shuffleBriefingChoices(question)

    this.usedBriefings.add(key)
    this.briefingAnswer = answer
    this.phase = 'briefing'
    this.setMobileDropVisible(false)
    this.els.hud.style.opacity = '1'
    this.els.targetName.textContent = '—'
    this.els.targetPop.textContent = ''

    this.els.briefingSubject.textContent = t(
      this.briefingAboutNext ? c.briefingAboutNext : c.briefingAboutPrev,
      { place },
    )
    this.els.briefingPrompt.textContent = question.prompt
    this.els.briefingFeedback.classList.add('hidden')
    this.els.briefingFeedback.textContent = ''
    this.els.briefingContinue.classList.add('hidden')
    this.els.briefingChoices.classList.remove('answered')
    this.els.briefingChoices.replaceChildren()

    for (const choice of choices) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = choice
      btn.addEventListener('click', () => this.answerBriefing(choice, btn))
      this.els.briefingChoices.append(btn)
    }

    this.els.briefingScreen.classList.remove('hidden')
    this.audio.setMode('menu')
  }

  private answerBriefing(choice: string, clicked: HTMLButtonElement) {
    if (this.phase !== 'briefing' || !this.briefingAnswer) return
    const answer = this.briefingAnswer
    const correct = choice === answer
    const delta = correct ? BRIEFING_CORRECT_PTS : BRIEFING_WRONG_PTS
    this.totalScore += delta
    this.els.scoreValue.textContent = String(this.totalScore)
    this.audio.ui()

    const buttons = [...this.els.briefingChoices.querySelectorAll('button')]
    for (const btn of buttons) {
      btn.disabled = true
      const text = btn.textContent ?? ''
      if (text === answer) btn.classList.add('correct')
      else if (btn === clicked) btn.classList.add('wrong')
    }
    this.els.briefingChoices.classList.add('answered')

    const c = copy()
    this.els.briefingFeedback.textContent = correct
      ? t(c.briefingCorrect, { points: Math.abs(delta) })
      : t(c.briefingWrong, { points: delta, answer })
    this.els.briefingFeedback.classList.remove('hidden')
    this.els.briefingContinue.classList.remove('hidden')
    this.els.briefingContinue.textContent = c.briefingContinue
    this.briefingAnswer = null
  }

  private finishBriefing() {
    if (this.phase !== 'briefing') return
    void this.audio.unlock()
    this.audio.ui()
    this.els.briefingScreen.classList.add('hidden')
    const next = this.pendingNextTarget
    this.pendingNextTarget = null
    if (!next) return
    this.beginNextExam(next)
  }

  private beginNextExam(next: Country) {
    this.setTarget(next, copy().target)
    this.phase = 'flying'
    this.canDrop = true
    this.plane.closeBay()
    this.plane.group.visible = true
    this.spawnAwayFromTarget()
    this.setMobileDropVisible(true)
    this.els.hud.style.opacity = '1'
    this.audio.setMode('flight')
  }

  /** Put the plane a real great-circle distance from the target capital. */
  private spawnAwayFromTarget() {
    if (!this.target) return

    const sepDeg = 60 + Math.random() * 70 // 60–130° away
    const sep = THREE.MathUtils.degToRad(sepDeg)
    const outbound = Math.random() * Math.PI * 2

    const φ1 = THREE.MathUtils.degToRad(this.target.lat)
    const λ1 = THREE.MathUtils.degToRad(this.target.lon)
    const φ2 = Math.asin(
      Math.sin(φ1) * Math.cos(sep) + Math.cos(φ1) * Math.sin(sep) * Math.cos(outbound),
    )
    const λ2 =
      λ1 +
      Math.atan2(
        Math.sin(outbound) * Math.sin(sep) * Math.cos(φ1),
        Math.cos(sep) - Math.sin(φ1) * Math.sin(φ2),
      )

    const lat = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(φ2), -65, 65)
    let lon = THREE.MathUtils.radToDeg(λ2)
    lon = ((((lon + 180) % 360) + 360) % 360) - 180

    // Aim generally toward the target, with some heading noise
    const toTarget = bearingTo(lat, lon, this.target.lat, this.target.lon)
    const facing = toTarget + (Math.random() - 0.5) * 1.1
    this.plane.place(lat, lon, facing)
  }

  private onImpact() {
    if (!this.target) return
    this.audio.setFall(false)
    this.revealHold = 0
    this.rangeRevealed = false
    this.setSkipVisible(true)

    const impactLat = this.viewingShared && this.shareHit ? this.shareHit.lat : this.nuke.impactLat
    const impactLon = this.viewingShared && this.shareHit ? this.shareHit.lon : this.nuke.impactLon
    this.lastLanded = this.world.countryAt(impactLat, impactLon)
    this.lastTerrain = classifyImpact(impactLat, impactLon, this.lastLanded?.id ?? null)
    // Permanent scar on the globe — accumulates across exams this session
    this.world.addImpactScar(impactLat, impactLon, this.lastTerrain.kind)
    // Hide the globe so the surface diorama isn't buried inside the sphere
    this.world.group.visible = false
    this.plane.group.visible = false
    this.vignette.play(impactLat, impactLon, this.lastTerrain)

    if (this.viewingShared && this.shareHit) {
      // Keep the encoded score — don't recompute / accumulate
      this.pendingImpact = {
        distanceKm: this.shareHit.distanceKm,
        points: this.shareHit.points,
        grade: this.shareHit.grade,
      }
      this.kickImpactJuice(
        this.shareHit.distanceKm,
        this.shareHit.points,
        this.lastLanded?.id === this.target.id,
      )
      return
    }
    const ocean = this.lastTerrain?.kind === 'ocean'
    const result = scoreDrop(this.nuke.impactLat, this.nuke.impactLon, this.target, { ocean })
    this.totalScore += result.points
    this.els.scoreValue.textContent = String(this.totalScore)
    this.pendingImpact = result
    this.kickImpactJuice(result.distanceKm, result.points, this.lastLanded?.id === this.target.id)
  }

  /** Shake + boom pitch from how badly you did. Crowd reacts on country hit / miss. */
  private kickImpactJuice(distanceKm: number, points: number, countryHit = false) {
    const quality = Math.min(1, Math.max(0, points / 1000))
    this.audio.impact(quality, { countryHit })
    const amp = 0.14 + quality * 0.65 + (distanceKm > 2500 || points < 0 ? 0.1 : 0)
    this.shake.amp = amp
    this.shake.t = 0.65 + quality * 0.3
    this.exposurePunch = 0.55 + quality * 0.45
    this.fovPunch = 6 + quality * 8
  }

  private maybeRevealRange() {
    if (this.rangeRevealed || !this.target || !this.pendingImpact) return
    if (!this.nuke.mushroomFormed) return
    // Finish the ground-level blast shot before the globe arc
    if (this.nuke.explodeAge < GROUND_POV_UNTIL) return

    this.vignette.dismiss()
    this.world.group.visible = true
    this.orbitCamSnap = true
    this.audio.reveal()
    const impactLat = this.viewingShared && this.shareHit ? this.shareHit.lat : this.nuke.impactLat
    const impactLon = this.viewingShared && this.shareHit ? this.shareHit.lon : this.nuke.impactLon
    this.world.showImpactRange(impactLat, impactLon, this.target.lat, this.target.lon)
    const km = Math.round(this.pendingImpact.distanceKm)
    const c = copy()
    this.els.rangeKm.textContent = `${formatNumber(km)} km`
    this.els.rangeCap.textContent = t(c.rangeCap, { place: this.target.name })
    this.els.rangeLabel.classList.remove('hidden')

    this.els.overlayKicker.textContent = reportKicker(this.viewingShared)
    this.els.overlayTitle.textContent = gradeLabel(this.pendingImpact.grade)
    this.els.overlayDetail.textContent = this.target.capitalName
      ? t(c.kmFromNamedCapital, {
          km: formatNumber(km),
          capital: this.target.capitalName,
          place: this.target.name,
        })
      : t(c.kmFromCapital, {
          km: formatNumber(km),
          place: this.target.name,
        })

    const landed = this.lastLanded ?? this.world.countryAt(impactLat, impactLon)
    const terrain =
      this.lastTerrain ?? classifyImpact(impactLat, impactLon, landed?.id ?? null)
    const hit = buildHitClause({ target: this.target, landed, terrain })
    const roast = roastLine(
      this.pendingImpact.grade,
      this.pendingImpact.distanceKm,
      this.target.name,
      {
        countryId: this.target.id,
        landedCountryId: landed?.id,
        landedCountryName: landed?.name,
      },
    )
    this.els.overlayRoast.textContent = `${hit} ${roast}`
    const casualties = estimateCasualties({
      lat: impactLat,
      lon: impactLon,
      blastScale: this.selectedNuke.blastScale,
      landed,
      terrain,
    })
    if (casualties <= 0) {
      this.els.casualtiesLabel.classList.add('hidden')
      this.els.casualtiesValue.textContent = copy().noCasualties
    } else {
      this.els.casualtiesLabel.classList.remove('hidden')
      this.els.casualtiesLabel.textContent = copy().estCasualties
      this.els.casualtiesValue.textContent = `${formatCasualties(casualties)} ${copy().people}`
    }
    const pts = this.pendingImpact.points
    this.els.overlayPoints.textContent = `${pts >= 0 ? '+' : ''}${pts} ${copy().points}`
    this.els.overlayPoints.classList.toggle('demerit', pts < 0)
    this.els.bullseyeStamp.classList.toggle('hidden', this.pendingImpact.grade !== 'BULLSEYE')
    this.fillVsLine(this.pendingImpact.distanceKm)

    if (!this.viewingShared) {
      this.shareHit = {
        lat: this.nuke.impactLat,
        lon: this.nuke.impactLon,
        distanceKm: this.pendingImpact.distanceKm,
        grade: this.pendingImpact.grade,
        countryId: this.target.id,
        countryName: this.target.name,
        points: this.pendingImpact.points,
      }
      this.shareCode = encodeHit(this.shareHit)
      history.replaceState({}, '', `/nuke/${this.shareCode}`)
    }
    document.title = `${gradeLabel(this.pendingImpact.grade)} · ${formatNumber(km)} km | NUKE ACADEMY`
    this.rangeRevealed = true
    this.revealHold = 0
  }

  private setSkipVisible(visible: boolean) {
    this.els.skipBtn.classList.toggle('hidden', !visible)
  }

  private revealHoldNeed(): number {
    // Brief beat on the orbital mushroom + arc before the report card.
    const coarse = window.matchMedia('(pointer: coarse)').matches
    return coarse ? 4.2 : 3.2
  }

  private skipCinematic() {
    if (this.phase !== 'cinematic') return
    void this.audio.unlock()
    this.audio.ui()
    this.vignette.dismiss()
    this.world.group.visible = true
    this.nuke.skipToReveal()
    this.maybeRevealRange()
    this.showResult()
  }

  private fillVsLine(yourKm: number) {
    if (this.viewingShared || !this.challenge) {
      this.els.overlayVs.classList.add('hidden')
      this.els.overlayVs.textContent = ''
      return
    }
    const theirs = Math.round(this.challenge.distanceKm)
    const yours = Math.round(yourKm)
    const rival = this.challenge.countryName
    const c = copy()
    const vars = {
      yours: formatNumber(yours),
      theirs: formatNumber(theirs),
      rival,
    }
    let line: string
    if (yours < theirs) {
      line = t(c.youWin, vars)
    } else if (yours > theirs) {
      line = t(c.theyWin, vars)
    } else {
      line = t(c.draw, vars)
    }
    this.els.overlayVs.textContent = line
    this.els.overlayVs.classList.remove('hidden')
  }

  private showResult() {
    if (this.phase === 'result') return
    this.phase = 'result'
    this.setSkipVisible(false)
    this.vignette.dismiss()
    this.world.group.visible = true
    // Keep arc visible a beat under the card; hide floating km so they don't stack
    this.els.rangeLabel.classList.add('hidden')
    this.hideResultActions()

    if (this.viewingShared) {
      this.els.playBtn.classList.remove('hidden')
      this.els.enrollBtn.classList.remove('hidden')
      this.els.challengeBtn.classList.toggle('hidden', !this.target)
    } else {
      this.els.retryBtn.classList.remove('hidden')
      this.els.challengeBtn.classList.toggle('hidden', !this.target)
      this.els.shareXBtn.classList.toggle('hidden', !this.shareCode)
    }

    this.els.overlay.classList.remove('hidden')
    const bull = this.pendingImpact?.grade === 'BULLSEYE'
    this.els.bullseyeStamp.classList.toggle('hidden', !bull)
    if (bull) {
      this.els.bullseyeStamp.classList.remove('pop')
      void this.els.bullseyeStamp.offsetWidth
      this.els.bullseyeStamp.classList.add('pop')
    }
    this.audio.result()
    this.audio.setMode('result')
  }

  private updateCamera(dt: number) {
    if (
      this.phase === 'cinematic' ||
      (this.phase === 'result' && (this.nuke.state !== 'idle' || this.viewingShared))
    ) {
      this.cinematic.t += dt
      const bomb = this.nuke.group.position
      const radial = bomb.clone().normalize()
      const { east, north } = enuFrame(bomb)

      if (this.nuke.state === 'falling') {
        // Follow the dive: wide establishing shot → tight chase as it shrinks
        const p = this.nuke.fallProgress
        const orbit = this.cinematic.t * 0.18
        const side = THREE.MathUtils.lerp(28, 7.5, easeCam(p))
        const height = THREE.MathUtils.lerp(15, 3.8, easeCam(p))
        const ahead = THREE.MathUtils.lerp(2.2, -1.4, p)

        const desired = bomb
          .clone()
          .addScaledVector(east, Math.sin(orbit) * side)
          .addScaledVector(north, Math.cos(orbit) * side * 0.7)
          .addScaledVector(radial, height)

        // Look past the bomb toward the impact zone on Earth
        const look = bomb
          .clone()
          .addScaledVector(radial, ahead)
          .addScaledVector(east, Math.sin(orbit + 0.4) * 1.8)

        // Springier chase — snappier late in the dive
        const blend = 1 - Math.exp(-dt * (1.6 + p * 1.8))
        this.camPos.lerp(desired, blend)
        this.camLook.lerp(look, 1 - Math.exp(-dt * 2.8))
        this.camera.up.copy(radial)
        this.camera.position.copy(this.camPos)
        this.camera.lookAt(this.camLook)

        // Tighten FOV as we dive
        const diveFov = THREE.MathUtils.lerp(58, 42, easeCam(p))
        if (Math.abs(this.camera.fov - diveFov) > 0.3) {
          this.camera.fov = diveFov
          this.camera.updateProjectionMatrix()
        }
        return
      }

      // Surface destruction diorama (globe hidden) — hard lock the camera
      if (
        this.nuke.state === 'exploding' &&
        this.vignette.isActive &&
        this.nuke.explodeAge < GROUND_POV_UNTIL
      ) {
        // Directed overlook: dolly + rise from vignette, follow stem bloom
        const eye = this.vignette.getEyeWorld()
        const look = this.vignette.getLookWorld().addScaledVector(
          bomb.clone().normalize(),
          0.2 + Math.min(1.4, this.nuke.explodeAge * 0.4),
        )
        this.camPos.copy(eye)
        this.camLook.copy(look)
        this.camera.up.copy(this.vignette.cameraUp)
        this.camera.position.copy(eye)
        this.camera.lookAt(look)
        const targetFov = 68 + this.vignette.fovBias
        if (Math.abs(this.camera.fov - targetFov) > 0.2) {
          this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 1 - Math.exp(-dt * 10))
          this.camera.updateProjectionMatrix()
        }
        const wind = this.vignette.shakeAmount()
        if (wind > 0.03) {
          // Handheld — stronger on the shock punch, then cascade rattle
          const kick = wind * wind
          this.camera.position.x += (Math.random() - 0.5) * kick * 0.14
          this.camera.position.y += (Math.random() - 0.5) * kick * 0.09
          this.camera.position.z += (Math.random() - 0.5) * kick * 0.14
          this.camera.rotation.z += (Math.random() - 0.5) * kick * 0.018
        }
        return
      }

      // Restore default FOV after overlook
      if (Math.abs(this.camera.fov - this.baseFov) > 0.5 && this.fovPunch < 0.5) {
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFov, 1 - Math.exp(-dt * 4))
        this.camera.updateProjectionMatrix()
      }

      // Orbital mushroom → ease out to miss-arc once the bloom finishes
      const capital = this.target
        ? latLonToVector3(this.target.lat, this.target.lon, EARTH_RADIUS)
        : bomb.clone()
      const impactDir = bomb.clone().normalize()
      const capitalDir = capital.clone().normalize()
      const mid = impactDir.clone().add(capitalDir).normalize()
      const sep = Math.acos(THREE.MathUtils.clamp(impactDir.dot(capitalDir), -1, 1))
      const arcPull = THREE.MathUtils.lerp(22, 48, Math.min(1, sep / 1.2))

      // Stay close while the cap is still rising; pull back after it's formed
      const bloomAge = Math.max(0, this.nuke.explodeAge - GROUND_POV_UNTIL)
      const toArc = easeCam(THREE.MathUtils.clamp((bloomAge - 1.1) / 1.4, 0, 1))
      const pullback = THREE.MathUtils.lerp(11, arcPull, toArc)
      const height = THREE.MathUtils.lerp(5.5, 8 + pullback * 0.35, toArc)
      const orbit = this.cinematic.t * 0.28
      const pivot = impactDir.clone().lerp(mid, toArc).normalize()
      const { east: me, north: mn } = enuFrame(pivot.clone().multiplyScalar(EARTH_RADIUS))
      const desired = pivot
        .clone()
        .multiplyScalar(EARTH_RADIUS + height)
        .addScaledVector(me, Math.sin(orbit) * pullback)
        .addScaledVector(mn, Math.cos(orbit) * pullback * THREE.MathUtils.lerp(0.55, 1, toArc))
      const look = impactDir
        .clone()
        .lerp(mid, toArc)
        .normalize()
        .multiplyScalar(EARTH_RADIUS + THREE.MathUtils.lerp(4.5, 3, toArc))

      if (this.orbitCamSnap) {
        this.camPos.copy(desired)
        this.camLook.copy(look)
        this.orbitCamSnap = false
      } else {
        // Snappier settle right after the ground cut, then ease
        const rate = THREE.MathUtils.lerp(7.5, 4.2, toArc)
        this.camPos.lerp(desired, 1 - Math.exp(-dt * rate))
        this.camLook.lerp(look, 1 - Math.exp(-dt * (rate + 0.5)))
      }
      this.camera.up.copy(pivot)
      this.camera.position.copy(this.camPos)
      this.camera.lookAt(this.camLook)
      return
    }

    // High chase cam: behind + well above the plane so Earth sits beneath
    const forward = this.plane.forward()
    const radial = this.plane.up() // away from Earth — stable "sky" direction
    const pivot = this.plane.group.position
    const right = new THREE.Vector3().crossVectors(forward, radial).normalize()

    // Bank-aware offset — camera leans into turns like a film chase
    const bank = this.plane.bank
    const speedNorm = this.plane.speed / (this.plane.orbitRadius > 0 ? 14 : 14)
    const chaseBack = THREE.MathUtils.lerp(-16, -20, THREE.MathUtils.clamp(speedNorm / 14, 0, 1))
    const desired = pivot
      .clone()
      .addScaledVector(forward, chaseBack)
      .addScaledVector(radial, 20 + Math.abs(bank) * 2.5)
      .addScaledVector(right, bank * 4.5)

    // Look past the plane toward Earth below, slightly into the turn
    const lookTarget = pivot
      .clone()
      .addScaledVector(forward, 9)
      .addScaledVector(radial, -13)
      .addScaledVector(right, bank * 3)

    const blend =
      this.phase === 'title' ||
      this.phase === 'intro' ||
      this.phase === 'loading' ||
      this.phase === 'briefing'
        ? 1 - Math.exp(-dt * 1.2)
        : 1 - Math.exp(-dt * 6.5)
    this.camPos.lerp(desired, blend)
    this.camLook.lerp(lookTarget, 1 - Math.exp(-dt * 7))

    // Critical: use radial up so lookAt never flips at the poles
    const camUp = radial.clone().addScaledVector(right, -bank * 0.35).normalize()
    this.camera.up.copy(camUp)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.camLook)

    if (this.phase === 'flying' && Math.abs(this.camera.fov - this.baseFov) > 0.4) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.baseFov, 1 - Math.exp(-dt * 3))
      this.camera.updateProjectionMatrix()
    }
  }

  private applyShake(dt: number) {
    // FOV punch decay (drop + impact)
    if (this.fovPunch > 0.05) {
      const target = this.baseFov + this.fovPunch
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, target, 1 - Math.exp(-dt * 14))
      this.camera.updateProjectionMatrix()
      this.fovPunch = Math.max(0, this.fovPunch - dt * 18)
    }

    // Exposure flash on detonation
    if (this.exposurePunch > 0.01) {
      this.renderer.toneMappingExposure = 1.15 + this.exposurePunch
      this.exposurePunch = Math.max(0, this.exposurePunch - dt * 1.8)
    } else if (this.renderer.toneMappingExposure !== 1.15) {
      this.renderer.toneMappingExposure = THREE.MathUtils.lerp(
        this.renderer.toneMappingExposure,
        1.15,
        1 - Math.exp(-dt * 3),
      )
    }

    if (this.shake.t <= 0) return
    this.shake.t = Math.max(0, this.shake.t - dt)
    const falloff = this.shake.t / 0.8
    const a = this.shake.amp * falloff * falloff
    this.camera.position.x += (Math.random() - 0.5) * a * 2.6
    this.camera.position.y += (Math.random() - 0.5) * a * 2.6
    this.camera.position.z += (Math.random() - 0.5) * a * 2.6
    this.camera.rotation.z += (Math.random() - 0.5) * a * 0.08
  }

  private updateRangeLabel() {
    const anchor = this.world.rangeLabelAnchor
    if (
      !anchor ||
      this.phase === 'result' ||
      this.phase === 'briefing' ||
      !this.els.overlay.classList.contains('hidden')
    ) {
      this.els.rangeLabel.classList.add('hidden')
      return
    }
    if (this.rangeRevealed) this.els.rangeLabel.classList.remove('hidden')

    const ndc = anchor.clone().project(this.camera)
    if (ndc.z > 1 || ndc.x < -1.35 || ndc.x > 1.35 || ndc.y < -1.35 || ndc.y > 1.35) {
      this.els.rangeLabel.style.opacity = '0'
      return
    }

    let x = (ndc.x * 0.5 + 0.5) * window.innerWidth
    let y = (-ndc.y * 0.5 + 0.5) * window.innerHeight

    // Keep the chip out of the dead-center where the report will land
    const cx = window.innerWidth * 0.5
    const cy = window.innerHeight * 0.5
    const dx = x - cx
    const dy = y - cy
    const minDist = Math.min(window.innerWidth, window.innerHeight) * 0.18
    const dist = Math.hypot(dx, dy)
    if (dist < minDist) {
      const push = minDist / Math.max(dist, 0.001)
      x = cx + dx * push
      y = cy + dy * push - 36
    }

    // Prefer sitting above the anchor so the capital pin stays readable
    y = Math.max(72, Math.min(window.innerHeight - 72, y - 28))
    x = Math.max(80, Math.min(window.innerWidth - 80, x))

    this.els.rangeLabel.style.opacity = '1'
    this.els.rangeLabel.style.left = `${x}px`
    this.els.rangeLabel.style.top = `${y}px`
  }

  private resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
  }

  private tick = (timestamp?: number) => {
    requestAnimationFrame(this.tick)
    this.timer.update(timestamp)
    const dt = Math.min(this.timer.getDelta(), 0.05)

    this.world.update(dt)

    if (this.phase === 'flying') {
      this.plane.update(dt, this.keys)
      const throttle = this.keys.forward ? 1 : this.keys.back ? 0.2 : 0.45
      this.audio.setEngine(true, throttle)
      this.audio.setFall(false)
    } else {
      this.audio.setEngine(false)
    }

    const impacted = this.nuke.update(dt)
    if (impacted) this.onImpact()
    if (this.phase === 'cinematic' && this.nuke.state === 'falling') {
      this.audio.setFall(true, this.nuke.fallProgress)
    } else if (this.nuke.state !== 'falling') {
      this.audio.setFall(false)
    }

    if (this.phase === 'cinematic') {
      this.vignette.update(dt)
      this.maybeRevealRange()

      if (this.rangeRevealed) {
        this.revealHold += dt
        if (this.revealHold >= this.revealHoldNeed()) this.showResult()
      } else if (this.nuke.state === 'done') {
        this.maybeRevealRange()
        this.showResult()
      }
    }

    this.updateCamera(dt)
    this.applyShake(dt)
    this.updateRangeLabel()

    // Keep key light fixed in world space relative to Earth, aimed at the action
    const focus =
      this.nuke.state === 'falling' || this.nuke.state === 'exploding'
        ? this.nuke.group.position
        : this.plane.group.visible
          ? this.plane.group.position
          : this.camLook
    this.sun.target.position.copy(focus)
    this.sun.target.updateMatrixWorld()
    // Soft orbit so shadows aren't locked to the camera
    const sunAng = this.timer.getElapsed() * 0.02
    this.sun.position.set(
      Math.cos(sunAng) * 140,
      95,
      Math.sin(sunAng) * 140,
    )

    this.renderer.render(this.scene, this.camera)
  }
}

function bearingTo(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = THREE.MathUtils.degToRad(lat1)
  const φ2 = THREE.MathUtils.degToRad(lat2)
  const Δλ = THREE.MathUtils.degToRad(lon2 - lon1)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return Math.atan2(y, x)
}

function easeCam(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) * (1 - x)
}

