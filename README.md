# Ride Together 3D

Mobile-first multiplayer motorcycle riding application. Riders share live GPS locations and appear as animated 3D motorcycle + rider characters on a shared real-world map.

## Status

**Current Milestone: 2 — Map + 3D Synchronization (SIMULATED GPS)**

- ✅ M0 Architecture
- ✅ M1 3D rider prototype
- ✅ M2 Geographic ENU conversion + map panel aligned with 3D

## Quick start

```bash
cd apps/mobile
npm install
npx expo start --web
```

View modes: **3D / Split / Map**. Camera: Follow / Group / Free.

Geo conversion tests (no Expo required):

```bash
node apps/mobile/src/map/geo.test.mjs
```

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DECISIONS.md](./DECISIONS.md)
- [docs/3d-coordinate-system.md](./docs/3d-coordinate-system.md)
- [docs/m2-map-3d-sync.md](./docs/m2-map-3d-sync.md)
