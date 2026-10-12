# Replacing placeholder bikes with real GLB models

## What is ready

- Procedural motorcycle (tank, wheels, lean, spin, lights, status ring)
- Scene positioning via lat/lng → ENU
- Status colors (LIVE / STALE / OFFLINE)

## What you add

1. Download a royalty-free **motorcycle GLB** (e.g. Sketchfab, CC license).
2. Put it at: `apps/mobile/assets/models/bike.glb`
3. Optionally add `rider.glb` for a separate character.

## Loader sketch (Three.js)

```ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load(require('../../assets/models/bike.glb'), (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1); // tune
  group.add(model);
});
```

Keep procedural `createRiderGroup` as fallback if the file is missing.

## Tips

- Prefer low-poly (<50k tris) for mobile.
- Bake materials; avoid huge textures.
- Forward axis should match heading (north = +Z in our ENU scene).
