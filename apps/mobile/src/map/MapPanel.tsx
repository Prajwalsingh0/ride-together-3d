/**
 * Map panel for Milestone 2 — shows geographic positions + schematic top-down view.
 * Full Mapbox/MapLibre tiles deferred until native custom client; this panel
 * proves that lat/lng ↔ local ENU stay synchronized with the 3D scene.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SimulatedRider } from '../riders3d/types';
import { DEFAULT_RIDE_ORIGIN, conversionErrorM } from './geo';
import { distanceBetween, formatDistance, relativeDirection } from '../riders3d/simulation';

interface MapPanelProps {
  riders: SimulatedRider[];
}

export default function MapPanel({ riders }: MapPanelProps) {
  const you = riders.find((r) => r.id === 'you');
  const others = riders.filter((r) => r.id !== 'you');

  const bounds = useMemo(() => {
    if (riders.length === 0) return { minX: -50, maxX: 50, minZ: -50, maxZ: 50 };
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    riders.forEach((r) => {
      minX = Math.min(minX, r.position.x);
      maxX = Math.max(maxX, r.position.x);
      minZ = Math.min(minZ, r.position.z);
      maxZ = Math.max(maxZ, r.position.z);
    });
    const pad = 30;
    return { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad };
  }, [riders]);

  const width = 280;
  const height = 180;
  const spanX = bounds.maxX - bounds.minX || 1;
  const spanZ = bounds.maxZ - bounds.minZ || 1;

  const toScreen = (x: number, z: number) => ({
    left: ((x - bounds.minX) / spanX) * width,
    top: ((bounds.maxZ - z) / spanZ) * height,
  });

  const maxError = useMemo(() => {
    let max = 0;
    riders.forEach((r) => {
      const err = conversionErrorM(
        { latitude: r.latitude, longitude: r.longitude },
        DEFAULT_RIDE_ORIGIN
      );
      if (err > max) max = err;
    });
    return max;
  }, [riders]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Geographic map · ENU sync</Text>
      <Text style={styles.sub}>
        Origin {DEFAULT_RIDE_ORIGIN.latitude.toFixed(4)}, {DEFAULT_RIDE_ORIGIN.longitude.toFixed(4)}
        {' · '}max conversion error {maxError.toFixed(3)} m
      </Text>

      <View style={[styles.schematic, { width, height }]}>
        {[0.25, 0.5, 0.75].map((t) => (
          <View key={`h${t}`} style={[styles.gridH, { top: height * t }]} />
        ))}
        {[0.25, 0.5, 0.75].map((t) => (
          <View key={`v${t}`} style={[styles.gridV, { left: width * t }]} />
        ))}
        <Text style={[styles.compass, { top: 4, left: width / 2 - 6 }]}>N</Text>

        {riders.map((r) => {
          const s = toScreen(r.position.x, r.position.z);
          return (
            <View
              key={r.id}
              style={[
                styles.marker,
                {
                  left: s.left - 7,
                  top: s.top - 7,
                  backgroundColor: r.color,
                  borderColor: r.id === 'you' ? '#fff' : 'transparent',
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.list}>
        {you &&
          others.map((r) => {
            const d = distanceBetween(you, r);
            const dir = relativeDirection(you, r);
            const arrow = dir === 'ahead' ? '↑' : dir === 'behind' ? '↓' : '→';
            return (
              <View key={r.id} style={styles.row}>
                <View style={[styles.dot, { backgroundColor: r.color }]} />
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.coords}>
                  {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
                </Text>
                <Text style={styles.dist}>
                  {formatDistance(d)} {arrow}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: { color: '#e2e8f0', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  sub: { color: '#64748b', fontSize: 11, marginBottom: 8 },
  schematic: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#334155' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#334155' },
  compass: { position: 'absolute', color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  marker: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  list: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  name: { color: '#e2e8f0', fontSize: 13, fontWeight: '600', width: 56 },
  coords: { color: '#64748b', fontSize: 11, flex: 1, fontVariant: ['tabular-nums'] },
  dist: { color: '#94a3b8', fontSize: 12, fontVariant: ['tabular-nums'] },
});
