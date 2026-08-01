import * as THREE from 'three'

/**
 * Compact Earth: small enough that the plane feels like it's
 * flying around an object, not hugging a planet.
 * Plane length ≈ 12 → Earth diameter ≈ 28 is intentionally disproportionate.
 */
export const EARTH_RADIUS = 14

/** High orbit relative to the tiny globe. */
export const ORBIT_ALTITUDE = 38
export const ORBIT_RADIUS = EARTH_RADIUS + ORBIT_ALTITUDE

/** Target time for one full orbit at cruise (seconds). */
export const ORBIT_PERIOD = 24

/** Cruise tangential speed so a full orbit ≈ ORBIT_PERIOD. */
export const CRUISE_SPEED = (2 * Math.PI * ORBIT_RADIUS) / ORBIT_PERIOD

/**
 * Convert lat/lon (degrees) → point on a sphere.
 * Uses the common Three.js globe convention (Y up, lon=0 at -Z).
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius = EARTH_RADIUS,
  target = new THREE.Vector3(),
): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  const sinPhi = Math.sin(phi)
  target.set(
    -radius * sinPhi * Math.cos(theta),
    radius * Math.cos(phi),
    radius * sinPhi * Math.sin(theta),
  )
  return target
}

export function vector3ToLatLon(v: THREE.Vector3): { lat: number; lon: number } {
  const r = v.length() || 1
  const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(v.y / r, -1, 1)))
  let lon = THREE.MathUtils.radToDeg(Math.atan2(v.z, -v.x)) - 180
  lon = ((((lon + 180) % 360) + 360) % 360) - 180
  return { lat, lon }
}

/** Great-circle distance in kilometers. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = THREE.MathUtils.degToRad(lat2 - lat1)
  const dLon = THREE.MathUtils.degToRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(THREE.MathUtils.degToRad(lat1)) *
      Math.cos(THREE.MathUtils.degToRad(lat2)) *
      Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}

/** Sample a great-circle arc between two lat/lon points on a sphere. */
export function greatCircleArc(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radius: number,
  segments = 64,
): THREE.Vector3[] {
  const a = latLonToVector3(lat1, lon1, 1)
  const b = latLonToVector3(lat2, lon2, 1)
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1)
  const omega = Math.acos(dot)
  const out: THREE.Vector3[] = []

  if (omega < 1e-5) {
    out.push(a.multiplyScalar(radius))
    return out
  }

  const sinOmega = Math.sin(omega)
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const p = new THREE.Vector3()
      .addScaledVector(a, Math.sin((1 - t) * omega) / sinOmega)
      .addScaledVector(b, Math.sin(t * omega) / sinOmega)
      .normalize()
      .multiplyScalar(radius)
    out.push(p)
  }
  return out
}

export function enuFrame(position: THREE.Vector3): {
  east: THREE.Vector3
  north: THREE.Vector3
  up: THREE.Vector3
} {
  const up = position.clone().normalize()
  const east = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), up)
  if (east.lengthSq() < 1e-8) {
    east.set(1, 0, 0)
  } else {
    east.normalize()
  }
  const north = new THREE.Vector3().crossVectors(up, east).normalize()
  return { east, north, up }
}

export function bearingDirection(
  position: THREE.Vector3,
  bearingRad: number,
): THREE.Vector3 {
  const { east, north } = enuFrame(position)
  return north.multiplyScalar(Math.cos(bearingRad)).add(east.multiplyScalar(Math.sin(bearingRad))).normalize()
}
