/** Shared types for the 3D rider system (M1+M2). */

export type RiderId = string;

export interface SimulatedRider {
  id: RiderId;
  name: string;
  color: string;
  /** Geographic position (source of truth for M2+) */
  latitude: number;
  longitude: number;
  /** Local ENU meters (derived from geo for 3D scene) */
  position: { x: number; y: number; z: number };
  /** Heading in radians (0 = north / +Z) */
  heading: number;
  /** Speed m/s */
  speed: number;
  moving: boolean;
}

export interface SceneCameraMode {
  mode: 'follow' | 'group' | 'free';
  followId?: RiderId;
}
