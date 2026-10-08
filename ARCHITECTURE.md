# Architecture — Ride Together 3D

## High-Level Overview

```
                    MOBILE CLIENT (Expo / React Native + TypeScript)
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
       GPS             MAP              3D LAYER
   (expo-location)  (Map provider)   (Three.js / expo-gl
                                      or native model layer)
        │                │                 │
        └───────────────┬┴─────────────────┘
                        │
                 REST + Socket.IO (authenticated)
                        │
                        ▼
              ┌──────────────────┐
              │     BACKEND      │
              │  Node + Express  │
              │  Socket.IO       │
              │  Prisma + PG     │
              └────────┬─────────┘
                       │
                       ▼
                PostgreSQL
```

## Chosen Stack (MVP)

### Mobile
- **Framework**: Expo (SDK 52+ recommended; current latest ~57 available via npx)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: Zustand (lightweight)
- **Maps**: Primary candidate `@rnmapbox/maps` (requires custom dev client / EAS). Fallback / web: `react-native-maps` or MapLibre via react-map-gl for web testing.
- **3D**: 
  1. Preferred for production fidelity: native model support in Mapbox (`Models` / `ModelLayer`) or munim-maps if it matures.
  2. Fallback / prototype: `expo-gl` + `three` + `expo-three` or `@react-three/fiber` (native) with a transparent overlay or custom camera sync.
  3. Hard constraint: Full animated character (idle/ride/lean) with GLB is non-trivial on native map layers; Mapbox model layer has animation limitations (as of early 2026 discussions).

### Backend
- Node.js + TypeScript
- Express
- Socket.IO (with auth middleware)
- PostgreSQL + Prisma ORM
- JWT (access + refresh) or session tokens; secure httpOnly where applicable + secure storage on mobile

### Shared
- Zod schemas for validation
- Shared TypeScript types for socket events and API payloads

## Coordinate System (Critical)

- Geographic: WGS84 (lat/lng)
- Map: Provider-specific (Mercator for Mapbox/MapLibre)
- 3D local: Local ENU (East-North-Up) origin centered on ride start or group centroid to avoid floating-point precision issues with large lat/lng values treated as meters.
- Conversion layer mandatory (see `docs/3d-coordinate-system.md` — to be created in Milestone 2).

## Real-time Flow

1. Authenticated client joins Socket.IO room `ride:{rideId}`
2. Client emits `location:update` (server derives userId from socket auth)
3. Server validates membership, accuracy, rate-limits, broadcasts `location:broadcast`
4. Clients interpolate + smooth into 3D positions
5. Presence / stale detection via heartbeats + last-seen timestamps

## Privacy & Safety Boundaries

- Location shared only while active member of a private ride
- No public share links for live location
- Server-side membership checks on every location event
- Configurable retention for LocationUpdate history
- SOS is best-effort notification, not guaranteed delivery

## Known Hard Problems (to validate early)

1. **Map + 3D alignment**: Camera, projection, rotation, zoom must stay synchronized. Drift is unacceptable.
2. **Animated GLB on map**: Native Mapbox model layers have limited animation support. Overlay Three.js is flexible but requires careful depth/camera sync and performance work.
3. **Background GPS**: Platform restrictions (especially iOS); battery impact.
4. **Sandbox limitations**: No Android emulator / Docker in current environment → web target + unit/integration tests first.

## Milestone Mapping

- M0: This document + env validation + repo skeleton
- M1: 3D prototype (simulated riders, no real map/GPS)
- M2: Map + geographic ↔ 3D conversion
- M3: Backend auth + rides
- M4: Real-time sockets
- M5: Real device GPS
- ... (see master prompt)
