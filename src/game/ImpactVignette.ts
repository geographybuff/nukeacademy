import * as THREE from 'three'
import { EARTH_RADIUS, enuFrame, latLonToVector3 } from './geo'
import type { ImpactTerrain } from './cities'
import {
  makeBoat,
  makeBoulder,
  makeBuilding,
  makeCar,
  makeCottage,
  makeCraterBowl,
  makePeak,
  makeStreetlight,
  makeTree,
  std,
} from './dioramaProps'

/** Stage depth — city between lens and blast. */
const VIEW_DIST = 7.6
/** How high the overlook sits above the diorama floor. */
const EYE_HEIGHT = 3.15
/** Matches nuke surface detonation height (land shell). */
const BLAST_RADIUS = EARTH_RADIUS + 0.28
const MAX_BUILDING_H = 2.65
const CHUNK_POOL = 140
const DUST_WALL_COUNT = 5

type DestructKind =
  | 'building'
  | 'tree'
  | 'house'
  | 'wave'
  | 'buoy'
  | 'peak'
  | 'prop'
  | 'car'
  | 'pole'
  | 'boat'

type Destructable = {
  obj: THREE.Object3D
  kind: DestructKind
  ox: number
  oy: number
  oz: number
  nx: number
  nz: number
  dist: number
  seed: number
  mass: number
  shattered: boolean
  baseYaw: number
}

type Chunk = {
  mesh: THREE.Mesh
  vx: number
  vy: number
  vz: number
  spinX: number
  spinY: number
  spinZ: number
  life: number
  active: boolean
}

type SmokePillar = {
  mesh: THREE.Mesh
  delay: number
  grow: number
}

/**
 * Directed surface-destruction cinema.
 * Built as a lit diorama; the globe is hidden while this plays.
 */
export class ImpactVignette {
  readonly group = new THREE.Group()
  readonly observerPos = new THREE.Vector3()
  readonly lookTarget = new THREE.Vector3()
  readonly cameraUp = new THREE.Vector3(0, 1, 0)
  readonly lookAim = new THREE.Vector3()

  /** Local-space camera dolly / rise driven each frame for Game.ts. */
  readonly camEyeLocal = new THREE.Vector3()
  readonly camLookLocal = new THREE.Vector3()
  fovBias = 0

  private root = new THREE.Group()
  private age = 0
  private active = false
  private dust: THREE.Points | null = null
  private dustVel: Float32Array | null = null
  private embers: THREE.Points | null = null
  private emberVel: Float32Array | null = null
  private glass: THREE.Points | null = null
  private glassVel: Float32Array | null = null
  private debris: THREE.Points | null = null
  private debrisVel: Float32Array | null = null
  private chunks: Chunk[] = []
  private chunkColors: number[] = []
  private nextChunk = 0
  private smoke: SmokePillar[] = []
  private dustWalls: THREE.Mesh[] = []
  private destructables: Destructable[] = []
  private flashMesh: THREE.Mesh | null = null
  private shockRing: THREE.Mesh | null = null
  private shockRing2: THREE.Mesh | null = null
  private scorchMesh: THREE.Mesh | null = null
  private groundMesh: THREE.Mesh | null = null
  private waterMesh: THREE.Mesh | null = null
  private floorFx = new THREE.Group()
  private skyMesh: THREE.Mesh | null = null
  private crater: THREE.Group | null = null
  private rng = 1
  private stageFloorY = -EYE_HEIGHT + 0.15
  private stageBlastZ = VIEW_DIST
  private stageBlastX = 0
  private terrainKind: ImpactTerrain['kind'] = 'city'

  constructor() {
    this.group.visible = false
    this.group.add(this.root)
  }

  play(lat: number, lon: number, terrain: ImpactTerrain) {
    this.clear()
    this.age = 0
    this.active = true
    this.group.visible = true
    this.destructables = []
    this.chunks = []
    this.smoke = []
    this.dustWalls = []
    this.nextChunk = 0
    this.fovBias = 0
    this.terrainKind = terrain.kind
    this.rng = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453) % 1

    const blast = latLonToVector3(lat, lon, BLAST_RADIUS)
    const impact = latLonToVector3(lat, lon, EARTH_RADIUS + 0.45)
    this.lookTarget.copy(blast)

    const { east, north, up } = enuFrame(impact)
    const bearing = this.rng * Math.PI * 2
    const away = east
      .clone()
      .multiplyScalar(Math.cos(bearing) * VIEW_DIST)
      .add(north.clone().multiplyScalar(Math.sin(bearing) * VIEW_DIST))

    this.observerPos.copy(impact).add(away).setLength(EARTH_RADIUS + EYE_HEIGHT + 0.6)
    this.cameraUp.copy(this.observerPos).normalize()

    const toBlast = blast.clone().sub(this.observerPos).normalize()
    const localUp = this.observerPos.clone().normalize()
    let xAxis = new THREE.Vector3().crossVectors(localUp, toBlast)
    if (xAxis.lengthSq() < 1e-8) xAxis = east.clone()
    xAxis.normalize()
    const yAxis = new THREE.Vector3().crossVectors(toBlast, xAxis).normalize()
    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, toBlast)

    this.group.position.copy(this.observerPos)
    this.group.quaternion.setFromRotationMatrix(basis)
    this.group.updateMatrixWorld(true)

    let localBlast = this.group.worldToLocal(blast.clone())
    const lift = EYE_HEIGHT + localBlast.y
    if (Math.abs(lift) > 1e-4) {
      this.observerPos.addScaledVector(yAxis, lift)
      this.cameraUp.copy(this.observerPos).normalize()
      this.group.position.copy(this.observerPos)
      this.group.updateMatrixWorld(true)
      localBlast = this.group.worldToLocal(blast.clone())
    }

    this.stageFloorY = localBlast.y
    this.stageBlastX = localBlast.x
    this.stageBlastZ = Math.max(3.4, localBlast.z)

    this.lookAim.copy(blast).addScaledVector(up, 0.55)
    this.camEyeLocal.set(0, 0, 0)
    this.camLookLocal.copy(this.group.worldToLocal(this.lookAim.clone()))

    this.setupLights()
    this.buildGroundApron(terrain.kind)
    this.buildCrater(terrain.kind)
    this.buildScorch()
    this.buildBlastFlash()
    this.buildShockRings()
    this.buildDustWalls()

    if (terrain.kind === 'city') this.buildCityPanorama()
    else if (terrain.kind === 'ocean') this.buildBoatDeck()
    else if (terrain.kind === 'mountain') this.buildMountainRidge()
    else this.buildCottageLand()

    this.buildForegroundFrame(terrain.kind)
    this.spawnSoftHaze()
    this.spawnDebris()
    this.spawnEmbers()
    this.spawnGlass()
    this.prepChunkPool(terrain.kind)
    this.spawnSmokePillars(terrain.kind)
  }

  update(dt: number) {
    if (!this.active) return
    this.age += dt
    const t = this.age

    const glow = this.root.getObjectByName('blastGlow') as THREE.PointLight | undefined
    if (glow) {
      const pulse = Math.max(0, t - 0.06)
      glow.intensity = Math.min(28, pulse * 40) * Math.exp(-Math.max(0, pulse - 0.45) * 0.55)
      glow.position.y = this.groundY() + 1.0 + Math.min(2.5, t * 1.4)
    }

    if (this.flashMesh) {
      const mat = this.flashMesh.material as THREE.MeshBasicMaterial
      mat.opacity = t < 0.035 ? 0.9 : Math.max(0, 0.4 - (t - 0.035) * 3.2)
      this.flashMesh.scale.setScalar(1 + t * 4)
      if (mat.opacity <= 0.02) this.flashMesh.visible = false
    }

    if (this.shockRing) {
      const shock = Math.max(0, t - 0.07)
      const mat = this.shockRing.material as THREE.MeshBasicMaterial
      const r = 0.55 + shock * 8.5
      this.shockRing.scale.set(r, r, r)
      mat.opacity = shock < 0.02 ? 0 : Math.max(0, 0.5 * Math.exp(-shock * 1.9))
      this.shockRing.visible = mat.opacity > 0.02
    }
    if (this.shockRing2) {
      const shock = Math.max(0, t - 0.16)
      const mat = this.shockRing2.material as THREE.MeshBasicMaterial
      const r = 0.45 + shock * 10.5
      this.shockRing2.scale.set(r, r, r)
      mat.opacity = shock < 0.02 ? 0 : Math.max(0, 0.32 * Math.exp(-shock * 1.7))
      this.shockRing2.visible = mat.opacity > 0.02
    }

    if (this.scorchMesh) {
      const s = easeOut(Math.min(1, t / 0.45))
      this.scorchMesh.scale.setScalar(0.35 + s * 2.1)
      ;(this.scorchMesh.material as THREE.MeshBasicMaterial).opacity = 0.4 * s
    }

    // Atmosphere darkens / warms after the flash
    if (this.skyMesh) {
      const mat = this.skyMesh.material as THREE.MeshBasicMaterial
      const warm = Math.min(1, t * 0.55)
      mat.color.setRGB(0.07 + warm * 0.12, 0.14 - warm * 0.04, 0.18 - warm * 0.06)
    }

    const heave = Math.max(0, t - 0.08)
    const amp = Math.min(0.05, heave * 0.1) * Math.exp(-Math.max(0, heave - 0.3) * 2.6)
    const heaveY = Math.sin(heave * 12) * amp
    if (this.groundMesh) {
      this.groundMesh.position.y = this.groundY() + heaveY
    }
    if (this.waterMesh) {
      const w = Math.max(0, t - 0.06)
      this.waterMesh.position.y =
        this.groundY() + 0.03 + heaveY + Math.sin(w * 9) * Math.min(0.12, w * 0.22) * Math.exp(-w * 0.35)
      this.waterMesh.rotation.z = Math.sin(w * 5.5) * 0.03
    }
    this.floorFx.position.y = heaveY

    this.updateDustWalls(t)
    this.updateSmoke(t, dt)
    this.updateCraterFlames(t, dt)
    this.updateDestructables(t, dt)
    this.updateDust(t, dt)
    this.updateDebris(t, dt)
    this.updateEmbers(t, dt)
    this.updateGlass(t, dt)
    this.updateChunks(dt)
    this.updateCameraMotion(t)
  }

  private updateCraterFlames(t: number, dt: number) {
    if (!this.crater) return
    // Punch the crater open with the shock
    const open = easeOut(clamp01((t - 0.06) / 0.28))
    this.crater.scale.setScalar(0.2 + open * 0.8)
    this.crater.traverse((o) => {
      if (o.name !== 'craterFlame') return
      const flame = o as THREE.Mesh
      const phase = ((flame.userData.phase as number) ?? 0) + dt * 11
      flame.userData.phase = phase
      flame.scale.y = 0.85 + Math.sin(phase) * 0.3
      flame.scale.x = 0.9 + Math.sin(phase * 1.4) * 0.18
      const mat = flame.material as THREE.MeshStandardMaterial
      const on = Math.min(1, Math.max(0, t - 0.12) * 4)
      mat.opacity = 0.9 * on
      mat.emissiveIntensity = (1.2 + Math.sin(phase) * 0.4) * on
      flame.visible = on > 0.05
    })
  }

  /** World-space eye after local dolly — call after update(). */
  getEyeWorld(out = new THREE.Vector3()): THREE.Vector3 {
    return this.group.localToWorld(out.copy(this.camEyeLocal))
  }

  /** World-space look target after local rise. */
  getLookWorld(out = new THREE.Vector3()): THREE.Vector3 {
    return this.group.localToWorld(out.copy(this.camLookLocal))
  }

  shakeAmount(): number {
    if (!this.active) return 0
    const hit = Math.max(0, this.age - 0.08)
    // Two punches: shock arrival + building collapse cascade
    const a = Math.min(1, hit * 2.2) * Math.exp(-Math.max(0, hit - 0.18) * 1.4)
    const b = Math.max(0, hit - 0.45)
    const cascade = Math.min(0.55, b * 1.1) * Math.exp(-Math.max(0, b - 0.25) * 1.6)
    return Math.min(1, a * 0.85 + cascade)
  }

  dismiss() {
    this.active = false
    this.group.visible = false
    this.clear()
  }

  get isActive() {
    return this.active
  }

  private updateCameraMotion(t: number) {
    // Dolly back + slight settle as the shock arrives; rise with the stem
    const dolly = easeOut(clamp01((t - 0.05) / 0.7)) * 0.85
    const rise = easeOut(clamp01((t - 0.25) / 1.4)) * 1.35
    const sway = Math.sin(t * 2.4) * 0.08 * Math.min(1, t)
    this.camEyeLocal.set(sway * 0.35, dolly * 0.15, -dolly)
    this.camLookLocal.set(
      this.stageBlastX * 0.15 + sway * 0.2,
      this.groundY() + 0.6 + rise,
      this.stageBlastZ * 0.92,
    )
    // FOV punch on shock, then widen for the bloom
    const punch = Math.max(0, 1 - Math.abs(t - 0.14) * 8) * 8
    const wide = easeOut(clamp01((t - 0.4) / 1.2)) * 6
    this.fovBias = punch + wide
  }

  private setupLights() {
    const key = new THREE.DirectionalLight(0xfff0dd, 2.2)
    key.position.set(-2.5, 7, -1.5)
    this.root.add(key)
    const fill = new THREE.DirectionalLight(0x7ab0c8, 0.95)
    fill.position.set(3.5, 2.5, 4)
    this.root.add(fill)
    const rim = new THREE.DirectionalLight(0xff7a3a, 0.7)
    rim.position.set(0.5, 2, this.stageBlastZ + 3)
    this.root.add(rim)
    const blastGlow = new THREE.PointLight(0xff6622, 0, 26, 2)
    blastGlow.position.set(this.stageBlastX, this.groundY() + 1.1, this.stageBlastZ * 0.92)
    blastGlow.name = 'blastGlow'
    this.root.add(blastGlow)
    this.root.add(new THREE.AmbientLight(0xa8c8d4, 0.55))
    this.root.add(new THREE.HemisphereLight(0xffe2c0, 0x152838, 0.4))
  }

  private clear() {
    while (this.root.children.length) {
      const c = this.root.children[0]!
      this.root.remove(c)
      c.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else if (mat) mat.dispose()
      })
    }
    this.dust = null
    this.dustVel = null
    this.embers = null
    this.emberVel = null
    this.glass = null
    this.glassVel = null
    this.debris = null
    this.debrisVel = null
    this.chunks = []
    this.smoke = []
    this.dustWalls = []
    this.flashMesh = null
    this.shockRing = null
    this.shockRing2 = null
    this.scorchMesh = null
    this.groundMesh = null
    this.waterMesh = null
    this.skyMesh = null
    this.crater = null
    this.floorFx = new THREE.Group()
    this.destructables = []
  }

  private buildCrater(kind: ImpactTerrain['kind']) {
    this.crater = makeCraterBowl(kind === 'ocean' ? 1.4 : 1.7, kind === 'ocean')
    this.crater.position.set(this.stageBlastX, this.groundY(), this.stageBlastZ)
    this.crater.scale.setScalar(0.15)
    this.root.add(this.crater)
  }

  private markDestruct(
    obj: THREE.Object3D,
    kind: DestructKind,
    opts: { mass?: number; seed?: number } = {},
  ) {
    const dx = obj.position.x - this.stageBlastX
    const dz = obj.position.z - this.stageBlastZ
    const dist = Math.max(0.3, Math.hypot(dx, dz))
    this.destructables.push({
      obj,
      kind,
      ox: obj.position.x,
      oy: obj.position.y,
      oz: obj.position.z,
      nx: dx / dist,
      nz: dz / dist,
      dist,
      seed: opts.seed ?? Math.random(),
      mass: opts.mass ?? 1,
      shattered: false,
      baseYaw: obj.rotation.y,
    })
  }

  private mat(color: number, emissive = 0x000000, em = 0, side: THREE.Side = THREE.FrontSide) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: em,
      roughness: 0.78,
      metalness: 0.06,
      flatShading: true,
      side,
    })
  }

  private groundY() {
    return this.stageFloorY
  }

  private ensureFloorFx() {
    if (!this.floorFx.parent) this.root.add(this.floorFx)
  }

  private floorDecalMat(color: number) {
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    })
  }

  private buildScorch() {
    this.ensureFloorFx()
    this.scorchMesh = new THREE.Mesh(new THREE.CircleGeometry(2.0, 32), this.floorDecalMat(0x1a1210))
    this.scorchMesh.rotation.x = -Math.PI / 2
    this.scorchMesh.position.set(this.stageBlastX, this.groundY() + 0.035, this.stageBlastZ)
    this.floorFx.add(this.scorchMesh)
  }

  private buildBlastFlash() {
    this.ensureFloorFx()
    this.flashMesh = new THREE.Mesh(new THREE.CircleGeometry(1.5, 28), this.floorDecalMat(0xffe8b0))
    this.flashMesh.rotation.x = -Math.PI / 2
    this.flashMesh.position.set(this.stageBlastX, this.groundY() + 0.045, this.stageBlastZ)
    this.floorFx.add(this.flashMesh)
  }

  private buildShockRings() {
    this.ensureFloorFx()
    this.shockRing = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 48), this.floorDecalMat(0xffc090))
    this.shockRing.rotation.x = -Math.PI / 2
    this.shockRing.position.set(this.stageBlastX, this.groundY() + 0.055, this.stageBlastZ)
    this.floorFx.add(this.shockRing)

    this.shockRing2 = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.2, 48), this.floorDecalMat(0xff8844))
    this.shockRing2.rotation.x = -Math.PI / 2
    this.shockRing2.position.set(this.stageBlastX, this.groundY() + 0.06, this.stageBlastZ)
    this.floorFx.add(this.shockRing2)
  }

  private buildDustWalls() {
    for (let i = 0; i < DUST_WALL_COUNT; i++) {
      const wall = new THREE.Mesh(
        new THREE.TorusGeometry(1.2 + i * 0.15, 0.35 + i * 0.08, 6, 36),
        new THREE.MeshStandardMaterial({
          color: 0xc4a070,
          emissive: 0xff6622,
          emissiveIntensity: 0.15,
          transparent: true,
          opacity: 0,
          roughness: 1,
          flatShading: true,
          depthWrite: false,
        }),
      )
      wall.rotation.x = Math.PI / 2
      wall.position.set(this.stageBlastX, this.groundY() + 0.45 + i * 0.15, this.stageBlastZ)
      wall.visible = false
      this.root.add(wall)
      this.dustWalls.push(wall)
    }
  }

  private updateDustWalls(t: number) {
    for (let i = 0; i < this.dustWalls.length; i++) {
      const wall = this.dustWalls[i]!
      const start = 0.1 + i * 0.07
      const local = Math.max(0, t - start)
      if (local <= 0) {
        wall.visible = false
        continue
      }
      wall.visible = true
      const expand = 0.6 + local * (4.5 - i * 0.35)
      wall.scale.set(expand, expand, 0.6 + local * 0.8)
      wall.position.y = this.groundY() + 0.35 + i * 0.18 + local * 0.35
      const mat = wall.material as THREE.MeshStandardMaterial
      mat.opacity = Math.max(0, 0.45 * Math.exp(-local * 1.35) * (1 - i * 0.08))
      mat.emissiveIntensity = Math.max(0.02, 0.35 * Math.exp(-local * 1.8))
      if (mat.opacity < 0.02) wall.visible = false
    }
  }

  private spawnSmokePillars(kind: ImpactTerrain['kind']) {
    if (kind === 'ocean') return
    const n = kind === 'city' ? 10 : 6
    for (let i = 0; i < n; i++) {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.35 + Math.random() * 0.25, 1.8, 5),
        new THREE.MeshStandardMaterial({
          color: 0x6a6058,
          emissive: 0xff5522,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0,
          roughness: 1,
          flatShading: true,
          depthWrite: false,
        }),
      )
      const a = (i / n) * Math.PI * 2 + this.rng
      const r = 0.8 + (i % 4) * 0.55
      mesh.position.set(
        this.stageBlastX + Math.cos(a) * r * 1.3,
        this.groundY() + 0.2,
        this.stageBlastZ + Math.sin(a) * r * 0.55,
      )
      mesh.scale.set(0.2, 0.1, 0.2)
      this.root.add(mesh)
      this.smoke.push({ mesh, delay: 0.2 + i * 0.06 + Math.random() * 0.1, grow: 0.8 + Math.random() * 0.6 })
    }
  }

  private updateSmoke(t: number, dt: number) {
    for (const s of this.smoke) {
      const local = Math.max(0, t - s.delay)
      if (local <= 0) continue
      const grow = easeOut(Math.min(1, local / s.grow))
      s.mesh.scale.set(0.4 + grow * 1.4, 0.3 + grow * 2.4, 0.4 + grow * 1.4)
      s.mesh.position.y = this.groundY() + 0.2 + grow * 1.6
      s.mesh.rotation.y += dt * 0.35
      const mat = s.mesh.material as THREE.MeshStandardMaterial
      mat.opacity = Math.min(0.55, grow * 0.7) * Math.exp(-Math.max(0, local - 1.1) * 0.6)
      mat.emissiveIntensity = Math.max(0.02, 0.35 * (1 - local * 0.35))
    }
  }

  private spawnSoftHaze() {
    const n = 220
    const pos = new Float32Array(n * 3)
    const vel = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * 2.2
      pos[i * 3] = this.stageBlastX + Math.cos(a) * r
      pos[i * 3 + 1] = this.groundY() + 0.15 + Math.random() * 0.8
      pos[i * 3 + 2] = this.stageBlastZ + Math.sin(a) * r * 0.5
      vel[i * 3] = Math.cos(a) * (0.8 + Math.random() * 2.2)
      vel[i * 3 + 1] = 0.8 + Math.random() * 1.6
      vel[i * 3 + 2] = Math.sin(a) * (0.5 + Math.random() * 1.4) - 1.5
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xd8b080,
        size: 0.32,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    )
    this.dustVel = vel
    this.root.add(this.dust)
  }

  private spawnEmbers() {
    const n = 120
    const pos = new Float32Array(n * 3)
    const vel = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * 1.4
      pos[i * 3] = this.stageBlastX + Math.cos(a) * r
      pos[i * 3 + 1] = this.groundY() + 0.15 + Math.random() * 0.7
      pos[i * 3 + 2] = this.stageBlastZ + Math.sin(a) * r * 0.45
      vel[i * 3] = Math.cos(a) * (1.5 + Math.random() * 3)
      vel[i * 3 + 1] = 2.5 + Math.random() * 5
      vel[i * 3 + 2] = Math.sin(a) * (1 + Math.random() * 2) - 0.8
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.embers = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xff6020,
        size: 0.11,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.emberVel = vel
    this.root.add(this.embers)
  }

  private spawnGlass() {
    const n = 90
    const pos = new Float32Array(n * 3)
    const vel = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = this.stageBlastX + (Math.random() - 0.5) * 3
      pos[i * 3 + 1] = this.groundY() + 0.4 + Math.random() * 1.6
      pos[i * 3 + 2] = 1.5 + Math.random() * Math.max(2, this.stageBlastZ - 1)
      vel[i * 3] = (Math.random() - 0.5) * 4
      vel[i * 3 + 1] = 1 + Math.random() * 3
      vel[i * 3 + 2] = -1 - Math.random() * 3
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.glass = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xe8f4ff,
        size: 0.07,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.glassVel = vel
    this.root.add(this.glass)
  }

  private spawnDebris() {
    const n = 200
    const pos = new Float32Array(n * 3)
    const vel = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.15 + Math.random() * 1.6
      pos[i * 3] = this.stageBlastX + Math.cos(a) * r
      pos[i * 3 + 1] = this.groundY() + 0.12 + Math.random() * 0.9
      pos[i * 3 + 2] = this.stageBlastZ + Math.sin(a) * r * 0.55
      vel[i * 3] = Math.cos(a) * (3 + Math.random() * 6)
      vel[i * 3 + 1] = 2.8 + Math.random() * 6.5
      vel[i * 3 + 2] = Math.sin(a) * (1.8 + Math.random() * 4) - 1.4
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.debris = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xc8a070,
        size: 0.12,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    )
    this.debrisVel = vel
    this.root.add(this.debris)
  }

  private prepChunkPool(kind: ImpactTerrain['kind']) {
    this.chunkColors =
      kind === 'ocean'
        ? [0x5a9eb8, 0xd9b87a, 0xc45a3a, 0xe7f2f4]
        : kind === 'mountain'
          ? [0x8a8580, 0x5a5550, 0xc8c4bc, 0x6a6560]
          : kind === 'city'
            ? [0x8a9096, 0xd9b87a, 0xe85d3a, 0x6b737a, 0xb8c0c6, 0xced4da]
            : [0x5f9a4a, 0xd9b87a, 0x8b5a3a, 0x2f6b3a, 0xe85d3a]
    for (let i = 0; i < CHUNK_POOL; i++) {
      const size = 0.07 + Math.random() * 0.28
      const geo =
        Math.random() > 0.4
          ? new THREE.BoxGeometry(size, size * (0.4 + Math.random() * 0.9), size * (0.5 + Math.random() * 0.6))
          : new THREE.TetrahedronGeometry(size * 0.75, 0)
      const mesh = new THREE.Mesh(geo, this.mat(this.chunkColors[i % this.chunkColors.length]!, 0xff6622, 0.2))
      mesh.visible = false
      mesh.castShadow = true
      this.root.add(mesh)
      this.chunks.push({
        mesh,
        vx: 0,
        vy: 0,
        vz: 0,
        spinX: 0,
        spinY: 0,
        spinZ: 0,
        life: 0,
        active: false,
      })
    }
  }

  private burstChunks(x: number, y: number, z: number, count: number, force: number) {
    for (let i = 0; i < count; i++) {
      const c = this.chunks[this.nextChunk % this.chunks.length]!
      this.nextChunk++
      const a = Math.random() * Math.PI * 2
      const elev = 0.3 + Math.random() * 0.9
      c.active = true
      c.life = 1.1 + Math.random() * 1.3
      c.mesh.visible = true
      c.mesh.position.set(x + (Math.random() - 0.5) * 0.25, y + Math.random() * 0.4, z + (Math.random() - 0.5) * 0.25)
      c.mesh.scale.setScalar(0.7 + Math.random() * 0.8)
      c.vx = Math.cos(a) * Math.cos(elev) * force * (0.7 + Math.random())
      c.vy = Math.sin(elev) * force * (0.8 + Math.random() * 0.8)
      c.vz = Math.sin(a) * Math.cos(elev) * force * (0.55 + Math.random()) - force * 0.15
      c.spinX = (Math.random() - 0.5) * 14
      c.spinY = (Math.random() - 0.5) * 14
      c.spinZ = (Math.random() - 0.5) * 14
      const mat = c.mesh.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.55
    }
  }

  private updateDust(t: number, dt: number) {
    if (!this.dust || !this.dustVel) return
    const rush = Math.max(0, t - 0.12)
    if (rush <= 0) return
    const positions = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = positions.array as Float32Array
    const vel = this.dustVel
    for (let i = 0; i < arr.length; i += 3) {
      vel[i + 1]! -= 1.2 * dt
      arr[i]! += vel[i]! * dt
      arr[i + 1]! += vel[i + 1]! * dt
      arr[i + 2]! += vel[i + 2]! * dt
      if (arr[i + 1]! < this.groundY() + 0.08) {
        arr[i + 1] = this.groundY() + 0.08
        vel[i]! *= 0.7
        vel[i + 1] = Math.abs(vel[i + 1]!) * 0.15
        vel[i + 2]! *= 0.7
      }
    }
    positions.needsUpdate = true
    const pm = this.dust.material as THREE.PointsMaterial
    pm.opacity = Math.min(0.8, rush * 1.1) * Math.exp(-Math.max(0, rush - 0.9) * 0.55)
    pm.size = 0.28 + Math.min(0.2, rush * 0.15)
  }

  private updateEmbers(t: number, dt: number) {
    if (!this.embers || !this.emberVel) return
    const rush = Math.max(0, t - 0.1)
    if (rush <= 0) return
    const positions = this.embers.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = positions.array as Float32Array
    const vel = this.emberVel
    for (let i = 0; i < arr.length; i += 3) {
      vel[i + 1]! -= 4.5 * dt
      arr[i]! += vel[i]! * dt
      arr[i + 1]! += vel[i + 1]! * dt
      arr[i + 2]! += vel[i + 2]! * dt
    }
    positions.needsUpdate = true
    const pm = this.embers.material as THREE.PointsMaterial
    pm.opacity = Math.min(0.95, rush * 2.8) * Math.exp(-Math.max(0, rush - 0.65) * 1.0)
  }

  private updateGlass(t: number, dt: number) {
    if (!this.glass || !this.glassVel || this.terrainKind !== 'city') return
    const rush = Math.max(0, t - 0.18)
    if (rush <= 0) return
    const positions = this.glass.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = positions.array as Float32Array
    const vel = this.glassVel
    for (let i = 0; i < arr.length; i += 3) {
      vel[i + 1]! -= 9 * dt
      arr[i]! += vel[i]! * dt
      arr[i + 1]! += vel[i + 1]! * dt
      arr[i + 2]! += vel[i + 2]! * dt
    }
    positions.needsUpdate = true
    const pm = this.glass.material as THREE.PointsMaterial
    pm.opacity = Math.min(0.9, rush * 2) * Math.exp(-Math.max(0, rush - 0.5) * 1.4)
  }

  private updateDebris(t: number, dt: number) {
    if (!this.debris || !this.debrisVel) return
    const rush = Math.max(0, t - 0.12)
    if (rush <= 0) return
    const positions = this.debris.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = positions.array as Float32Array
    const vel = this.debrisVel
    for (let i = 0; i < arr.length; i += 3) {
      vel[i + 1]! -= 11 * dt
      arr[i]! += vel[i]! * dt
      arr[i + 1]! += vel[i + 1]! * dt
      arr[i + 2]! += vel[i + 2]! * dt
      if (arr[i + 1]! < this.groundY() + 0.05) {
        arr[i + 1] = this.groundY() + 0.05
        vel[i]! *= 0.48
        vel[i + 1] = Math.abs(vel[i + 1]!) * 0.25
        vel[i + 2]! *= 0.48
      }
    }
    positions.needsUpdate = true
    const pm = this.debris.material as THREE.PointsMaterial
    pm.opacity = Math.min(0.9, rush * 2.5) * Math.exp(-Math.max(0, rush - 1.05) * 0.7)
  }

  private updateChunks(dt: number) {
    for (const c of this.chunks) {
      if (!c.active) continue
      c.life -= dt
      c.vy -= 12 * dt
      c.mesh.position.x += c.vx * dt
      c.mesh.position.y += c.vy * dt
      c.mesh.position.z += c.vz * dt
      c.mesh.rotation.x += c.spinX * dt
      c.mesh.rotation.y += c.spinY * dt
      c.mesh.rotation.z += c.spinZ * dt
      if (c.mesh.position.y < this.groundY() + 0.04) {
        c.mesh.position.y = this.groundY() + 0.04
        c.vy = Math.abs(c.vy) * 0.2
        c.vx *= 0.5
        c.vz *= 0.5
        c.spinX *= 0.45
        c.spinY *= 0.45
      }
      const mat = c.mesh.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = Math.max(0.02, 0.45 * (c.life / 1.4))
      if (c.life < 0.3) {
        c.mesh.scale.multiplyScalar(1 - dt * 2.8)
      }
      if (c.life <= 0) {
        c.active = false
        c.mesh.visible = false
      }
    }
  }

  private updateDestructables(t: number, dt: number) {
    for (const d of this.destructables) {
      // Shock speed ~25 units/s — nearer props go first
      const arrival = 0.09 + d.dist * 0.038 + d.seed * 0.05
      const local = Math.max(0, t - arrival)
      if (local <= 0) {
        d.obj.position.set(d.ox, d.oy, d.oz)
        d.obj.rotation.set(0, d.baseYaw, 0)
        d.obj.scale.set(1, 1, 1)
        d.obj.visible = true
        continue
      }

      const force = (1.35 / Math.sqrt(d.dist * d.mass)) * (0.7 + d.seed * 0.5)
      // Phases: shudder → tip → launch → shatter
      const shudderT = Math.min(1, local / 0.08)
      const tip = easeOut(clamp01(local / (0.28 + d.mass * 0.16)))
      const fly = easeOut(clamp01((local - 0.08) / (0.42 + d.mass * 0.12)))
      const shatter = easeOut(clamp01((local - 0.22) / 0.35))

      if (d.kind === 'wave') {
        const swell = Math.sin(local * 16 + d.seed * 6) * Math.min(0.7, local * 1.6)
        d.obj.position.y = d.oy + swell * 0.45
        d.obj.scale.setScalar(1 + tip * 1.1 + fly * 1.8)
        const mat = (d.obj as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat?.opacity != null) mat.opacity = Math.max(0.04, 0.42 - fly * 0.4)
        continue
      }

      if (d.kind === 'buoy' || d.kind === 'boat') {
        d.obj.position.x = d.ox + d.nx * fly * (2.8 + force)
        d.obj.position.z = d.oz + d.nz * fly * (1.9 + force * 0.8)
        d.obj.position.y = d.oy + Math.sin(local * 18) * 0.2 * shudderT + fly * (1.8 + force * 0.4)
        d.obj.rotation.x = tip * 2.2 * (d.seed - 0.5) + fly * 1.2
        d.obj.rotation.z = tip * 2.6 * (0.5 - d.seed)
        d.obj.rotation.y = d.baseYaw + fly * 3 * (d.seed - 0.5)
        if (shatter > 0.85) d.obj.visible = false
        continue
      }

      if (d.kind === 'car') {
        const flip = tip * (1.2 + d.seed) + fly * 2.5
        d.obj.rotation.x = -flip * 0.7
        d.obj.rotation.z = (d.seed - 0.5) * tip * 1.8
        d.obj.rotation.y = d.baseYaw + fly * 4
        d.obj.position.x = d.ox + d.nx * fly * (3.5 + force)
        d.obj.position.z = d.oz + d.nz * fly * 2.2
        d.obj.position.y = d.oy + fly * (2.2 + force) * (0.8 + d.seed)
        if (shatter > 0.7 && !d.shattered) {
          d.shattered = true
          this.burstChunks(d.obj.position.x, d.obj.position.y, d.obj.position.z, 4, 4 + force)
          d.obj.visible = false
        }
        continue
      }

      if (d.kind === 'pole') {
        d.obj.rotation.x = -tip * (1.4 + d.seed) - fly * 0.6
        d.obj.rotation.z = (d.seed - 0.5) * tip * 0.8
        d.obj.position.x = d.ox + d.nx * fly * 1.2
        d.obj.position.z = d.oz + d.nz * fly * 0.9
        d.obj.position.y = d.oy - tip * 0.15
        continue
      }

      // Buildings / houses / trees / peaks / props
      const leanAmt = d.kind === 'tree' ? 1.55 : d.kind === 'house' ? 1.15 : 1
      const leanX = -tip * (0.95 + d.seed * 0.85) * leanAmt
      const leanZ = tip * (d.seed - 0.5) * (d.kind === 'tree' ? 1.5 : 0.95)
      const vib = Math.sin(local * 48 + d.seed * 10) * 0.045 * shudderT * (1 - tip)
      d.obj.rotation.x = leanX + vib
      d.obj.rotation.z = leanZ + Math.cos(local * 40) * 0.035 * shudderT * (1 - tip)
      d.obj.rotation.y = d.baseYaw + fly * 0.4 * (d.seed - 0.5)

      const slide =
        fly * force * (d.kind === 'tree' ? 3.8 : d.kind === 'house' ? 2.5 : d.kind === 'prop' ? 3.2 : 1.9)
      const lift =
        fly * force * (d.kind === 'tree' ? 3.1 : d.kind === 'house' ? 1.7 : 1.5) * (0.65 + d.seed)
      d.obj.position.x = d.ox + d.nx * slide + vib * 0.15
      d.obj.position.z = d.oz + d.nz * slide * 0.88
      d.obj.position.y = d.oy + lift - tip * 0.2 * d.mass

      if (d.kind === 'building' || d.kind === 'house') {
        const squash = 1 - tip * 0.45
        const crush = 1 - shatter * (0.55 + d.seed * 0.3)
        d.obj.scale.set(1 + tip * 0.28, Math.max(0.05, squash * crush), 1 + tip * 0.2)
        if (shatter > 0.55 && !d.shattered) {
          d.shattered = true
          const n = d.kind === 'building' ? 6 + Math.floor(d.seed * 5) : 4
          this.burstChunks(
            d.obj.position.x,
            d.obj.position.y + 0.3,
            d.obj.position.z,
            n,
            3.5 + force * 1.2,
          )
        }
        if (shatter > 0.82) d.obj.visible = false
      } else if (d.kind === 'tree') {
        d.obj.scale.setScalar(Math.max(0.04, 1 - fly * 0.95))
        d.obj.rotation.y += dt * (6 + d.seed * 10) * fly
        if (shatter > 0.6 && !d.shattered) {
          d.shattered = true
          this.burstChunks(d.obj.position.x, d.obj.position.y, d.obj.position.z, 3, 3 + force)
        }
      } else if (d.kind === 'peak') {
        d.obj.rotation.x = -tip * 0.45
        d.obj.position.y = d.oy - tip * 0.5
        d.obj.scale.set(1 + tip * 0.15, Math.max(0.3, 1 - tip * 0.45), 1 + tip * 0.15)
        if (shatter > 0.7 && !d.shattered) {
          d.shattered = true
          this.burstChunks(d.obj.position.x, d.obj.position.y + 0.5, d.obj.position.z, 5, 2.5 + force)
        }
      } else if (d.kind === 'prop') {
        d.obj.rotation.x = tip * 2 + fly * 3
        d.obj.rotation.z = (d.seed - 0.5) * fly * 4
        if (shatter > 0.75) d.obj.visible = false
      }

      d.obj.traverse((o) => {
        const m = o as THREE.Mesh
        const mat = m.material as THREE.MeshStandardMaterial | undefined
        if (!mat || mat.emissiveIntensity == null) return
        mat.emissiveIntensity = Math.min(
          1.7,
          (mat.userData.baseEm ?? 0.08) + tip * 1.05 + fly * 0.6,
        )
      })
    }
  }

  private buildGroundApron(kind: ImpactTerrain['kind']) {
    const color =
      kind === 'ocean' ? 0x1a4a66 : kind === 'mountain' ? 0x6a6560 : kind === 'city' ? 0x3a4248 : 0x4f8a45
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(20, 64),
      this.mat(color, color, 0.08, THREE.DoubleSide),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.set(this.stageBlastX, this.groundY(), this.stageBlastZ * 0.45)
    ground.receiveShadow = true
    this.groundMesh = ground
    this.root.add(ground)

    const skyColor = kind === 'ocean' ? 0x0c222c : 0x122830
    this.skyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(26, 32, 20),
      new THREE.MeshBasicMaterial({
        color: skyColor,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    )
    this.skyMesh.position.set(this.stageBlastX, this.groundY() + 4, this.stageBlastZ * 0.45)
    this.root.add(this.skyMesh)

    const haze = new THREE.Mesh(
      new THREE.CylinderGeometry(22, 22, 4.2, 36, 1, true),
      new THREE.MeshBasicMaterial({
        color: kind === 'ocean' ? 0x3a7088 : 0x4a6870,
        transparent: true,
        opacity: 0.28,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    )
    haze.position.set(this.stageBlastX, this.groundY() + 1.4, this.stageBlastZ * 0.45)
    this.root.add(haze)
  }

  /** Near-camera frame so the shot feels placed, not floating. */
  private buildForegroundFrame(kind: ImpactTerrain['kind']) {
    const gy = this.groundY()
    if (kind === 'city') {
      const rail = new THREE.Group()
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.18, 0.55), this.mat(0x4a5258, 0x000000, 0))
      ledge.position.set(0, gy + 0.55, 0.35)
      rail.add(ledge)
      for (let i = -2; i <= 2; i++) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), this.mat(0x6b737a))
        post.position.set(i * 1.1, gy + 0.85, 0.45)
        rail.add(post)
      }
      const bar = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 0.06), this.mat(0x8a9096))
      bar.position.set(0, gy + 1.15, 0.45)
      rail.add(bar)
      this.root.add(rail)
    } else if (kind === 'mountain' || kind === 'land') {
      // Near grass / rock lip
      for (let i = 0; i < 8; i++) {
        const tuft = new THREE.Mesh(
          new THREE.ConeGeometry(0.12, 0.35 + Math.random() * 0.2, 4),
          this.mat(kind === 'mountain' ? 0x5a5550 : 0x3d7a35),
        )
        tuft.position.set((i - 3.5) * 0.55, gy + 0.15, 0.5 + (i % 2) * 0.2)
        this.root.add(tuft)
      }
    } else if (kind === 'ocean') {
      const gunwale = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.22, 0.4), this.mat(0x6b4a32))
      gunwale.position.set(0, gy + 0.45, 0.4)
      this.root.add(gunwale)
    }
  }

  private buildCityPanorama() {
    const gy = this.groundY()
    const asphalt = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 18),
      this.mat(0x2a3036, 0x2a3036, 0.06, THREE.DoubleSide),
    )
    asphalt.rotation.x = -Math.PI / 2
    asphalt.position.set(this.stageBlastX, gy + 0.02, this.stageBlastZ * 0.45)
    asphalt.receiveShadow = true
    this.root.add(asphalt)

    for (let i = -3; i <= 3; i++) {
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, 15),
        this.mat(0x15191c, 0x000000, 0, THREE.DoubleSide),
      )
      road.rotation.x = -Math.PI / 2
      road.position.set(this.stageBlastX + i * 1.9, gy + 0.035, this.stageBlastZ * 0.45)
      this.root.add(road)
      for (let d = 0; d < 9; d++) {
        const dash = new THREE.Mesh(
          new THREE.PlaneGeometry(0.07, 0.4),
          this.mat(0xd9b87a, 0xd9b87a, 0.12, THREE.DoubleSide),
        )
        dash.rotation.x = -Math.PI / 2
        dash.position.set(this.stageBlastX + i * 1.9, gy + 0.045, 1.3 + d * 1.35)
        this.root.add(dash)
      }
    }
    for (let row = 0; row < 4; row++) {
      const cross = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 0.55),
        this.mat(0x15191c, 0x000000, 0, THREE.DoubleSide),
      )
      cross.rotation.x = -Math.PI / 2
      cross.position.set(this.stageBlastX, gy + 0.036, 2.2 + row * 1.6)
      this.root.add(cross)
    }

    const palette = [0x8a9096, 0xb8c0c6, 0xd9b87a, 0x6b737a, 0xe85d3a, 0xc4a35a, 0x9aa3aa, 0xced4da, 0x7a8490]
    for (let ring = 0; ring < 14; ring++) {
      const z = 1.15 + ring * 0.48
      const halfWidth = 4.4 + ring * 0.5
      const cols = 8 + Math.floor(ring * 0.9)
      for (let i = 0; i < cols; i++) {
        const u = cols === 1 ? 0 : i / (cols - 1)
        const x = -halfWidth + u * halfWidth * 2
        // Keep crater clear
        if (Math.hypot(x - this.stageBlastX, z - this.stageBlastZ) < 1.5) continue

        const h = Math.min(
          MAX_BUILDING_H,
          0.55 + ((ring * 7 + i * 3) % 10) * 0.22 + Math.random() * 0.65 + (ring > 8 ? 0.7 : 0),
        )
        // Vary footprint so shop / walkup / slab / deco styles can read
        const slim = Math.random() > 0.7
        const w = slim ? 0.32 + Math.random() * 0.28 : 0.42 + Math.random() * 0.55
        const depth = slim ? 0.55 + Math.random() * 0.35 : 0.38 + Math.random() * 0.45
        const building = makeBuilding(
          w,
          h,
          depth,
          palette[(ring + i) % palette.length]!,
          ring > 6 || Math.random() > 0.55,
          ring * 31 + i * 7 + h * 10,
        )
        building.position.set(x, gy + 0.02, z)
        building.rotation.y = (Math.random() - 0.5) * 0.18
        this.markDestruct(building, 'building', { mass: 0.65 + ring * 0.09, seed: Math.random() })
        this.root.add(building)
      }
    }

    // Landmark towers near the blast — tall deco / round / glass
    for (let i = 0; i < 12; i++) {
      const h = 2.1 + Math.random() * 1.6
      const slim = i % 3 === 0
      const tower = makeBuilding(
        slim ? 0.38 : 0.52,
        h,
        slim ? 0.55 : 0.48,
        i % 3 === 0 ? 0xe7f2f4 : i % 3 === 1 ? 0xb8c0c6 : 0xd9b87a,
        true,
        900 + i * 17,
      )
      const ang = (i / 12) * Math.PI * 2
      const r = 1.65 + (i % 4) * 0.38
      tower.position.set(
        this.stageBlastX + Math.cos(ang) * r * 1.4,
        gy,
        this.stageBlastZ * 0.78 + Math.sin(ang) * r * 0.5,
      )
      this.markDestruct(tower, 'building', { mass: 1.2, seed: Math.random() })
      this.root.add(tower)
    }

    for (let i = 0; i < 24; i++) {
      const car = makeCar(i % 3 === 0 ? 0xe85d3a : i % 3 === 1 ? 0xd9b87a : 0x4a90b8)
      const lane = (i % 7) - 3
      car.position.set(
        this.stageBlastX + lane * 1.9 + (Math.random() - 0.5) * 0.25,
        gy + 0.02,
        1.4 + (i * 0.55) % Math.max(4, this.stageBlastZ - 1.5),
      )
      car.rotation.y = Math.random() > 0.5 ? 0 : Math.PI
      this.markDestruct(car, 'car', { mass: 0.4, seed: Math.random() })
      this.root.add(car)
    }

    for (let i = 0; i < 16; i++) {
      const pole = makeStreetlight()
      const lane = (i % 8) - 3.5
      pole.position.set(
        this.stageBlastX + lane * 1.9,
        gy,
        1.6 + Math.floor(i / 8) * 3.2 + (i % 3) * 0.8,
      )
      this.markDestruct(pole, 'pole', { mass: 0.55, seed: Math.random() })
      this.root.add(pole)
    }
  }

  private buildBoatDeck() {
    const gy = this.groundY()
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(18, 64),
      this.mat(0x1a556e, 0x1f6a88, 0.18, THREE.DoubleSide),
    )
    water.rotation.x = -Math.PI / 2
    water.position.set(this.stageBlastX, gy + 0.03, this.stageBlastZ * 0.45)
    this.waterMesh = water
    this.root.add(water)

    for (let i = 0; i < 8; i++) {
      const wave = new THREE.Mesh(
        new THREE.TorusGeometry(1.4 + i * 0.75, 0.09, 5, 40),
        new THREE.MeshStandardMaterial({
          color: 0x7eb8c8,
          transparent: true,
          opacity: 0.42 - i * 0.04,
          roughness: 0.28,
          flatShading: true,
        }),
      )
      wave.rotation.x = Math.PI / 2
      wave.position.set(this.stageBlastX, gy + 0.12, this.stageBlastZ * 0.55 + i * 0.45)
      this.markDestruct(wave, 'wave', { mass: 0.35, seed: i / 8 })
      this.root.add(wave)
    }

    for (let i = 0; i < 6; i++) {
      const boat = makeBoat()
      const a = (i / 6) * Math.PI * 2 + 0.5
      boat.position.set(
        this.stageBlastX + Math.cos(a) * (2.6 + i * 0.35),
        gy + 0.06,
        this.stageBlastZ * 0.48 + Math.sin(a) * 1.7,
      )
      boat.rotation.y = a + Math.PI / 2
      this.markDestruct(boat, 'boat', { mass: 0.7, seed: Math.random() })
      this.root.add(boat)
    }

    for (let i = 0; i < 8; i++) {
      const buoy = new THREE.Group()
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.13 + (i % 2) * 0.05, 7, 5),
        this.mat(i % 2 ? 0xc45a3a : 0xd9b87a, 0xff6622, 0.18),
      )
      buoy.add(ball)
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 5), this.mat(0xe7f2f4))
      pole.position.y = 0.32
      buoy.add(pole)
      const a = (i / 8) * Math.PI * 2 + 0.3
      buoy.position.set(
        this.stageBlastX + Math.cos(a) * (1.8 + i * 0.3),
        gy + 0.18,
        this.stageBlastZ * 0.5 + Math.sin(a) * 1.5,
      )
      this.markDestruct(buoy, 'buoy', { mass: 0.3, seed: Math.random() })
      this.root.add(buoy)
    }
  }

  private buildCottageLand() {
    const gy = this.groundY()
    const field = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 18),
      this.mat(0x5f9a4a, 0x5f9a4a, 0.1, THREE.DoubleSide),
    )
    field.rotation.x = -Math.PI / 2
    field.position.set(this.stageBlastX, gy + 0.03, this.stageBlastZ * 0.45)
    field.receiveShadow = true
    this.root.add(field)

    // Patchwork field strips
    for (let i = 0; i < 5; i++) {
      const strip = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 12),
        this.mat(i % 2 ? 0x6aab52 : 0x4f8a45, 0x000000, 0, THREE.DoubleSide),
      )
      strip.rotation.x = -Math.PI / 2
      strip.position.set(this.stageBlastX - 6 + i * 3.2, gy + 0.035, this.stageBlastZ * 0.45)
      this.root.add(strip)
    }

    const path = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 14),
      this.mat(0x8a6a45, 0x000000, 0, THREE.DoubleSide),
    )
    path.rotation.x = -Math.PI / 2
    path.position.set(this.stageBlastX, gy + 0.04, this.stageBlastZ * 0.45)
    this.root.add(path)

    const roofColors = [0xe85d3a, 0xc45a3a, 0x8a5050, 0xd9b87a, 0x4a6a8a]
    const wallColors = [0xd9b87a, 0xf2e6d0, 0xc4a06a, 0xe8dcc8, 0xb8a078]
    const houseStyles = ['cottage', 'farmhouse', 'barn', 'bungalow'] as const
    for (let i = 0; i < 12; i++) {
      const cottage = makeCottage(
        wallColors[i % wallColors.length]!,
        roofColors[i % roofColors.length]!,
        houseStyles[i % houseStyles.length],
      )
      const x = this.stageBlastX - 5.5 + (i % 6) * 1.2 + (i >= 6 ? 0.4 : 0)
      const z = 1.55 + Math.floor(i / 6) * 1.7 + (i % 3) * 0.35 + Math.sin(i * 1.7) * 0.2
      if (Math.hypot(x - this.stageBlastX, z - this.stageBlastZ) < 1.6) continue
      cottage.position.set(x, gy, z)
      cottage.rotation.y = (Math.random() - 0.5) * 0.45
      cottage.scale.setScalar(0.9 + (i % 3) * 0.08)
      this.markDestruct(cottage, 'house', { mass: 0.85, seed: Math.random() })
      this.root.add(cottage)
    }

    // Split-rail fence
    for (let i = 0; i < 20; i++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), std(0x6b4a32))
      post.position.set(this.stageBlastX - 5.8 + i * 0.6, gy + 0.25, 1.15)
      this.markDestruct(post, 'pole', { mass: 0.35, seed: Math.random() })
      this.root.add(post)
      if (i < 19) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.05), std(0x7a5a3a))
        rail.position.set(this.stageBlastX - 5.5 + i * 0.6, gy + 0.35, 1.15)
        this.root.add(rail)
      }
    }

    for (let i = 0; i < 55; i++) {
      const style = i % 5 === 0 ? 'round' : i % 7 === 0 ? 'bush' : 'pine'
      const tree = makeTree(style)
      const x = this.stageBlastX + (Math.random() - 0.5) * 13
      const z = 1.1 + Math.random() * Math.max(4.5, this.stageBlastZ - 1.2)
      if (Math.hypot(x - this.stageBlastX, z - this.stageBlastZ) < 1.4) continue
      tree.position.set(x, gy, z)
      tree.scale.setScalar(0.85 + Math.random() * 0.4)
      this.markDestruct(tree, 'tree', { mass: 0.42, seed: Math.random() })
      this.root.add(tree)
    }
  }

  private buildMountainRidge() {
    const gy = this.groundY()
    const rock = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 18),
      this.mat(0x6a6560, 0x6a6560, 0.08, THREE.DoubleSide),
    )
    rock.rotation.x = -Math.PI / 2
    rock.position.set(this.stageBlastX, gy + 0.03, this.stageBlastZ * 0.45)
    rock.receiveShadow = true
    this.root.add(rock)

    for (let i = 0; i < 32; i++) {
      const boulder = makeBoulder(0.12 + Math.random() * 0.28)
      const x = this.stageBlastX + (Math.random() - 0.5) * 10
      const z = 1.3 + Math.random() * 5
      if (Math.hypot(x - this.stageBlastX, z - this.stageBlastZ) < 1.3) continue
      boulder.position.set(x, gy + 0.1, z)
      boulder.rotation.set(Math.random(), Math.random(), Math.random())
      this.markDestruct(boulder, 'prop', { mass: 0.6 + Math.random() * 0.5, seed: Math.random() })
      this.root.add(boulder)
    }

    for (let i = 0; i < 16; i++) {
      const h = 1.9 + Math.random() * 2.7
      const peak = makePeak(h)
      const x = (i - 7.5) * 1.05
      const z = 1.7 + (i % 4) * 1.05
      if (Math.hypot(x - this.stageBlastX, z - this.stageBlastZ) < 1.5) {
        // Push slightly away from crater
        peak.position.set(x * 1.15, gy, z + 0.8)
      } else {
        peak.position.set(x, gy, z)
      }
      this.markDestruct(peak, 'peak', { mass: 1.7, seed: Math.random() })
      this.root.add(peak)
    }

    for (let i = 0; i < 22; i++) {
      const tree = makeTree('pine')
      tree.scale.setScalar(0.7 + Math.random() * 0.35)
      tree.position.set(
        this.stageBlastX + (Math.random() - 0.5) * 11,
        gy,
        1.5 + Math.random() * 5,
      )
      this.markDestruct(tree, 'tree', { mass: 0.4, seed: Math.random() })
      this.root.add(tree)
    }
  }
}

function easeOut(t: number) {
  const u = Math.min(1, Math.max(0, t))
  return 1 - (1 - u) * (1 - u)
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}
