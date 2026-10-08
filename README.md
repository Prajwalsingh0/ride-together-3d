# Ride Together 3D

Mobile-first multiplayer motorcycle riding application. Riders share live GPS locations and appear as animated 3D motorcycle + rider characters on a shared real-world map.

## Status

**Current Milestone: 1 — 3D Rider Prototype (SIMULATED)**

Milestone 0 (architecture) is complete. Milestone 1 delivers a working 3D multi-rider scene with simulated movement.

## Project Structure

```
ride-together/
├── apps/
│   ├── mobile/          # Expo React Native app (TypeScript)
│   └── server/          # Node.js + Express + Socket.IO backend
├── packages/
│   └── shared/          # Shared types, constants, utilities
├── docs/                # Detailed technical docs
├── docker/
├── .env.example
├── docker-compose.yml
├── README.md
├── ARCHITECTURE.md
└── DECISIONS.md
```

## Quick start (Milestone 1)

```bash
cd apps/mobile
npm install
npx expo start --web
```

You should see four simulated riders moving on a dark ground plane, distance list, and camera controls (Follow Me / Group / Free).

See `docs/m1-3d-prototype.md` for details.

## Prerequisites

- Node.js 20+
- npm 10+
- For native device builds later: Expo CLI / EAS, Android Studio or Xcode

## Development Principles

- Build only in verified milestones.
- Implement → run → test → fix → document → commit.
- Never claim untested functionality works.
- Clearly label any simulated parts.
- No secrets committed.

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DECISIONS.md](./DECISIONS.md)
- [docs/m1-3d-prototype.md](./docs/m1-3d-prototype.md)
