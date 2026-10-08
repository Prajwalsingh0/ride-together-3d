/** Shared types for the 3D rider prototype (Milestone 1 — simulated). */

export type RiderId = string;

export interface SimulatedRider {
  id: RiderId;
  name: string;
  color: string; // motorcycle body color
  /** Local 3D position in meters (X = east, Z = north, Y = up) */
  position: { x: number; y: number; z: number };
  /** Heading in radians (0 = +Z / north) */
  heading: number;
  /** Speed m/s */
  speed: number;
  /** Whether currently moving */
  moving: boolean;
}

export interface SceneCameraMode {
  mode: 'follow' | 'group' | 'free';
  followId?: RiderId;
}
