/**
 * Simulated multiplayer ride — positions are geographic (lat/lng).
 * Local ENU is derived via geoToLocal for the 3D scene.
 * Milestone 1–2: still simulated movement (no real GPS).
 */
import type { RiderId, SimulatedRider } from './types';
import {
  localToGeo,
  haversineDistanceM,
  DEFAULT_RIDE_ORIGIN,
  type GeoOrigin,
} from '../map/geo';

const COLORS = ['#ef4444', '#3b82f6', '#a855f7', '#f59e0b', '#14b8a6'];

/** Seed riders around origin with small geographic offsets. */
export function createInitialRiders(origin: GeoOrigin = DEFAULT_RIDE_ORIGIN): SimulatedRider[] {
  const seeds: Array<{ id: string; name: string; color: string; eastM: number; northM: number; heading: number; speed: number }> = [
    { id: 'you', name: 'You', color: '#22c55e', eastM: 0, northM: 0, heading: 0, speed: 8 },
    { id: 'rahul', name: 'Rahul', color: COLORS[0], eastM: -35, northM: 80, heading: 0.15, speed: 9.5 },
    { id: 'aman', name: 'Aman', color: COLORS[1], eastM: 55, northM: -25, heading: -0.4, speed: 7.2 },
    { id: 'neha', name: 'Neha', color: COLORS[2], eastM: 20, northM: 45, heading: 0.05, speed: 8.8 },
  ];

  return seeds.map((s) => {
    const local = { x: s.eastM, y: 0, z: s.northM };
    const geo = localToGeo(local, origin);
    return {
      id: s.id,
      name: s.name,
      color: s.color,
      latitude: geo.latitude,
      longitude: geo.longitude,
      position: local,
      heading: s.heading,
      speed: s.speed,
      moving: true,
    };
  });
}

/** Advance simulation in local meters, then write lat/lng back. */
export function stepSimulation(
  riders: SimulatedRider[],
  dt: number,
  elapsed: number,
  origin: GeoOrigin = DEFAULT_RIDE_ORIGIN
): SimulatedRider[] {
  return riders.map((r, i) => {
    const phase = elapsed * 0.35 + i * 1.7;
    const turn = Math.sin(phase) * 0.45 + Math.sin(phase * 0.37) * 0.2;
    const heading = r.heading + turn * dt * 0.6;

    const speed = Math.max(4, Math.min(14, r.speed + Math.sin(elapsed * 0.5 + i) * 0.8));
    const vx = Math.sin(heading) * speed;
    const vz = Math.cos(heading) * speed;

    const position = {
      x: r.position.x + vx * dt,
      y: 0,
      z: r.position.z + vz * dt,
    };
    const geo = localToGeo(position, origin);

    return {
      ...r,
      heading,
      speed,
      moving: true,
      position,
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  });
}

/** Straight-line distance using local meters (consistent with 3D). */
export function distanceBetween(a: SimulatedRider, b: SimulatedRider): number {
  const dx = a.position.x - b.position.x;
  const dz = a.position.z - b.position.z;
  return Math.sqrt(dx * dx + dz * dz);
}

/** Geographic haversine distance (cross-check). */
export function geoDistanceBetween(a: SimulatedRider, b: SimulatedRider): number {
  return haversineDistanceM(
    { latitude: a.latitude, longitude: a.longitude },
    { latitude: b.latitude, longitude: b.longitude }
  );
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function relativeDirection(
  you: SimulatedRider,
  other: SimulatedRider
): 'ahead' | 'behind' | 'side' {
  const dx = other.position.x - you.position.x;
  const dz = other.position.z - you.position.z;
  const forwardX = Math.sin(you.heading);
  const forwardZ = Math.cos(you.heading);
  const proj = dx * forwardX + dz * forwardZ;
  if (proj > 8) return 'ahead';
  if (proj < -8) return 'behind';
  return 'side';
}

export { DEFAULT_RIDE_ORIGIN };
export type { RiderId };
