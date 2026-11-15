import { BufferGeometry, ExtrudeGeometry, Float32BufferAttribute, Shape } from "three";

// Geometry built from the brand itself: the official monogram (traced from the 1080px logo
// file, proportions untouched), the eight-point zellige star of "Sortez du lot.", and the
// rounded frames of social formats.

/** Logo outline in source pixels (viewBox 428 × 518, y down). */
const M_POINTS: [number, number][] = [[0, 0], [214, 171], [428, 0], [428, 250], [375, 250], [375, 112], [214, 239], [53, 112], [53, 250], [0, 250]];
const W_POINTS: [number, number][] = [[0, 267], [53, 267], [53, 406], [214, 279], [375, 406], [375, 267], [428, 267], [428, 518], [214, 347], [0, 518]];

/** Height of the monogram in scene units. */
export const LOGO_HEIGHT = 2.2;
const UNIT = LOGO_HEIGHT / 518;
/** The gap between M and W (the "horizon") sits at y = 0. */
const toScene = ([x, y]: [number, number]): [number, number] => [(x - 214) * UNIT, -(y - 258.5) * UNIT];

function shapeFrom(points: [number, number][]) {
  const s = new Shape();
  points.map(toScene).forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

export function monogramGeometry(letter: "M" | "W", depth = 0.26) {
  const g = new ExtrudeGeometry(shapeFrom(letter === "M" ? M_POINTS : W_POINTS), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.016,
    bevelSegments: 2,
    curveSegments: 1,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** Closed outline of a letter as a line, for construction drawings. */
export function monogramOutline(letter: "M" | "W") {
  const pts = (letter === "M" ? M_POINTS : W_POINTS).map(toScene);
  const flat: number[] = [];
  [...pts, pts[0]].forEach(([x, y]) => flat.push(x, y, 0));
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(flat, 3));
  return g;
}

/** Eight-point star: two squares at 45°, the basic tile of Moroccan zellige. */
export function starShape(radius = 1) {
  const inner = radius * 0.7654;
  const s = new Shape();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.PI / 8;
    const r = i % 2 === 0 ? radius : inner;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i) s.lineTo(x, y);
    else s.moveTo(x, y);
  }
  s.closePath();
  return s;
}

export function starGeometry(radius = 1, depth = 0.12, bevel = 0.02) {
  const g = new ExtrudeGeometry(starShape(radius), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 1,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function roundedRectShape(w: number, h: number, r: number) {
  const x = -w / 2;
  const y = -h / 2;
  const s = new Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function slabGeometry(w: number, h: number, r: number, depth: number) {
  const g = new ExtrudeGeometry(roundedRectShape(w, h, r), { depth, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** A circle as a line, in the XZ plane or transformed point by point. */
export function circlePoints(count: number, at: (angle: number, out: { x: number; y: number; z: number }) => void) {
  const g = new BufferGeometry();
  const arr = new Float32Array((count + 1) * 3);
  const p = { x: 0, y: 0, z: 0 };
  for (let i = 0; i <= count; i++) {
    at((i / count) * Math.PI * 2, p);
    arr[i * 3] = p.x;
    arr[i * 3 + 1] = p.y;
    arr[i * 3 + 2] = p.z;
  }
  g.setAttribute("position", new Float32BufferAttribute(arr, 3));
  return g;
}
