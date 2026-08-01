import * as THREE from 'three'
import type { NukeLoadout, PlaneLoadout } from './loadouts'

function std(
  color: number,
  opts: {
    roughness?: number
    metalness?: number
    emissive?: number
    emissiveIntensity?: number
  } = {},
) {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0.08,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  })
}

function shadowMesh(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Shared low-poly plane mesh (nose toward -Z). Named parts drive flight anim. */
export function createPlaneModel(loadout: PlaneLoadout): THREE.Group {
  const root = new THREE.Group()
  const bodyMat = std(loadout.body, { roughness: 0.52, metalness: 0.12 })
  const accentMat = std(loadout.accent, { roughness: 0.42, metalness: 0.18 })
  const darkMat = std(0x1c2a30, { roughness: 0.75, metalness: 0.25 })
  const glassMat = std(0x7ec8e0, {
    roughness: 0.15,
    metalness: 0.55,
    emissive: 0x3a8aaa,
    emissiveIntensity: 0.22,
  })
  const metalMat = std(0x8a969c, { roughness: 0.35, metalness: 0.55 })

  // Fuselage with slight taper via stacked boxes
  const body = shadowMesh(new THREE.BoxGeometry(2.15, 1.75, 7.2), bodyMat)
  body.position.z = 0.4
  root.add(body)

  const belly = shadowMesh(new THREE.BoxGeometry(1.7, 0.55, 5.5), darkMat)
  belly.position.set(0, -0.95, 0.5)
  root.add(belly)

  const nose = shadowMesh(new THREE.ConeGeometry(1.05, 2.8, 7), bodyMat)
  nose.rotation.x = -Math.PI / 2
  nose.position.z = -5.15
  root.add(nose)

  const intake = shadowMesh(new THREE.CylinderGeometry(0.55, 0.72, 0.9, 6), darkMat)
  intake.rotation.x = Math.PI / 2
  intake.position.set(0, -0.15, -4.55)
  root.add(intake)

  const cockpit = shadowMesh(new THREE.BoxGeometry(1.45, 0.95, 2.35), glassMat)
  cockpit.position.set(0, 1.15, -0.55)
  root.add(cockpit)

  const canopyFrame = shadowMesh(new THREE.BoxGeometry(1.55, 0.12, 2.5), accentMat)
  canopyFrame.position.set(0, 1.65, -0.55)
  root.add(canopyFrame)

  // Main wing + ailerons (animated)
  const wingRoot = new THREE.Group()
  wingRoot.name = 'wing'
  wingRoot.position.set(0, 0.08, 0.15)
  const wing = shadowMesh(new THREE.BoxGeometry(14.2, 0.26, 2.9), accentMat)
  wingRoot.add(wing)

  // Wing thickness / leading edge
  const leading = shadowMesh(new THREE.BoxGeometry(13.6, 0.18, 0.45), bodyMat)
  leading.position.set(0, 0.05, -1.35)
  wingRoot.add(leading)

  for (const side of [-1, 1] as const) {
    const aileron = shadowMesh(new THREE.BoxGeometry(3.2, 0.12, 0.7), darkMat)
    aileron.name = side < 0 ? 'aileronL' : 'aileronR'
    aileron.position.set(side * 4.8, -0.02, 1.15)
    wingRoot.add(aileron)

    const tip = shadowMesh(new THREE.BoxGeometry(0.35, 0.55, 1.6), accentMat)
    tip.position.set(side * 7.0, 0.2, 0.1)
    tip.rotation.z = side * 0.35
    wingRoot.add(tip)

    // Engine nacelle under wing
    const nacelle = shadowMesh(new THREE.CylinderGeometry(0.38, 0.42, 2.2, 6), metalMat)
    nacelle.rotation.x = Math.PI / 2
    nacelle.position.set(side * 3.6, -0.45, 0.1)
    wingRoot.add(nacelle)

    const exhaust = shadowMesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.35, 6),
      std(0xff6a28, { roughness: 0.4, emissive: 0xff4a10, emissiveIntensity: 0.55 }),
    )
    exhaust.name = side < 0 ? 'exhaustL' : 'exhaustR'
    exhaust.rotation.x = Math.PI / 2
    exhaust.position.set(side * 3.6, -0.45, 1.25)
    wingRoot.add(exhaust)
  }
  root.add(wingRoot)

  // Horizontal stabilizer + elevators
  const tail = new THREE.Group()
  tail.name = 'tail'
  tail.position.set(0, 0.4, 3.75)
  const stab = shadowMesh(new THREE.BoxGeometry(4.8, 0.2, 1.35), accentMat)
  tail.add(stab)
  for (const side of [-1, 1] as const) {
    const elev = shadowMesh(new THREE.BoxGeometry(1.8, 0.1, 0.55), darkMat)
    elev.name = side < 0 ? 'elevatorL' : 'elevatorR'
    elev.position.set(side * 1.4, -0.02, 0.55)
    tail.add(elev)
  }
  root.add(tail)

  const fin = shadowMesh(new THREE.BoxGeometry(0.26, 2.45, 1.75), bodyMat)
  fin.position.set(0, 1.65, 3.85)
  root.add(fin)

  const rudder = shadowMesh(new THREE.BoxGeometry(0.14, 1.4, 0.55), darkMat)
  rudder.name = 'rudder'
  rudder.position.set(0, 1.85, 4.55)
  root.add(rudder)

  // Bomb bay with hinged doors
  const bay = new THREE.Group()
  bay.name = 'bombBay'
  bay.position.set(0, -1.05, 0.35)
  const bayWell = shadowMesh(new THREE.BoxGeometry(1.15, 0.55, 2.3), darkMat)
  bay.add(bayWell)
  for (const side of [-1, 1] as const) {
    const door = shadowMesh(new THREE.BoxGeometry(0.55, 0.08, 2.2), metalMat)
    door.name = side < 0 ? 'bayDoorL' : 'bayDoorR'
    door.position.set(side * 0.3, -0.32, 0)
    bay.add(door)
  }
  root.add(bay)

  // Landing lights
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff2c8 })
  for (const side of [-1, 1] as const) {
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), lightMat)
    lamp.position.set(side * 5.8, -0.05, -0.9)
    root.add(lamp)
  }

  const prop = new THREE.Group()
  prop.name = 'propeller'
  prop.position.set(0, 0, -6.45)
  const hub = shadowMesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.45, 7),
    std(loadout.accent, { roughness: 0.4, metalness: 0.35 }),
  )
  hub.rotation.x = Math.PI / 2
  prop.add(hub)
  const spinner = shadowMesh(new THREE.ConeGeometry(0.32, 0.55, 6), metalMat)
  spinner.rotation.x = -Math.PI / 2
  spinner.position.z = -0.35
  prop.add(spinner)

  const bladeMat = std(0x24343a, { roughness: 0.55, metalness: 0.2 })
  for (let i = 0; i < 3; i++) {
    const blade = shadowMesh(new THREE.BoxGeometry(0.32, 4.4, 0.16), bladeMat)
    blade.rotation.z = (i * Math.PI * 2) / 3
    // Slight pitch for reading at rest
    blade.rotation.y = 0.18
    prop.add(blade)
  }

  // Prop disc for high-speed blur (toggled in airplane update)
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(2.15, 20),
    new THREE.MeshBasicMaterial({
      color: 0x8aa0a8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  disc.name = 'propDisc'
  disc.rotation.y = Math.PI / 2
  prop.add(disc)
  root.add(prop)

  // Contrail emitters (empty markers)
  for (const side of [-1, 1] as const) {
    const tip = new THREE.Object3D()
    tip.name = side < 0 ? 'trailTipL' : 'trailTipR'
    tip.position.set(side * 7.05, 0.15, 0.2)
    root.add(tip)
  }

  if (loadout.flair === 'duck') {
    const beakMat = std(0xff7a2e, { roughness: 0.5 })
    const head = shadowMesh(new THREE.SphereGeometry(1.15, 8, 6), bodyMat)
    head.position.set(0, 0.35, -6.1)
    root.add(head)
    const beak = shadowMesh(new THREE.ConeGeometry(0.45, 1.4, 5), beakMat)
    beak.rotation.x = Math.PI / 2
    beak.position.set(0, 0.15, -7.5)
    root.add(beak)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a })
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 4), eyeMat)
      eye.position.set(side * 0.45, 0.7, -6.5)
      root.add(eye)
    }
  } else if (loadout.flair === 'clown') {
    const spotMat = std(0xffe066, { roughness: 0.5, emissive: 0xffe066, emissiveIntensity: 0.28 })
    for (const [x, z] of [
      [-3.5, 0.2],
      [3.5, 0.2],
      [-2.2, -0.6],
      [2.2, -0.6],
    ] as const) {
      const spot = shadowMesh(new THREE.SphereGeometry(0.35, 6, 4), spotMat)
      spot.position.set(x, 0.35, z)
      root.add(spot)
    }
    const bow = shadowMesh(new THREE.BoxGeometry(1.8, 0.7, 0.35), accentMat)
    bow.position.set(0, -0.2, -4.6)
    root.add(bow)
  } else if (loadout.flair === 'stripe') {
    const caution = std(0xd9b87a, { emissive: 0xd9b87a, emissiveIntensity: 0.2 })
    for (let i = 0; i < 3; i++) {
      const tape = shadowMesh(new THREE.BoxGeometry(2.4, 0.2, 0.55), caution)
      tape.position.set(0, 0.95, -1.5 + i * 1.4)
      tape.rotation.z = 0.15
      root.add(tape)
    }
  } else if (loadout.flair === 'halo') {
    const haloMat = std(loadout.accent, {
      emissive: loadout.accent,
      emissiveIntensity: 0.4,
      metalness: 0.25,
      roughness: 0.35,
    })
    const halo = shadowMesh(new THREE.TorusGeometry(1.35, 0.14, 6, 16), haloMat)
    halo.rotation.x = Math.PI / 2
    halo.position.set(0, 2.2, -1.2)
    root.add(halo)
  } else if (loadout.flair === 'fins') {
    const finMat = std(loadout.accent, { roughness: 0.4 })
    for (const side of [-1, 1]) {
      const canard = shadowMesh(new THREE.BoxGeometry(3.2, 0.16, 1.0), finMat)
      canard.position.set(side * 2.4, 0.4, -3.2)
      canard.rotation.z = side * 0.25
      root.add(canard)
    }
    const spine = shadowMesh(new THREE.BoxGeometry(0.2, 1.6, 2.4), finMat)
    spine.position.set(0, 1.8, 1.2)
    root.add(spine)
  } else if (loadout.flair === 'cursed') {
    const xMat = new THREE.MeshBasicMaterial({ color: 0xe85d3a })
    for (const side of [-1, 1]) {
      const eye = new THREE.Group()
      eye.position.set(side * 0.55, 1.35, -1.1)
      for (const rot of [0.7, -0.7]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.1), xMat)
        bar.rotation.z = rot
        eye.add(bar)
      }
      root.add(eye)
    }
    const crack = shadowMesh(
      new THREE.BoxGeometry(0.12, 0.9, 2.8),
      std(0xe85d3a, { emissive: 0xe85d3a, emissiveIntensity: 0.45 }),
    )
    crack.position.set(0.35, 0.95, 0.2)
    crack.rotation.z = 0.35
    root.add(crack)
  }

  root.scale.setScalar(loadout.scale * 1.15)
  return root
}

/** Shared low-poly nuke mesh (tip toward -Y). */
export function createNukeModel(loadout: NukeLoadout): THREE.Group {
  const g = new THREE.Group()
  const shell = std(loadout.body, { metalness: 0.42, roughness: 0.4 })
  const stripe = std(loadout.stripe, {
    emissive: loadout.stripe,
    emissiveIntensity: 0.32,
    metalness: 0.2,
    roughness: 0.45,
  })
  const dark = std(0x2a3238, { metalness: 0.5, roughness: 0.4 })

  const bodyScale =
    loadout.flair === 'big' ? 1.2 : loadout.flair === 'tiny' ? 0.72 : loadout.flair === 'cursed' ? 1.08 : 1
  const body = shadowMesh(new THREE.CylinderGeometry(0.52, 0.72, 3.4, 7), shell)
  body.scale.setScalar(bodyScale)
  g.add(body)

  // Panel seams
  for (let i = 0; i < 3; i++) {
    const seam = shadowMesh(new THREE.CylinderGeometry(0.74, 0.74, 0.06, 7), dark)
    seam.position.y = -0.7 + i * 0.85
    seam.scale.setScalar(bodyScale)
    g.add(seam)
  }

  const tip = shadowMesh(new THREE.ConeGeometry(0.52, 1.25, 7), shell)
  tip.position.y = -2.25 * bodyScale
  tip.scale.setScalar(bodyScale)
  g.add(tip)

  const tipCap = shadowMesh(
    new THREE.SphereGeometry(0.22, 6, 4),
    std(0xffaa44, { emissive: 0xff6622, emissiveIntensity: 0.35, metalness: 0.4 }),
  )
  tipCap.position.y = -2.85 * bodyScale
  tipCap.scale.setScalar(bodyScale)
  g.add(tipCap)

  const band = shadowMesh(new THREE.CylinderGeometry(0.74, 0.74, 0.38, 7), stripe)
  band.position.y = 0.3
  band.scale.setScalar(bodyScale)
  g.add(band)

  const collar = shadowMesh(new THREE.CylinderGeometry(0.48, 0.58, 0.55, 7), dark)
  collar.position.y = 1.55 * bodyScale
  collar.scale.setScalar(bodyScale)
  g.add(collar)

  const finRoot = new THREE.Group()
  finRoot.name = 'fins'
  const finCount = loadout.flair === 'big' ? 6 : loadout.flair === 'tiny' ? 3 : loadout.flair === 'cursed' ? 5 : 4
  const finReach = loadout.flair === 'big' ? 0.95 : loadout.flair === 'tiny' ? 0.55 : 0.7
  for (let i = 0; i < finCount; i++) {
    const fin = shadowMesh(new THREE.BoxGeometry(0.12, 1.15, 0.9), shell)
    const a = (i / finCount) * Math.PI * 2 + (loadout.flair === 'cursed' ? 0.2 : 0)
    fin.position.set(Math.cos(a) * finReach, 1.5 * bodyScale, Math.sin(a) * finReach)
    fin.rotation.y = -a
    if (loadout.flair === 'big') fin.scale.set(1, 1.25, 1.15)
    if (loadout.flair === 'tiny') fin.scale.set(0.85, 0.85, 0.85)
    if (loadout.flair === 'cursed') fin.scale.set(1, 0.85 + (i % 3) * 0.2, 1.1)
    finRoot.add(fin)
  }
  g.add(finRoot)

  if (loadout.flair === 'smile') {
    const face = new THREE.Group()
    face.position.set(0, 0.3, 0.72)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffd28a })
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), eyeMat)
      eye.position.set(side * 0.22, 0.18, 0)
      face.add(eye)
    }
    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.05, 6, 10, Math.PI),
      eyeMat,
    )
    mouth.rotation.x = Math.PI
    mouth.position.set(0, -0.05, 0)
    face.add(mouth)
    g.add(face)
  } else if (loadout.flair === 'oops') {
    const pole = shadowMesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.1, 5),
      std(0xe7f2f4),
    )
    pole.position.set(0.55, 0.9, 0)
    g.add(pole)
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.45),
      new THREE.MeshBasicMaterial({ color: 0xe7f2f4, side: THREE.DoubleSide }),
    )
    flag.position.set(0.95, 1.25, 0)
    g.add(flag)
  } else if (loadout.flair === 'heart') {
    const heartMat = std(loadout.stripe, {
      emissive: loadout.stripe,
      emissiveIntensity: 0.4,
    })
    const heart = new THREE.Group()
    heart.position.set(0, 0.35, 0.78 * bodyScale)
    for (const side of [-1, 1]) {
      const lobe = shadowMesh(new THREE.SphereGeometry(0.22, 6, 4), heartMat)
      lobe.position.set(side * 0.14, 0.12, 0)
      heart.add(lobe)
    }
    const tipHeart = shadowMesh(new THREE.ConeGeometry(0.32, 0.45, 4), heartMat)
    tipHeart.rotation.x = Math.PI
    tipHeart.position.set(0, -0.12, 0)
    heart.add(tipHeart)
    g.add(heart)
  } else if (loadout.flair === 'cursed') {
    const xMat = new THREE.MeshBasicMaterial({ color: 0xe85d3a })
    const face = new THREE.Group()
    face.position.set(0, 0.35, 0.78 * bodyScale)
    for (const side of [-1, 1]) {
      const eye = new THREE.Group()
      eye.position.set(side * 0.22, 0.16, 0)
      for (const rot of [0.7, -0.7]) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.06), xMat)
        bar.rotation.z = rot
        eye.add(bar)
      }
      face.add(eye)
    }
    const frown = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.045, 6, 10, Math.PI),
      xMat,
    )
    frown.position.set(0, -0.18, 0)
    face.add(frown)
    g.add(face)
  }

  g.scale.setScalar(1.1)
  return g
}
