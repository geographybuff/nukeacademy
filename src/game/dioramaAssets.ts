import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * Kenney City + Quaternius nature GLBs for the impact diorama.
 * Falls back to null so callers can keep procedural props.
 */

type Catalog = {
  city: string[]
  sky: string[]
  house: string[]
  pine: string[]
  deciduous: string[]
  bush: string[]
  rock: string[]
  snowRock: string[]
  cliff: string[]
  debris: string[]
}

const CATALOG: Catalog = {
  city: [
    'city/building-a.glb',
    'city/building-b.glb',
    'city/building-c.glb',
    'city/building-e.glb',
    'city/building-f.glb',
    'city/building-g.glb',
    'city/building-h.glb',
    'city/building-i.glb',
    'city/low-detail-building-a.glb',
    'city/low-detail-building-c.glb',
    'city/low-detail-building-f.glb',
    'city/low-detail-building-wide-a.glb',
  ],
  sky: [
    'city/building-skyscraper-a.glb',
    'city/building-skyscraper-b.glb',
    'city/building-skyscraper-c.glb',
    'city/building-skyscraper-d.glb',
  ],
  house: [
    'house/building-type-a.glb',
    'house/building-type-b.glb',
    'house/building-type-c.glb',
    'house/building-type-e.glb',
    'house/building-type-g.glb',
    'house/building-type-h.glb',
    'house/building-type-i.glb',
    'house/building-type-k.glb',
    'house/building-type-m.glb',
    'house/building-type-p.glb',
  ],
  pine: [
    'nature/PineTree_1.glb',
    'nature/PineTree_2.glb',
    'nature/PineTree_3.glb',
    'nature/PineTree_5.glb',
  ],
  deciduous: [
    'nature/CommonTree_1.glb',
    'nature/CommonTree_2.glb',
    'nature/CommonTree_3.glb',
    'nature/CommonTree_5.glb',
    'nature/BirchTree_1.glb',
    'nature/BirchTree_3.glb',
  ],
  bush: ['nature/Bush_1.glb', 'nature/Bush_2.glb'],
  rock: [
    'nature/Rock_1.glb',
    'nature/Rock_2.glb',
    'nature/Rock_3.glb',
    'nature/Rock_5.glb',
    'nature/Rock_7.glb',
    'nature/Rock_Moss_1.glb',
    'nature/Rock_Moss_3.glb',
    'nature/Rock_Moss_5.glb',
  ],
  snowRock: [
    'nature/Rock_Snow_1.glb',
    'nature/Rock_Snow_3.glb',
    'nature/Rock_Snow_5.glb',
  ],
  cliff: [
    'debris/cliff_large_rock.glb',
    'debris/cliff_rock.glb',
    'debris/cliff_block_rock.glb',
    'debris/cliff_corner_rock.glb',
  ],
  debris: [
    'debris/rock_smallA.glb',
    'debris/rock_smallB.glb',
    'debris/rock_largeA.glb',
    'debris/rock_tallA.glb',
  ],
}

const templates = new Map<string, THREE.Object3D>()
let ready = false
let loadPromise: Promise<void> | null = null

const _box = new THREE.Box3()
const _size = new THREE.Vector3()
const _center = new THREE.Vector3()

export function dioramaAssetsReady() {
  return ready
}

export function preloadDioramaAssets(): Promise<void> {
  if (ready) return Promise.resolve()
  if (loadPromise) return loadPromise

  const loader = new GLTFLoader()
  const paths = [...new Set(Object.values(CATALOG).flat())]

  loadPromise = Promise.all(
    paths.map(
      (path) =>
        new Promise<void>((resolve) => {
          loader.load(
            `/models/${path}`,
            (gltf) => {
              const root = gltf.scene
              prepareTemplate(root)
              templates.set(path, root)
              resolve()
            },
            undefined,
            () => resolve(),
          )
        }),
    ),
  ).then(() => {
    ready = templates.size > 0
  })

  return loadPromise
}

function prepareTemplate(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) {
      const std = mat as THREE.MeshStandardMaterial
      if (!std) continue
      std.flatShading = true
      std.roughness = Math.max(0.55, std.roughness ?? 0.8)
      if (std.emissive) {
        const base = std.userData.baseEm ?? 0.06
        std.userData.baseEm = base
        if (std.emissiveIntensity < 0.01) {
          std.emissive.setHex(0xff6622)
          std.emissiveIntensity = base
        } else {
          std.userData.baseEm = std.emissiveIntensity
        }
      }
      std.needsUpdate = true
    }
  })
}

function pick(list: string[], seed: number): string | null {
  const available = list.filter((p) => templates.has(p))
  if (!available.length) return null
  const i = Math.floor(Math.abs(seed) * 9973) % available.length
  return available[i]!
}

/** Clone a template, ground it on Y=0, and fit to a target height. */
function instantiate(path: string, targetHeight: number, yaw = 0): THREE.Group | null {
  const src = templates.get(path)
  if (!src) return null

  const g = new THREE.Group()
  const clone = src.clone(true)
  clone.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => {
        const c = m.clone()
        c.userData = { ...m.userData }
        return c
      })
    } else if (mesh.material) {
      const c = mesh.material.clone()
      c.userData = { ...mesh.material.userData }
      mesh.material = c
    }
  })
  g.add(clone)

  _box.setFromObject(g)
  if (_box.isEmpty()) return g
  _box.getSize(_size)
  _box.getCenter(_center)

  // Sit on the ground plane
  clone.position.sub(_center)
  clone.position.y += _size.y * 0.5

  const h = Math.max(0.05, _size.y)
  const s = targetHeight / h
  g.scale.setScalar(s)
  g.rotation.y = yaw
  g.updateMatrixWorld(true)
  return g
}

export function assetBuilding(height: number, seed = Math.random()): THREE.Group | null {
  const tall = height > 1.85
  const path = pick(tall ? CATALOG.sky : CATALOG.city, seed)
  if (!path) return null
  return instantiate(path, height, (seed - 0.5) * 0.2)
}

export function assetHouse(seed = Math.random()): THREE.Group | null {
  const path = pick(CATALOG.house, seed)
  if (!path) return null
  const h = 0.95 + (seed % 0.3)
  return instantiate(path, h, (seed - 0.5) * 0.8)
}

export function assetTree(
  style: 'pine' | 'round' | 'bush' = 'pine',
  seed = Math.random(),
): THREE.Group | null {
  const list =
    style === 'bush' ? CATALOG.bush : style === 'round' ? CATALOG.deciduous : CATALOG.pine
  const path = pick(list, seed)
  if (!path) return null
  const h =
    style === 'bush' ? 0.45 + seed * 0.25 : style === 'pine' ? 1.35 + seed * 0.7 : 1.15 + seed * 0.55
  return instantiate(path, h, seed * Math.PI * 2)
}

export function assetRock(size = 0.25, seed = Math.random(), snow = false): THREE.Group | null {
  const path = pick(snow ? CATALOG.snowRock : CATALOG.rock, seed)
  if (!path) return null
  return instantiate(path, size * 2.2, seed * Math.PI * 2)
}

/** Mountain peak from stacked cliffs / snow rocks. */
export function assetPeak(height: number, seed = Math.random()): THREE.Group | null {
  const cliff = pick(CATALOG.cliff, seed)
  const rock = pick(seed > 0.45 ? CATALOG.snowRock : CATALOG.rock, seed + 0.17)
  if (!cliff && !rock) return null

  const g = new THREE.Group()
  if (cliff) {
    const base = instantiate(cliff, height * 0.85, seed * 4)
    if (base) {
      base.position.y = 0
      g.add(base)
    }
  }
  if (rock) {
    const tip = instantiate(rock, height * (cliff ? 0.45 : 0.95), seed * 7)
    if (tip) {
      tip.position.y = cliff ? height * 0.55 : 0
      tip.position.x = (seed - 0.5) * 0.25
      g.add(tip)
    }
  }
  if (!g.children.length) return null

  // Normalize composed peak to requested height
  _box.setFromObject(g)
  _box.getSize(_size)
  if (_size.y > 0.01) g.scale.setScalar(height / _size.y)
  return g
}

export function assetDebris(size = 0.18, seed = Math.random()): THREE.Group | null {
  const path = pick([...CATALOG.debris, ...CATALOG.rock], seed)
  if (!path) return null
  return instantiate(path, size * 2, seed * 5)
}
