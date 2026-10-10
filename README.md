# Ride Together 3D

Mobile-first multiplayer motorcycle riding app. Riders share live location and appear as 3D motorcycle + rider characters on a shared map.

## Status — MVP complete (milestones 0–10 foundation)

| Milestone | Status |
|-----------|--------|
| 0 Architecture | ✅ |
| 1 3D prototype | ✅ |
| 2 Geo ENU + map panel | ✅ |
| 3 Backend auth + rides | ✅ |
| 4 Socket.IO realtime | ✅ |
| 5 GPS (real + simulated fallback) | ✅ |
| 6 Distance / ahead-behind | ✅ (in 3D UI) |
| 7 Safety SOS + privacy | ✅ |
| 8 Ride list / membership history | ✅ (API) |
| 9–10 Polish / production notes | ✅ docs |

## Quick start

```bash
# Terminal 1 — API
cd apps/server && npm install && npm run dev

# Terminal 2 — app
cd apps/mobile && npm install
EXPO_PUBLIC_API_URL=http://localhost:3001 npx expo start --web
```

1. Sign up → Create ride → share **join code**
2. Second user joins with code
3. Owner taps **Start Ride** → both enter **Live Ride**
4. Locations stream (simulated GPS on web; real GPS when available)

## Architecture

- **Mobile**: Expo + TypeScript + expo-gl/three + Socket.IO client  
- **Server**: Express + Socket.IO + JWT + Zod + in-memory store  
- **Production DB**: Prisma schema for PostgreSQL (`apps/server/prisma/schema.prisma`)  
- **Coords**: WGS84 ↔ local ENU meters (`docs/3d-coordinate-system.md`)

## Tests

```bash
node apps/mobile/src/map/geo.test.mjs
cd apps/server && npm test
```

## Docs

- [docs/setup.md](./docs/setup.md)
- [docs/privacy.md](./docs/privacy.md)
- [docs/socket-events.md](./docs/socket-events.md)
- [docs/3d-coordinate-system.md](./docs/3d-coordinate-system.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DECISIONS.md](./DECISIONS.md)

## Important limitations

- In-memory store resets when the server restarts (use Prisma + Postgres for production).
- Map panel is schematic (not full Mapbox tiles — needs native custom client + token).
- 3D models are procedural placeholders (not production GLB).
- SOS notifies ride members only — **not** a guaranteed emergency service.
- Real multi-device GPS requires physical devices / emulators outside this sandbox.
