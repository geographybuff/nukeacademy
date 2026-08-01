import * as THREE from 'three'

/** Shared low-poly prop kit for the impact diorama — readable silhouettes, not boxes. */

export function std(
  color: number,
  opts: {
    emissive?: number
    em?: number
    roughness?: number
    metalness?: number
    transparent?: boolean
    opacity?: number
    side?: THREE.Side
  } = {},
) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.em ?? 0,
    roughness: opts.roughness ?? 0.78,
    metalness: opts.metalness ?? 0.06,
    flatShading: true,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
  })
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, cast = true) {
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = cast
  m.receiveShadow = true
  return m
}

function hash01(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Triangular-prism gable roof extruded along depth (Y up). */
function gableRoofGeo(width: number, rise: number, depth: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(-width * 0.5, 0)
  shape.lineTo(width * 0.5, 0)
  shape.lineTo(0, rise)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false })
  geo.translate(0, 0, -depth * 0.5)
  return geo
}

/** Hip / barn roof — wider base, flatter peak. */
function hipRoofGeo(width: number, rise: number, depth: number): THREE.BufferGeometry {
  const hw = width * 0.5
  const hd = depth * 0.5
  const positions = new Float32Array([
    // front slope
    -hw, 0, hd, hw, 0, hd, 0, rise, 0,
    // back slope
    hw, 0, -hd, -hw, 0, -hd, 0, rise, 0,
    // left slope
    -hw, 0, -hd, -hw, 0, hd, 0, rise, 0,
    // right slope
    hw, 0, hd, hw, 0, -hd, 0, rise, 0,
  ])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.computeVertexNormals()
  return geo
}

function litWindow(w: number, h: number, lit: boolean) {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      color: lit ? (Math.random() > 0.35 ? 0xffe8b0 : 0xffd080) : 0x9ab0c0,
    }),
  )
}

function addWindowBay(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  lit: boolean,
  rotY = 0,
) {
  const frame = mesh(new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.04), std(0x3a4248, { metalness: 0.25 }))
  frame.position.set(x, y, z)
  frame.rotation.y = rotY
  parent.add(frame)
  const pane = litWindow(w, h, lit)
  pane.position.set(x, y, z + (rotY === 0 ? 0.025 : 0))
  if (rotY !== 0) {
    pane.rotation.y = rotY
    pane.position.set(
      x + Math.sin(rotY) * 0.025,
      y,
      z + Math.cos(rotY) * 0.025,
    )
  }
  parent.add(pane)
}

/** Pine / deciduous tree with trunk + stacked foliage. */
export function makeTree(style: 'pine' | 'round' | 'bush' = 'pine'): THREE.Group {
  const g = new THREE.Group()
  const trunkH = style === 'bush' ? 0.22 : 0.45
  const trunk = mesh(
    new THREE.CylinderGeometry(style === 'bush' ? 0.04 : 0.055, 0.09, trunkH, 5),
    std(0x5a3a22, { roughness: 0.95 }),
  )
  trunk.position.y = trunkH * 0.5
  g.add(trunk)

  if (style === 'pine') {
    const tiers = 3 + Math.floor(Math.random() * 2)
    for (let i = 0; i < tiers; i++) {
      const h = 0.55 - i * 0.08
      const r = 0.32 - i * 0.05
      const foliage = mesh(
        new THREE.ConeGeometry(r, h, 6),
        std(i % 2 ? 0x2f6b3a : 0x3a7a42, { emissive: 0xff6622, em: 0.04 }),
      )
      ;(foliage.material as THREE.MeshStandardMaterial).userData.baseEm = 0.04
      foliage.position.y = trunkH + 0.15 + i * 0.32
      g.add(foliage)
    }
  } else if (style === 'round') {
    const canopy = mesh(
      new THREE.IcosahedronGeometry(0.38, 0),
      std(0x3a7a42, { emissive: 0xff6622, em: 0.05 }),
    )
    ;(canopy.material as THREE.MeshStandardMaterial).userData.baseEm = 0.05
    canopy.position.y = trunkH + 0.35
    canopy.scale.set(1.15, 0.9, 1.1)
    g.add(canopy)
    const canopy2 = mesh(
      new THREE.IcosahedronGeometry(0.28, 0),
      std(0x2f6b3a, { emissive: 0xff6622, em: 0.04 }),
    )
    canopy2.position.set(0.15, trunkH + 0.5, -0.08)
    g.add(canopy2)
  } else {
    const bush = mesh(
      new THREE.IcosahedronGeometry(0.28, 0),
      std(0x4a8a3a, { emissive: 0xff6622, em: 0.04 }),
    )
    ;(bush.material as THREE.MeshStandardMaterial).userData.baseEm = 0.04
    bush.position.y = 0.28
    bush.scale.set(1.3, 0.75, 1.2)
    g.add(bush)
  }
  return g
}

type CottageStyle = 'cottage' | 'farmhouse' | 'barn' | 'bungalow'

/** House with real gable/hip roof, eaves, chimney, porch — not a decorated cube. */
export function makeCottage(bodyColor = 0xd9b87a, roofColor = 0xe85d3a, style?: CottageStyle): THREE.Group {
  const g = new THREE.Group()
  const pick: CottageStyle =
    style ?? (['cottage', 'farmhouse', 'barn', 'bungalow'] as const)[Math.floor(Math.random() * 4)]!

  const roofMat = std(roofColor, { emissive: 0xff5522, em: 0.14, roughness: 0.72 })
  ;(roofMat as THREE.MeshStandardMaterial).userData.baseEm = 0.14
  const wallMat = std(bodyColor, { emissive: 0xff8844, em: 0.08, roughness: 0.88 })
  ;(wallMat as THREE.MeshStandardMaterial).userData.baseEm = 0.08
  const trimMat = std(0xf2e6d0, { roughness: 0.75 })
  const woodMat = std(0x5a3a22, { roughness: 0.92 })

  if (pick === 'barn') {
    const w = 1.55
    const d = 1.05
    const wallH = 0.95
    const foundation = mesh(new THREE.BoxGeometry(w + 0.08, 0.12, d + 0.08), std(0x6a6560))
    foundation.position.y = 0.06
    g.add(foundation)

    const body = mesh(new THREE.BoxGeometry(w, wallH, d), wallMat)
    body.position.y = 0.12 + wallH * 0.5
    g.add(body)

    // Tall gable ends (siding boards suggested by vertical trim)
    const roof = mesh(gableRoofGeo(w + 0.2, 0.72, d + 0.12), roofMat)
    roof.position.y = 0.12 + wallH
    g.add(roof)

    // Ridge vent / cupola
    const cupola = mesh(new THREE.BoxGeometry(0.28, 0.22, 0.28), trimMat)
    cupola.position.y = 0.12 + wallH + 0.72
    g.add(cupola)
    const cupRoof = mesh(gableRoofGeo(0.38, 0.18, 0.38), roofMat.clone())
    ;(cupRoof.material as THREE.MeshStandardMaterial).userData.baseEm = 0.14
    cupRoof.position.y = 0.12 + wallH + 0.84
    g.add(cupRoof)

    // Big barn door
    const door = mesh(new THREE.BoxGeometry(0.55, 0.7, 0.06), woodMat)
    door.position.set(0, 0.12 + 0.35, d * 0.5 + 0.02)
    g.add(door)
    const Xbar = mesh(new THREE.BoxGeometry(0.5, 0.04, 0.02), std(0x3a2818))
    Xbar.position.set(0, 0.12 + 0.35, d * 0.5 + 0.06)
    g.add(Xbar)

    for (const sx of [-0.45, 0.45] as const) {
      const loft = litWindow(0.18, 0.14, true)
      loft.position.set(sx, 0.12 + wallH * 0.72, d * 0.5 + 0.01)
      g.add(loft)
    }
    return g
  }

  if (pick === 'bungalow') {
    const w = 1.35
    const d = 1.1
    const wallH = 0.55
    const foundation = mesh(new THREE.BoxGeometry(w + 0.1, 0.1, d + 0.1), std(0x7a7570))
    foundation.position.y = 0.05
    g.add(foundation)

    const body = mesh(new THREE.BoxGeometry(w, wallH, d), wallMat)
    body.position.y = 0.1 + wallH * 0.5
    g.add(body)

    // Wide hip roof overhang
    const roof = mesh(hipRoofGeo(w + 0.55, 0.42, d + 0.55), roofMat)
    roof.position.y = 0.1 + wallH
    g.add(roof)

    // Front porch slab + posts
    const porch = mesh(new THREE.BoxGeometry(w * 0.7, 0.06, 0.38), woodMat)
    porch.position.set(0, 0.1, d * 0.5 + 0.15)
    g.add(porch)
    for (const sx of [-0.4, 0.4] as const) {
      const post = mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.52, 5), trimMat)
      post.position.set(sx, 0.1 + 0.26, d * 0.5 + 0.28)
      g.add(post)
    }

    const door = mesh(new THREE.BoxGeometry(0.22, 0.4, 0.04), woodMat)
    door.position.set(0, 0.1 + 0.22, d * 0.5 + 0.02)
    g.add(door)
    for (const sx of [-0.38, 0.38] as const) {
      addWindowBay(g, sx, 0.1 + wallH * 0.55, d * 0.5 + 0.01, 0.22, 0.18, true)
    }
    return g
  }

  if (pick === 'farmhouse') {
    const w = 1.2
    const d = 0.95
    const wallH = 0.85
    const foundation = mesh(new THREE.BoxGeometry(w + 0.08, 0.14, d + 0.08), std(0x6a6560))
    foundation.position.y = 0.07
    g.add(foundation)

    const body = mesh(new THREE.BoxGeometry(w, wallH, d), wallMat)
    body.position.y = 0.14 + wallH * 0.5
    g.add(body)

    // Two-story look via belt course
    const belt = mesh(new THREE.BoxGeometry(w + 0.02, 0.05, d + 0.02), trimMat)
    belt.position.y = 0.14 + wallH * 0.5
    g.add(belt)

    const roof = mesh(gableRoofGeo(w + 0.22, 0.55, d + 0.1), roofMat)
    roof.position.y = 0.14 + wallH
    g.add(roof)

    // Side wing
    const wing = mesh(new THREE.BoxGeometry(0.55, wallH * 0.7, 0.7), wallMat.clone())
    ;(wing.material as THREE.MeshStandardMaterial).userData.baseEm = 0.08
    wing.position.set(w * 0.5 + 0.2, 0.14 + wallH * 0.35, 0)
    g.add(wing)
    const wingRoof = mesh(gableRoofGeo(0.7, 0.32, 0.78), roofMat.clone())
    ;(wingRoof.material as THREE.MeshStandardMaterial).userData.baseEm = 0.14
    wingRoof.rotation.y = Math.PI / 2
    wingRoof.position.set(w * 0.5 + 0.2, 0.14 + wallH * 0.7, 0)
    g.add(wingRoof)

    const chimney = mesh(new THREE.BoxGeometry(0.16, 0.48, 0.16), std(0x6b5050))
    chimney.position.set(-0.28, 0.14 + wallH + 0.35, -0.12)
    g.add(chimney)
    const cap = mesh(new THREE.BoxGeometry(0.22, 0.04, 0.22), std(0x4a4040))
    cap.position.set(-0.28, 0.14 + wallH + 0.58, -0.12)
    g.add(cap)

    // Porch with pitched awning
    const porch = mesh(new THREE.BoxGeometry(0.7, 0.05, 0.32), woodMat)
    porch.position.set(0, 0.14, d * 0.5 + 0.14)
    g.add(porch)
    for (const sx of [-0.28, 0.28] as const) {
      const post = mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.55, 5), trimMat)
      post.position.set(sx, 0.14 + 0.28, d * 0.5 + 0.22)
      g.add(post)
    }
    const awning = mesh(new THREE.BoxGeometry(0.78, 0.04, 0.4), roofMat.clone())
    ;(awning.material as THREE.MeshStandardMaterial).userData.baseEm = 0.14
    awning.position.set(0, 0.14 + 0.58, d * 0.5 + 0.12)
    awning.rotation.x = -0.35
    g.add(awning)

    const door = mesh(new THREE.BoxGeometry(0.22, 0.42, 0.04), woodMat)
    door.position.set(0, 0.14 + 0.22, d * 0.5 + 0.02)
    g.add(door)

    for (const floor of [0.32, 0.68] as const) {
      for (const sx of [-0.35, 0.35] as const) {
        addWindowBay(g, sx, 0.14 + wallH * floor, d * 0.5 + 0.01, 0.16, 0.14, true)
      }
    }
    return g
  }

  // Default: classic cottage
  {
    const w = 1.15
    const d = 0.95
    const wallH = 0.68
    const foundation = mesh(new THREE.BoxGeometry(w + 0.1, 0.12, d + 0.1), std(0x7a7570))
    foundation.position.y = 0.06
    g.add(foundation)

    const body = mesh(new THREE.BoxGeometry(w, wallH, d), wallMat)
    body.position.y = 0.12 + wallH * 0.5
    g.add(body)

    // Corner quoins
    for (const sx of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        const quoin = mesh(new THREE.BoxGeometry(0.08, wallH * 0.95, 0.08), trimMat)
        quoin.position.set(sx * w * 0.48, 0.12 + wallH * 0.48, sz * d * 0.48)
        g.add(quoin)
      }
    }

    const roof = mesh(gableRoofGeo(w + 0.28, 0.52, d + 0.14), roofMat)
    roof.position.y = 0.12 + wallH
    g.add(roof)

    // Eave fascia boards
    const fascia = mesh(new THREE.BoxGeometry(w + 0.3, 0.04, 0.05), woodMat)
    fascia.position.set(0, 0.12 + wallH + 0.02, d * 0.5 + 0.04)
    g.add(fascia)

    const chimney = mesh(new THREE.BoxGeometry(0.15, 0.42, 0.15), std(0x6b5050))
    chimney.position.set(0.3, 0.12 + wallH + 0.38, -0.08)
    g.add(chimney)

    // Dormer
    const dormer = mesh(new THREE.BoxGeometry(0.28, 0.22, 0.22), wallMat.clone())
    ;(dormer.material as THREE.MeshStandardMaterial).userData.baseEm = 0.08
    dormer.position.set(-0.2, 0.12 + wallH + 0.22, 0.15)
    g.add(dormer)
    const dormRoof = mesh(gableRoofGeo(0.36, 0.16, 0.26), roofMat.clone())
    ;(dormRoof.material as THREE.MeshStandardMaterial).userData.baseEm = 0.14
    dormRoof.position.set(-0.2, 0.12 + wallH + 0.33, 0.15)
    g.add(dormRoof)
    addWindowBay(g, -0.2, 0.12 + wallH + 0.2, 0.15 + 0.12, 0.14, 0.12, true)

    const porch = mesh(new THREE.BoxGeometry(0.55, 0.06, 0.3), woodMat)
    porch.position.set(0, 0.12, d * 0.5 + 0.12)
    g.add(porch)
    for (const sx of [-0.2, 0.2] as const) {
      const post = mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.48, 5), trimMat)
      post.position.set(sx, 0.12 + 0.24, d * 0.5 + 0.22)
      g.add(post)
    }

    const door = mesh(new THREE.BoxGeometry(0.2, 0.4, 0.04), woodMat)
    door.position.set(0, 0.12 + 0.22, d * 0.5 + 0.02)
    g.add(door)
    // Door handle
    const knob = mesh(new THREE.SphereGeometry(0.02, 5, 4), std(0xc4a35a, { metalness: 0.6 }))
    knob.position.set(0.07, 0.12 + 0.22, d * 0.5 + 0.05)
    g.add(knob)

    for (const sx of [-0.35, 0.35] as const) {
      addWindowBay(g, sx, 0.12 + wallH * 0.55, d * 0.5 + 0.01, 0.18, 0.16, true)
      // Shutters
      for (const side of [-1, 1] as const) {
        const shutter = mesh(new THREE.BoxGeometry(0.05, 0.16, 0.02), std(roofColor, { roughness: 0.8 }))
        shutter.position.set(sx + side * 0.13, 0.12 + wallH * 0.55, d * 0.5 + 0.02)
        g.add(shutter)
      }
    }

    // Flower boxes
    for (const sx of [-0.35, 0.35] as const) {
      const box = mesh(new THREE.BoxGeometry(0.22, 0.06, 0.08), woodMat)
      box.position.set(sx, 0.12 + wallH * 0.4, d * 0.5 + 0.06)
      g.add(box)
      const flowers = mesh(
        new THREE.IcosahedronGeometry(0.06, 0),
        std(0xe85d3a, { emissive: 0xff4422, em: 0.15 }),
      )
      flowers.position.set(sx, 0.12 + wallH * 0.48, d * 0.5 + 0.06)
      flowers.scale.set(1.2, 0.7, 0.9)
      g.add(flowers)
    }
  }

  return g
}

type BuildingStyle = 'shop' | 'walkup' | 'tower' | 'deco' | 'slab' | 'round'

/** City building — multi-volume massing, storefront, window bays, roof gear. */
export function makeBuilding(
  w: number,
  h: number,
  depth: number,
  color: number,
  lit: boolean,
  seed = Math.random() * 1000,
): THREE.Group {
  const g = new THREE.Group()
  const r0 = hash01(seed)
  const r1 = hash01(seed + 1)
  const r2 = hash01(seed + 2)

  let style: BuildingStyle
  if (h < 0.85) style = 'shop'
  else if (h < 1.35) style = r0 > 0.55 ? 'walkup' : 'shop'
  else if (h > 2.0 && r0 > 0.65) style = 'round'
  else if (h > 1.7 && r0 > 0.45) style = 'deco'
  else if (r0 > 0.5) style = 'slab'
  else style = 'tower'

  const bodyMat = std(color, {
    emissive: 0xff6622,
    em: lit ? 0.16 : 0.04,
    roughness: 0.7,
    metalness: style === 'tower' || style === 'slab' ? 0.22 : 0.08,
  })
  ;(bodyMat as THREE.MeshStandardMaterial).userData.baseEm = lit ? 0.16 : 0.04
  const accent = std(0x5a6066, { metalness: 0.25, roughness: 0.55 })
  const glassStrip = std(lit ? 0xffe0a0 : 0x6a8a9a, {
    emissive: lit ? 0xffcc66 : 0x2a4a5a,
    em: lit ? 0.55 : 0.08,
    metalness: 0.45,
    roughness: 0.25,
  })

  // Plinth / sidewalk base
  const plinth = mesh(new THREE.BoxGeometry(w * 1.08, 0.08, depth * 1.08), std(0x3a4248))
  plinth.position.y = 0.04
  g.add(plinth)

  if (style === 'shop') {
    const storeH = Math.min(h * 0.55, 0.45)
    const upperH = Math.max(0.25, h - storeH)
    const store = mesh(
      new THREE.BoxGeometry(w, storeH, depth),
      std(0x2a3036, { emissive: 0xff8844, em: 0.1, metalness: 0.15 }),
    )
    store.position.y = 0.08 + storeH * 0.5
    g.add(store)

    // Glass storefront
    const storefront = mesh(new THREE.BoxGeometry(w * 0.85, storeH * 0.7, 0.04), glassStrip)
    storefront.position.set(0, 0.08 + storeH * 0.48, depth * 0.5 + 0.02)
    g.add(storefront)

    // Awning
    const awning = mesh(
      new THREE.BoxGeometry(w * 0.95, 0.04, 0.28),
      std(r1 > 0.5 ? 0xe85d3a : 0xd9b87a, { emissive: 0xff5522, em: 0.12 }),
    )
    awning.position.set(0, 0.08 + storeH * 0.92, depth * 0.5 + 0.12)
    awning.rotation.x = -0.25
    g.add(awning)

    const upper = mesh(new THREE.BoxGeometry(w * 0.95, upperH, depth * 0.92), bodyMat)
    upper.position.y = 0.08 + storeH + upperH * 0.5
    g.add(upper)

    // Cornice
    const cornice = mesh(new THREE.BoxGeometry(w * 1.05, 0.08, depth * 1.0), accent)
    cornice.position.y = 0.08 + h + 0.02
    g.add(cornice)

    addFacadeWindows(g, w * 0.9, upperH, depth * 0.92, 0.08 + storeH, lit, 2)
    return g
  }

  if (style === 'round') {
    const r = Math.min(w, depth) * 0.55
    const shaft = mesh(
      new THREE.CylinderGeometry(r * 0.85, r, h * 0.88, 8),
      bodyMat,
    )
    shaft.position.y = 0.08 + h * 0.44
    g.add(shaft)

    const crown = mesh(
      new THREE.CylinderGeometry(r * 0.55, r * 0.75, h * 0.18, 8),
      std(0xb8c0c6, { emissive: 0xff8844, em: 0.14, metalness: 0.3 }),
    )
    crown.position.y = 0.08 + h * 0.9
    g.add(crown)

    const spire = mesh(new THREE.ConeGeometry(r * 0.2, 0.45, 6), accent)
    spire.position.y = 0.08 + h + 0.2
    g.add(spire)

    // Horizontal glass rings
    const floors = Math.max(3, Math.floor(h / 0.28))
    for (let f = 0; f < floors; f++) {
      if (hash01(seed + f * 3) > 0.35) continue
      const ring = mesh(
        new THREE.TorusGeometry(r * 0.92, 0.03, 4, 12),
        glassStrip,
      )
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.2 + (f / floors) * h * 0.85
      g.add(ring)
    }
    return g
  }

  if (style === 'deco') {
    // Art-deco stepped tower
    const tiers = [
      { s: 1.0, h: h * 0.45 },
      { s: 0.78, h: h * 0.28 },
      { s: 0.55, h: h * 0.18 },
      { s: 0.32, h: h * 0.12 },
    ]
    let y = 0.08
    for (let t = 0; t < tiers.length; t++) {
      const tier = tiers[t]!
      const tw = w * tier.s
      const td = depth * tier.s
      const block = mesh(
        new THREE.BoxGeometry(tw, tier.h, td),
        t === 0 ? bodyMat : std(color, { emissive: 0xff6622, em: lit ? 0.12 : 0.04, metalness: 0.18 }),
      )
      block.position.y = y + tier.h * 0.5
      g.add(block)

      // Vertical fin accents on lowest tier
      if (t === 0) {
        for (const sx of [-1, 1] as const) {
          const fin = mesh(new THREE.BoxGeometry(0.05, tier.h * 0.95, 0.08), accent)
          fin.position.set(sx * tw * 0.48, y + tier.h * 0.48, td * 0.5 + 0.02)
          g.add(fin)
        }
      }

      // Cap lip
      const lip = mesh(new THREE.BoxGeometry(tw * 1.06, 0.04, td * 1.06), accent)
      lip.position.y = y + tier.h + 0.01
      g.add(lip)

      addFacadeWindows(g, tw * 0.85, tier.h, td, y, lit, Math.max(1, Math.floor(tier.h / 0.3)))
      y += tier.h
    }

    // Spire / antenna
    const mast = mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.55, 4), std(0xaaaaaa, { metalness: 0.6 }))
    mast.position.y = y + 0.3
    g.add(mast)
    return g
  }

  if (style === 'slab') {
    // Modern glass slab — thin, curtain-wall look
    const slabW = w * (1.1 + r1 * 0.25)
    const slabD = depth * 0.65
    const body = mesh(new THREE.BoxGeometry(slabW, h, slabD), bodyMat)
    body.position.y = 0.08 + h * 0.5
    g.add(body)

    // Floor slab lines (horizontal)
    const floors = Math.max(4, Math.floor(h / 0.22))
    for (let f = 1; f < floors; f++) {
      const line = mesh(
        new THREE.BoxGeometry(slabW * 1.01, 0.025, slabD * 1.01),
        accent,
      )
      line.position.y = 0.08 + (f / floors) * h
      g.add(line)
    }

    // Curtain mullions
    const cols = Math.max(3, Math.floor(slabW / 0.18))
    for (let c = 0; c < cols; c++) {
      const u = cols === 1 ? 0 : (c / (cols - 1) - 0.5) * slabW * 0.88
      const mullion = mesh(new THREE.BoxGeometry(0.03, h * 0.95, 0.03), accent)
      mullion.position.set(u, 0.08 + h * 0.48, slabD * 0.5 + 0.01)
      g.add(mullion)
    }

    // Glass panes between mullions
    for (let f = 0; f < floors; f++) {
      for (let c = 0; c < cols - 1; c++) {
        if (hash01(seed + f * 17 + c) > (lit ? 0.4 : 0.6)) continue
        const u0 = (c / (cols - 1) - 0.5) * slabW * 0.88
        const u1 = ((c + 1) / (cols - 1) - 0.5) * slabW * 0.88
        const pane = mesh(
          new THREE.PlaneGeometry(Math.abs(u1 - u0) * 0.85, (h / floors) * 0.7),
          new THREE.MeshBasicMaterial({ color: lit ? 0xffe8b0 : 0xa8c0d0 }),
        )
        pane.position.set((u0 + u1) * 0.5, 0.08 + (f + 0.5) * (h / floors), slabD * 0.5 + 0.02)
        g.add(pane)
      }
    }

    // Roof mechanicals
    addRoofGear(g, slabW * 0.5, h + 0.08, slabD * 0.5, r2)
    return g
  }

  if (style === 'walkup') {
    const body = mesh(new THREE.BoxGeometry(w, h, depth), bodyMat)
    body.position.y = 0.08 + h * 0.5
    g.add(body)

    // Brownstone stoop
    const stoop = mesh(new THREE.BoxGeometry(w * 0.45, 0.12, 0.35), std(0x6a6560))
    stoop.position.set(0, 0.14, depth * 0.5 + 0.12)
    g.add(stoop)
    const stoop2 = mesh(new THREE.BoxGeometry(w * 0.35, 0.1, 0.22), std(0x5a5550))
    stoop2.position.set(0, 0.22, depth * 0.5 + 0.22)
    g.add(stoop2)

    const door = mesh(new THREE.BoxGeometry(0.22, 0.42, 0.05), std(0x3a2818))
    door.position.set(0, 0.35, depth * 0.5 + 0.02)
    g.add(door)

    // Cornice + parapet
    const cornice = mesh(new THREE.BoxGeometry(w * 1.08, 0.1, depth * 1.08), std(0xf2e6d0))
    cornice.position.y = 0.08 + h + 0.02
    g.add(cornice)

    // Balconies
    const floors = Math.max(2, Math.floor(h / 0.35))
    for (let f = 1; f < floors; f++) {
      const balc = mesh(new THREE.BoxGeometry(w * 0.7, 0.04, 0.18), accent)
      balc.position.set(0, 0.08 + (f / floors) * h, depth * 0.5 + 0.08)
      g.add(balc)
      const rail = mesh(new THREE.BoxGeometry(w * 0.7, 0.08, 0.02), std(0x8a9096, { metalness: 0.4 }))
      rail.position.set(0, 0.08 + (f / floors) * h + 0.06, depth * 0.5 + 0.16)
      g.add(rail)
    }

    addFacadeWindows(g, w, h, depth, 0.08, lit, floors)
    return g
  }

  // Default tower — L-shaped / stepped massing
  {
    const mainH = h
    const main = mesh(new THREE.BoxGeometry(w, mainH, depth), bodyMat)
    main.position.y = 0.08 + mainH * 0.5
    g.add(main)

    // Side wing for L massing
    if (r1 > 0.35 && w > 0.4) {
      const wingW = w * (0.45 + r2 * 0.2)
      const wingH = mainH * (0.55 + r0 * 0.25)
      const wing = mesh(
        new THREE.BoxGeometry(wingW, wingH, depth * 0.75),
        std(color, { emissive: 0xff6622, em: lit ? 0.1 : 0.03, metalness: 0.12 }),
      )
      wing.position.set(w * 0.5 + wingW * 0.35, 0.08 + wingH * 0.5, -depth * 0.05)
      g.add(wing)
      addFacadeWindows(g, wingW, wingH, depth * 0.75, 0.08, lit, Math.max(2, Math.floor(wingH / 0.3)), w * 0.5 + wingW * 0.35)
    }

    // Setback crown
    if (h > 1.2) {
      const crownH = h * (0.18 + r1 * 0.1)
      const crown = mesh(
        new THREE.BoxGeometry(w * 0.62, crownH, depth * 0.62),
        std(0xb8c0c6, { emissive: 0xff8844, em: 0.14, metalness: 0.25 }),
      )
      crown.position.y = 0.08 + h + crownH * 0.5
      g.add(crown)
      addRoofGear(g, w * 0.35, 0.08 + h + crownH, depth * 0.35, r2)
    } else {
      const parapet = mesh(new THREE.BoxGeometry(w * 1.05, 0.08, depth * 1.05), accent)
      parapet.position.y = 0.08 + h + 0.02
      g.add(parapet)
      addRoofGear(g, w * 0.4, 0.08 + h + 0.08, depth * 0.4, r2)
    }

    // Corner pillars
    for (const sx of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        const pillar = mesh(new THREE.BoxGeometry(0.06, h * 0.96, 0.06), accent)
        pillar.position.set(sx * w * 0.48, 0.08 + h * 0.48, sz * depth * 0.48)
        g.add(pillar)
      }
    }

    // Ground-floor lobby reveal
    const lobby = mesh(new THREE.BoxGeometry(w * 0.7, 0.28, 0.04), glassStrip)
    lobby.position.set(0, 0.22, depth * 0.5 + 0.02)
    g.add(lobby)

    addFacadeWindows(g, w, h, depth, 0.08, lit, Math.max(3, Math.floor(h / 0.28)))
  }

  return g
}

function addFacadeWindows(
  g: THREE.Group,
  w: number,
  h: number,
  depth: number,
  y0: number,
  lit: boolean,
  floors: number,
  xOff = 0,
) {
  const cols = Math.max(1, Math.floor(w / 0.2))
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > (lit ? 0.38 : 0.58)) continue
      const u = cols === 1 ? 0 : (c / (cols - 1) - 0.5) * w * 0.72
      const y = y0 + 0.18 + (f + 0.15) * ((h * 0.82) / floors)
      // Recessed bay (depth cue)
      const recess = mesh(
        new THREE.BoxGeometry(0.12, 0.14, 0.05),
        std(0x1a2228, { metalness: 0.2 }),
      )
      recess.position.set(xOff + u, y, depth * 0.5 + 0.01)
      g.add(recess)
      const pane = litWindow(0.1, 0.11, lit && Math.random() > 0.3)
      pane.position.set(xOff + u, y, depth * 0.5 + 0.04)
      g.add(pane)
    }
  }
}

function addRoofGear(g: THREE.Group, halfW: number, y: number, halfD: number, r: number) {
  // HVAC box
  const hvac = mesh(new THREE.BoxGeometry(0.22, 0.12, 0.18), std(0x6b737a, { metalness: 0.35 }))
  hvac.position.set(-halfW * 0.3, y + 0.06, halfD * 0.1)
  g.add(hvac)

  if (r > 0.4) {
    // Water tower
    const tank = mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.18, 6),
      std(0x8a5050, { metalness: 0.2, roughness: 0.7 }),
    )
    tank.position.set(halfW * 0.25, y + 0.22, -halfD * 0.15)
    g.add(tank)
    const legs = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 4), std(0x5a5550, { metalness: 0.4 }))
    legs.position.set(halfW * 0.25, y + 0.08, -halfD * 0.15)
    g.add(legs)
    const cone = mesh(new THREE.ConeGeometry(0.11, 0.1, 6), std(0x6b4040))
    cone.position.set(halfW * 0.25, y + 0.35, -halfD * 0.15)
    g.add(cone)
  }

  if (r > 0.55) {
    const ant = mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.5, 4), std(0xaaaaaa, { metalness: 0.55 }))
    ant.position.set(0, y + 0.28, 0)
    g.add(ant)
    const dish = mesh(new THREE.SphereGeometry(0.07, 5, 3), std(0xc0c8cc, { metalness: 0.45 }))
    dish.scale.set(1, 0.3, 1)
    dish.position.set(0.1, y + 0.12, 0.05)
    dish.rotation.z = 0.4
    g.add(dish)
  }
}

/** Rocky peak — irregular low-poly mass with optional snow. */
export function makePeak(h: number, rocky = true): THREE.Group {
  const g = new THREE.Group()
  const r = 0.55 + Math.random() * 0.7
  const base = mesh(
    new THREE.ConeGeometry(r, h, rocky ? 6 : 5),
    std(rocky ? (Math.random() > 0.5 ? 0x7a7570 : 0x5a5550) : 0x6a6560, {
      emissive: 0xff7744,
      em: 0.08,
      roughness: 0.95,
    }),
  )
  ;(base.material as THREE.MeshStandardMaterial).userData.baseEm = 0.08
  base.position.y = h * 0.5
  base.scale.set(1 + Math.random() * 0.25, 1, 0.85 + Math.random() * 0.3)
  base.rotation.y = Math.random() * Math.PI
  g.add(base)

  if (Math.random() > 0.4) {
    const spur = mesh(
      new THREE.ConeGeometry(r * 0.45, h * 0.55, 5),
      std(0x6a6560, { emissive: 0xff7744, em: 0.06 }),
    )
    spur.position.set(r * 0.45, h * 0.28, -r * 0.2)
    spur.rotation.z = 0.25
    g.add(spur)
  }

  if (h > 2.4) {
    const snow = mesh(
      new THREE.ConeGeometry(r * 0.35, 0.5, 5),
      std(0xe8e4dc, { emissive: 0xffffff, em: 0.05 }),
    )
    snow.position.y = h - 0.1
    g.add(snow)
  }
  return g
}

/** Boulder / talus chunk. */
export function makeBoulder(size = 0.2): THREE.Mesh {
  const m = mesh(
    new THREE.DodecahedronGeometry(size, 0),
    std(Math.random() > 0.5 ? 0x7a7570 : 0x5a5550, { emissive: 0xff7744, em: 0.05, roughness: 0.95 }),
  )
  ;(m.material as THREE.MeshStandardMaterial).userData.baseEm = 0.05
  m.scale.set(1 + Math.random() * 0.4, 0.7 + Math.random() * 0.5, 1 + Math.random() * 0.3)
  return m
}

/** Car with tapered hood, cabin glass, bumpers — not two boxes. */
export function makeCar(color: number): THREE.Group {
  const g = new THREE.Group()
  const paint = std(color, { emissive: 0xff8844, em: 0.08, metalness: 0.35, roughness: 0.4 })
  ;(paint as THREE.MeshStandardMaterial).userData.baseEm = 0.08
  const dark = std(0x1a1a1a, { roughness: 0.9 })
  const chrome = std(0xc0c8cc, { metalness: 0.7, roughness: 0.3 })

  // Lower body — slightly boat-shaped via scaled box + nose taper
  const chassis = mesh(new THREE.BoxGeometry(0.62, 0.16, 0.32), paint)
  chassis.position.y = 0.14
  g.add(chassis)

  // Hood slope (front wedge)
  const hood = mesh(new THREE.BoxGeometry(0.22, 0.1, 0.3), paint.clone())
  hood.position.set(0.22, 0.18, 0)
  hood.rotation.z = -0.25
  g.add(hood)

  // Cabin / greenhouse
  const cabin = mesh(
    new THREE.BoxGeometry(0.28, 0.14, 0.28),
    std(0x2a3a42, { emissive: 0x7ec8e0, em: 0.25, metalness: 0.5, roughness: 0.22 }),
  )
  cabin.position.set(-0.04, 0.28, 0)
  g.add(cabin)

  // Windshield angle plate
  const windshield = mesh(
    new THREE.BoxGeometry(0.02, 0.12, 0.26),
    std(0x7ec8e0, { emissive: 0x7ec8e0, em: 0.35, metalness: 0.6, roughness: 0.15 }),
  )
  windshield.position.set(0.12, 0.26, 0)
  windshield.rotation.z = -0.45
  g.add(windshield)

  // Bumpers
  const frontBump = mesh(new THREE.BoxGeometry(0.06, 0.06, 0.34), chrome)
  frontBump.position.set(0.34, 0.1, 0)
  g.add(frontBump)
  const rearBump = mesh(new THREE.BoxGeometry(0.05, 0.06, 0.34), chrome)
  rearBump.position.set(-0.34, 0.1, 0)
  g.add(rearBump)

  // Headlights
  for (const zz of [-0.1, 0.1] as const) {
    const light = mesh(
      new THREE.SphereGeometry(0.035, 5, 4),
      std(0xfff0c0, { emissive: 0xffe8a0, em: 0.8 }),
    )
    light.position.set(0.35, 0.14, zz)
    g.add(light)
  }

  // Wheels with hubs
  for (const zx of [-0.18, 0.18] as const) {
    for (const zz of [-0.15, 0.15] as const) {
      const wheel = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 8), dark)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(zx, 0.07, zz)
      g.add(wheel)
      const hub = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.065, 5), chrome)
      hub.rotation.z = Math.PI / 2
      hub.position.set(zx, 0.07, zz)
      g.add(hub)
    }
  }
  return g
}

/** Fishing boat / skiff with tapered hull. */
export function makeBoat(): THREE.Group {
  const g = new THREE.Group()
  const hullMat = std(0xc4a06a, { emissive: 0xff8844, em: 0.08, roughness: 0.7 })
  ;(hullMat as THREE.MeshStandardMaterial).userData.baseEm = 0.08

  // Hull from tapered cylinder + cone bow
  const hull = mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.0, 6), hullMat)
  hull.rotation.z = Math.PI / 2
  hull.position.set(0, 0.1, 0)
  hull.scale.set(1, 1.15, 0.55)
  g.add(hull)

  const bow = mesh(new THREE.ConeGeometry(0.2, 0.5, 5), hullMat.clone())
  ;(bow.material as THREE.MeshStandardMaterial).userData.baseEm = 0.08
  bow.rotation.z = -Math.PI / 2
  bow.position.set(0.65, 0.12, 0)
  bow.scale.set(1, 1, 0.7)
  g.add(bow)

  // Gunwale rail
  const rail = mesh(new THREE.TorusGeometry(0.42, 0.025, 4, 10, Math.PI), std(0x8a6a45))
  rail.rotation.x = Math.PI / 2
  rail.rotation.z = Math.PI / 2
  rail.position.set(0.05, 0.22, 0)
  rail.scale.set(1.3, 1, 0.55)
  g.add(rail)

  const cabin = mesh(
    new THREE.BoxGeometry(0.32, 0.26, 0.3),
    std(0xe7f2f4, { emissive: 0x7ec8e0, em: 0.12 }),
  )
  cabin.position.set(-0.12, 0.32, 0)
  g.add(cabin)
  const cabinRoof = mesh(new THREE.BoxGeometry(0.36, 0.04, 0.34), std(0x4a90b8, { metalness: 0.3 }))
  cabinRoof.position.set(-0.12, 0.46, 0)
  g.add(cabinRoof)

  const mast = mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.75, 5), std(0x8a6a45))
  mast.position.set(0.15, 0.55, 0)
  g.add(mast)

  // Sail hint
  const sail = mesh(
    new THREE.PlaneGeometry(0.35, 0.5),
    std(0xf2e6d0, { side: THREE.DoubleSide, roughness: 0.9 }),
  )
  sail.position.set(0.15, 0.55, 0.02)
  sail.rotation.y = 0.15
  g.add(sail)

  return g
}

/** Streetlight with arm + glowing lamp. */
export function makeStreetlight(): THREE.Group {
  const g = new THREE.Group()
  const pole = mesh(new THREE.CylinderGeometry(0.03, 0.045, 1.35, 6), std(0x6b737a, { metalness: 0.45 }))
  pole.position.y = 0.68
  g.add(pole)

  // Base
  const base = mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 6), std(0x4a5258, { metalness: 0.4 }))
  base.position.y = 0.05
  g.add(base)

  const arm = mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.5, 5), std(0x6b737a, { metalness: 0.45 }))
  arm.rotation.z = Math.PI / 2
  arm.position.set(0.22, 1.32, 0)
  g.add(arm)

  const housing = mesh(new THREE.BoxGeometry(0.16, 0.06, 0.12), std(0x3a4248, { metalness: 0.35 }))
  housing.position.set(0.42, 1.28, 0)
  g.add(housing)

  const lamp = mesh(
    new THREE.SphereGeometry(0.08, 6, 4),
    std(0xffe8a0, { emissive: 0xffe8a0, em: 0.9, roughness: 0.25 }),
  )
  lamp.position.set(0.42, 1.22, 0)
  g.add(lamp)
  return g
}

/**
 * Crater bowl for the diorama floor — recessed pit + rim + rubble + scorch.
 */
export function makeCraterBowl(radius = 1.6, ocean = false): THREE.Group {
  const g = new THREE.Group()

  const stain = mesh(
    new THREE.CircleGeometry(radius * 1.35, 36),
    std(ocean ? 0x0a2a38 : 0x1a1210, {
      emissive: ocean ? 0x1a4050 : 0xff4410,
      em: ocean ? 0.08 : 0.2,
      side: THREE.DoubleSide,
    }),
    false,
  )
  stain.rotation.x = -Math.PI / 2
  stain.position.y = 0.02
  g.add(stain)

  const pit = mesh(
    new THREE.CircleGeometry(radius * 0.55, 28),
    std(ocean ? 0x061820 : 0x0c0806, {
      emissive: ocean ? 0x0a3040 : 0xff2200,
      em: ocean ? 0.1 : 0.45,
      side: THREE.DoubleSide,
    }),
    false,
  )
  pit.rotation.x = -Math.PI / 2
  pit.position.y = 0.025
  g.add(pit)

  const rim = mesh(
    new THREE.TorusGeometry(radius * 0.75, radius * 0.08, 6, 28),
    std(ocean ? 0x2a5a6e : 0x3a2a22, {
      emissive: ocean ? 0x1a5060 : 0xff5522,
      em: ocean ? 0.1 : 0.35,
      roughness: 0.92,
    }),
  )
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.06
  g.add(rim)

  const crack = new THREE.Mesh(
    new THREE.RingGeometry(radius * 0.9, radius * 1.15, 36),
    new THREE.MeshBasicMaterial({
      color: ocean ? 0x3a7088 : 0x2a1a14,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  crack.rotation.x = -Math.PI / 2
  crack.position.y = 0.028
  g.add(crack)

  const n = ocean ? 6 : 14
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
    const r = radius * (0.7 + Math.random() * 0.45)
    const chunk = mesh(
      Math.random() > 0.4
        ? new THREE.TetrahedronGeometry(0.1 + Math.random() * 0.12, 0)
        : new THREE.DodecahedronGeometry(0.08 + Math.random() * 0.08, 0),
      std(ocean ? 0x5a9eb8 : 0x3a2a22, { emissive: 0xff5522, em: ocean ? 0.05 : 0.25 }),
    )
    chunk.position.set(Math.cos(a) * r, 0.08 + Math.random() * 0.08, Math.sin(a) * r)
    chunk.rotation.set(Math.random(), Math.random(), Math.random())
    g.add(chunk)
  }

  if (!ocean) {
    for (let i = 0; i < 5; i++) {
      const flame = mesh(
        new THREE.ConeGeometry(0.1 + Math.random() * 0.08, 0.35 + Math.random() * 0.25, 4),
        std(i % 2 ? 0xff6622 : 0xffaa44, {
          emissive: 0xff3300,
          em: 1.6,
          transparent: true,
          opacity: 0.92,
        }),
        false,
      )
      const a = (i / 5) * Math.PI * 2
      flame.position.set(Math.cos(a) * 0.2, 0.15, Math.sin(a) * 0.2)
      flame.name = 'craterFlame'
      flame.userData.phase = Math.random() * Math.PI * 2
      g.add(flame)
    }
  }

  return g
}
