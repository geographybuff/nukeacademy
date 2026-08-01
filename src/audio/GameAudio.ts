const MUTE_KEY = 'nuke-academy-mute'

export type MusicMode = 'off' | 'menu' | 'flight' | 'cinematic' | 'result'

/**
 * Procedural music + SFX via Web Audio (no asset files).
 * Unlocks on first user gesture — call unlock() from any click/tap.
 */
export class GameAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicBus: GainNode | null = null
  private sfxBus: GainNode | null = null

  private muted = false
  /** Tab/window not visible — silence without changing user mute preference. */
  private pageHidden = typeof document !== 'undefined' ? document.hidden : false
  private unlocked = false
  private mode: MusicMode = 'off'

  private musicStop: (() => void) | null = null
  private engineStop: (() => void) | null = null
  private fallStop: (() => void) | null = null
  private engineGain: GainNode | null = null
  private fallGain: GainNode | null = null
  private fallFilter: BiquadFilterNode | null = null
  private fallOsc: OscillatorNode | null = null
  private fallOsc2: OscillatorNode | null = null

  constructor() {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      this.muted = false
    }
    document.addEventListener('visibilitychange', () => {
      void this.onVisibilityChange()
    })
  }

  get isMuted() {
    return this.muted
  }

  get isUnlocked() {
    return this.unlocked
  }

  private get silent() {
    return this.muted || this.pageHidden
  }

  private async onVisibilityChange() {
    this.pageHidden = document.hidden
    this.applyMuteGains()
    if (!this.ctx) return
    if (this.pageHidden) {
      try {
        await this.ctx.suspend()
      } catch {
        /* ignore */
      }
      return
    }
    if (this.unlocked && !this.muted) {
      try {
        await this.ctx.resume()
      } catch {
        /* ignore */
      }
      if (this.mode !== 'off' && !this.musicStop) this.startMusic(this.mode)
    }
  }

  /** Resume AudioContext after a user gesture. Safe to call repeatedly. */
  async unlock() {
    if (!this.ctx) this.createGraph()
    if (!this.ctx) return
    if (this.pageHidden) {
      this.unlocked = true
      this.applyMuteGains()
      return
    }
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume()
      } catch {
        return
      }
    }
    this.unlocked = this.ctx.state === 'running'
    this.applyMuteGains()
    if (this.unlocked && this.mode !== 'off' && !this.musicStop) {
      this.startMusic(this.mode)
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted
    try {
      localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0')
    } catch {
      /* ignore */
    }
    this.applyMuteGains()
    if (!this.muted) void this.unlock()
    return this.muted
  }

  setMode(mode: MusicMode) {
    const changed = this.mode !== mode
    this.mode = mode
    if (!this.unlocked || this.silent || !this.ctx) return
    if (changed || !this.musicStop) this.startMusic(mode)
  }

  /** Soft engine bed while flying; intensity 0–1 from throttle. */
  setEngine(active: boolean, intensity = 0.35) {
    if (!this.ctx || !this.sfxBus || this.silent || !this.unlocked) {
      if (!active) this.stopEngine()
      return
    }
    if (!active) {
      this.stopEngine()
      return
    }
    if (!this.engineStop) this.startEngine()
    if (this.engineGain) {
      const g = 0.02 + intensity * 0.045
      this.engineGain.gain.setTargetAtTime(g, this.ctx.currentTime, 0.08)
    }
  }

  /** Dive whistle while nuke is falling; progress 0–1 raises pitch + urgency. */
  setFall(active: boolean, progress = 0) {
    if (!this.ctx || !this.sfxBus || this.silent || !this.unlocked) {
      if (!active) this.stopFall()
      return
    }
    if (!active) {
      this.stopFall()
      return
    }
    if (!this.fallStop) this.startFall()
    const t = this.ctx.currentTime
    const p = Math.min(1, Math.max(0, progress))
    if (this.fallFilter) {
      this.fallFilter.frequency.setTargetAtTime(380 + p * 1400, t, 0.04)
    }
    if (this.fallOsc) {
      this.fallOsc.frequency.setTargetAtTime(320 + p * 980, t, 0.05)
    }
    if (this.fallOsc2) {
      this.fallOsc2.frequency.setTargetAtTime(480 + p * 1320, t, 0.05)
    }
    if (this.fallGain) {
      this.fallGain.gain.setTargetAtTime(0.022 + p * 0.07, t, 0.05)
    }
  }

  ui() {
    this.blip(660, 0.045, 0.07, 'triangle')
  }

  takeoff() {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(90, t)
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.55)
    f.type = 'lowpass'
    f.frequency.setValueAtTime(400, t)
    f.frequency.exponentialRampToValueAtTime(1800, t + 0.5)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.08)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7)
    osc.connect(f)
    f.connect(g)
    g.connect(this.sfxBus!)
    osc.start(t)
    osc.stop(t + 0.75)
  }

  /** Bay release — sharp CLAC of the nuke disengaging, then a short whoosh. */
  drop() {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t = ctx.currentTime

    // Sharp mechanical CLAC (latch / shackle release)
    this.noiseBurst(t, 0.018, 0.16, 4500, 'highpass')
    this.noiseBurst(t, 0.04, 0.1, 1800)
    const clac = ctx.createOscillator()
    const clacG = ctx.createGain()
    clac.type = 'square'
    clac.frequency.setValueAtTime(1800, t)
    clac.frequency.exponentialRampToValueAtTime(220, t + 0.05)
    clacG.gain.setValueAtTime(0.0001, t)
    clacG.gain.exponentialRampToValueAtTime(0.09, t + 0.002)
    clacG.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    clac.connect(clacG)
    clacG.connect(this.sfxBus!)
    clac.start(t)
    clac.stop(t + 0.08)

    // Soft metal ring after the snap
    const ring = ctx.createOscillator()
    const ringG = ctx.createGain()
    ring.type = 'triangle'
    ring.frequency.setValueAtTime(740, t + 0.012)
    ring.frequency.exponentialRampToValueAtTime(310, t + 0.18)
    ringG.gain.setValueAtTime(0.0001, t + 0.012)
    ringG.gain.exponentialRampToValueAtTime(0.045, t + 0.02)
    ringG.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
    ring.connect(ringG)
    ringG.connect(this.sfxBus!)
    ring.start(t + 0.012)
    ring.stop(t + 0.25)

    // Body whoosh as it clears the bay
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(480, t + 0.04)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.5)
    f.type = 'lowpass'
    f.frequency.value = 1100
    g.gain.setValueAtTime(0.0001, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.08)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
    osc.connect(f)
    f.connect(g)
    g.connect(this.sfxBus!)
    osc.start(t + 0.04)
    osc.stop(t + 0.6)
  }

  /**
   * Boom by hit quality. Crowd reacts after the blast:
   * countryHit → applause; fail → big OOOOOOH (plus sad trombone).
   */
  impact(quality = 0.6, opts: { countryHit?: boolean } = {}) {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const q = Math.min(1, Math.max(0, quality))
    const fail = q < 0.28
    const countryHit = Boolean(opts.countryHit) && !fail

    if (fail) {
      // Thin splash / dud crack, then crowd groan
      this.noiseBurst(t, 0.22, 0.09, 900)
      this.noiseBurst(t + 0.04, 0.18, 0.05, 500)
      const notes = [311, 277, 247, 208]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sawtooth'
        const start = t + i * 0.16
        osc.frequency.setValueAtTime(freq, start)
        osc.frequency.linearRampToValueAtTime(freq * 0.92, start + 0.2)
        g.gain.setValueAtTime(0.0001, start)
        g.gain.exponentialRampToValueAtTime(0.055, start + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.28)
        const f = ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = 900
        osc.connect(f)
        f.connect(g)
        g.connect(this.sfxBus!)
        osc.start(start)
        osc.stop(start + 0.32)
      })
      this.crowdOh(t + 0.12)
      return
    }

    // Closer = deeper sub; farther = thinner crack
    const subStart = 42 + q * 28
    const subEnd = 22 + q * 12
    const subGain = 0.18 + q * 0.22
    const sub = ctx.createOscillator()
    const subG = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(subStart, t)
    sub.frequency.exponentialRampToValueAtTime(subEnd, t + 1.2)
    subG.gain.setValueAtTime(0.0001, t)
    subG.gain.exponentialRampToValueAtTime(subGain, t + 0.02)
    subG.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    sub.connect(subG)
    subG.connect(this.sfxBus!)
    sub.start(t)
    sub.stop(t + 1.5)

    this.noiseBurst(t, 0.25 + q * 0.15, 0.12 + q * 0.12, 1400 + q * 1200)
    this.noiseBurst(t + 0.05, 0.4, 0.06 + q * 0.05, 500 + q * 200)

    const sting = ctx.createOscillator()
    const stingG = ctx.createGain()
    sting.type = 'triangle'
    sting.frequency.setValueAtTime(120 + q * 100, t)
    sting.frequency.exponentialRampToValueAtTime(50 + q * 40, t + 0.4)
    stingG.gain.setValueAtTime(0.0001, t)
    stingG.gain.exponentialRampToValueAtTime(0.06 + q * 0.08, t + 0.01)
    stingG.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
    sting.connect(stingG)
    stingG.connect(this.sfxBus!)
    sting.start(t)
    sting.stop(t + 0.55)

    if (countryHit) this.applause(t + 0.35)
  }

  /** Stadium clap bed after landing on the target country. */
  applause(when?: number) {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t0 = when ?? ctx.currentTime
    const bursts = 14
    for (let i = 0; i < bursts; i++) {
      const jitter = Math.random() * 0.045
      const start = t0 + i * 0.055 + jitter
      const gain = 0.035 + Math.random() * 0.04
      const cutoff = 2200 + Math.random() * 2800
      this.noiseBurst(start, 0.035 + Math.random() * 0.025, gain, cutoff, 'bandpass')
    }
    // Soft cheer swell under the claps
    const cheer = ctx.createOscillator()
    const cheerG = ctx.createGain()
    const cheerF = ctx.createBiquadFilter()
    cheer.type = 'sawtooth'
    cheer.frequency.setValueAtTime(220, t0)
    cheer.frequency.linearRampToValueAtTime(280, t0 + 0.9)
    cheerF.type = 'bandpass'
    cheerF.frequency.value = 900
    cheerF.Q.value = 1.2
    cheerG.gain.setValueAtTime(0.0001, t0)
    cheerG.gain.exponentialRampToValueAtTime(0.028, t0 + 0.12)
    cheerG.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1)
    cheer.connect(cheerF)
    cheerF.connect(cheerG)
    cheerG.connect(this.sfxBus!)
    cheer.start(t0)
    cheer.stop(t0 + 1.15)
  }

  /** Big crowd OOOOOOH on a miss / ocean flop. */
  crowdOh(when?: number) {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t0 = when ?? ctx.currentTime
    // Layered formant-ish "ooooh" — rises then sinks in shame
    const voices = [
      { f0: 280, f1: 340, g: 0.07 },
      { f0: 360, f1: 420, g: 0.055 },
      { f0: 190, f1: 230, g: 0.05 },
    ]
    for (const v of voices) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      const f = ctx.createBiquadFilter()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(v.f0, t0)
      osc.frequency.linearRampToValueAtTime(v.f1, t0 + 0.35)
      osc.frequency.exponentialRampToValueAtTime(v.f0 * 0.72, t0 + 1.35)
      f.type = 'bandpass'
      f.frequency.setValueAtTime(650, t0)
      f.frequency.linearRampToValueAtTime(820, t0 + 0.4)
      f.frequency.exponentialRampToValueAtTime(480, t0 + 1.3)
      f.Q.value = 3.5
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(v.g, t0 + 0.08)
      g.gain.setValueAtTime(v.g * 0.9, t0 + 0.55)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.45)
      osc.connect(f)
      f.connect(g)
      g.connect(this.sfxBus!)
      osc.start(t0)
      osc.stop(t0 + 1.5)
    }
    // Airy crowd noise bed
    this.noiseBurst(t0, 1.2, 0.045, 1600, 'bandpass')
  }

  reveal() {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const notes = [392, 494, 587]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = t + i * 0.09
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(0.07, start + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.55)
      osc.connect(g)
      g.connect(this.sfxBus!)
      osc.start(start)
      osc.stop(start + 0.6)
    })
  }

  result() {
    this.blip(523.25, 0.08, 0.09, 'sine')
    window.setTimeout(() => this.blip(659.25, 0.12, 0.08, 'sine'), 90)
  }

  private ready() {
    return Boolean(this.ctx && this.sfxBus && this.unlocked && !this.silent)
  }

  private createGraph() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const master = ctx.createGain()
    const musicBus = ctx.createGain()
    const sfxBus = ctx.createGain()
    musicBus.gain.value = 0.55
    sfxBus.gain.value = 0.85
    master.gain.value = this.silent ? 0 : 1
    musicBus.connect(master)
    sfxBus.connect(master)
    master.connect(ctx.destination)
    this.ctx = ctx
    this.master = master
    this.musicBus = musicBus
    this.sfxBus = sfxBus
  }

  private applyMuteGains() {
    if (!this.master || !this.ctx) return
    const target = this.silent ? 0 : 1
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03)
    if (this.silent) {
      this.stopEngine()
      this.stopFall()
    }
  }

  private blip(freq: number, dur: number, gain: number, type: OscillatorType) {
    if (!this.ready()) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g)
    g.connect(this.sfxBus!)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  private noiseBurst(
    when: number,
    dur: number,
    gain: number,
    cutoff: number,
    filter: BiquadFilterType = 'lowpass',
  ) {
    if (!this.ctx || !this.sfxBus) return
    const ctx = this.ctx
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const f = ctx.createBiquadFilter()
    f.type = filter
    f.frequency.value = cutoff
    if (filter === 'bandpass' || filter === 'highpass') f.Q.value = 1.8
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(gain, when + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    src.connect(f)
    f.connect(g)
    g.connect(this.sfxBus)
    src.start(when)
    src.stop(when + dur + 0.02)
  }

  private startMusic(mode: MusicMode) {
    this.stopMusic()
    if (mode === 'off' || !this.ctx || !this.musicBus) return

    const ctx = this.ctx
    const bus = this.musicBus
    const mix = ctx.createGain()
    mix.gain.value = 0.0001
    mix.connect(bus)

    const stops: Array<() => void> = []
    mix.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.8)

    if (mode === 'menu' || mode === 'result') {
      stops.push(...this.spawnPad(mix, mode === 'result' ? 0.7 : 1))
      stops.push(...this.spawnArp(mix, mode === 'menu' ? 1 : 0.65))
    } else if (mode === 'flight') {
      stops.push(...this.spawnPad(mix, 0.85))
      stops.push(...this.spawnPulse(mix))
    } else if (mode === 'cinematic') {
      stops.push(...this.spawnPad(mix, 0.55))
      stops.push(...this.spawnTension(mix))
    }

    this.musicStop = () => {
      const t = ctx.currentTime
      try {
        mix.gain.cancelScheduledValues(t)
        mix.gain.setTargetAtTime(0.0001, t, 0.12)
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        for (const s of stops) s()
        try {
          mix.disconnect()
        } catch {
          /* ignore */
        }
      }, 400)
      this.musicStop = null
    }
  }

  private stopMusic() {
    if (this.musicStop) this.musicStop()
  }

  /** Warm orbital drone + soft fifth. */
  private spawnPad(dest: AudioNode, level: number): Array<() => void> {
    const ctx = this.ctx!
    const stops: Array<() => void> = []
    const tones = [
      { f: 110, type: 'sine' as const, g: 0.045 * level },
      { f: 164.81, type: 'sine' as const, g: 0.028 * level },
      { f: 220, type: 'triangle' as const, g: 0.016 * level },
    ]

    for (const tone of tones) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      const f = ctx.createBiquadFilter()
      osc.type = tone.type
      osc.frequency.value = tone.f
      f.type = 'lowpass'
      f.frequency.value = 640
      g.gain.value = tone.g
      // Slow tremolo
      const lfo = ctx.createOscillator()
      const lfoG = ctx.createGain()
      lfo.frequency.value = 0.07 + Math.random() * 0.04
      lfoG.gain.value = tone.g * 0.35
      lfo.connect(lfoG)
      lfoG.connect(g.gain)
      osc.connect(f)
      f.connect(g)
      g.connect(dest)
      osc.start()
      lfo.start()
      stops.push(() => {
        try {
          osc.stop()
          lfo.stop()
          osc.disconnect()
          lfo.disconnect()
          g.disconnect()
          f.disconnect()
        } catch {
          /* ignore */
        }
      })
    }
    return stops
  }

  /** Sparse pentatonic plucks — menu ambience. */
  private spawnArp(dest: AudioNode, level: number): Array<() => void> {
    const ctx = this.ctx!
    const scale = [220, 246.94, 277.18, 329.63, 369.99, 440]
    let step = 0
    let alive = true

    const tick = () => {
      if (!alive || !this.ctx) return
      const freq = scale[step % scale.length]!
      step += step % 5 === 2 ? 2 : 1
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      const f = ctx.createBiquadFilter()
      osc.type = 'sine'
      osc.frequency.value = freq
      f.type = 'lowpass'
      f.frequency.value = 1400
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.035 * level, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
      osc.connect(f)
      f.connect(g)
      g.connect(dest)
      osc.start(t)
      osc.stop(t + 1.5)
      window.setTimeout(tick, 1400 + (step % 3) * 400)
    }
    window.setTimeout(tick, 600)

    return [
      () => {
        alive = false
      },
    ]
  }

  /** Soft flight pulse under the pad. */
  private spawnPulse(dest: AudioNode): Array<() => void> {
    const ctx = this.ctx!
    let alive = true
    const beat = () => {
      if (!alive || !this.ctx) return
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 55
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      osc.connect(g)
      g.connect(dest)
      osc.start(t)
      osc.stop(t + 0.4)
      window.setTimeout(beat, 2000)
    }
    window.setTimeout(beat, 400)
    return [
      () => {
        alive = false
      },
    ]
  }

  /** Low tense swell for the drop / blast. */
  private spawnTension(dest: AudioNode): Array<() => void> {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    osc.type = 'sawtooth'
    osc.frequency.value = 48
    f.type = 'lowpass'
    f.frequency.value = 180
    g.gain.value = 0.04
    const lfo = ctx.createOscillator()
    const lfoG = ctx.createGain()
    lfo.frequency.value = 0.35
    lfoG.gain.value = 0.02
    lfo.connect(lfoG)
    lfoG.connect(g.gain)
    osc.connect(f)
    f.connect(g)
    g.connect(dest)
    osc.start()
    lfo.start()
    return [
      () => {
        try {
          osc.stop()
          lfo.stop()
          osc.disconnect()
          lfo.disconnect()
          g.disconnect()
          f.disconnect()
        } catch {
          /* ignore */
        }
      },
    ]
  }

  private startEngine() {
    if (!this.ctx || !this.sfxBus) return
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    osc.type = 'sawtooth'
    osc2.type = 'triangle'
    osc.frequency.value = 72
    osc2.frequency.value = 74.5
    f.type = 'lowpass'
    f.frequency.value = 320
    g.gain.value = 0.03
    osc.connect(f)
    osc2.connect(f)
    f.connect(g)
    g.connect(this.sfxBus)
    osc.start()
    osc2.start()
    this.engineGain = g
    this.engineStop = () => {
      try {
        osc.stop()
        osc2.stop()
        osc.disconnect()
        osc2.disconnect()
        g.disconnect()
        f.disconnect()
      } catch {
        /* ignore */
      }
      this.engineGain = null
      this.engineStop = null
    }
  }

  private stopEngine() {
    if (this.engineStop) this.engineStop()
  }

  private startFall() {
    if (!this.ctx || !this.sfxBus) return
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    osc.type = 'sine'
    osc2.type = 'triangle'
    osc.frequency.value = 320
    osc2.frequency.value = 480
    f.type = 'bandpass'
    f.frequency.value = 500
    f.Q.value = 8
    g.gain.value = 0.0001
    osc.connect(f)
    osc2.connect(f)
    f.connect(g)
    g.connect(this.sfxBus)
    osc.start()
    osc2.start()
    g.gain.setTargetAtTime(0.022, ctx.currentTime, 0.08)
    this.fallGain = g
    this.fallFilter = f
    this.fallOsc = osc
    this.fallOsc2 = osc2
    this.fallStop = () => {
      try {
        osc.stop()
        osc2.stop()
        osc.disconnect()
        osc2.disconnect()
        g.disconnect()
        f.disconnect()
      } catch {
        /* ignore */
      }
      this.fallGain = null
      this.fallFilter = null
      this.fallOsc = null
      this.fallOsc2 = null
      this.fallStop = null
    }
  }

  private stopFall() {
    if (this.fallStop) this.fallStop()
  }
}
