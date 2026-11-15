import type { ServiceId } from "~/content/work";

// Values that change every frame live here, outside React, so the WebGL scene and the DOM can
// both read them without re-rendering anything. GSAP writes them, useFrame reads them.

export const SERVICE_IDS: ServiceId[] = ["branding", "shooting", "social", "web"];

export const rt = {
  /** Scroll progress through the universe journey, 0 → 1 (smoothed by ScrollTrigger). */
  u: 0,
  /** Scroll progress inside the current world, 0 → 1. */
  w: 0,
  /** Scene 01: 0 = dark, 1 = monogram assembled and lit. */
  emerge: 0,
  /** 0 = intro framing, 1 = universe revealed with the spheres on their orbits. */
  reveal: 0,
  /** 0 = in the universe, 1 = inside a world. */
  enter: 0,
  /** Portal flash while the camera crosses a sphere's surface. */
  flash: 0,
  /** The world the 3D scene is showing or travelling to. */
  service: null as ServiceId | null,
  /** Orbital phase in radians, and a speed multiplier (0 while a world is docked). */
  phase: 0.55,
  orbitSpeed: 1,
  /** Pointer position, -1 → 1 on both axes. */
  pointer: { x: 0, y: 0 },
  /** Sphere centres in world space, written by the orbital system. */
  spheres: SERVICE_IDS.map(() => ({ x: 0, y: 0, z: 0 })),
  /**
   * Sphere centres projected to screen pixels (plus on-screen radius), for the DOM labels.
   * `up` is set for spheres passing behind the core: their label sits above them instead.
   */
  labels: SERVICE_IDS.map(() => ({ x: 0, y: 0, r: 0, visible: false, up: false })),
};

export type Runtime = typeof rt;
