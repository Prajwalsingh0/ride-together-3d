# Ride Together 3D

Mobile-first multiplayer motorcycle riding application. Riders share live GPS locations and appear as animated 3D motorcycle + rider characters on a shared real-world map.

## Status

**Current Milestone: 0 — Environment + Architecture Validation**

## Project Structure

```
ride-together/
├── apps/
│   ├── mobile/          # Expo React Native app (TypeScript)
│   └── server/          # Node.js + Express + Socket.IO backend
├── packages/
│   └── shared/          # Shared types, constants, utilities
├── docs/                # Detailed technical docs
├── docker/              # Docker assets
├── .env.example
├── docker-compose.yml
├── README.md
├── ARCHITECTURE.md
└── DECISIONS.md
```

## Prerequisites

- Node.js 20+ (tested with 24.15.0)
- npm 10+
- Git
- For mobile: Expo CLI / EAS, physical device or emulator
- PostgreSQL (local or container)

## Environment Notes (This Sandbox)

- OS: Ubuntu 24.04.4 LTS (x86_64)
- Node: v24.15.0
- npm: 11.12.1
- Git: 2.43.0
- OpenJDK 21 present
- **Missing**: Docker, Android SDK / adb, pre-installed Expo CLI, pnpm/yarn
- Resources: ~1.2 GiB RAM, 2 CPU cores, ~19 GiB free disk
- Implication: Full native Android builds and emulators are not practical here. We will use Expo web + simulated GPS for early milestones, and document device testing requirements.

## Development Principles

- Build only in verified milestones.
- Implement → run → test → fix → document → commit.
- Never claim untested functionality works.
- Clearly label any simulated parts.
- No secrets committed.

## Next Steps

See ARCHITECTURE.md and DECISIONS.md.
