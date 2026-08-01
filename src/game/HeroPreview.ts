import * as THREE from 'three'
import { createPlaneModel } from './models'
import { PLANES, type PlaneLoadout } from './loadouts'

/** Simple spinning plane preview for the intro popup. */
export class HeroPreview {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  private model: THREE.Object3D
  private prop: THREE.Object3D | null
  private spin = 0
  private running = true
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, loadout: PlaneLoadout = PLANES[0]!) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)

    this.scene.background = null
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.05))
    const key = new THREE.DirectionalLight(0xfff2d6, 1.4)
    key.position.set(4, 6, 8)
    this.scene.add(key)
    const fill = new THREE.DirectionalLight(0x6aa0b8, 0.55)
    fill.position.set(-5, -2, -4)
    this.scene.add(fill)

    this.model = createPlaneModel(loadout)
    this.model.rotation.y = Math.PI * 0.15
    this.model.scale.multiplyScalar(0.85)
    this.prop = this.model.getObjectByName('propeller') ?? null
    this.scene.add(this.model)

    this.camera.position.set(0, 2.2, 16)
    this.camera.lookAt(0, 0.2, 0)

    const ro = new ResizeObserver(() => this.resize())
    ro.observe(canvas.parentElement ?? canvas)
    requestAnimationFrame(() => this.resize())
    this.tick()
  }

  stop() {
    this.running = false
    this.renderer.dispose()
  }

  private resize() {
    const parent = this.canvas.parentElement
    const w = Math.max(200, parent?.clientWidth || this.canvas.clientWidth || 280)
    const h = Math.max(140, parent?.clientHeight || 168)
    this.canvas.style.width = '100%'
    this.canvas.style.height = `${h}px`
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private tick = () => {
    if (!this.running) return
    requestAnimationFrame(this.tick)
    this.spin += 0.01
    this.model.rotation.y = Math.PI * 0.12 + this.spin
    this.model.rotation.x = Math.sin(this.spin * 1.4) * 0.06
    if (this.prop) this.prop.rotation.z += 0.4
    this.renderer.render(this.scene, this.camera)
  }
}
