import * as THREE from 'three'
import earcut from 'earcut'
import {
  countryFromFeature,
  isPlayableTarget,
  type Country,
  type GeoFeature,
} from './countries'
import { EARTH_RADIUS, greatCircleArc, latLonToVector3, vector3ToLatLon } from './geo'
import { EarthScars } from './EarthScars'
import type { TerrainKind } from './cities'

const ARC_RADIUS = EARTH_RADIUS + 0.45
const CAPITAL_RADIUS = EARTH_RADIUS + 0.38

type Ring = number[][]

const LAND_RADIUS = EARTH_RADIUS + 0.28
const BORDER_RADIUS = EARTH_RADIUS + 0.32
/** Lon/lat edge densify — keeps sphere chords above the ocean surface. */
const MAX_RING_STEP_DEG = 2.5
/**
 * Max lon/lat edge on earcut diagonals before split.
 * Critical near poles: geodesic chords otherwise cut through Arctic ocean.
 */
const MAX_TRI_STEP_DEG = 2.75
/** Max chord length on the land sphere before a triangle edge is split. */
const MAX_LAND_EDGE = EARTH_RADIUS * 0.08

type TerritoryPoly = {
  country: Country
  /** [minLon, minLat, maxLon, maxLat] — skipped when crosses antimeridian */
  bbox: [number, number, number, number] | null
  polys: { contour: [number, number][]; holes: [number, number][][] }[]
}

export class World {
  readonly group = new THREE.Group()
  readonly countries: Country[] = []
  readonly targets: Country[] = []
  readonly countryMeshes = new Map<string, THREE.Mesh[]>()
  readonly scars = new EarthScars()

  private ready = false
  private territories: TerritoryPoly[] = []
  private reveal = new THREE.Group()
  private revealArc: THREE.Line | null = null
  private capitalMarker = new THREE.Group()
  private capitalRing: THREE.Mesh
  private capitalPulse = 0
  private labelAnchor = new THREE.Vector3()
  private revealActive = false

  constructor() {
    this.group.add(this.makeOcean())
    this.group.add(this.makeOceanSpec())
    this.group.add(this.makeIceCaps())
    this.group.add(this.makeCloudBand())
    this.group.add(this.makeAtmosphere())
    this.group.add(this.makeAtmosphereOuter())
    this.group.add(this.makeGraticule())
    this.group.add(this.scars.group)

    this.capitalRing = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.9, 20),
      new THREE.MeshBasicMaterial({
        color: 0xe8c47a,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    this.capitalMarker.add(this.capitalRing)

    const pin = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.15, 7),
      new THREE.MeshStandardMaterial({
        color: 0xe8c47a,
        emissive: 0xe85d3a,
        emissiveIntensity: 0.65,
        flatShading: true,
        metalness: 0.25,
        roughness: 0.45,
      }),
    )
    pin.position.y = 0.95
    pin.castShadow = true
    this.capitalMarker.add(pin)

    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 3.4, 6),
      new THREE.MeshBasicMaterial({
        color: 0xffe0a0,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    )
    beacon.position.y = 2.5
    this.capitalMarker.add(beacon)

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 6),
      new THREE.MeshBasicMaterial({
        color: 0xff8844,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    )
    glow.position.y = 0.35
    this.capitalMarker.add(glow)

    this.capitalMarker.visible = false
    this.reveal.add(this.capitalMarker)
    this.reveal.visible = false
    this.group.add(this.reveal)
  }

  /**
   * Draw capital pin + great-circle arc from blast to capital after impact.
   * Returns world-space anchor for the distance label (arc midpoint).
   */
  showImpactRange(
    impactLat: number,
    impactLon: number,
    capitalLat: number,
    capitalLon: number,
  ): THREE.Vector3 {
    this.clearImpactRange()

    const capitalPos = latLonToVector3(capitalLat, capitalLon, CAPITAL_RADIUS)
    const up = capitalPos.clone().normalize()
    this.capitalMarker.position.copy(capitalPos)
    this.capitalMarker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
    this.capitalMarker.visible = true

    const arcPts = greatCircleArc(impactLat, impactLon, capitalLat, capitalLon, ARC_RADIUS, 72)
    const positions = new Float32Array(arcPts.length * 3)
    for (let i = 0; i < arcPts.length; i++) {
      const p = arcPts[i]!
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.revealArc = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: 0xffd28a,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    )
    this.reveal.add(this.revealArc)

    const mid = arcPts[Math.floor(arcPts.length / 2)] ?? capitalPos
    this.labelAnchor.copy(mid).normalize().multiplyScalar(ARC_RADIUS + 1.2)

    this.reveal.visible = true
    this.revealActive = true
    this.capitalPulse = 0
    return this.labelAnchor
  }

  clearImpactRange() {
    if (this.revealArc) {
      this.reveal.remove(this.revealArc)
      this.revealArc.geometry.dispose()
      ;(this.revealArc.material as THREE.Material).dispose()
      this.revealArc = null
    }
    this.capitalMarker.visible = false
    this.reveal.visible = false
    this.revealActive = false
  }

  get rangeLabelAnchor(): THREE.Vector3 | null {
    return this.revealActive ? this.labelAnchor : null
  }

  async load(): Promise<void> {
    if (this.ready) return
    const res = await fetch('/countries.geojson')
    const data = (await res.json()) as { features: GeoFeature[] }
    const land = new THREE.Group()
    const borders = new THREE.Group()

    for (const feature of data.features) {
      const country = countryFromFeature(feature)
      if (!country) continue

      const meshes = this.buildCountryMeshes(feature, country.color)
      if (meshes.length === 0) continue

      this.countries.push(country)
      if (isPlayableTarget(feature)) this.targets.push(country)
      this.territories.push(this.buildTerritory(country, feature))

      const list: THREE.Mesh[] = []
      for (const mesh of meshes) {
        mesh.userData.countryId = country.id
        mesh.userData.baseColor = country.color
        land.add(mesh)
        list.push(mesh)
      }
      this.countryMeshes.set(country.id, list)

      const outline = this.buildCountryBorders(feature)
      if (outline) borders.add(outline)
    }

    this.group.add(land)
    this.group.add(borders)
    this.ready = true
  }

  /**
   * Which sovereign land polygon contains this lat/lon, or null if ocean / unmatched.
   * Uses the same lon/lat point-in-polygon as mesh filtering — fine for roast jokes.
   */
  countryAt(lat: number, lon: number): Country | null {
    let lonN = ((((lon + 180) % 360) + 360) % 360) - 180
    for (const t of this.territories) {
      if (t.bbox) {
        const [minLon, minLat, maxLon, maxLat] = t.bbox
        if (lonN < minLon || lonN > maxLon || lat < minLat || lat > maxLat) continue
      }
      for (const poly of t.polys) {
        if (this.pointInPolygon(lonN, lat, poly.contour, poly.holes)) return t.country
      }
    }
    return null
  }

  private buildTerritory(country: Country, feature: GeoFeature): TerritoryPoly {
    const polys: TerritoryPoly['polys'] = []
    let minLon = Infinity
    let minLat = Infinity
    let maxLon = -Infinity
    let maxLat = -Infinity
    let wraps = false

    for (const rings of this.polygonsOf(feature)) {
      if (rings.length === 0) continue
      const contour = rings[0]!.map((p) => [p[0]!, p[1]!] as [number, number])
      const holes = rings.slice(1).map((r) => r.map((p) => [p[0]!, p[1]!] as [number, number]))
      polys.push({ contour, holes })
      for (const [lo, la] of contour) {
        if (lo < minLon) minLon = lo
        if (lo > maxLon) maxLon = lo
        if (la < minLat) minLat = la
        if (la > maxLat) maxLat = la
      }
    }
    wraps = Number.isFinite(minLon) && maxLon - minLon > 180

    return {
      country,
      bbox: wraps || !Number.isFinite(minLon) ? null : [minLon, minLat, maxLon, maxLat],
      polys,
    }
  }

  private makeOcean(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(EARTH_RADIUS, 112, 80)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0f5a6e,
      roughness: 0.42,
      metalness: 0.18,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.receiveShadow = true
    return mesh
  }

  /** Subtle brighter “specular” shell so water reads wet under the key light. */
  private makeOceanSpec(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(EARTH_RADIUS + 0.02, 64, 48)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a90a8,
      roughness: 0.2,
      metalness: 0.45,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
    return new THREE.Mesh(geo, mat)
  }

  private makeIceCaps(): THREE.Group {
    const g = new THREE.Group()
    const ice = new THREE.MeshStandardMaterial({
      color: 0xe8f2f4,
      roughness: 0.55,
      metalness: 0.05,
      flatShading: true,
    })
    const r = EARTH_RADIUS + 0.12
    // theta: 0 = north pole … π = south pole
    g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 28, 10, 0, Math.PI * 2, 0, 0.38), ice))
    g.add(
      new THREE.Mesh(new THREE.SphereGeometry(r, 28, 10, 0, Math.PI * 2, Math.PI - 0.38, 0.38), ice),
    )
    return g
  }

  /** Low-poly cloud patches floating above the globe. */
  private makeCloudBand(): THREE.Group {
    const g = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf0f6f8,
      roughness: 1,
      transparent: true,
      opacity: 0.35,
      flatShading: true,
      depthWrite: false,
    })
    const r = EARTH_RADIUS + 0.55
    for (let i = 0; i < 28; i++) {
      const lat = (Math.random() - 0.5) * 100
      const lon = Math.random() * 360 - 180
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(0.55 + Math.random() * 0.9, 5, 4),
        mat,
      )
      latLonToVector3(lat, lon, r + Math.random() * 0.25, puff.position)
      puff.lookAt(0, 0, 0)
      puff.scale.set(1.4 + Math.random(), 0.35 + Math.random() * 0.25, 1 + Math.random() * 0.6)
      g.add(puff)
    }
    return g
  }

  private makeAtmosphere(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(EARTH_RADIUS * 1.04, 64, 40)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x7ec8d8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      depthWrite: false,
    })
    return new THREE.Mesh(geo, mat)
  }

  private makeAtmosphereOuter(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(EARTH_RADIUS * 1.085, 48, 32)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x4a9ab0,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      depthWrite: false,
    })
    return new THREE.Mesh(geo, mat)
  }

  /** Subtle lat/lon grid so geography reads more clearly. */
  private makeGraticule(): THREE.LineSegments {
    const positions: number[] = []
    const tmp = new THREE.Vector3()
    const r = EARTH_RADIUS + 0.05

    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 4) {
        latLonToVector3(lat, lon, r, tmp)
        positions.push(tmp.x, tmp.y, tmp.z)
        latLonToVector3(lat, lon + 4, r, tmp)
        positions.push(tmp.x, tmp.y, tmp.z)
      }
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -80; lat < 80; lat += 4) {
        latLonToVector3(lat, lon, r, tmp)
        positions.push(tmp.x, tmp.y, tmp.z)
        latLonToVector3(lat + 4, lon, r, tmp)
        positions.push(tmp.x, tmp.y, tmp.z)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0x9fd3d8, transparent: true, opacity: 0.1 }),
    )
  }

  private polygonsOf(feature: GeoFeature): Ring[][] {
    return feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates as Ring[]]
      : (feature.geometry.coordinates as Ring[][])
  }

  private buildCountryMeshes(feature: GeoFeature, color: number): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = []
    const mat = new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: 0.88,
      metalness: 0.04,
      side: THREE.DoubleSide,
    })

    for (const rings of this.polygonsOf(feature)) {
      const geo = this.ringsToGeometry(rings)
      if (!geo) continue
      const mesh = new THREE.Mesh(geo, mat.clone())
      mesh.castShadow = true
      mesh.receiveShadow = true
      meshes.push(mesh)
    }
    return meshes
  }

  private buildCountryBorders(feature: GeoFeature): THREE.LineSegments | null {
    const positions: number[] = []
    const tmp = new THREE.Vector3()

    for (const rings of this.polygonsOf(feature)) {
      for (const ring of rings) {
        if (ring.length < 2) continue
        const dense = this.densifyRing(this.stripRing(ring), MAX_RING_STEP_DEG)
        for (let i = 0; i < dense.length; i++) {
          const a = dense[i]!
          const b = dense[(i + 1) % dense.length]!
          latLonToVector3(a[1], a[0], BORDER_RADIUS, tmp)
          positions.push(tmp.x, tmp.y, tmp.z)
          latLonToVector3(b[1], b[0], BORDER_RADIUS, tmp)
          positions.push(tmp.x, tmp.y, tmp.z)
        }
      }
    }

    if (positions.length === 0) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0xd8e6c8, transparent: true, opacity: 0.55 }),
    )
  }

  private stripRing(ring: Ring): [number, number][] {
    const pts = ring.map(([lon, lat]) => [lon, lat] as [number, number])
    if (pts.length > 1) {
      const a = pts[0]!
      const b = pts[pts.length - 1]!
      if (a[0] === b[0] && a[1] === b[1]) pts.pop()
    }
    return pts
  }

  /** Insert vertices so no lon/lat edge exceeds maxStep degrees. */
  private densifyRing(ring: [number, number][], maxStep: number): [number, number][] {
    if (ring.length < 2) return ring
    const out: [number, number][] = []
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]!
      const b = ring[(i + 1) % ring.length]!
      out.push(a)
      const dLon = b[0] - a[0]
      const dLat = b[1] - a[1]
      const dist = Math.hypot(dLon, dLat)
      const steps = Math.max(1, Math.ceil(dist / maxStep))
      for (let s = 1; s < steps; s++) {
        const t = s / steps
        out.push([a[0] + dLon * t, a[1] + dLat * t])
      }
    }
    return out
  }

  private ringsToGeometry(rings: Ring[]): THREE.BufferGeometry | null {
    if (!rings[0] || rings[0].length < 4) return null

    let contour = this.stripRing(rings[0])
    if (contour.length < 3) return null

    const lons = contour.map((p) => p[0])
    const span = Math.max(...lons) - Math.min(...lons)
    const shift = span > 180
    if (shift) {
      contour = contour.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat])
    }

    const lons2 = contour.map((p) => p[0])
    if (Math.max(...lons2) - Math.min(...lons2) > 350) return null

    // Densify after unwrap so long edges don't interpolate across the wrong hemisphere
    contour = this.densifyRing(contour, MAX_RING_STEP_DEG)

    const holes = rings
      .slice(1)
      .map((r) => {
        let h = this.stripRing(r)
        if (shift) h = h.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat])
        return this.densifyRing(h, MAX_RING_STEP_DEG)
      })
      .filter((h) => h.length >= 3)

    const flat: number[] = []
    const holeIndices: number[] = []
    for (const [lon, lat] of contour) flat.push(lon, lat)
    for (const hole of holes) {
      holeIndices.push(flat.length / 2)
      for (const [lon, lat] of hole) flat.push(lon, lat)
    }

    const indices = earcut(flat, holeIndices, 2)
    if (indices.length < 3) return null

    // Subdivide diagonals in lon/lat BEFORE sphere projection so polar
    // great-circle chords don't fill Arctic ocean (Russia, Canada, etc.).
    const refined = this.subdivideLonLatTris(flat, indices, MAX_TRI_STEP_DEG)
    const kept = this.filterTrisInsidePolygon(refined.flat, refined.indices, contour, holes)
    if (kept.length < 3) return null

    const tmp = new THREE.Vector3()
    const verts: THREE.Vector3[] = []
    for (let i = 0; i < refined.flat.length; i += 2) {
      let lon = refined.flat[i]!
      const lat = refined.flat[i + 1]!
      if (lon > 180) lon -= 360
      latLonToVector3(lat, lon, LAND_RADIUS, tmp)
      verts.push(tmp.clone())
    }

    const tris = this.subdivideSphereTris(verts, kept, MAX_LAND_EDGE)

    const positions: number[] = []
    const normals: number[] = []
    for (const v of tris) {
      positions.push(v.x, v.y, v.z)
      tmp.copy(v).normalize()
      normals.push(tmp.x, tmp.y, tmp.z)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    return geo
  }

  /** Split long earcut edges in lon/lat space (midpoint stays on the planar diagonal). */
  private subdivideLonLatTris(
    flat: number[],
    indices: number[],
    maxStep: number,
  ): { flat: number[]; indices: number[] } {
    type Tri = [number, number, number]
    const coords = flat.slice()
    let tris: Tri[] = []
    for (let i = 0; i < indices.length; i += 3) {
      tris.push([indices[i]!, indices[i + 1]!, indices[i + 2]!])
    }

    const midCache = new Map<string, number>()
    const midpoint = (ia: number, ib: number): number => {
      const key = ia < ib ? `${ia}_${ib}` : `${ib}_${ia}`
      const hit = midCache.get(key)
      if (hit !== undefined) return hit
      const lon = (coords[ia * 2]! + coords[ib * 2]!) * 0.5
      const lat = (coords[ia * 2 + 1]! + coords[ib * 2 + 1]!) * 0.5
      const idx = coords.length / 2
      coords.push(lon, lat)
      midCache.set(key, idx)
      return idx
    }

    const edgeLen = (ia: number, ib: number) => {
      const dLon = coords[ia * 2]! - coords[ib * 2]!
      const dLat = coords[ia * 2 + 1]! - coords[ib * 2 + 1]!
      // Weight longitude by cos(lat) so polar spans aren't under-split
      const lat = ((coords[ia * 2 + 1]! + coords[ib * 2 + 1]!) * 0.5 * Math.PI) / 180
      return Math.hypot(dLon * Math.cos(lat), dLat)
    }

    for (let pass = 0; pass < 10; pass++) {
      const next: Tri[] = []
      let splitAny = false
      for (const [a, b, c] of tris) {
        const ab = edgeLen(a, b)
        const bc = edgeLen(b, c)
        const ca = edgeLen(c, a)
        const longest = Math.max(ab, bc, ca)
        if (longest <= maxStep) {
          next.push([a, b, c])
          continue
        }
        splitAny = true
        if (ab >= bc && ab >= ca) {
          const m = midpoint(a, b)
          next.push([a, m, c], [m, b, c])
        } else if (bc >= ab && bc >= ca) {
          const m = midpoint(b, c)
          next.push([a, b, m], [a, m, c])
        } else {
          const m = midpoint(c, a)
          next.push([a, b, m], [m, b, c])
        }
      }
      tris = next
      if (!splitAny) break
    }

    const outIdx: number[] = []
    for (const [a, b, c] of tris) outIdx.push(a, b, c)
    return { flat: coords, indices: outIdx }
  }

  /** Drop sliver / ocean-covering tris whose centroid falls outside the polygon. */
  private filterTrisInsidePolygon(
    flat: number[],
    indices: number[],
    contour: [number, number][],
    holes: [number, number][][],
  ): number[] {
    const kept: number[] = []
    for (let i = 0; i < indices.length; i += 3) {
      const ia = indices[i]!
      const ib = indices[i + 1]!
      const ic = indices[i + 2]!
      const lon =
        (flat[ia * 2]! + flat[ib * 2]! + flat[ic * 2]!) / 3
      const lat =
        (flat[ia * 2 + 1]! + flat[ib * 2 + 1]! + flat[ic * 2 + 1]!) / 3
      if (!this.pointInPolygon(lon, lat, contour, holes)) continue
      kept.push(ia, ib, ic)
    }
    return kept
  }

  private pointInPolygon(
    lon: number,
    lat: number,
    contour: [number, number][],
    holes: [number, number][][],
  ): boolean {
    if (!this.pointInRing(lon, lat, contour)) return false
    for (const hole of holes) {
      if (this.pointInRing(lon, lat, hole)) return false
    }
    return true
  }

  private pointInRing(x: number, y: number, ring: [number, number][]): boolean {
    let inside = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i]![0]
      const yi = ring[i]![1]
      const xj = ring[j]![0]
      const yj = ring[j]![1]
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    return inside
  }

  /**
   * Split long triangle edges and reproject midpoints onto the land sphere
   * so flat chords don't sink under the ocean mesh.
   */
  private subdivideSphereTris(
    verts: THREE.Vector3[],
    indices: number[],
    maxEdge: number,
  ): THREE.Vector3[] {
    type Tri = [number, number, number]
    let tris: Tri[] = []
    for (let i = 0; i < indices.length; i += 3) {
      tris.push([indices[i]!, indices[i + 1]!, indices[i + 2]!])
    }

    const midCache = new Map<string, number>()
    const midpoint = (ia: number, ib: number): number => {
      const key = ia < ib ? `${ia}_${ib}` : `${ib}_${ia}`
      const hit = midCache.get(key)
      if (hit !== undefined) return hit
      // Geographic midpoint (not 3D chord) — avoids polar ocean bulge
      const a = vector3ToLatLon(verts[ia]!)
      const b = vector3ToLatLon(verts[ib]!)
      let dLon = b.lon - a.lon
      if (dLon > 180) dLon -= 360
      if (dLon < -180) dLon += 360
      const midLon = a.lon + dLon * 0.5
      const midLat = (a.lat + b.lat) * 0.5
      const mid = latLonToVector3(midLat, midLon, LAND_RADIUS)
      const idx = verts.length
      verts.push(mid.clone())
      midCache.set(key, idx)
      return idx
    }

    const maxEdgeSq = maxEdge * maxEdge
    for (let pass = 0; pass < 8; pass++) {
      const next: Tri[] = []
      let splitAny = false
      for (const [a, b, c] of tris) {
        const va = verts[a]!
        const vb = verts[b]!
        const vc = verts[c]!
        const ab = va.distanceToSquared(vb)
        const bc = vb.distanceToSquared(vc)
        const ca = vc.distanceToSquared(va)
        const longest = Math.max(ab, bc, ca)
        if (longest <= maxEdgeSq) {
          next.push([a, b, c])
          continue
        }
        splitAny = true
        if (ab >= bc && ab >= ca) {
          const m = midpoint(a, b)
          next.push([a, m, c], [m, b, c])
        } else if (bc >= ab && bc >= ca) {
          const m = midpoint(b, c)
          next.push([a, b, m], [a, m, c])
        } else {
          const m = midpoint(c, a)
          next.push([a, b, m], [m, b, c])
        }
      }
      tris = next
      if (!splitAny) break
    }

    const out: THREE.Vector3[] = []
    for (const [a, b, c] of tris) {
      out.push(verts[a]!, verts[b]!, verts[c]!)
    }
    return out
  }

  /** Leave a lasting crater on the globe — land scars keep fire + smoke. */
  addImpactScar(lat: number, lon: number, kind: TerrainKind) {
    this.scars.add(lat, lon, kind)
  }

  clearScars() {
    this.scars.clear()
  }

  update(dt: number) {
    this.scars.update(dt)
    if (!this.revealActive) return
    this.capitalPulse += dt
    const s = 1 + Math.sin(this.capitalPulse * 3.2) * 0.12
    this.capitalRing.scale.setScalar(s)
    const mat = this.capitalRing.material as THREE.MeshBasicMaterial
    mat.opacity = 0.55 + Math.sin(this.capitalPulse * 3.2) * 0.3
  }
}
