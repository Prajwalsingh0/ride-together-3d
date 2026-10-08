# Architecture Decision Records

## ADR-001: Monorepo Structure
**Date**: 2026-10-08
**Status**: Accepted
**Context**: Need clear separation of mobile, server, and shared code while keeping the project manageable.
**Decision**: Use simple folder-based monorepo (`apps/`, `packages/`) without forcing Turborepo/Nx initially. Add workspace tooling later if needed.
**Consequences**: Simple `npm` / file references; can evolve.

## ADR-002: Mobile Framework
**Date**: 2026-10-08
**Status**: Accepted
**Context**: Need React Native + good DX + TypeScript + Expo ecosystem for location, assets, builds.
**Decision**: Expo (managed + custom dev clients when native modules required).
**Consequences**: Mapbox and some 3D packages require EAS / prebuild. Expo Go alone is insufficient for production map/3D.

## ADR-003: Map Provider
**Date**: 2026-10-08
**Status**: Provisional
**Context**: Need real-world roads, camera control, markers, and ability to place 3D models.
**Options considered**:
- `@rnmapbox/maps` — strong, has Models/ModelLayer, needs access token + custom client
- `react-native-maps` — simpler, weaker 3D model support
- munim-maps — promising animated 3D + multi-engine, newer
- expo-maps (alpha) — too early
**Decision**: Start with `@rnmapbox/maps` for native; use MapLibre / react-map-gl for web testing in this sandbox. Re-evaluate munim-maps after M1/M2 prototypes.
**Consequences**: Requires Mapbox token (user-provided, never committed). Custom native code needed.

## ADR-004: 3D Rendering Approach
**Date**: 2026-10-08
**Status**: Under investigation (hardest assumption)
**Context**: Primary differentiator is animated 3D motorcycle + rider on the map.
**Findings**:
- Mapbox model layer supports GLB but animation support is limited (confirmed in community discussions).
- expo-gl + three / @react-three/fiber works for pure 3D scenes in Expo.
- Overlaying a GLView on a map and keeping camera/projection in sync is non-trivial (depth, occlusion, performance).
- munim-maps claims native animated models anchored to coordinates.
**Decision for M1**: Build a pure 3D scene (no map) with multiple simulated riders using expo-gl + three (or R3F) to validate models, animation, camera, labels. Label clearly as prototype.
**Decision for M2**: Prototype geographic conversion + either (a) Mapbox ModelLayer or (b) overlay strategy. Choose the one that stays aligned and performant.
**Consequences**: May need to fall back to simplified 3D (low-poly, fewer animations) or hybrid markers if full animated characters prove too costly for MVP.

## ADR-005: Backend Stack
**Date**: 2026-10-08
**Status**: Accepted
**Decision**: Node.js + Express + TypeScript + Socket.IO + Prisma + PostgreSQL.
**Rationale**: Matches prompt, mature, good TypeScript support, Prisma excellent for schema evolution.

## ADR-006: Authentication
**Date**: 2026-10-08
**Status**: Accepted (details later)
**Decision**: Email + password with bcrypt (or argon2), JWT access + refresh tokens. Socket.IO auth via token. Secure storage on mobile (expo-secure-store).
**Consequences**: Standard; implement rate limiting and proper validation early.

## ADR-007: Location Update Strategy
**Date**: 2026-10-08
**Status**: Accepted (starting values)
**Decision**: Adaptive intervals based on speed/movement (1–3s moving, longer when stationary). Configurable. Server rate-limits and validates accuracy/timestamp.
**Consequences**: Battery and bandwidth conscious from day one.

## ADR-008: Environment Constraints
**Date**: 2026-10-08
**Status**: Accepted
**Context**: Current sandbox has no Docker, no Android SDK, limited RAM.
**Decision**: 
- Backend can be developed and unit-tested fully.
- Mobile early milestones target Expo web + simulated data.
- Real device GPS and native map testing documented as required outside this environment.
- No pretence that web simulation == production mobile.
**Consequences**: Explicit "simulated" labels; later milestones will note device testing gaps.

## ADR-009: Git & Secrets
**Date**: 2026-10-08
**Status**: Accepted
**Decision**: Meaningful commits per milestone. `.env.example` only. Never commit tokens, keys, or real credentials.
