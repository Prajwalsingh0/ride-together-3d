/**
 * Remote rider presence — fed by Socket.IO location:broadcast.
 */
export type PresenceStatus = 'LIVE' | 'GPS_WEAK' | 'STALE' | 'OFFLINE';

export interface RemoteRider {
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  timestamp: number;
  status: PresenceStatus;
  lastSeenAt: number;
}

const STALE_MS = 20_000;
const OFFLINE_MS = 45_000;

const riders = new Map<string, RemoteRider>();
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((l) => l());
}

function recomputeStatus(r: RemoteRider, now = Date.now()): PresenceStatus {
  const age = now - r.lastSeenAt;
  if (age > OFFLINE_MS) return 'OFFLINE';
  if (age > STALE_MS) return 'STALE';
  if (r.accuracy != null && r.accuracy > 50) return 'GPS_WEAK';
  return 'LIVE';
}

export const presenceStore = {
  upsert(update: {
    userId: string;
    name: string;
    latitude: number;
    longitude: number;
    heading?: number | null;
    speed?: number | null;
    accuracy?: number | null;
    timestamp: number;
  }) {
    const now = Date.now();
    const existing = riders.get(update.userId);
    const next: RemoteRider = {
      userId: update.userId,
      name: update.name,
      latitude: update.latitude,
      longitude: update.longitude,
      heading: update.heading ?? null,
      speed: update.speed ?? null,
      accuracy: update.accuracy ?? null,
      timestamp: update.timestamp,
      lastSeenAt: now,
      status: 'LIVE',
    };
    next.status = recomputeStatus(next, now);
    if (!next.name && existing?.name) next.name = existing.name;
    riders.set(update.userId, next);
    notify();
  },

  markOffline(userId: string) {
    const r = riders.get(userId);
    if (!r) return;
    r.status = 'OFFLINE';
    r.lastSeenAt = Date.now() - OFFLINE_MS - 1;
    notify();
  },

  tick() {
    const now = Date.now();
    let changed = false;
    riders.forEach((r) => {
      const s = recomputeStatus(r, now);
      if (s !== r.status) {
        r.status = s;
        changed = true;
      }
    });
    if (changed) notify();
  },

  list(): RemoteRider[] {
    return [...riders.values()].sort((a, b) => a.name.localeCompare(b.name));
  },

  clear() {
    riders.clear();
    notify();
  },

  subscribe(fn: () => void) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};
