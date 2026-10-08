# 3D Coordinate System

**Milestone 2**

## Problem

Latitude and longitude are angles on a sphere. Treating them as X/Y in a 3D engine causes distortion, floating-point precision issues, and incorrect distances/headings.

## Solution: Local ENU

For each active ride we pick a **geographic origin** and convert all positions to a local **East-North-Up (ENU)** frame in **meters**.

| Axis | Meaning | 3D usage |
|------|---------|----------|
| X | East (meters) | `position.x` |
| Z | North (meters) | `position.z` |
| Y | Up (meters) | `position.y` (0 for ground riders) |

Heading: **0 = north (+Z)**, increasing **clockwise**. Three.js Y-rotation uses `-heading`.

## Conversion

Implementation: `apps/mobile/src/map/geo.ts`

```
geoToLocal(lat, lng, origin) → { x: eastM, y: 0, z: northM }
localToGeo({ x, z }, origin) → { latitude, longitude }
```

Equirectangular approximation — accurate for ride-scale distances (< 10–20 km from origin).

## Round-trip error

Typically well under 10 cm at ride scale. Verified by unit tests.

## Default origin

```
latitude:  19.0760
longitude: 72.8777
```

## Rules

1. Never feed raw lat/lng into Three.js `position`.
2. Always convert through `geoToLocal` with the active ride origin.
3. Distances for UI may use local Euclidean or haversine; do not mix labels.
