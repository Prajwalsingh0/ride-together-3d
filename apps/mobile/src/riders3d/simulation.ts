/**
 * Simulated multiplayer ride — Milestone 1 only.
 * No real GPS. Deterministic-ish movement so the prototype feels alive.
 */
import type { RiderId, SimulatedRider } from './types';

const COLORS = ['#ef4444', '#3b82f6', '#a855f7', '#f59e0b', '#14b8a6'];

export function createInitialRiders(): SimulatedRider[] {
  return [
    {
      id: 'you',
      name: 'You',
      color: '#22c55e',
      position: { x: 0, y: 0, z: 0 },
      heading: 0,
      speed: 8,
      moving: true,
    },
    {
      id: 'rahul',
      name: 'Rahul',
      color: COLORS[0],
      position: { x: -12, y: 0, z: 28 },
      heading: 0.15,
      speed: 9.5,
      moving: true,
    },
    {
      id: 'aman',
      name: 'Aman',
      color: COLORS[1],
      position: { x: 18, y: 0, z: -8 },
      heading: -0.4,
      speed: 7.2,
      moving: true,
    },
    {
      id: 'neha',
      name: 'Neha',
      color: COLORS[2],
      position: { x: 6, y: 0, z: 15 },
      heading: 0.05,
      speed: 8.8,
      moving: true,
    },
  ];
}

/** Advance simulation by `dt` seconds. */
export function stepSimulation(riders: SimulatedRider[], dt: number, elapsed: number): SimulatedRider[] {
  return riders.map((r, i) => {
    // Gentle weaving path unique per rider
    const phase = elapsed * 0.35 + i * 1.7;
    const turn = Math.sin(phase) * 0.45 + Math.sin(phase * 0.37) * 0.2;
    const heading = r.heading + turn * dt * 0.6;

    const speed = r.speed + Math.sin(elapsed * 0.5 + i) * 0.8;
    const vx = Math.sin(heading) * speed;
    const vz = Math.cos(heading) * speed;

    return {
      ...r,
      heading,
      speed: Math.max(4, Math.min(14, speed)),
      moving: true,
      position: {
        x: r.position.x + vx * dt,
        y: 0,
        z: r.position.z + vz * dt,
      },
    };
  });
}

/** Straight-line distance in meters between two riders. */
export function distanceBetween(a: SimulatedRider, b: SimulatedRider): number {
  const dx = a.position.x - b.position.x;
  const dz = a.position.z - b.position.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/** Rough ahead/behind relative to "you" based on your heading. */
export function relativeDirection(
  you: SimulatedRider,
  other: SimulatedRider
): 'ahead' | 'behind' | 'side' {
  const dx = other.position.x - you.position.x;
  const dz = other.position.z - you.position.z;
  // Project onto your forward vector
  const forwardX = Math.sin(you.heading);
  const forwardZ = Math.cos(you.heading);
  const proj = dx * forwardX + dz * forwardZ;
  if (proj > 8) return 'ahead';
  if (proj < -8) return 'behind';
  return 'side';
}

export type { RiderId };
