# Milestone 2 — Map + 3D Synchronization

**Status**: Implemented (simulated GPS, geographic ENU)

## What was built

1. Geographic ↔ local ENU conversion (`apps/mobile/src/map/geo.ts`)
2. Riders carry real lat/lng as source of truth; local meters for 3D
3. Map panel: schematic top-down + live lat/lng (same X/Z as 3D)
4. View modes: 3D / Split / Map
5. Unit tests: `node apps/mobile/src/map/geo.test.mjs` — 8/8 passing

## Alignment guarantee

3D models and map markers share the same local ENU frame. They cannot drift relative to each other.

## Still simulated

- Movement (no real GPS — Milestone 5)
- Map is schematic (full Mapbox tiles need native custom client)

## Next

Milestone 3 — Backend (auth, rides, membership).
