import * as THREE from 'three'
import { EARTH_RADIUS, enuFrame, latLonToVector3, vector3ToLatLon } from './geo'
import { NUKES, type NukeLoadout } from './loadouts'
import { createNukeModel } from './models'

export type NukeState = 'idle' | 'falling' | 'exploding' | 'done'

/** Tiny beat before mushroom rises — watched from overlook POV. */
export const VIGNETTE_UNTIL = 0.15
/** Cap + stem fully risen (from impact). */
export const MUSHROOM_FORMED_AT = 3.0
/**
 * Surface diorama then cut to orbital cam.
 * Leave early (mid-bloom) so the cap finishes rising in aerial view.
 */
/** Surface diorama runtime — hold → slow-mo → brutal cascade, then orbital cut. */
export const GROUND_POV_UNTIL = 3.55
/** Total explode phase length (ground POV → grow → hold → fade). */
const MUSHROOM_DURATION = 10.5
/** Matches land shell in world.ts — detonate on first contact with the surface. */
const SURFACE_RADIUS = EARTH_RADIUS + 0.28
const DROP_SCALE = 0.16
const IMPACT_SCALE = 0.055
const TRAIL_LEN = 280
const EMBER_COUNT = 90

export class Nuke {
  readonly group = new THREE.Group()
  state: NukeState = 'idle'
  loadout: NukeLoadout = NUKES[1]!

  private body: THREE.Group
  private trail: THREE.Points
  private trailPositions: Float32Array
  private trailColors: Float32Array
  private trailIndex = 0
  private embers: THREE.Points
  private emberPos: Float32Array
  private emberVel: Float32Array
  private emberLife: Float32Array
  private velocity = new THREE.Vector3()
  private spin = 0
  private explodeT = 0
  private fallT = 0
  private dropRadius = EARTH_RADIUS + 38
  private fireball: THREE.Mesh
  private fireballInner: THREE.Mesh
  private shockwave: THREE.Mesh
  private shockwave2: THREE.Mesh
  private heatHaze: THREE.Mesh
  private hitMarker!: THREE.Group
  private hitRing!: THREE.Mesh
  private mushroom!: THREE.Group
  private groundSkirt!: THREE.Mesh
  private stem!: THREE.Mesh
  private neck!: THREE.Mesh
  private cap!: THREE.Mesh
  private capUnderside!: THREE.Mesh
  private core!: THREE.Mesh
  private puffClouds: THREE.Mesh[] = []
  private groundMat!: THREE.MeshStandardMaterial
  private stemMat!: THREE.MeshStandardMaterial
  private capMat!: THREE.MeshStandardMaterial
  private underMat!: THREE.MeshStandardMaterial
  private coreMat!: THREE.MeshStandardMaterial
  private gravity = 4.2
  private terminalSpeed = 14
  private impactUp = new THREE.Vector3(0, 1, 0)
  private replayTarget: THREE.Vector3 | null = null
  private fins: THREE.Object3D | null = null
  private blastLight: THREE.PointLight

  impactLat = 0
  impactLon = 0

  /** 0 at drop, 1 at surface — for cinematic camera. */
  get fallProgress(): number {
    if (this.state !== 'falling') return this.state === 'exploding' || this.state === 'done' ? 1 : 0
    const span = Math.max(1, this.dropRadius - SURFACE_RADIUS)
    return clamp01(1 - (this.group.position.length() - SURFACE_RADIUS) / span)
  }

  /** Seconds since impact flash started. */
  get explodeAge(): number {
    return this.explodeT
  }

  /** True once the mushroom silhouette has fully bloomed. */
  get mushroomFormed(): boolean {
    return this.state === 'exploding' || this.state === 'done'
      ? this.explodeT >= MUSHROOM_FORMED_AT
      : false
  }

  constructor() {
    this.body = new THREE.Group()
    this.group.add(this.body)
    this.applyLoadout(NUKES[1]!)

    this.trailPositions = new Float32Array(TRAIL_LEN * 3)
    this.trailColors = new Float32Array(TRAIL_LEN * 3)
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3))
    trailGeo.setAttribute('color', new THREE.BufferAttribute(this.trailColors, 3))
    this.trail = new THREE.Points(
      trailGeo,
      new THREE.PointsMaterial({
        size: 0.14,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        sizeAttenuation: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.trail.frustumCulled = false
    this.trail.name = 'nukeTrail'
    // World-space — attached to scene in beginFall

    this.emberPos = new Float32Array(EMBER_COUNT * 3)
    this.emberVel = new Float32Array(EMBER_COUNT * 3)
    this.emberLife = new Float32Array(EMBER_COUNT)
    const emberGeo = new THREE.BufferGeometry()
    emberGeo.setAttribute('position', new THREE.BufferAttribute(this.emberPos, 3))
    this.embers = new THREE.Points(
      emberGeo,
      new THREE.PointsMaterial({
        color: 0xff8030,
        size: 0.1,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.embers.visible = false
    this.embers.name = 'nukeEmbers'

    this.fireball = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 1),
      new THREE.MeshStandardMaterial({
        color: 0xff6a2e,
        emissive: 0xff3b00,
        emissiveIntensity: 2.4,
        flatShading: true,
        roughness: 0.45,
      }),
    )
    this.fireball.visible = false
    this.group.add(this.fireball)

    this.fireballInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.35, 0),
      new THREE.MeshBasicMaterial({
        color: 0xffe8a0,
        transparent: true,
        opacity: 0.95,
      }),
    )
    this.fireballInner.visible = false
    this.group.add(this.fireballInner)

    this.shockwave = new THREE.Mesh(
      new THREE.RingGeometry(0.25, 0.7, 36),
      new THREE.MeshBasicMaterial({
        color: 0xffd2a0,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    this.shockwave.visible = false
    this.group.add(this.shockwave)

    this.shockwave2 = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.55, 40),
      new THREE.MeshBasicMaterial({
        color: 0xffaa66,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    this.shockwave2.visible = false
    this.group.add(this.shockwave2)

    this.heatHaze = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0xff8844,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    )
    this.heatHaze.visible = false
    this.group.add(this.heatHaze)

    this.blastLight = new THREE.PointLight(0xff6622, 0, 40, 2)
    this.group.add(this.blastLight)

    this.buildHitMarker()
    this.buildMushroom()
    this.group.visible = false
  }

  private buildHitMarker() {
    this.hitMarker = new THREE.Group()
    this.hitMarker.visible = false

    const red = new THREE.MeshBasicMaterial({
      color: 0xe02424,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    })

    const arm = new THREE.PlaneGeometry(1.65, 0.28)
    const a = new THREE.Mesh(arm, red)
    const b = new THREE.Mesh(arm, red)
    a.rotation.z = Math.PI / 4
    b.rotation.z = -Math.PI / 4
    a.renderOrder = 4
    b.renderOrder = 4
    this.hitMarker.add(a, b)

    this.hitRing = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.15, 28),
      new THREE.MeshBasicMaterial({
        color: 0xe02424,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      }),
    )
    this.hitRing.renderOrder = 4
    this.hitMarker.add(this.hitRing)

    this.group.add(this.hitMarker)
  }

  /** Classic nuke silhouette: soft base cloud → thin column → wide flat cap. */
  private buildMushroom() {
    this.groundMat = new THREE.MeshStandardMaterial({
      color: 0x6a6058,
      emissive: 0xff5a18,
      emissiveIntensity: 0.35,
      flatShading: true,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      roughness: 1,
    })
    this.stemMat = new THREE.MeshStandardMaterial({
      color: 0xd8d0c4,
      emissive: 0xff7a28,
      emissiveIntensity: 0.45,
      flatShading: true,
      transparent: false,
      opacity: 1,
      roughness: 0.95,
    })
    this.capMat = new THREE.MeshStandardMaterial({
      color: 0xf0ebe0,
      emissive: 0xff6a20,
      emissiveIntensity: 0.5,
      flatShading: true,
      transparent: false,
      opacity: 1,
      roughness: 0.9,
    })
    this.underMat = new THREE.MeshStandardMaterial({
      color: 0xffb060,
      emissive: 0xff3a00,
      emissiveIntensity: 1.1,
      flatShading: true,
      transparent: false,
      opacity: 1,
      roughness: 0.7,
    })
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0xffe8a0,
      emissive: 0xffaa30,
      emissiveIntensity: 2.2,
      flatShading: true,
      transparent: false,
      opacity: 1,
      roughness: 0.4,
    })

    this.mushroom = new THREE.Group()
    this.mushroom.visible = false

    this.groundSkirt = new THREE.Mesh(
      lathe(
        [
          [0.2, 0.02],
          [1.6, 0.05],
          [2.4, 0.18],
          [2.8, 0.35],
          [2.5, 0.55],
          [1.4, 0.45],
          [0.4, 0.2],
        ],
        14,
      ),
      this.groundMat,
    )
    this.mushroom.add(this.groundSkirt)

    this.stem = new THREE.Mesh(
      lathe(
        [
          [0.0, 0.0],
          [0.42, 0.0],
          [0.38, 0.25],
          [0.33, 0.8],
          [0.3, 1.8],
          [0.28, 3.0],
          [0.3, 4.0],
          [0.38, 4.6],
          [0.55, 4.95],
          [0.0, 5.05],
        ],
        14,
      ),
      this.stemMat,
    )
    this.mushroom.add(this.stem)

    this.neck = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6), this.underMat)
    this.neck.scale.set(1.1, 0.7, 1.1)
    this.neck.position.y = 4.85
    this.neck.visible = false
    this.mushroom.add(this.neck)

    this.core = new THREE.Mesh(new THREE.SphereGeometry(0.4, 7, 5), this.coreMat)
    this.core.position.y = 2.8
    this.core.visible = false
    this.mushroom.add(this.core)

    this.capUnderside = new THREE.Mesh(
      lathe(
        [
          [0.5, 0.0],
          [1.8, 0.05],
          [3.0, 0.15],
          [3.5, 0.35],
          [3.3, 0.55],
          [2.2, 0.45],
          [0.6, 0.25],
          [0.0, 0.15],
        ],
        14,
      ),
      this.underMat,
    )
    this.capUnderside.position.y = 4.95
    this.capUnderside.visible = false
    this.mushroom.add(this.capUnderside)

    this.cap = new THREE.Mesh(
      lathe(
        [
          [0.4, 0.0],
          [2.2, 0.1],
          [3.4, 0.35],
          [3.7, 0.7],
          [3.5, 1.05],
          [2.8, 1.35],
          [1.6, 1.55],
          [0.6, 1.65],
          [0.0, 1.7],
        ],
        14,
      ),
      this.capMat,
    )
    this.cap.position.y = 5.15
    this.cap.visible = false
    this.mushroom.add(this.cap)

    // Secondary puff lobes — denser ring + a few upper wisp balls
    this.puffClouds = []
    const puffMat = new THREE.MeshStandardMaterial({
      color: 0xe8e0d4,
      emissive: 0xff7a30,
      emissiveIntensity: 0.35,
      flatShading: true,
      roughness: 0.95,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
    for (let i = 0; i < 10; i++) {
      const puff = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42 + (i % 3) * 0.12, 0),
        puffMat.clone(),
      )
      puff.visible = false
      const a = (i / 10) * Math.PI * 2
      puff.userData.angle = a
      puff.userData.radius = 2.0 + (i % 4) * 0.4
      puff.userData.yBias = i < 8 ? 0 : 0.55 + (i % 2) * 0.25
      this.mushroom.add(puff)
      this.puffClouds.push(puff)
    }

    this.group.add(this.mushroom)
  }

  applyLoadout(loadout: NukeLoadout) {
    this.loadout = loadout
    this.body.clear()
    const model = createNukeModel(loadout)
    this.body.add(model)
    this.fins = model.getObjectByName('fins') ?? null
    this.body.scale.setScalar(DROP_SCALE)
  }

  drop(from: THREE.Vector3, planeForward: THREE.Vector3) {
    this.beginFall(from)

    const { east, north } = enuFrame(from)
    const drift = 0.55 * this.loadout.driftMul
    const driftE = (Math.random() - 0.5) * drift
    const driftN = (Math.random() - 0.5) * drift
    const inward = from.clone().normalize().negate()

    // Slow release — long cinematic arc toward Earth
    this.velocity
      .copy(inward)
      .multiplyScalar(2.2 + Math.random() * 0.6)
      .addScaledVector(planeForward, 1.4 + Math.random() * 0.5)
      .addScaledVector(east, driftE)
      .addScaledVector(north, driftN)

    this.gravity = 4.6 / this.loadout.fallMul
    this.terminalSpeed = 15 / this.loadout.fallMul
  }

  /**
   * Shared-link replay: fall from high altitude onto an exact impact point,
   * then run the normal explosion / mushroom sequence.
   */
  replayDrop(lat: number, lon: number) {
    const impact = latLonToVector3(lat, lon, SURFACE_RADIUS)
    const up = impact.clone().normalize()
    const { east, north } = enuFrame(impact)
    const from = impact
      .clone()
      .addScaledVector(up, 34)
      .addScaledVector(east, 9)
      .addScaledVector(north, -5)

    this.beginFall(from)
    this.impactLat = lat
    this.impactLon = lon

    this.velocity.copy(impact).sub(from).normalize().multiplyScalar(3.1)
    this.gravity = 3.4 / this.loadout.fallMul
    this.terminalSpeed = 16 / this.loadout.fallMul
    this.replayTarget = impact
  }

  private attachWorldFx() {
    const parent = this.group.parent
    if (!parent) return
    if (this.trail.parent !== parent) {
      this.trail.removeFromParent()
      parent.add(this.trail)
    }
    if (this.embers.parent !== parent) {
      this.embers.removeFromParent()
      parent.add(this.embers)
    }
  }

  private beginFall(from: THREE.Vector3) {
    this.state = 'falling'
    this.group.visible = true
    this.body.visible = true
    this.attachWorldFx()
    this.trail.visible = true
    this.embers.visible = true
    this.fireball.visible = false
    this.fireballInner.visible = false
    this.shockwave.visible = false
    this.shockwave2.visible = false
    this.heatHaze.visible = false
    this.mushroom.visible = false
    this.hitMarker.visible = false
    this.blastLight.intensity = 0
    this.explodeT = 0
    this.fallT = 0
    this.trailIndex = 0
    this.trailPositions.fill(0)
    this.trailColors.fill(0)
    this.emberLife.fill(0)
    this.body.scale.setScalar(DROP_SCALE)
    this.replayTarget = null

    this.group.position.copy(from)
    this.dropRadius = from.length()
  }

  /** Returns true when impact scoring should happen (once). */
  update(dt: number): boolean {
    if (this.state === 'idle' || this.state === 'done') return false

    if (this.state === 'falling') {
      this.fallT += dt
      const radial = this.group.position.clone().normalize()
      const progress = this.fallProgress

      // Soft accel early, stronger late — still capped so the fall lasts
      const g = this.gravity * (0.55 + progress * 1.15)
      this.velocity.addScaledVector(radial, -g * dt)

      // Bleed sideways motion so it settles into a clean dive
      const radialSpeed = this.velocity.dot(radial)
      const tangential = this.velocity.clone().addScaledVector(radial, -radialSpeed)
      this.velocity.addScaledVector(tangential, -Math.min(1, 1.8 * dt))

      const dive = this.velocity.dot(radial)
      if (dive < -this.terminalSpeed) {
        this.velocity.addScaledVector(radial, -dive - this.terminalSpeed)
      }

      const scale = THREE.MathUtils.lerp(DROP_SCALE, IMPACT_SCALE, easeIn(progress))
      this.body.scale.setScalar(scale)

      // Spin + fin flutter + wobble
      this.spin += dt * (2.4 + progress * 3.4)
      const tipDir = radial.clone().negate()
      this.body.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), tipDir)
      this.body.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.spin)
      const wobble = Math.sin(this.fallT * 3.4) * (0.14 - progress * 0.08)
      this.body.rotateOnAxis(new THREE.Vector3(1, 0, 0), wobble)
      if (this.fins) {
        this.fins.rotation.y = Math.sin(this.fallT * 9) * 0.08 * (1 - progress * 0.5)
      }

      this.pushTrail(progress)
      this.updateEmbers(dt, progress, true)

      const next = this.group.position.clone().addScaledVector(this.velocity, dt)

      if (this.replayTarget) {
        const toHit = this.replayTarget.clone().sub(next)
        const dist = toHit.length()
        if (dist < 0.45 || next.length() <= SURFACE_RADIUS) {
          this.group.position.copy(this.replayTarget)
          this.replayTarget = null
          this.beginExplosion()
          this.updateMushroom(0, this.loadout.blastScale, 0)
          return true
        }
        this.velocity.lerp(toHit.normalize().multiplyScalar(this.terminalSpeed), 1 - Math.exp(-dt * 2.2))
        this.group.position.copy(next)
        return false
      }

      if (next.length() <= SURFACE_RADIUS) {
        this.group.position.copy(next).setLength(SURFACE_RADIUS)
        this.beginExplosion()
        this.updateMushroom(0, this.loadout.blastScale, 0)
        return true
      }

      this.group.position.copy(next)
      return false
    }

    this.explodeT += dt
    const t = this.explodeT
    const blast = this.loadout.blastScale
    const mt = Math.max(0, t - VIGNETTE_UNTIL)

    // Vignette owns the surface flash — keep orbital orbs/rings off (they read as a
    // clunky blinking blob at the stem foot in overlook POV)
    this.fireball.visible = false
    this.fireballInner.visible = false
    this.shockwave.visible = false
    this.shockwave2.visible = false

    // Heat haze only after the ground cut — it z-fights the diorama floor
    const aerial = t >= GROUND_POV_UNTIL
    this.heatHaze.visible = aerial && t < 4.2
    if (this.heatHaze.visible) {
      const age = t - GROUND_POV_UNTIL
      const h = easeOut(clamp01(age / 0.35))
      this.heatHaze.scale.setScalar((2.2 + age * 3.2) * blast)
      const hm = this.heatHaze.material as THREE.MeshBasicMaterial
      hm.opacity = Math.max(0, 0.16 * h * (1 - age / 2.4))
    }

    // Dim orbital blast light during overlook — vignette has its own glow
    this.blastLight.intensity = aerial
      ? Math.max(0, 18 * Math.exp(-(t - GROUND_POV_UNTIL) * 1.2) * blast)
      : Math.max(0, 6 * Math.exp(-t * 2.2) * blast)
    this.updateHitMarker(t)
    this.updateEmbers(dt, 1, false)
    if (mt > 0) this.updateMushroom(mt, blast, dt)
    else this.mushroom.visible = false

    if (t > MUSHROOM_DURATION) this.state = 'done'
    return false
  }

  /**
   * Jump to post-mushroom end state for SKIP / Space —
   * cloud fully faded, FX off; keeps impact lat/lon.
   */
  skipToReveal() {
    if (this.state === 'falling') return false
    if (this.state !== 'exploding' && this.state !== 'done') return false
    this.explodeT = MUSHROOM_DURATION
    this.state = 'done'
    this.fireball.visible = false
    this.fireballInner.visible = false
    this.shockwave.visible = false
    this.shockwave2.visible = false
    this.heatHaze.visible = false
    this.blastLight.intensity = 0
    this.mushroom.visible = false
    this.hitMarker.visible = false
    this.embers.visible = false
    this.setMushroomTransparent(false)
    this.resetMushroomPose()
    return true
  }

  private beginExplosion() {
    const ll = vector3ToLatLon(this.group.position)
    this.impactLat = ll.lat
    this.impactLon = ll.lon
    this.replayTarget = null
    this.state = 'exploding'
    this.explodeT = 0
    this.body.visible = false
    this.trail.visible = false
    this.embers.visible = true
    // Ground diorama plays the flash — keep orbital orbs/rings off so they don't
    // sit in the overlook as a clunky blinking blob at the stem foot
    this.fireball.visible = false
    this.fireballInner.visible = false
    this.shockwave.visible = false
    this.shockwave2.visible = false
    this.heatHaze.visible = false
    this.mushroom.visible = false
    this.impactUp.copy(this.group.position).normalize()
    this.shockwave.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.impactUp)
    this.shockwave2.quaternion.copy(this.shockwave.quaternion)
    this.mushroom.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.impactUp)
    this.mushroom.scale.set(1, 1, 1)
    // Bury stem into the diorama floor so the foot doesn't z-fight / flicker
    this.mushroom.position.copy(this.impactUp).multiplyScalar(-0.14)
    this.blastLight.intensity = 32

    // Burst embers outward on contact (world space)
    this.attachWorldFx()
    const origin = this.group.position
    for (let i = 0; i < EMBER_COUNT; i++) {
      const a = Math.random() * Math.PI * 2
      const elev = Math.random() * Math.PI * 0.45
      const spd = 2 + Math.random() * 7
      this.emberPos[i * 3] = origin.x
      this.emberPos[i * 3 + 1] = origin.y
      this.emberPos[i * 3 + 2] = origin.z
      const { east, north } = enuFrame(origin)
      const dir = east
        .clone()
        .multiplyScalar(Math.cos(a) * Math.cos(elev))
        .add(north.clone().multiplyScalar(Math.sin(a) * Math.cos(elev)))
        .add(this.impactUp.clone().multiplyScalar(Math.sin(elev) + 0.35))
      this.emberVel[i * 3] = dir.x * spd
      this.emberVel[i * 3 + 1] = dir.y * spd
      this.emberVel[i * 3 + 2] = dir.z * spd
      this.emberLife[i] = 0.6 + Math.random() * 1.2
    }
    ;(this.embers.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true

    this.hitMarker.visible = false
    this.hitMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.impactUp)
    this.hitMarker.position.copy(this.impactUp).multiplyScalar(0.03)
    this.hitRing.scale.setScalar(1)

    this.resetMushroomPose()
    this.setMushroomTransparent(false)
  }

  private updateHitMarker(t: number) {
    // Small buffer so the red X never flashes into the ground diorama
    const show = t >= GROUND_POV_UNTIL + 0.12
    this.hitMarker.visible = show
    if (!show) return
    const pulse = 1 + Math.sin(t * 3.2) * 0.06
    this.hitRing.scale.setScalar(pulse)
    const mat = this.hitRing.material as THREE.MeshBasicMaterial
    mat.opacity = 0.7 + Math.sin(t * 3.2) * 0.15
  }

  private resetMushroomPose() {
    this.groundSkirt.scale.set(0.3, 0.2, 0.3)
    this.stem.scale.set(0.2, 0.35, 0.2)
    this.neck.scale.set(0.2, 0.2, 0.2)
    this.neck.position.y = 0.4
    this.neck.visible = false
    this.core.scale.set(0.3, 0.3, 0.3)
    this.core.position.y = 0.3
    this.core.visible = false
    this.cap.scale.set(0.15, 0.15, 0.15)
    this.cap.position.y = 0.5
    this.cap.visible = false
    this.capUnderside.scale.set(0.15, 0.15, 0.15)
    this.capUnderside.position.y = 0.45
    this.capUnderside.visible = false
    for (const p of this.puffClouds) {
      p.visible = false
      p.scale.setScalar(0.1)
    }
  }

  private setMushroomTransparent(on: boolean) {
    for (const mat of [this.stemMat, this.capMat, this.underMat, this.coreMat]) {
      mat.transparent = on
      mat.depthWrite = !on
      if (!on) mat.opacity = 1
    }
    this.groundMat.transparent = true
    this.groundMat.depthWrite = false
  }

  private updateMushroom(t: number, blast: number, dt: number) {
    const skirt = easeOut(clamp01(t / 0.45))
    const stem = easeOut(clamp01(t / 1.0))
    const bloom = easeOut(clamp01((t - 0.35) / 1.15))
    const rise = easeOut(clamp01((t - 0.9) / 2.2))
    const fade = t > 6.8 ? clamp01(1 - (t - 6.8) / 1.8) : 1
    const unit = 1.15 * blast

    // Thin/tall skirt — a wide flat disc z-fights the diorama floor and blinks
    const g = 0.35 + skirt * 0.75
    this.groundSkirt.scale.set(g * unit, (0.4 + skirt * 0.45) * unit, g * unit)
    this.groundSkirt.rotation.y += dt * 0.12

    const stemH = 0.45 + stem * 0.55
    const stemW = 0.22 + stem * 0.55 + bloom * 0.12
    this.stem.scale.set(stemW * unit, stemH * unit, stemW * unit)
    // Subtle stem sway
    this.stem.rotation.z = Math.sin(t * 1.4) * 0.02 * bloom

    if (t >= 0.04) this.mushroom.visible = true

    const topY = 5.0 * stemH * unit
    this.core.visible = stem > 0.08
    this.core.position.y = topY * 0.55
    this.core.scale.setScalar((0.5 + stem * 0.9) * unit * (1 - rise * 0.25))
    this.core.rotation.y += dt * 0.8

    const showCap = bloom > 0.06
    this.neck.visible = showCap
    this.cap.visible = showCap
    this.capUnderside.visible = showCap
    this.neck.position.y = topY
    this.neck.scale.setScalar((0.3 + bloom * 1.1) * unit)

    const capY = topY + (0.15 + bloom * 0.25 + rise * 0.9) * unit
    const capW = (0.35 + bloom * 0.95) * unit
    const capH = (0.3 + bloom * 0.5 + rise * 0.2) * unit
    this.cap.position.y = capY
    this.cap.scale.set(capW, capH, capW)
    this.cap.rotation.y += dt * 0.22

    this.capUnderside.position.y = capY - 0.15 * unit
    this.capUnderside.scale.set(capW * 1.02, capH * 0.55, capW * 1.02)
    this.capUnderside.rotation.y -= dt * 0.18

    // Puff lobes around the cap rim
    for (let i = 0; i < this.puffClouds.length; i++) {
      const puff = this.puffClouds[i]!
      const show = bloom > 0.2
      puff.visible = show
      if (!show) continue
      const a = (puff.userData.angle as number) + t * 0.12
      const r = (puff.userData.radius as number) * capW * 0.85
      const yBias = (puff.userData.yBias as number | undefined) ?? 0
      puff.position.set(
        Math.cos(a) * r,
        capY + yBias * unit + Math.sin(t * 1.5 + i) * 0.15 * unit,
        Math.sin(a) * r,
      )
      const s = (0.35 + bloom * 0.7 + (i % 3) * 0.08) * unit
      puff.scale.setScalar(s)
      const pm = puff.material as THREE.MeshStandardMaterial
      pm.emissiveIntensity = Math.max(0.05, 0.5 - t * 0.08)
      pm.opacity = 0.75 * fade
    }

    const heat = Math.max(0.05, 1.15 - t * 0.22)
    const ash = clamp01((t - 2.5) / 2.5)
    this.stemMat.color.setHex(lerpHex(0xffc090, 0xc8c2b8, ash))
    this.capMat.color.setHex(lerpHex(0xffe0c0, 0xe8e4dc, ash))
    this.groundMat.color.setHex(lerpHex(0x8a6050, 0x6a6058, ash))

    this.stemMat.emissiveIntensity = heat * 0.4
    this.capMat.emissiveIntensity = heat * 0.45
    this.underMat.emissiveIntensity = heat * 1.15
    this.coreMat.emissiveIntensity = 1.4 + heat * 1.2
    this.groundMat.emissiveIntensity = heat * 0.5
    this.groundMat.opacity = 0.28 * (0.55 + skirt * 0.45)

    if (fade < 1) {
      this.setMushroomTransparent(true)
      this.groundMat.opacity *= fade
      this.stemMat.opacity = 0.96 * fade
      this.capMat.opacity = 0.97 * fade
      this.underMat.opacity = 0.9 * fade
      this.coreMat.opacity = 0.95 * fade
    }

    if (fade <= 0) this.mushroom.visible = false
  }

  private pushTrail(progress: number) {
    const i = this.trailIndex % TRAIL_LEN
    this.trailPositions[i * 3] = this.group.position.x
    this.trailPositions[i * 3 + 1] = this.group.position.y
    this.trailPositions[i * 3 + 2] = this.group.position.z

    // Hot white → orange → dim red along heat
    const heat = 0.55 + progress * 0.45
    this.trailColors[i * 3] = 1.0
    this.trailColors[i * 3 + 1] = 0.45 + heat * 0.35
    this.trailColors[i * 3 + 2] = 0.2 + (1 - progress) * 0.35

    this.trailIndex++
    const attr = this.trail.geometry.getAttribute('position') as THREE.BufferAttribute
    attr.needsUpdate = true
    const cAttr = this.trail.geometry.getAttribute('color') as THREE.BufferAttribute
    cAttr.needsUpdate = true

    const trailMat = this.trail.material as THREE.PointsMaterial
    trailMat.size = THREE.MathUtils.lerp(0.22, 0.07, progress)
    trailMat.opacity = THREE.MathUtils.lerp(0.5, 0.95, progress)
  }

  private updateEmbers(dt: number, progress: number, falling: boolean) {
    const mat = this.embers.material as THREE.PointsMaterial
    if (falling) {
      // Spawn sparse heat flakes along the trail
      mat.opacity = 0.15 + progress * 0.55
      mat.size = THREE.MathUtils.lerp(0.12, 0.05, progress)
      for (let i = 0; i < EMBER_COUNT; i++) {
        if (this.emberLife[i]! <= 0 && Math.random() < dt * 8 * progress) {
          this.emberLife[i] = 0.35 + Math.random() * 0.5
          const j = (this.trailIndex + TRAIL_LEN - 1 - Math.floor(Math.random() * 12)) % TRAIL_LEN
          this.emberPos[i * 3] = this.trailPositions[j * 3]! + (Math.random() - 0.5) * 0.3
          this.emberPos[i * 3 + 1] = this.trailPositions[j * 3 + 1]! + (Math.random() - 0.5) * 0.3
          this.emberPos[i * 3 + 2] = this.trailPositions[j * 3 + 2]! + (Math.random() - 0.5) * 0.3
          this.emberVel[i * 3] = (Math.random() - 0.5) * 1.2
          this.emberVel[i * 3 + 1] = (Math.random() - 0.5) * 1.2
          this.emberVel[i * 3 + 2] = (Math.random() - 0.5) * 1.2
        }
        if (this.emberLife[i]! <= 0) continue
        this.emberLife[i]! -= dt
        this.emberPos[i * 3]! += this.emberVel[i * 3]! * dt
        this.emberPos[i * 3 + 1]! += this.emberVel[i * 3 + 1]! * dt
        this.emberPos[i * 3 + 2]! += this.emberVel[i * 3 + 2]! * dt
      }
    } else {
      // World-space burst — positions relative to group origin (at impact)
      let alive = 0
      for (let i = 0; i < EMBER_COUNT; i++) {
        if (this.emberLife[i]! <= 0) continue
        alive++
        this.emberLife[i]! -= dt
        this.emberVel[i * 3 + 1]! -= 2.5 * dt // mild settle along world Y — approximate
        // Pull slightly back toward surface normal in local: damp outward
        this.emberVel[i * 3]! *= 1 - 0.4 * dt
        this.emberVel[i * 3 + 1]! *= 1 - 0.4 * dt
        this.emberVel[i * 3 + 2]! *= 1 - 0.4 * dt
        this.emberPos[i * 3]! += this.emberVel[i * 3]! * dt
        this.emberPos[i * 3 + 1]! += this.emberVel[i * 3 + 1]! * dt
        this.emberPos[i * 3 + 2]! += this.emberVel[i * 3 + 2]! * dt
      }
      mat.opacity = Math.min(0.9, alive / EMBER_COUNT)
      mat.size = 0.08
      if (alive === 0) this.embers.visible = false
    }
    ;(this.embers.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
  }

  reset() {
    this.state = 'idle'
    this.group.visible = false
    this.body.visible = true
    this.trail.visible = false
    this.embers.visible = false
    this.fireball.visible = false
    this.fireballInner.visible = false
    this.shockwave.visible = false
    this.shockwave2.visible = false
    this.heatHaze.visible = false
    this.mushroom.visible = false
    this.mushroom.position.set(0, 0, 0)
    this.hitMarker.visible = false
    this.replayTarget = null
    this.blastLight.intensity = 0
    this.fireball.scale.setScalar(1)
    this.shockwave.scale.setScalar(1)
    this.setMushroomTransparent(false)
    this.resetMushroomPose()
    this.explodeT = 0
  }
}

function lathe(profile: [number, number][], segments: number): THREE.LatheGeometry {
  const pts = profile.map(([x, y]) => new THREE.Vector2(x, y))
  return new THREE.LatheGeometry(pts, segments)
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t)
}

function easeIn(t: number) {
  return t * t
}

function lerpHex(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return (r << 16) | (g << 8) | bl
}
