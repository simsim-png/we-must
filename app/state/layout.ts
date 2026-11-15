// Spatial maths for the universe: orbits, the gallery arc and every camera position.
// Pure numbers on purpose (no three.js import) so the DOM side can use it without pulling
// the 3D bundle, and so the whole camera path can be read and tuned in one file.

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export const sat = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
/** Frame-rate independent approach of `a` toward `b`. */
export const damp = (a: number, b: number, lambda: number, dt: number) => lerp(a, b, 1 - Math.exp(-lambda * dt));

/** 0 on landscape screens, 1 on phone-portrait screens, blended in between. */
export const portraitFactor = (aspect: number) => sat((1.2 - aspect) / (1.2 - 0.7));

export type XYZ = { x: number; y: number; z: number };

/* ------------------------------------------------------------------ orbits */

/** The logo's chevrons fall at 38.6°. Rings and cuts reuse that angle instead of a generic 45°. */
export const SIGNATURE_ANGLE = 38.6 * DEG;

export const ORBIT_RADII = [4.6, 4.95, 5.3, 5.65];
/** How much a sphere grows when it becomes the environment. */
export const WORLD_SCALE = 3;
/** Orbit angle a selected sphere is brought to before the camera flies in (front, slightly right). */
export const DOCK_ANGLE = Math.PI / 2 - 0.5;
/** Radians per second of the idle orbit: one revolution in about 100 seconds. */
export const ORBIT_SPEED = TAU / 100;

/**
 * Point on an orbit. Angle 0 is +X, π/2 is toward the opening camera.
 * Landscape: a wide ellipse tipped toward the viewer. Portrait: the same orbit stood upright
 * so the four worlds stack around the core instead of leaving the screen sideways.
 */
export function orbitPoint(out: XYZ, radius: number, angle: number, k: number): XYZ {
  const tilt = lerp(0.3, 0.66, k);
  const roll = lerp(0, Math.PI / 2, k);
  const r = radius * lerp(1, 0.78, k);
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  const y1 = -z * Math.sin(tilt);
  const z1 = z * Math.cos(tilt);
  out.x = x * Math.cos(roll) - y1 * Math.sin(roll);
  out.y = x * Math.sin(roll) + y1 * Math.cos(roll);
  out.z = z1;
  return out;
}

export const sphereAngle = (index: number, phase: number) => phase + index * (Math.PI / 2);

/** Shortest signed angular distance from a to b. */
export const angleDelta = (a: number, b: number) => ((((b - a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

/** Orbital phase that puts sphere `index` on the docking angle, reached the short way round. */
export const dockPhase = (index: number, phase: number) => phase + angleDelta(sphereAngle(index, phase), DOCK_ANGLE);

/** Where each sphere waits behind the core while the camera is close on the monogram (about scene). */
export const gatherAngle = (index: number) => -Math.PI / 2 + 0.62 + (index - 1.5) * 0.42;

/** Where each sphere sits when the four worlds line up in front of the core (contact scene). */
export const alignAngle = (index: number) => Math.PI / 2 - (index - 1.5) * 0.62;

/* ----------------------------------------------------------------- gallery */

export const WORK_COUNT = 6;
const GALLERY_RADIUS = 13;
const GALLERY_START = -50 * DEG;
const GALLERY_STEP = 20 * DEG;

export type FramePose = { x: number; y: number; z: number; ry: number };

/** Frames stand on an arc outside the orbits, facing outward. */
export function galleryFrame(i: number): FramePose {
  const a = GALLERY_START + i * GALLERY_STEP;
  return { x: GALLERY_RADIUS * Math.sin(a), y: 0.55, z: GALLERY_RADIUS * Math.cos(a), ry: a };
}

/* ------------------------------------------------------------- camera rigs */

/**
 * A camera pose. `ox` / `oy` slide the picture inside the frame (fractions of the screen,
 * +x right, +y up) so the subject can sit beside the text without changing the perspective.
 */
export type Rig = { px: number; py: number; pz: number; lx: number; ly: number; lz: number; fov: number; ox: number; oy: number };

export const makeRig = (): Rig => ({ px: 0, py: 0, pz: 10, lx: 0, ly: 0, lz: 0, fov: 40, ox: 0, oy: 0 });

function set(o: Rig, px: number, py: number, pz: number, lx: number, ly: number, lz: number, fov: number, ox: number, oy: number) {
  o.px = px; o.py = py; o.pz = pz; o.lx = lx; o.ly = ly; o.lz = lz; o.fov = fov; o.ox = ox; o.oy = oy;
  return o;
}

export function copyRig(o: Rig, a: Rig) {
  return set(o, a.px, a.py, a.pz, a.lx, a.ly, a.lz, a.fov, a.ox, a.oy);
}

export function mixRig(o: Rig, a: Rig, b: Rig, t: number) {
  return set(
    o,
    lerp(a.px, b.px, t), lerp(a.py, b.py, t), lerp(a.pz, b.pz, t),
    lerp(a.lx, b.lx, t), lerp(a.ly, b.ly, t), lerp(a.lz, b.lz, t),
    lerp(a.fov, b.fov, t), lerp(a.ox, b.ox, t), lerp(a.oy, b.oy, t),
  );
}

/** Scene 01: tight on the monogram while it assembles. */
export function introRig(k: number, o: Rig) {
  return set(o, 0, 0.1, lerp(12, 12.6, k), 0, 0, 0, lerp(30, 36, k), 0, 0.2);
}

/** Stations of the scroll journey: universe, one stop per project, about, contact. */
export const STATION_COUNT = 1 + WORK_COUNT + 2;
export const STATION = { universe: 0, work: 1, about: 1 + WORK_COUNT, contact: 2 + WORK_COUNT } as const;

export function universeStation(i: number, aspect: number, o: Rig): Rig {
  const k = portraitFactor(aspect);
  if (i <= 0) {
    // Scene 02: the whole system, seen from above the orbital plane so the worlds passing in
    // front never cover the monogram. Narrower screens step back to keep all four in frame.
    const fit = Math.min(1.22, Math.max(1, 1.5 / aspect));
    return set(o, 0, lerp(2.9, 0.6, k), lerp(15.4 * fit, 20.5, k), 0, lerp(-0.7, 0.3, k), 0, lerp(38, 46, k), lerp(0.04, 0, k), lerp(0.06, 0.02, k));
  }
  if (i <= WORK_COUNT) {
    // Scene 04: outside the arc, looking back at one frame with the universe behind it.
    const f = galleryFrame(i - 1);
    const a = f.ry + lerp(11 * DEG, 0, k);
    const rho = GALLERY_RADIUS + lerp(8.2, 10.6, k);
    return set(o, rho * Math.sin(a), f.y + 0.35, rho * Math.cos(a), f.x, f.y, f.z, lerp(38, 50, k), lerp(0.2, 0, k), lerp(0, 0.17, k));
  }
  if (i === STATION.about) {
    // Scene 05: close on the monogram.
    return set(o, lerp(-2.4, 0, k), 0.45, lerp(6.6, 10.4, k), 0, 0.02, 0, lerp(34, 42, k), lerp(0.22, 0, k), lerp(0, 0.21, k));
  }
  // Scene 06: pulled back and low, the four worlds lined up in front of the core.
  return set(o, 0, lerp(-0.9, 0, k), lerp(25, 26, k), 0, lerp(0.6, 0, k), 0, lerp(36, 48, k), 0, lerp(-0.03, -0.07, k));
}

const stations: Rig[] = Array.from({ length: STATION_COUNT }, makeRig);
let stationsAspect = -1;

function ensureStations(aspect: number) {
  if (Math.abs(aspect - stationsAspect) < 0.0005) return;
  stationsAspect = aspect;
  for (let i = 0; i < STATION_COUNT; i++) universeStation(i, aspect, stations[i]);
}

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};

/**
 * Camera for scroll progress u (0 → 1). Positions follow a spline through the stations; the
 * motion eases in and out of each one so every scene holds for a beat before the next move.
 */
export function sampleUniverse(u: number, aspect: number, o: Rig): Rig {
  ensureStations(aspect);
  const n = STATION_COUNT - 1;
  const x = sat(u) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const raw = x - i;
  const t = lerp(raw, easeInOutCubic(raw), 0.75);
  const a = stations[Math.max(0, i - 1)];
  const b = stations[i];
  const c = stations[i + 1];
  const d = stations[Math.min(n, i + 2)];
  o.px = catmull(a.px, b.px, c.px, d.px, t);
  o.py = catmull(a.py, b.py, c.py, d.py, t);
  o.pz = catmull(a.pz, b.pz, c.pz, d.pz, t);
  o.lx = lerp(b.lx, c.lx, t);
  o.ly = lerp(b.ly, c.ly, t);
  o.lz = lerp(b.lz, c.lz, t);
  o.fov = lerp(b.fov, c.fov, t);
  o.ox = lerp(b.ox, c.ox, t);
  o.oy = lerp(b.oy, c.oy, t);
  return o;
}

/* ------------------------------------------------------------ world rigs */

/**
 * Camera beats inside a world, in sphere-local units (the sphere's radius is 1):
 * title, capabilities, work wall, call to action.
 */
export const WORLD_BEATS = [
  { p: [0.0, 0.03, 0.86], l: [0.0, 0.0, 0.0], fov: 50 },
  { p: [-0.44, 0.1, 0.6], l: [0.04, 0.0, -0.05], fov: 46 },
  { p: [0.34, 0.02, 0.12], l: [0.56, 0.0, -0.5], fov: 50 },
  { p: [0.0, 0.2, 0.9], l: [0.0, -0.02, 0.0], fov: 58 },
] as const;
export const BEAT_COUNT = WORLD_BEATS.length;

/** Where the related project frame hangs inside every world (sphere-local). */
export const WORLD_WALL = { x: 0.56, y: 0.0, z: -0.5, ry: -0.34 } as const;

export function sampleWorld(w: number, c: XYZ, k: number, o: Rig): Rig {
  const n = BEAT_COUNT - 1;
  const x = sat(w) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const t = easeInOutCubic(x - i);
  const a = WORLD_BEATS[i];
  const b = WORLD_BEATS[i + 1];
  const s = WORLD_SCALE;
  o.px = c.x + s * lerp(a.p[0], b.p[0], t);
  o.py = c.y + s * lerp(a.p[1], b.p[1], t);
  o.pz = c.z + s * lerp(a.p[2], b.p[2], t);
  o.lx = c.x + s * lerp(a.l[0], b.l[0], t);
  o.ly = c.y + s * lerp(a.l[1], b.l[1], t);
  o.lz = c.z + s * lerp(a.l[2], b.l[2], t);
  // Portrait screens are narrow: widen the lens and lift the subject above the text.
  o.fov = lerp(a.fov, b.fov, t) + 16 * k;
  o.ox = lerp(0.2, 0, k);
  o.oy = lerp(0, 0.18, k);
  return o;
}

/* --------------------------------------------------------- entering a world */

/** Sub-curves of the single 0 → 1 "enter" value that drives the whole transition. */
export const enterCurves = {
  /** Camera flies from the universe to a point just outside the sphere. */
  approach: (e: number) => easeInOutCubic(sat(e / 0.6)),
  /** Camera settles inside while the sphere grows around it. */
  settle: (e: number) => easeInOutCubic(sat((e - 0.5) / 0.5)),
  /** The sphere expands into the environment. */
  expand: (e: number) => easeInOutCubic(sat((e - 0.48) / 0.42)),
  /** The world's own elements animate in. */
  reveal: (e: number) => sat((e - 0.62) / 0.38),
};
