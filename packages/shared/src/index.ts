// Shared types and constants for Ride Together 3D

export type RiderStatus = 'LIVE' | 'GPS_WEAK' | 'CONNECTING' | 'STALE' | 'OFFLINE';

export interface LocationPayload {
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null; // m/s
  accuracy?: number | null; // meters
  timestamp: number; // unix ms
}

export interface RiderPresence {
  userId: string;
  name: string;
  status: RiderStatus;
  lastSeenAt: number;
  location?: LocationPayload;
}

// Socket event names (typed later with Socket.IO)
export const SOCKET_EVENTS = {
  RIDE_JOIN: 'ride:join',
  RIDE_LEAVE: 'ride:leave',
  LOCATION_UPDATE: 'location:update',
  LOCATION_BROADCAST: 'location:broadcast',
  RIDER_ONLINE: 'rider:online',
  RIDER_OFFLINE: 'rider:offline',
  RIDER_STALE: 'rider:stale',
  RIDE_START: 'ride:start',
  RIDE_END: 'ride:end',
  HEARTBEAT: 'heartbeat',
} as const;

export const GPS_DEFAULTS = {
  MOVING_INTERVAL_MS: 2000,
  SLOW_INTERVAL_MS: 4000,
  STATIONARY_INTERVAL_MS: 15000,
  STALE_THRESHOLD_MS: 20000,
  MIN_ACCURACY_M: 50,
} as const;
