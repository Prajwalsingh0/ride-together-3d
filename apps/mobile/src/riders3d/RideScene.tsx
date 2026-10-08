/**
 * Milestone 2 — 3D multiplayer riding with geographic ↔ ENU sync (SIMULATED GPS).
 * Uses expo-gl + three. Map panel shows lat/lng + schematic aligned to same coordinates.
 */
import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { createRiderGroup, updateRiderGroup } from './RiderModel';
import {
  createInitialRiders,
  stepSimulation,
  distanceBetween,
  formatDistance,
  relativeDirection,
  DEFAULT_RIDE_ORIGIN,
} from './simulation';
import type { SimulatedRider } from './types';
import MapPanel from '../map/MapPanel';
import { conversionErrorM } from '../map/geo';

type CameraMode = 'follow' | 'group' | 'free';
type ViewMode = '3d' | 'map' | 'split';

export default function RideScene() {
  const ridersRef = useRef<SimulatedRider[]>(createInitialRiders());
  const groupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const cameraModeRef = useRef<CameraMode>('follow');
  const elapsedRef = useRef(0);
  const [uiRiders, setUiRiders] = useState(ridersRef.current);
  const [cameraMode, setCameraMode] = useState<CameraMode>('follow');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMode = useCallback((mode: CameraMode) => {
    cameraModeRef.current = mode;
    setCameraMode(mode);
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    try {
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

      // @ts-expect-error expo-three Renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor('#0b1220');
      renderer.shadowMap.enabled = true;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog('#0b1220', 40, 180);

      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 400);
      camera.position.set(0, 12, -18);

      const ambient = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 1.05);
      dir.position.set(20, 40, 10);
      dir.castShadow = true;
      dir.shadow.mapSize.set(1024, 1024);
      scene.add(dir);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400, 40, 40),
        new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.95, metalness: 0.05 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const grid = new THREE.GridHelper(200, 40, 0x334155, 0x1e293b);
      grid.position.y = 0.02;
      scene.add(grid);

      ridersRef.current.forEach((r) => {
        const g = createRiderGroup(r, r.id === 'you');
        groupsRef.current.set(r.id, g);
        scene.add(g);
      });

      setReady(true);

      let last = performance.now();
      let uiTick = 0;

      const renderLoop = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        elapsedRef.current += dt;

        ridersRef.current = stepSimulation(
          ridersRef.current,
          dt,
          elapsedRef.current,
          DEFAULT_RIDE_ORIGIN
        );

        ridersRef.current.forEach((r) => {
          const g = groupsRef.current.get(r.id);
          if (g) updateRiderGroup(g, r);
        });

        const you = ridersRef.current.find((r) => r.id === 'you');
        const mode = cameraModeRef.current;

        if (mode === 'follow' && you) {
          const back = 16;
          const heightCam = 9;
          const cx = you.position.x - Math.sin(you.heading) * back;
          const cz = you.position.z - Math.cos(you.heading) * back;
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, cx, 0.08);
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, cz, 0.08);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, heightCam, 0.08);
          camera.lookAt(you.position.x, 1.2, you.position.z);
        } else if (mode === 'group') {
          const rs = ridersRef.current;
          let sx = 0, sz = 0;
          rs.forEach((r) => {
            sx += r.position.x;
            sz += r.position.z;
          });
          const cx = sx / rs.length;
          const cz = sz / rs.length;
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, cx, 0.05);
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, cz - 30, 0.05);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, 28, 0.05);
          camera.lookAt(cx, 0, cz);
        }

        renderer.render(scene, camera);
        gl.endFrameEXP();

        uiTick += dt;
        if (uiTick > 0.25) {
          uiTick = 0;
          setUiRiders([...ridersRef.current]);
        }

        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'Failed to create WebGL context');
    }
  };

  const you = uiRiders.find((r) => r.id === 'you');
  const others = uiRiders.filter((r) => r.id !== 'you');

  const maxConvErr =
    uiRiders.length === 0
      ? 0
      : Math.max(
          ...uiRiders.map((r) =>
            conversionErrorM(
              { latitude: r.latitude, longitude: r.longitude },
              DEFAULT_RIDE_ORIGIN
            )
          )
        );

  const show3d = viewMode === '3d' || viewMode === 'split';
  const showMap = viewMode === 'map' || viewMode === 'split';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride Together 3D</Text>
        <Text style={styles.badge}>M2 · GEO SYNC · SIM</Text>
      </View>

      {show3d && (
        <View style={[styles.glWrap, viewMode === 'split' && styles.glSplit]}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <GLView style={styles.gl} onContextCreate={onContextCreate} />
          )}
          {!ready && !error && (
            <View style={styles.loading}>
              <Text style={styles.loadingText}>Starting 3D scene…</Text>
            </View>
          )}
        </View>
      )}

      {showMap && (
        <ScrollView style={viewMode === 'map' ? styles.mapFull : undefined} nestedScrollEnabled>
          <MapPanel riders={uiRiders} />
        </ScrollView>
      )}

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>
          🟢 {uiRiders.length} Riders · ENU err ≤ {maxConvErr.toFixed(3)} m
        </Text>
        {you &&
          others.map((r) => {
            const d = distanceBetween(you, r);
            const dir = relativeDirection(you, r);
            const arrow = dir === 'ahead' ? '↑' : dir === 'behind' ? '↓' : '→';
            return (
              <View key={r.id} style={styles.row}>
                <View style={[styles.dot, { backgroundColor: r.color }]} />
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.dist}>
                  {formatDistance(d)} {arrow}
                </Text>
              </View>
            );
          })}

        <View style={styles.cameraRow}>
          {(['follow', 'group', 'free'] as CameraMode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[styles.camBtn, cameraMode === m && styles.camBtnActive]}
            >
              <Text style={[styles.camBtnText, cameraMode === m && styles.camBtnTextActive]}>
                {m === 'follow' ? 'Follow' : m === 'group' ? 'Group' : 'Free'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.cameraRow}>
          {(['3d', 'split', 'map'] as ViewMode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => setViewMode(m)}
              style={[styles.camBtn, viewMode === m && styles.camBtnActive]}
            >
              <Text style={[styles.camBtnText, viewMode === m && styles.camBtnTextActive]}>
                {m === '3d' ? '3D' : m === 'split' ? 'Split' : 'Map'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b1220' },
  header: {
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  badge: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#0c4a6e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  glWrap: { flex: 1, position: 'relative' },
  glSplit: { flex: 1.2 },
  gl: { flex: 1 },
  mapFull: { flex: 1 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1220',
  },
  loadingText: { color: '#94a3b8' },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: '#f87171', textAlign: 'center' },
  panel: {
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'web' ? 14 : 26,
  },
  panelTitle: { color: '#94a3b8', fontSize: 12, marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  name: { color: '#e2e8f0', fontSize: 14, flex: 1, fontWeight: '600' },
  dist: { color: '#94a3b8', fontSize: 13, fontVariant: ['tabular-nums'] },
  cameraRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  camBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  camBtnActive: { backgroundColor: '#2563eb' },
  camBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  camBtnTextActive: { color: '#fff' },
});
