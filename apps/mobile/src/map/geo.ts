/**
 * Geographic ↔ local ENU (East-North-Up) coordinate conversion.
 *
 * Critical for Milestone 2: never treat lat/lng as ordinary 3D coordinates.
 * Uses a local origin so 3D scene stays in meter-scale floats (avoids precision issues).
 *
 * See docs/3d-coordinate-system.md
 */

const EARTH_RADIUS_M = 6_378_137; // WGS84 equatorial radius (approx)

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface LocalPoint {
  /** East (meters) */
  x: number;
  /** Up (meters) — usually 0 for ground riders */
  y: number;
  /** North (meters) */
  z: number;
}

export interface GeoOrigin {
  latitude: number;
  longitude: number;
}

/** Degrees → radians */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Radians → degrees */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Convert geographic (lat/lng) to local ENU meters relative to origin.
 * X = East, Z = North, Y = Up (0 for ground).
 */
export function geoToLocal(point: GeoPoint, origin: GeoOrigin): LocalPoint {
  const lat1 = degToRad(origin.latitude);
  const lat2 = degToRad(point.latitude);
  const dLat = degToRad(point.latitude - origin.latitude);
  const dLon = degToRad(point.longitude - origin.longitude);

  // Equirectangular approximation — excellent for ride-scale distances (< ~50 km)
  const x = dLon * Math.cos((lat1 + lat2) / 2) * EARTH_RADIUS_M; // East
  const z = dLat * EARTH_RADIUS_M; // North

  return { x, y: 0, z };
}

/**
 * Convert local ENU meters back to geographic (lat/lng).
 */
export function localToGeo(local: LocalPoint, origin: GeoOrigin): GeoPoint {
  const lat1 = degToRad(origin.latitude);
  const dLat = local.z / EARTH_RADIUS_M;
  const dLon = local.x / (EARTH_RADIUS_M * Math.cos(lat1));

  return {
    latitude: origin.latitude + radToDeg(dLat),
    longitude: origin.longitude + radToDeg(dLon),
  };
}

/**
 * Haversine great-circle distance in meters.
 */
export function haversineDistanceM(a: GeoPoint, b: GeoPoint): number {
  const lat1 = degToRad(a.latitude);
  const lat2 = degToRad(b.latitude);
  const dLat = degToRad(b.latitude - a.latitude);
  const dLon = degToRad(b.longitude - a.longitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

/**
 * Initial bearing from A → B in radians (0 = north, clockwise).
 */
export function bearingRad(from: GeoPoint, to: GeoPoint): number {
  const lat1 = degToRad(from.latitude);
  const lat2 = degToRad(to.latitude);
  const dLon = degToRad(to.longitude - from.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return Math.atan2(y, x);
}

/**
 * Default ride origin — a real-world reference point (Mumbai coastal road area).
 * Can be set to ride start location at runtime.
 */
export const DEFAULT_RIDE_ORIGIN: GeoOrigin = {
  latitude: 19.0760,
  longitude: 72.8777,
};

/**
 * Validate conversion round-trip error (meters). Used in tests / diagnostics.
 */
export function conversionErrorM(
  point: GeoPoint,
  origin: GeoOrigin
): number {
  const local = geoToLocal(point, origin);
  const back = localToGeo(local, origin);
  return haversineDistanceM(point, back);
}
