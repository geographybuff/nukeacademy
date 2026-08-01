import * as THREE from 'three'
import { EARTH_RADIUS, enuFrame, latLonToVector3 } from './geo'
import type { TerrainKind } from './cities'

/** Sit just above land / ocean shells so the scar reads from orbit. */
const SCAR_RADIUS = EARTH_RADIUS + 0.34
/** Enough room for a session of exams — Earth reads as burning past ~100. */
const MAX_SCARS = 140
const SMOKE_PER_SCAR = 96
const ASH_PER_SCAR = 40
const EMBER_PER_SCAR = 22
const OCEAN_STEAM = 28
/** Point lights are expensive — only the newest scars keep a real glow. */
const MAX_GLOWS = 10
const SMOKE_CEILING = 4.2
const ASH_CEILING = 5.5

type Scar = {
  root: THREE.Group
  kind: TerrainKind
  age: number
  smoke: THREE.Points | null
  smokeVel: Float32Array | null
  ash: THREE.Points | null
  ashVel: Float32Array | null
  embers: THREE.Points | null
  emberVel: Float32Array | null
  fireMeshes: THREE.Mesh[]
  glow: THREE.PointLight | null
  up: THREE.Vector3
}

/**
 * Persistent impact scars on the globe — craters that accumulate as you play.
 * Land scars keep fire + tall smoke / ash plumes visible from orbit.
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
      new THREE.CircleGeometry(0.48 * craterScale, 20),
      new THREE.MeshBasicMaterial({
        color: isOcean ? 0x0a2a38 : 0x1a1210,
        transparent: true,
        opacity: isOcean ? 0.55 : 0.9,
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

    // Outer scorch ring — reads as burned countryside from orbit
    if (!isOcean) {
      const scorch = new THREE.Mesh(
        new THREE.RingGeometry(0.42 * craterScale, 0.72 * craterScale, 24),
        new THREE.MeshBasicMaterial({
          color: 0x2a1810,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -3,
          polygonOffsetUnits: -3,
        }),
      )
      scorch.rotation.x = -Math.PI / 2
      scorch.position.y = 0.009
      root.add(scorch)
    }

    // Inner pit
    const pit = new THREE.Mesh(
      new THREE.CircleGeometry(0.24 * craterScale, 16),
      new THREE.MeshBasicMaterial({
        color: isOcean ? 0x061820 : 0x0a0808,
        transparent: true,
        opacity: 0.92,
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
      new THREE.TorusGeometry(0.34 * craterScale, 0.05 * craterScale, 5, 18),
      new THREE.MeshStandardMaterial({
        color: isOcean ? 0x2a5a6e : 0x3a2a22,
        emissive: isOcean ? 0x1a4050 : 0xff5522,
        emissiveIntensity: isOcean ? 0.08 : 0.45,
        flatShading: true,
        roughness: 0.9,
      }),
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.02
    root.add(rim)

    // Charred rubble bits around the rim
    if (!isOcean) {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + Math.random() * 0.3
        const r = 0.28 + Math.random() * 0.22
        const chunk = new THREE.Mesh(
          new THREE.TetrahedronGeometry(0.04 + Math.random() * 0.04, 0),
          new THREE.MeshStandardMaterial({
            color: 0x2a2218,
            emissive: 0xff4410,
            emissiveIntensity: 0.35,
            flatShading: true,
          }),
        )
        chunk.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r)
        chunk.rotation.set(Math.random(), Math.random(), Math.random())
        root.add(chunk)
      }
    } else {
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
    let ash: THREE.Points | null = null
    let ashVel: Float32Array | null = null
    let embers: THREE.Points | null = null
    let emberVel: Float32Array | null = null

    if (!isOcean) {
      // Core fire — denser flame cluster
      for (let i = 0; i < 8; i++) {
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.045 + Math.random() * 0.04, 0.16 + Math.random() * 0.16, 4),
          new THREE.MeshStandardMaterial({
            color: i % 2 ? 0xff6622 : 0xffaa44,
            emissive: 0xff3300,
            emissiveIntensity: 1.7,
            flatShading: true,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
          }),
        )
        const a = (i / 8) * Math.PI * 2
        const r = 0.04 + (i % 3) * 0.035
        flame.position.set(Math.cos(a) * r, 0.07, Math.sin(a) * r)
        flame.userData.baseY = flame.position.y
        flame.userData.phase = Math.random() * Math.PI * 2
        root.add(flame)
        fireMeshes.push(flame)
      }

      glow = new THREE.PointLight(0xff5522, 2.4, 3.6, 2)
      glow.position.set(0, 0.2, 0)
      root.add(glow)

      // Dense near-field smoke column
      const sPos = new Float32Array(SMOKE_PER_SCAR * 3)
      smokeVel = new Float32Array(SMOKE_PER_SCAR * 3)
      for (let i = 0; i < SMOKE_PER_SCAR; i++) {
        sPos[i * 3] = (Math.random() - 0.5) * 0.28
        sPos[i * 3 + 1] = Math.random() * 0.55
        sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.28
        smokeVel[i * 3] = (Math.random() - 0.5) * 0.14
        smokeVel[i * 3 + 1] = 0.45 + Math.random() * 0.75
        smokeVel[i * 3 + 2] = (Math.random() - 0.5) * 0.14
      }
      const sGeo = new THREE.BufferGeometry()
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
      smoke = new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          color: 0x5a5048,
          size: 0.22,
          transparent: true,
          opacity: 0.62,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      )
      root.add(smoke)

      // High ash / haze — drifts outward so many scars veil the planet
      const aPos = new Float32Array(ASH_PER_SCAR * 3)
      ashVel = new Float32Array(ASH_PER_SCAR * 3)
      for (let i = 0; i < ASH_PER_SCAR; i++) {
        aPos[i * 3] = (Math.random() - 0.5) * 0.5
        aPos[i * 3 + 1] = 0.4 + Math.random() * 1.4
        aPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5
        ashVel[i * 3] = (Math.random() - 0.5) * 0.22
        ashVel[i * 3 + 1] = 0.2 + Math.random() * 0.4
        ashVel[i * 3 + 2] = (Math.random() - 0.5) * 0.22
      }
      const aGeo = new THREE.BufferGeometry()
      aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3))
      ash = new THREE.Points(
        aGeo,
        new THREE.PointsMaterial({
          color: 0x8a7060,
          size: 0.34,
          transparent: true,
          opacity: 0.38,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      )
      root.add(ash)

      const ePos = new Float32Array(EMBER_PER_SCAR * 3)
      emberVel = new Float32Array(EMBER_PER_SCAR * 3)
      for (let i = 0; i < EMBER_PER_SCAR; i++) {
        ePos[i * 3] = (Math.random() - 0.5) * 0.16
        ePos[i * 3 + 1] = Math.random() * 0.2
        ePos[i * 3 + 2] = (Math.random() - 0.5) * 0.16
        emberVel[i * 3] = (Math.random() - 0.5) * 0.16
        emberVel[i * 3 + 1] = 0.55 + Math.random() * 0.7
        emberVel[i * 3 + 2] = (Math.random() - 0.5) * 0.16
      }
      const eGeo = new THREE.BufferGeometry()
      eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3))
      embers = new THREE.Points(
        eGeo,
        new THREE.PointsMaterial({
          color: 0xff6020,
          size: 0.07,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
        }),
      )
      root.add(embers)
    } else {
      const sPos = new Float32Array(OCEAN_STEAM * 3)
      smokeVel = new Float32Array(OCEAN_STEAM * 3)
      for (let i = 0; i < OCEAN_STEAM; i++) {
        sPos[i * 3] = (Math.random() - 0.5) * 0.28
        sPos[i * 3 + 1] = Math.random() * 0.15
        sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.28
        smokeVel[i * 3] = (Math.random() - 0.5) * 0.08
        smokeVel[i * 3 + 1] = 0.22 + Math.random() * 0.35
        smokeVel[i * 3 + 2] = (Math.random() - 0.5) * 0.08
      }
      const sGeo = new THREE.BufferGeometry()
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
      smoke = new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          color: 0xc8e0e8,
          size: 0.16,
          transparent: true,
          opacity: 0.45,
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
      ash,
      ashVel,
      embers,
      emberVel,
      fireMeshes,
      glow,
      up: up.clone(),
    })
    this.pruneGlows()
  }

  update(dt: number) {
    const n = this.scars.length
    // More scars → thicker haze / hotter look (planet-scale burn)
    const planetBurn = Math.min(1, n / 100)

    for (const scar of this.scars) {
      scar.age += dt
      // Stay hot longer; never fully extinguish while the scar remains
      const fade = Math.max(0.55, 1 - scar.age * 0.004)

      for (const flame of scar.fireMeshes) {
        const phase = (flame.userData.phase as number) + scar.age * 10
        flame.userData.phase = phase
        flame.scale.y = 0.9 + Math.sin(phase) * 0.35
        flame.scale.x = 0.95 + Math.sin(phase * 1.3) * 0.2
        flame.position.y = (flame.userData.baseY as number) + Math.sin(phase * 1.1) * 0.03
        const mat = flame.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = (1.35 + Math.sin(phase) * 0.45) * fade * (1 + planetBurn * 0.35)
      }

      if (scar.glow) {
        scar.glow.intensity = (1.6 + Math.sin(scar.age * 7) * 0.5) * fade * (1 + planetBurn * 0.25)
      }

      if (scar.smoke && scar.smokeVel) {
        const arr = scar.smoke.geometry.getAttribute('position').array as Float32Array
        const vel = scar.smokeVel
        const count = arr.length / 3
        const ceil = scar.kind === 'ocean' ? 2.2 : SMOKE_CEILING
        for (let i = 0; i < count; i++) {
          // Drift wider as the column rises
          const h = arr[i * 3 + 1]!
          const spread = 1 + h * 0.35
          arr[i * 3]! += vel[i * 3]! * dt * spread
          arr[i * 3 + 1]! += vel[i * 3 + 1]! * dt
          arr[i * 3 + 2]! += vel[i * 3 + 2]! * dt * spread
          if (arr[i * 3 + 1]! > ceil) {
            arr[i * 3] = (Math.random() - 0.5) * 0.22
            arr[i * 3 + 1] = 0.02 + Math.random() * 0.08
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.22
          }
        }
        ;(scar.smoke.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
        const sm = scar.smoke.material as THREE.PointsMaterial
        const base = scar.kind === 'ocean' ? 0.4 : 0.58 + planetBurn * 0.18
        sm.opacity = base * fade
        sm.size = scar.kind === 'ocean' ? 0.16 : 0.2 + planetBurn * 0.12
      }

      if (scar.ash && scar.ashVel) {
        const arr = scar.ash.geometry.getAttribute('position').array as Float32Array
        const vel = scar.ashVel
        const count = arr.length / 3
        for (let i = 0; i < count; i++) {
          const h = arr[i * 3 + 1]!
          const spread = 1.2 + h * 0.5
          arr[i * 3]! += vel[i * 3]! * dt * spread
          arr[i * 3 + 1]! += vel[i * 3 + 1]! * dt
          arr[i * 3 + 2]! += vel[i * 3 + 2]! * dt * spread
          if (arr[i * 3 + 1]! > ASH_CEILING || Math.hypot(arr[i * 3]!, arr[i * 3 + 2]!) > 2.8) {
            arr[i * 3] = (Math.random() - 0.5) * 0.35
            arr[i * 3 + 1] = 0.3 + Math.random() * 0.5
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.35
          }
        }
        ;(scar.ash.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
        const am = scar.ash.material as THREE.PointsMaterial
        am.opacity = (0.32 + planetBurn * 0.28) * fade
        am.size = 0.3 + planetBurn * 0.22
      }

      if (scar.embers && scar.emberVel) {
        const arr = scar.embers.geometry.getAttribute('position').array as Float32Array
        const vel = scar.emberVel
        const count = arr.length / 3
        for (let i = 0; i < count; i++) {
          arr[i * 3]! += vel[i * 3]! * dt
          arr[i * 3 + 1]! += vel[i * 3 + 1]! * dt
          arr[i * 3 + 2]! += vel[i * 3 + 2]! * dt
          if (arr[i * 3 + 1]! > 1.8) {
            arr[i * 3] = (Math.random() - 0.5) * 0.12
            arr[i * 3 + 1] = 0.02
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12
          }
        }
        ;(scar.embers.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
        const em = scar.embers.material as THREE.PointsMaterial
        em.opacity = (0.8 + planetBurn * 0.15) * fade
      }
    }
  }

  /** 0..1 — how scorched the planet looks (for fog / exposure elsewhere). */
  get burnLevel() {
    return Math.min(1, this.scars.length / 100)
  }

  clear() {
    while (this.scars.length) {
      this.disposeScar(this.scars.pop()!)
    }
  }

  get count() {
    return this.scars.length
  }

  private pruneGlows() {
    const start = Math.max(0, this.scars.length - MAX_GLOWS)
    for (let i = 0; i < start; i++) {
      const scar = this.scars[i]!
      if (!scar.glow) continue
      scar.root.remove(scar.glow)
      scar.glow.dispose()
      scar.glow = null
    }
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
    if (scar.glow) {
      scar.glow.dispose()
      scar.glow = null
    }
  }
}
