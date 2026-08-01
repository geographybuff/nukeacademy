import * as THREE from 'three'
import { EARTH_RADIUS, enuFrame, latLonToVector3 } from './geo'
import type { TerrainKind } from './cities'

/** Sit just above land / ocean shells so the scar reads from orbit. */
const SCAR_RADIUS = EARTH_RADIUS + 0.34
const MAX_SCARS = 48
const SMOKE_PER_SCAR = 28
const EMBER_PER_SCAR = 16

type Scar = {
  root: THREE.Group
  kind: TerrainKind
  age: number
  smoke: THREE.Points | null
  smokeVel: Float32Array | null
  embers: THREE.Points | null
  emberVel: Float32Array | null
  fireMeshes: THREE.Mesh[]
  glow: THREE.PointLight | null
  up: THREE.Vector3
}

/**
 * Persistent impact scars on the globe — craters that accumulate as you play.
 * Land scars keep a small fire + smoke plume visible from orbit.
 */
export class EarthScars {
  readonly group = new THREE.Group()
  private scars: Scar[] = []

  add(lat: number, lon: number, kind: TerrainKind) {
    if (this.scars.length >= MAX_SCARS) {
      const old = this.scars.shift()!
      this.disposeScar(old)
    }

    const pos = latLonToVector3(lat, lon, SCAR_RADIUS)
    const { east, north, up } = enuFrame(pos)
    const root = new THREE.Group()
    root.position.copy(pos)
    root.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(east, up, north.clone().negate()),
    )

    const isOcean = kind === 'ocean'
    const craterScale = kind === 'city' ? 1.15 : kind === 'mountain' ? 1.05 : 1

    // Dark burn / stain on the surface
    const stain = new THREE.Mesh(
      new THREE.CircleGeometry(0.42 * craterScale, 20),
      new THREE.MeshBasicMaterial({
        color: isOcean ? 0x0a2a38 : 0x1a1210,
        transparent: true,
        opacity: isOcean ? 0.55 : 0.85,
        depthWrite: false,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      }),
    )
    stain.rotation.x = -Math.PI / 2
    stain.position.y = 0.01
    root.add(stain)

    // Inner pit
    const pit = new THREE.Mesh(
      new THREE.CircleGeometry(0.22 * craterScale, 16),
      new THREE.MeshBasicMaterial({
        color: isOcean ? 0x061820 : 0x0a0808,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -5,
      }),
    )
    pit.rotation.x = -Math.PI / 2
    pit.position.y = 0.012
    root.add(pit)

    // Raised rim (low-poly crater lip)
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.32 * craterScale, 0.045 * craterScale, 5, 18),
      new THREE.MeshStandardMaterial({
        color: isOcean ? 0x2a5a6e : 0x3a2a22,
        emissive: isOcean ? 0x1a4050 : 0xff5522,
        emissiveIntensity: isOcean ? 0.08 : 0.35,
        flatShading: true,
        roughness: 0.9,
      }),
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.02
    root.add(rim)

    // Charred rubble bits around the rim
    if (!isOcean) {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + Math.random() * 0.3
        const r = 0.28 + Math.random() * 0.18
        const chunk = new THREE.Mesh(
          new THREE.TetrahedronGeometry(0.04 + Math.random() * 0.035, 0),
          new THREE.MeshStandardMaterial({
            color: 0x2a2218,
            emissive: 0xff4410,
            emissiveIntensity: 0.25,
            flatShading: true,
          }),
        )
        chunk.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r)
        chunk.rotation.set(Math.random(), Math.random(), Math.random())
        root.add(chunk)
      }
    } else {
      // Foam ring for ocean hits
      const foam = new THREE.Mesh(
        new THREE.RingGeometry(0.3 * craterScale, 0.48 * craterScale, 20),
        new THREE.MeshBasicMaterial({
          color: 0xa8d4e0,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      )
      foam.rotation.x = -Math.PI / 2
      foam.position.y = 0.015
      root.add(foam)
    }

    const fireMeshes: THREE.Mesh[] = []
    let glow: THREE.PointLight | null = null
    let smoke: THREE.Points | null = null
    let smokeVel: Float32Array | null = null
    let embers: THREE.Points | null = null
    let emberVel: Float32Array | null = null

    if (!isOcean) {
      // Core fire — small low-poly flames
      for (let i = 0; i < 4; i++) {
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.04 + Math.random() * 0.03, 0.12 + Math.random() * 0.1, 4),
          new THREE.MeshStandardMaterial({
            color: i % 2 ? 0xff6622 : 0xffaa44,
            emissive: 0xff4400,
            emissiveIntensity: 1.4,
            flatShading: true,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
          }),
        )
        const a = (i / 4) * Math.PI * 2
        flame.position.set(Math.cos(a) * 0.06, 0.06, Math.sin(a) * 0.06)
        flame.userData.baseY = flame.position.y
        flame.userData.phase = Math.random() * Math.PI * 2
        root.add(flame)
        fireMeshes.push(flame)
      }

      glow = new THREE.PointLight(0xff5522, 1.8, 2.8, 2)
      glow.position.set(0, 0.15, 0)
      root.add(glow)

      // Smoke plume (world-space particles relative to scar root)
      const sPos = new Float32Array(SMOKE_PER_SCAR * 3)
      smokeVel = new Float32Array(SMOKE_PER_SCAR * 3)
      for (let i = 0; i < SMOKE_PER_SCAR; i++) {
        sPos[i * 3] = (Math.random() - 0.5) * 0.15
        sPos[i * 3 + 1] = Math.random() * 0.2
        sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.15
        smokeVel[i * 3] = (Math.random() - 0.5) * 0.08
        smokeVel[i * 3 + 1] = 0.25 + Math.random() * 0.35
        smokeVel[i * 3 + 2] = (Math.random() - 0.5) * 0.08
      }
      const sGeo = new THREE.BufferGeometry()
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
      smoke = new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          color: 0x6a6058,
          size: 0.12,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      )
      root.add(smoke)

      const ePos = new Float32Array(EMBER_PER_SCAR * 3)
      emberVel = new Float32Array(EMBER_PER_SCAR * 3)
      for (let i = 0; i < EMBER_PER_SCAR; i++) {
        ePos[i * 3] = (Math.random() - 0.5) * 0.12
        ePos[i * 3 + 1] = Math.random() * 0.15
        ePos[i * 3 + 2] = (Math.random() - 0.5) * 0.12
        emberVel[i * 3] = (Math.random() - 0.5) * 0.12
        emberVel[i * 3 + 1] = 0.4 + Math.random() * 0.5
        emberVel[i * 3 + 2] = (Math.random() - 0.5) * 0.12
      }
      const eGeo = new THREE.BufferGeometry()
      eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3))
      embers = new THREE.Points(
        eGeo,
        new THREE.PointsMaterial({
          color: 0xff6020,
          size: 0.06,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
        }),
      )
      root.add(embers)
    } else {
      // Ocean steam wisps
      const sPos = new Float32Array(14 * 3)
      smokeVel = new Float32Array(14 * 3)
      for (let i = 0; i < 14; i++) {
        sPos[i * 3] = (Math.random() - 0.5) * 0.2
        sPos[i * 3 + 1] = Math.random() * 0.1
        sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.2
        smokeVel[i * 3] = (Math.random() - 0.5) * 0.05
        smokeVel[i * 3 + 1] = 0.15 + Math.random() * 0.2
        smokeVel[i * 3 + 2] = (Math.random() - 0.5) * 0.05
      }
      const sGeo = new THREE.BufferGeometry()
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
      smoke = new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          color: 0xc8e0e8,
          size: 0.1,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      )
      root.add(smoke)
    }

    this.group.add(root)
    this.scars.push({
      root,
      kind,
      age: 0,
      smoke,
      smokeVel,
      embers,
      emberVel,
      fireMeshes,
      glow,
      up: up.clone(),
    })
  }

  update(dt: number) {
    for (const scar of this.scars) {
      scar.age += dt
      const fade = Math.max(0.35, 1 - scar.age * 0.008) // slowly cools but stays

      for (const flame of scar.fireMeshes) {
        const phase = (flame.userData.phase as number) + scar.age * 9
        flame.userData.phase = phase
        flame.scale.y = 0.85 + Math.sin(phase) * 0.25
        flame.scale.x = 0.9 + Math.sin(phase * 1.3) * 0.15
        flame.position.y = (flame.userData.baseY as number) + Math.sin(phase * 1.1) * 0.02
        const mat = flame.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (1.1 + Math.sin(phase) * 0.35) * fade
      }

      if (scar.glow) {
        scar.glow.intensity = (1.2 + Math.sin(scar.age * 7) * 0.4) * fade
      }

      if (scar.smoke && scar.smokeVel) {
        const arr = scar.smoke.geometry.getAttribute('position').array as Float32Array
        const vel = scar.smokeVel
        const n = arr.length / 3
        for (let i = 0; i < n; i++) {
          arr[i * 3]! += vel[i * 3]! * dt
          arr[i * 3 + 1]! += vel[i * 3 + 1]! * dt
          arr[i * 3 + 2]! += vel[i * 3 + 2]! * dt
          // Recycle when too high
          if (arr[i * 3 + 1]! > 1.6) {
            arr[i * 3] = (Math.random() - 0.5) * 0.12
            arr[i * 3 + 1] = 0.02
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12
          }
        }
        ;(scar.smoke.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
        const sm = scar.smoke.material as THREE.PointsMaterial
        sm.opacity = (scar.kind === 'ocean' ? 0.35 : 0.5) * fade
      }

      if (scar.embers && scar.emberVel) {
        const arr = scar.embers.geometry.getAttribute('position').array as Float32Array
        const vel = scar.emberVel
        const n = arr.length / 3
        for (let i = 0; i < n; i++) {
          arr[i * 3]! += vel[i * 3]! * dt
          arr[i * 3 + 1]! += vel[i * 3 + 1]! * dt
          arr[i * 3 + 2]! += vel[i * 3 + 2]! * dt
          if (arr[i * 3 + 1]! > 1.1) {
            arr[i * 3] = (Math.random() - 0.5) * 0.1
            arr[i * 3 + 1] = 0.02
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1
          }
        }
        ;(scar.embers.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
        const em = scar.embers.material as THREE.PointsMaterial
        em.opacity = 0.75 * fade
      }
    }
  }

  clear() {
    while (this.scars.length) {
      this.disposeScar(this.scars.pop()!)
    }
  }

  get count() {
    return this.scars.length
  }

  private disposeScar(scar: Scar) {
    this.group.remove(scar.root)
    scar.root.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
      const mat = m.material
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else if (mat) mat.dispose()
    })
  }
}
