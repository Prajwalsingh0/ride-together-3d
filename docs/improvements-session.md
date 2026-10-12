# Improvements applied (while owner away)

## Visual / 3D
- Richer procedural bike: tank, chassis, exhaust, headlight, visor, arms
- Wheel spin proportional to travel distance
- Lean into turns from yaw rate
- Status-colored helmet + ground ring + soft glow
- Darker night-ride atmosphere, road strip + center line

## Multiplayer UX
- `presenceStore` for remote riders from Socket.IO
- Live ride listens to location:broadcast, rider:online/offline
- Horizontal presence chips (LIVE / GPS_WEAK / STALE / OFFLINE)
- Stale/offline timers (20s / 45s)

## UI copy
- Auth tagline "Live 3D group rides"
- Live badge "LIVE · 3D · GEO"

## Docs
- docs/assets-glb.md — how to drop in a real bike model

## Still for you later
- Real GLB file
- Mapbox token + native build
- Deploy API + Postgres
- Two-phone GPS test
