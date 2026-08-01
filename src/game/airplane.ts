import * as THREE from 'three'
import {
  EARTH_RADIUS,
  ORBIT_ALTITUDE,
  ORBIT_RADIUS,
  CRUISE_SPEED,
  bearingDirection,
  enuFrame,
  latLonToVector3,
} from './geo'
import { PLANES, type PlaneLoadout } from './loadouts'
import { createPlaneModel } from './models'

const TRAIL_LEN = 48

export class Airplane {
  readonly group = new THREE.Group()

  bearing = 0
  bank = 0
  speed = CRUISE_SPEED
  altitude = ORBIT_ALTITUDE
  loadout: PlaneLoadout = PLANES[0]!

  private model = new THREE.Group()
  private propeller: THREE.Object3D = new THREE.Group()
  private propDisc: THREE.Mesh | null = null
  private propSpin = 0
  private readonly forwardVec = new THREE.Vector3()
  private readonly upVec = new THREE.Vector3()
  private bankVel = 0
  private pitchBob = 0
  private bobPhase = 0
  private bayOpen = 0
  private prevSpeed = CRUISE_SPEED
  private exhaustPulse = 0

  private aileronL: THREE.Object3D | null = null
  private aileronR: THREE.Object3D | null = null
  private elevatorL: THREE.Object3D | null = null
  private elevatorR: THREE.Object3D | null = null
  private rudder: THREE.Object3D | null = null
  private bayDoorL: THREE.Object3D | null = null
  private bayDoorR: THREE.Object3D | null = null
  private exhaustL: THREE.Mesh | null = null
  private exhaustR: THREE.Mesh | null = null
  private wing: THREE.Object3D | null = null

  private trails: THREE.Points[] = []
  private trailPos: Float32Array[] = []
  private trailIdx = [0, 0]
  private trailTips: THREE.Object3D[] = []
  private readonly tmpWorld = new THREE.Vector3()

  constructor() {
    this.group.add(this.model)
    this.applyLoadout(PLANES[0]!)
    this.place(28, -8, 0.15)
  }

  applyLoadout(loadout: PlaneLoadout) {
    this.loadout = loadout
    this.disposeTrails()
    this.group.remove(this.model)
    this.model = createPlaneModel(loadout)
    this.group.add(this.model)
    this.bindParts()
    this.buildContrails()
    this.speed = CRUISE_SPEED * loadout.speedMul
    this.prevSpeed = this.speed
    this.bayOpen = 0
  }

  /** Call when the bomb leaves the bay. */
  openBay() {
    this.bayOpen = 1
  }

  closeBay() {
    this.bayOpen = 0
  }

  place(lat: number, lon: number, bearing: number) {
    this.bearing = bearing
    this.altitude = ORBIT_ALTITUDE
    this.bayOpen = 0
    latLonToVector3(lat, lon, EARTH_RADIUS + this.altitude, this.group.position)
    this.orient()
  }

  update(
    dt: number,
    input: { forward: boolean; back: boolean; left: boolean; right: boolean },
  ) {
    const turnSpeed = 1.1 * this.loadout.turnMul
    if (input.left) this.bearing -= turnSpeed * dt
    if (input.right) this.bearing += turnSpeed * dt

    const cruise = CRUISE_SPEED * this.loadout.speedMul
    if (input.forward) {
      this.speed = THREE.MathUtils.lerp(this.speed, cruise * 1.35, dt * 1.8)
    } else if (input.back) {
      this.speed = THREE.MathUtils.lerp(this.speed, cruise * 0.55, dt * 1.8)
    } else {
      this.speed = THREE.MathUtils.lerp(this.speed, cruise, dt)
    }

    // Critically-damped bank with slight overshoot — studio arcade feel
    const targetBank = input.left ? -0.62 : input.right ? 0.62 : 0
    const bankAccel = (targetBank - this.bank) * 28 - this.bankVel * 8.5
    this.bankVel += bankAccel * dt
    this.bank += this.bankVel * dt
    this.bank = THREE.MathUtils.clamp(this.bank, -0.85, 0.85)

    const dir = bearingDirection(this.group.position, this.bearing)
    this.group.position.addScaledVector(dir, this.speed * dt)
    this.group.position.setLength(EARTH_RADIUS + this.altitude)

    this.reprojectBearing(dir)
    this.orient()
    this.animateSurfaces(dt, input)
    this.updateContrails(dt)

    this.propSpin += dt * (16 + this.speed * 0.95)
    this.propeller.rotation.z = this.propSpin

    this.prevSpeed = this.speed
  }

  private bindParts() {
    this.propeller = this.model.getObjectByName('propeller') ?? new THREE.Group()
    this.propDisc = (this.model.getObjectByName('propDisc') as THREE.Mesh) ?? null
    this.aileronL = this.model.getObjectByName('aileronL') ?? null
    this.aileronR = this.model.getObjectByName('aileronR') ?? null
    this.elevatorL = this.model.getObjectByName('elevatorL') ?? null
    this.elevatorR = this.model.getObjectByName('elevatorR') ?? null
    this.rudder = this.model.getObjectByName('rudder') ?? null
    this.bayDoorL = this.model.getObjectByName('bayDoorL') ?? null
    this.bayDoorR = this.model.getObjectByName('bayDoorR') ?? null
    this.exhaustL = (this.model.getObjectByName('exhaustL') as THREE.Mesh) ?? null
    this.exhaustR = (this.model.getObjectByName('exhaustR') as THREE.Mesh) ?? null
    this.wing = this.model.getObjectByName('wing') ?? null
    this.trailTips = [
      this.model.getObjectByName('trailTipL') ?? new THREE.Object3D(),
      this.model.getObjectByName('trailTipR') ?? new THREE.Object3D(),
    ]
  }

  private animateSurfaces(
    dt: number,
    input: { forward: boolean; back: boolean; left: boolean; right: boolean },
  ) {
    this.bobPhase += dt * (1.6 + Math.abs(this.bank) * 1.2)
    const accel = (this.speed - this.prevSpeed) / Math.max(dt, 1e-4)
    const pitchFromAccel = THREE.MathUtils.clamp(-accel * 0.012, -0.18, 0.22)
    const targetBob = Math.sin(this.bobPhase) * 0.025 + pitchFromAccel
    this.pitchBob = THREE.MathUtils.lerp(this.pitchBob, targetBob, 1 - Math.exp(-dt * 6))

    // Subtle wing flex under load
    if (this.wing) {
      const flex = Math.abs(this.bank) * 0.04 + Math.sin(this.bobPhase * 2.1) * 0.008
      this.wing.rotation.z = this.bank * 0.04
      this.wing.position.y = flex * 0.15
    }

    const ail = this.bank * 0.55
    if (this.aileronL) this.aileronL.rotation.x = ail
    if (this.aileronR) this.aileronR.rotation.x = -ail

    const elev = this.pitchBob * 2.2 + (input.forward ? -0.18 : input.back ? 0.22 : 0)
    if (this.elevatorL) this.elevatorL.rotation.x = elev
    if (this.elevatorR) this.elevatorR.rotation.x = elev

    const rud = (input.left ? 0.35 : 0) + (input.right ? -0.35 : 0) + this.bank * 0.15
    if (this.rudder) this.rudder.rotation.y = rud

    // Bay doors swing open on drop
    const bayTarget = this.bayOpen
    const doorAng = THREE.MathUtils.lerp(
      this.bayDoorL?.rotation.z ?? 0,
      bayTarget * 1.35,
      1 - Math.exp(-dt * 7),
    )
    if (this.bayDoorL) {
      this.bayDoorL.rotation.z = doorAng
      this.bayDoorL.position.y = -0.32 - bayTarget * 0.05
    }
    if (this.bayDoorR) {
      this.bayDoorR.rotation.z = -doorAng
      this.bayDoorR.position.y = -0.32 - bayTarget * 0.05
    }

    // Exhaust glow pulses with throttle
    this.exhaustPulse += dt * 14
    const throttle = this.speed / (CRUISE_SPEED * this.loadout.speedMul)
    const glow = 0.35 + throttle * 0.55 + Math.sin(this.exhaustPulse) * 0.12
    for (const ex of [this.exhaustL, this.exhaustR]) {
      if (!ex) continue
      const mat = ex.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = glow
      ex.scale.setScalar(0.9 + throttle * 0.25)
    }

    // Prop disc opacity at high RPM
    if (this.propDisc) {
      const mat = this.propDisc.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.smoothstep(throttle, 0.7, 1.15) * 0.28
    }

    // Micro turbulence on the model
    this.model.rotation.x = this.pitchBob
    this.model.rotation.z = Math.sin(this.bobPhase * 1.7) * 0.012 * (0.4 + Math.abs(this.bank))
  }

  private buildContrails() {
    this.trails = []
    this.trailPos = []
    this.trailIdx = [0, 0]
    for (let t = 0; t < 2; t++) {
      const pos = new Float32Array(TRAIL_LEN * 3)
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const pts = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: 0xe8f4f8,
          size: 0.35,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
        }),
      )
      pts.frustumCulled = false
      pts.name = t === 0 ? 'contrailL' : 'contrailR'
      // World-space trails — parented to scene when available
      this.trails.push(pts)
      this.trailPos.push(pos)
    }
    this.attachTrails()
  }

  private attachTrails() {
    const parent = this.group.parent
    if (!parent) return
    for (const t of this.trails) {
      if (t.parent !== parent) {
        t.removeFromParent()
        parent.add(t)
      }
    }
  }

  private disposeTrails() {
    for (const t of this.trails) {
      t.removeFromParent()
      t.geometry.dispose()
      ;(t.material as THREE.Material).dispose()
    }
    this.trails = []
    this.trailPos = []
  }

  private updateContrails(dt: number) {
    if (this.trails.length < 2 || this.trailTips.length < 2) return
    this.attachTrails()
    const bankAmt = Math.abs(this.bank)
    const speedAmt = this.speed / (CRUISE_SPEED * this.loadout.speedMul)
    const strength = THREE.MathUtils.clamp(bankAmt * 1.4 + (speedAmt - 0.85) * 1.2, 0, 1)

    for (let t = 0; t < 2; t++) {
      const tip = this.trailTips[t]!
      tip.getWorldPosition(this.tmpWorld)
      const idx = this.trailIdx[t]! % TRAIL_LEN
      const arr = this.trailPos[t]!
      arr[idx * 3] = this.tmpWorld.x
      arr[idx * 3 + 1] = this.tmpWorld.y
      arr[idx * 3 + 2] = this.tmpWorld.z
      this.trailIdx[t] = this.trailIdx[t]! + 1
      const attr = this.trails[t]!.geometry.getAttribute('position') as THREE.BufferAttribute
      attr.needsUpdate = true

      const mat = this.trails[t]!.material as THREE.PointsMaterial
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.12 + strength * 0.6, 1 - Math.exp(-dt * 4))
      mat.size = 0.2 + strength * 0.32
    }
  }

  private reprojectBearing(desiredDir: THREE.Vector3) {
    const { east, north } = enuFrame(this.group.position)
    this.bearing = Math.atan2(desiredDir.dot(east), desiredDir.dot(north))
  }

  private orient() {
    this.forwardVec.copy(bearingDirection(this.group.position, this.bearing))
    this.upVec.copy(this.group.position).normalize()

    const right = new THREE.Vector3().crossVectors(this.forwardVec, this.upVec).normalize()
    const up = new THREE.Vector3().crossVectors(right, this.forwardVec).normalize()
    const m = new THREE.Matrix4().makeBasis(right, up, this.forwardVec.clone().negate())
    this.group.quaternion.setFromRotationMatrix(m)
    this.group.rotateOnWorldAxis(this.forwardVec, this.bank)
  }

  dropPoint(): THREE.Vector3 {
    const local = new THREE.Vector3(0, -1.4 * this.loadout.scale, 0.3)
    return this.group.localToWorld(local)
  }

  forward(): THREE.Vector3 {
    return this.forwardVec.clone()
  }

  up(): THREE.Vector3 {
    return this.upVec.clone()
  }

  get orbitRadius() {
    return ORBIT_RADIUS
  }
}
