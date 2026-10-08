/**
 * Procedural low-poly motorcycle + rider builder.
 * PLACEHOLDER MODELS for Milestone 1 — not production GLB assets.
 */
import * as THREE from 'three';
import type { SimulatedRider } from './types';

export function createRiderGroup(rider: SimulatedRider, isYou = false): THREE.Group {
  const group = new THREE.Group();
  group.name = `rider-${rider.id}`;
  group.userData = { riderId: rider.id, isYou };

  const bodyColor = new THREE.Color(rider.color);
  const accent = new THREE.Color(isYou ? '#22c55e' : '#94a3b8');

  // Motorcycle body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.22, 1.35),
    new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.4, roughness: 0.45 })
  );
  body.position.set(0, 0.45, 0);
  body.castShadow = true;
  group.add(body);

  // Seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.12, 0.55),
    new THREE.MeshStandardMaterial({ color: '#1e293b' })
  );
  seat.position.set(0, 0.62, -0.15);
  seat.castShadow = true;
  group.add(seat);

  // Front fairing
  const fairing = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.35, 0.25),
    new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.5, roughness: 0.4 })
  );
  fairing.position.set(0, 0.55, 0.55);
  fairing.castShadow = true;
  group.add(fairing);

  // Handlebar
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.06, 0.06),
    new THREE.MeshStandardMaterial({ color: '#334155' })
  );
  bar.position.set(0, 0.78, 0.48);
  bar.castShadow = true;
  group.add(bar);

  // Wheels
  const wheelMat = new THREE.MeshStandardMaterial({ color: '#0f172a' });
  const frontWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16), wheelMat);
  frontWheel.rotation.z = Math.PI / 2;
  frontWheel.position.set(0, 0.28, 0.55);
  frontWheel.castShadow = true;
  group.add(frontWheel);

  const rearWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16), wheelMat);
  rearWheel.rotation.z = Math.PI / 2;
  rearWheel.position.set(0, 0.28, -0.55);
  rearWheel.castShadow = true;
  group.add(rearWheel);

  // Rider torso
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.45, 0.28),
    new THREE.MeshStandardMaterial({ color: '#e2e8f0' })
  );
  torso.position.set(0, 0.95, -0.05);
  torso.castShadow = true;
  group.add(torso);

  // Helmet
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshStandardMaterial({ color: accent, metalness: 0.3, roughness: 0.35 })
  );
  helmet.position.set(0, 1.28, -0.02);
  helmet.castShadow = true;
  group.add(helmet);

  // Name plate (dark plane)
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.35),
    new THREE.MeshBasicMaterial({ color: '#0f172a', transparent: true, opacity: 0.8, side: THREE.DoubleSide })
  );
  label.position.set(0, 1.9, 0);
  group.add(label);

  // Status ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 0.72, 32),
    new THREE.MeshBasicMaterial({
      color: isYou ? '#22c55e' : '#64748b',
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  group.add(ring);

  // Initial pose
  group.position.set(rider.position.x, 0, rider.position.z);
  group.rotation.y = -rider.heading;

  return group;
}

/** Smoothly update a rider group toward its simulated state. */
export function updateRiderGroup(
  group: THREE.Group,
  rider: SimulatedRider,
  lerpFactor = 0.14
): void {
  group.position.x = THREE.MathUtils.lerp(group.position.x, rider.position.x, lerpFactor);
  group.position.z = THREE.MathUtils.lerp(group.position.z, rider.position.z, lerpFactor);
  group.position.y = 0;

  const targetY = -rider.heading;
  // Shortest-angle lerp
  let delta = targetY - group.rotation.y;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  group.rotation.y += delta * lerpFactor;
}
