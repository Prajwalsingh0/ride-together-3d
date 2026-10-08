# Milestone 1 — 3D Rider Prototype

**Status**: Implemented (simulated)

## What this is

A pure 3D multiplayer riding prototype with:

- Procedural low-poly motorcycle + rider characters (placeholder, not production GLB)
- Four simulated riders (You, Rahul, Aman, Neha)
- Continuous movement and heading changes
- Distance + ahead/behind indicators
- Camera modes: Follow Me / Group / Free
- Clear **SIMULATED** badge — no real GPS, no map

## How it works

```
simulation.ts  →  updates positions / headings every frame
       ↓
RiderModel.ts  →  builds & lerps THREE.Group meshes
       ↓
RideScene.tsx  →  expo-gl + expo-three Renderer, lights, ground, camera
```

Coordinate system for this milestone is a simple local metric plane:

- X = east
- Z = north
- Y = up
- Origin = starting position of "You"

This will be replaced by a proper geographic ↔ local ENU conversion in Milestone 2.

## Running

```bash
cd apps/mobile
npm install
npx expo start --web     # recommended for this sandbox
# or
npx expo start           # then open on device / simulator
```

## Known limitations (intentional for M1)

- Models are procedural boxes/cylinders, not GLB
- No name text labels yet (colored name plate + status ring only)
- No real map tiles
- No real GPS
- Free camera has no orbit controls yet
- Performance not yet profiled on low-end devices

## Next (M2)

Geographic coordinate conversion + map alignment.
