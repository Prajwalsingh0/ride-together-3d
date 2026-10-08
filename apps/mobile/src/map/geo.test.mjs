/**
 * Standalone tests for geographic ↔ ENU conversion.
 * Run: node apps/mobile/src/map/geo.test.mjs
 */

const EARTH_RADIUS_M = 6_378_137;

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function geoToLocal(point, origin) {
  const lat1 = degToRad(origin.latitude);
  const lat2 = degToRad(point.latitude);
  const dLat = degToRad(point.latitude - origin.latitude);
  const dLon = degToRad(point.longitude - origin.longitude);
  const x = dLon * Math.cos((lat1 + lat2) / 2) * EARTH_RADIUS_M;
  const z = dLat * EARTH_RADIUS_M;
  return { x, y: 0, z };
}

function localToGeo(local, origin) {
  const lat1 = degToRad(origin.latitude);
  const dLat = local.z / EARTH_RADIUS_M;
  const dLon = local.x / (EARTH_RADIUS_M * Math.cos(lat1));
  return {
    latitude: origin.latitude + radToDeg(dLat),
    longitude: origin.longitude + radToDeg(dLon),
  };
}

function haversineDistanceM(a, b) {
  const lat1 = degToRad(a.latitude);
  const lat2 = degToRad(b.latitude);
  const dLat = degToRad(b.latitude - a.latitude);
  const dLon = degToRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

const origin = { latitude: 19.076, longitude: 72.8777 };
let passed = 0;
let failed = 0;

function assert(name, cond, detail = '') {
  if (cond) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.error(`  ✗ ${name} ${detail}`);
    failed++;
  }
}

console.log('geo conversion tests\n');

{
  const local = geoToLocal(origin, origin);
  assert('origin → local (0,0)', Math.abs(local.x) < 1e-9 && Math.abs(local.z) < 1e-9);
}

{
  const north = { latitude: origin.latitude + 0.001, longitude: origin.longitude };
  const local = geoToLocal(north, origin);
  assert('0.001° north ≈ 111m', Math.abs(local.z - 111.19) < 0.5);
  assert('no east drift for pure north', Math.abs(local.x) < 0.01);
}

{
  const pts = [
    { latitude: 19.08, longitude: 72.88 },
    { latitude: 19.07, longitude: 72.87 },
    { latitude: 19.09, longitude: 72.89 },
  ];
  pts.forEach((p, i) => {
    const local = geoToLocal(p, origin);
    const back = localToGeo(local, origin);
    const err = haversineDistanceM(p, back);
    assert(`round-trip #${i + 1} < 10cm`, err < 0.1, `err=${err}m`);
  });
}

{
  const local = { x: 100, y: 0, z: 0 };
  const geo = localToGeo(local, origin);
  const back = geoToLocal(geo, origin);
  assert('100m east round-trip', Math.abs(back.x - 100) < 0.01 && Math.abs(back.z) < 0.01);
}

{
  const a = { latitude: 19.076, longitude: 72.8777 };
  const bLocal = { x: 30, y: 0, z: 40 };
  const b = localToGeo(bLocal, origin);
  const dHav = haversineDistanceM(a, b);
  const dLocal = Math.sqrt(30 * 30 + 40 * 40);
  assert('haversine ≈ local Euclidean (50m)', Math.abs(dHav - dLocal) < 0.5);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
