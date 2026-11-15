import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { type PerspectiveCamera, Vector3 } from "three";
import { copyRig, damp, enterCurves, introRig, lerp, makeRig, mixRig, portraitFactor, sampleUniverse, sampleWorld, sat, smooth, WORLD_SCALE } from "~/state/layout";
import { rt, SERVICE_IDS } from "~/state/runtime";
import { useStore } from "~/state/store";

const intro = makeRig();
const universe = makeRig();
const base = makeRig();
const outside = makeRig();
const world = makeRig();
const rig = makeRig();
const look = new Vector3();
const v = new Vector3();

/**
 * The one camera of the film. Every frame it works out where it should be from three inputs:
 * the scroll journey through the universe, the opening move, and the flight into a world.
 * It also tells the DOM where the spheres are on screen so their labels can follow them.
 */
export function CameraController() {
  const { size } = useThree();
  const sway = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const camera = state.camera as PerspectiveCamera;
    const { reduced, touch } = useStore.getState();
    const aspect = size.width / size.height;
    const k = portraitFactor(aspect);

    // Scene 01 → 02: from tight on the monogram back to the whole system.
    introRig(k, intro);
    sampleUniverse(rt.u, aspect, universe);
    mixRig(base, intro, universe, sat(rt.reveal));
    copyRig(rig, base);

    let kick = 0;
    const index = rt.service ? SERVICE_IDS.indexOf(rt.service) : -1;
    if (index >= 0 && rt.enter > 0) {
      const c = rt.spheres[index];
      const e = rt.enter;
      const approach = enterCurves.approach(e);
      const settle = enterCurves.settle(e);

      // First leg: to a point just outside the glass, on the side facing where we came from.
      v.set(base.px - c.x, base.py - c.y, base.pz - c.z).normalize().multiplyScalar(3.3);
      outside.px = c.x + v.x;
      outside.py = c.y + v.y + 0.12;
      outside.pz = c.z + v.z;
      outside.lx = c.x;
      outside.ly = c.y;
      outside.lz = c.z;
      outside.fov = 40;
      outside.ox = 0;
      outside.oy = 0;

      // Second leg: the sphere grows past the camera, which settles on the world's first beat.
      sampleWorld(rt.w, c, k, world);
      mixRig(rig, base, outside, approach);
      mixRig(rig, rig, world, settle);

      // The eye finds the sphere early, before the body gets there.
      const found = smooth(sat(e / 0.3));
      rig.lx = lerp(lerp(base.lx, c.x, found), world.lx, settle);
      rig.ly = lerp(lerp(base.ly, c.y, found), world.ly, settle);
      rig.lz = lerp(lerp(base.lz, c.z, found), world.lz, settle);

      // The lens opens up while the world rushes past, then closes again.
      kick = reduced ? 0 : Math.sin(sat((e - 0.42) / 0.46) * Math.PI) * 13;
    }

    // The frame drifts a little with the pointer, less once inside a world.
    const inside = enterCurves.expand(rt.enter);
    const amount = reduced || touch ? 0 : lerp(lerp(0.1, 0.6, sat(rt.reveal)), 0.14, inside);
    sway.current.x = damp(sway.current.x, rt.pointer.x * amount, 2.4, dt);
    sway.current.y = damp(sway.current.y, rt.pointer.y * amount * 0.55, 2.4, dt);

    camera.position.set(rig.px, rig.py, rig.pz);
    look.set(rig.lx, rig.ly, rig.lz);
    camera.lookAt(look);
    camera.translateX(sway.current.x);
    camera.translateY(sway.current.y);
    camera.lookAt(look);
    camera.fov = rig.fov + kick;
    // Slides the picture inside the frame so the subject sits beside the text.
    camera.setViewOffset(size.width, size.height, -rig.ox * size.width, rig.oy * size.height, size.width, size.height);
    camera.updateMatrixWorld();

    // Screen positions of the spheres, for the DOM labels.
    v.set(0, 0, 0).project(camera);
    const coreY = (-v.y * 0.5 + 0.5) * size.height;
    for (let i = 0; i < 4; i++) {
      const p = rt.spheres[i];
      const label = rt.labels[i];
      v.set(p.x, p.y, p.z).project(camera);
      label.visible = v.z > -1 && v.z < 1;
      label.x = (v.x * 0.5 + 0.5) * size.width;
      label.y = (-v.y * 0.5 + 0.5) * size.height;
      const scale = i === index ? lerp(1, WORLD_SCALE, inside) : 1;
      v.setFromMatrixColumn(camera.matrixWorld, 1).multiplyScalar(scale).add(p as Vector3).project(camera);
      label.r = Math.abs((-v.y * 0.5 + 0.5) * size.height - label.y);
      // A little hysteresis so a label does not flicker as its sphere crosses the horizon.
      label.up = label.up ? label.y < coreY + 12 : label.y < coreY - 12;
    }
  }, -1);

  return null;
}
