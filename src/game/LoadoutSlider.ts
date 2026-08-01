import * as THREE from 'three'
import { copy } from '../i18n/copy'
import { createNukeModel, createPlaneModel } from './models'
import type { NukeLoadout, PlaneLoadout } from './loadouts'

type Kind = 'plane' | 'nuke'
type Item = PlaneLoadout | NukeLoadout

type Options = {
  root: HTMLElement
  kind: Kind
  items: Item[]
  initialIndex: number
  onChange: (index: number, item: Item) => void
  onInteract?: () => void
}

/**
 * Horizontal loadout slider with a live Three.js preview,
 * side arrows, swipe, and dot indicators.
 */
export class LoadoutSlider {
  private root: HTMLElement
  private kind: Kind
  private items: Item[]
  private index: number
  private onChange: Options['onChange']
  private onInteract?: () => void

  private canvas: HTMLCanvasElement
  private nameEl: HTMLElement
  private blurbEl: HTMLElement
  private badgeEl: HTMLElement

  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  private model: THREE.Object3D | null = null
  private prop: THREE.Object3D | null = null
  private spin = 0
  private running = true

  private swipeX = 0
  private swiping = false

  constructor(opts: Options) {
    this.root = opts.root
    this.kind = opts.kind
    this.items = opts.items
    this.index = opts.initialIndex
    this.onChange = opts.onChange
    this.onInteract = opts.onInteract

    this.root.innerHTML = `
      <div class="slider">
        <button type="button" class="slider-arrow" data-dir="-1" aria-label="Previous">‹</button>
        <div class="slider-stage">
          <canvas class="slider-canvas"></canvas>
          <div class="slider-meta">
            <div class="slider-badge" hidden></div>
            <div class="slider-name"></div>
            <div class="slider-blurb"></div>
          </div>
        </div>
        <button type="button" class="slider-arrow" data-dir="1" aria-label="Next">›</button>
      </div>
    `

    this.canvas = this.root.querySelector('.slider-canvas')!
    this.nameEl = this.root.querySelector('.slider-name')!
    this.blurbEl = this.root.querySelector('.slider-blurb')!
    this.badgeEl = this.root.querySelector('.slider-badge')!

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)

    this.scene.background = null
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.0))
    const key = new THREE.DirectionalLight(0xfff2d6, 1.35)
    key.position.set(4, 6, 8)
    this.scene.add(key)
    const fill = new THREE.DirectionalLight(0x6aa0b8, 0.55)
    fill.position.set(-5, -2, -4)
    this.scene.add(fill)

    this.camera.position.set(0, 1.6, 14)
    this.camera.lookAt(0, 0, 0)

    for (const btn of this.root.querySelectorAll<HTMLButtonElement>('.slider-arrow')) {
      btn.addEventListener('click', () => this.step(Number(btn.dataset.dir)))
    }

    this.bindSwipe()
    this.show(this.index, false)
    this.tick()

    const stage = this.root.querySelector('.slider-stage') as HTMLElement
    const ro = new ResizeObserver(() => this.resize())
    ro.observe(stage)
    requestAnimationFrame(() => this.resize())
    window.addEventListener('resize', () => this.resize())
  }

  get current(): Item {
    return this.items[this.index]!
  }

  get currentIndex(): number {
    return this.index
  }

  stop() {
    this.running = false
    this.renderer.dispose()
  }

  private step(delta: number) {
    const next = (this.index + delta + this.items.length) % this.items.length
    if (next === this.index) return
    this.onInteract?.()
    this.show(next, true)
  }

  private localized(id: string) {
    const c = copy()
    return this.kind === 'plane' ? c.planes[id] : c.nukes[id]
  }

  private show(index: number, notify: boolean) {
    this.index = index
    const item = this.items[index]!
    const localized = this.localized(item.id)
    this.nameEl.textContent = (localized?.name ?? item.name).toUpperCase()
    this.blurbEl.textContent = localized?.blurb ?? item.blurb
    const cursed = Boolean(item.cursed)
    this.badgeEl.hidden = !cursed
    this.badgeEl.textContent = cursed ? copy().loadoutCursed : ''
    this.root.classList.toggle('slider--cursed', cursed)

    if (this.model) {
      this.scene.remove(this.model)
      this.disposeObject(this.model)
    }

    this.model =
      this.kind === 'plane'
        ? createPlaneModel(item as PlaneLoadout)
        : createNukeModel(item as NukeLoadout)

    if (this.kind === 'nuke') {
      this.model.rotation.z = 0.35
      this.model.rotation.x = 0.15
      this.model.scale.multiplyScalar(1.35)
    } else {
      this.model.rotation.y = Math.PI * 0.15
      this.model.scale.multiplyScalar(0.72)
    }

    this.prop = this.model.getObjectByName('propeller') ?? null
    this.scene.add(this.model)
    this.spin = 0

    if (notify) this.onChange(index, item)
  }

  private bindSwipe() {
    const stage = this.root.querySelector('.slider-stage') as HTMLElement
    stage.addEventListener('pointerdown', (e) => {
      this.swiping = true
      this.swipeX = e.clientX
      stage.setPointerCapture(e.pointerId)
    })
    stage.addEventListener('pointerup', (e) => {
      if (!this.swiping) return
      this.swiping = false
      const dx = e.clientX - this.swipeX
      if (Math.abs(dx) > 40) this.step(dx < 0 ? 1 : -1)
    })
    stage.addEventListener('pointercancel', () => {
      this.swiping = false
    })
  }

  private resize() {
    const stage = this.root.querySelector('.slider-stage') as HTMLElement
    const w = Math.max(160, stage.clientWidth || 240)
    const h = 96
    this.canvas.style.width = '100%'
    this.canvas.style.height = `${h}px`
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private tick = () => {
    if (!this.running) return
    requestAnimationFrame(this.tick)
    this.spin += 0.012
    if (this.model) {
      if (this.kind === 'plane') {
        this.model.rotation.y = Math.PI * 0.15 + this.spin
        if (this.prop) this.prop.rotation.z += 0.35
      } else {
        this.model.rotation.y = this.spin * 0.8
      }
    }
    this.renderer.render(this.scene, this.camera)
  }

  private disposeObject(obj: THREE.Object3D) {
    obj.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) {
        mesh.geometry?.dispose()
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      }
    })
  }
}
