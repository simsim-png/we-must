import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CircleGeometry, DoubleSide, type Group, type Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Shape, ShapeGeometry } from "three";
import type { ServiceId } from "~/content/work";
import { palette } from "~/lib/palette";
import { TAU } from "~/state/layout";
import { useStore } from "~/state/store";
import { slabGeometry, starGeometry } from "../lib/geometry";
import { glassMaterial } from "../lib/shaders";
import { drawUi, useDrawnTexture } from "../lib/textures";

// The object at the heart of each sphere. It is what you see through the glass from the
// universe, and it stays as the centrepiece once you are inside. Each one fits in a radius
// of about 0.24 (the sphere's radius is 1).

const time = (clock: { elapsedTime: number }) => (useStore.getState().reduced ? 0 : clock.elapsedTime);

/** Branding: a patch of grey zellige with one cobalt star lifted out of it ("Sortez du lot."). */
function BrandingEmblem() {
  const hero = useRef<Mesh>(null!);
  const patch = useRef<Group>(null!);
  const star = useMemo(() => starGeometry(0.082, 0.05, 0.008), []);
  const tile = useMemo(() => starGeometry(0.066, 0.02, 0.004), []);
  const cobalt = useMemo(
    () => new MeshStandardMaterial({ color: palette.cobalt, emissive: palette.cobalt, emissiveIntensity: 1.15, roughness: 0.3, metalness: 0.1 }),
    [],
  );
  const stone = useMemo(() => new MeshStandardMaterial({ color: "#4a4d5b", roughness: 0.62, metalness: 0.15 }), []);
  const cells = useMemo(() => {
    const list: [number, number][] = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) if (x || y) list.push([x * 0.142, y * 0.142]);
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = time(clock);
    hero.current.rotation.z = Math.sin(t * 0.5) * 0.35;
    hero.current.position.z = 0.07 + Math.sin(t * 0.9) * 0.014;
    patch.current.rotation.y = 0.3 + Math.sin(t * 0.3) * 0.12;
  });

  return (
    <group ref={patch} rotation={[-0.16, 0.3, 0.06]}>
      <mesh ref={hero} geometry={star} material={cobalt} />
      {cells.map(([x, y], i) => (
        <mesh key={i} geometry={tile} material={stone} position={[x, y, 0]} />
      ))}
    </group>
  );
}

/** Shooting: a lens. The iris breathes, the front element catches a cobalt and an amber light. */
function LensEmblem() {
  const lens = useRef<Group>(null!);
  const pupil = useRef<Mesh>(null!);
  const metal = useMemo(() => new MeshStandardMaterial({ color: "#0b0c10", metalness: 0.85, roughness: 0.38, side: DoubleSide }), []);
  const chrome = useMemo(() => new MeshStandardMaterial({ color: "#cfc9bd", metalness: 1, roughness: 0.18 }), []);
  const blades = useMemo(() => new MeshStandardMaterial({ color: "#050506", metalness: 0.6, roughness: 0.5 }), []);
  const deep = useMemo(() => new MeshPhysicalMaterial({ color: "#0a1240", metalness: 0.9, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.22 }), []);
  const glass = useMemo(() => glassMaterial({ tint: "#1a2a9c", rim: palette.amber, base: 0.12 }), []);
  const ember = useMemo(() => new MeshBasicMaterial({ color: palette.amber }), []);
  const heptagon = useMemo(() => new CircleGeometry(1, 7), []);

  useFrame(({ clock }) => {
    const t = time(clock);
    lens.current.rotation.y = -0.38 + Math.sin(t * 0.35) * 0.16;
    lens.current.rotation.x = 0.1 + Math.sin(t * 0.27) * 0.05;
    const open = 0.042 + (Math.sin(t * 0.8) * 0.5 + 0.5) * 0.034;
    pupil.current.scale.setScalar(open);
  });

  return (
    <group ref={lens}>
      <mesh rotation-x={Math.PI / 2} material={metal}>
        <cylinderGeometry args={[0.15, 0.162, 0.22, 56, 1, true]} />
      </mesh>
      <mesh position-z={0.11} material={chrome}>
        <torusGeometry args={[0.15, 0.008, 10, 72]} />
      </mesh>
      <mesh position-z={0.03} material={chrome}>
        <torusGeometry args={[0.158, 0.0045, 8, 72]} />
      </mesh>
      <mesh position-z={-0.045} material={metal}>
        <torusGeometry args={[0.163, 0.012, 8, 72]} />
      </mesh>
      <mesh position-z={-0.11} material={chrome}>
        <torusGeometry args={[0.162, 0.006, 8, 72]} />
      </mesh>
      {/* inner bezel, iris and the glass behind it */}
      <mesh position-z={0.085} material={blades}>
        <ringGeometry args={[0.096, 0.15, 56]} />
      </mesh>
      <mesh position-z={0.03} geometry={heptagon} material={blades} scale={0.1} />
      <mesh ref={pupil} position-z={0.032} geometry={heptagon} material={deep} />
      <mesh position-z={0.034} material={ember} scale={0.006}>
        <circleGeometry args={[1, 16]} />
      </mesh>
      <mesh position-z={-0.062} rotation-x={Math.PI / 2} material={glass} renderOrder={2}>
        <sphereGeometry args={[0.2, 48, 20, 0, TAU, 0, 0.62]} />
      </mesh>
    </group>
  );
}

/** Social: three formats (reel, post, square) fanned out, and a reply being typed. */
function FramesEmblem() {
  const a = useRef<Group>(null!);
  const b = useRef<Group>(null!);
  const c = useRef<Group>(null!);
  const dots = useRef<Group>(null!);
  const reel = useMemo(() => slabGeometry(0.15, 0.266, 0.02, 0.012), []);
  const post = useMemo(() => slabGeometry(0.2, 0.25, 0.02, 0.012), []);
  const square = useMemo(() => slabGeometry(0.17, 0.17, 0.02, 0.012), []);
  const pill = useMemo(() => slabGeometry(0.115, 0.052, 0.026, 0.012), []);
  const bar = useMemo(() => slabGeometry(1, 1, 0.3, 0.002), []);
  const play = useMemo(() => {
    const s = new Shape();
    s.moveTo(-0.022, -0.03);
    s.lineTo(0.03, 0);
    s.lineTo(-0.022, 0.03);
    s.closePath();
    return new ShapeGeometry(s);
  }, []);
  const ivory = useMemo(() => new MeshStandardMaterial({ color: palette.ivory, roughness: 0.5 }), []);
  const ink = useMemo(() => new MeshStandardMaterial({ color: palette.ink, roughness: 0.4, metalness: 0.2 }), []);
  const flatInk = useMemo(() => new MeshBasicMaterial({ color: palette.ink }), []);
  const flatIvory = useMemo(() => new MeshBasicMaterial({ color: palette.ivory }), []);
  const flatCobalt = useMemo(() => new MeshBasicMaterial({ color: palette.cobalt }), []);

  useFrame(({ clock }) => {
    const t = time(clock);
    a.current.position.y = 0.01 + Math.sin(t * 1.1) * 0.012;
    b.current.position.y = Math.sin(t * 0.9 + 1.4) * 0.014;
    c.current.position.y = -0.055 + Math.sin(t * 1.3 + 2.6) * 0.012;
    c.current.rotation.z = -0.1 + Math.sin(t * 0.7) * 0.04;
    dots.current.children.forEach((d, i) => d.scale.setScalar(0.8 + Math.max(0, Math.sin(t * 4 - i * 0.9)) * 0.7));
  });

  return (
    <group rotation={[0.04, -0.3, 0]}>
      <group ref={a} position={[-0.135, 0.01, -0.06]} rotation={[0, 0.32, 0.12]}>
        <mesh geometry={reel} material={ink} />
        <mesh geometry={play} material={flatIvory} position-z={0.008} />
      </group>
      <group ref={b}>
        <mesh geometry={post} material={ivory} />
        <mesh position={[0, 0.03, 0.008]} material={flatCobalt}>
          <planeGeometry args={[0.16, 0.14]} />
        </mesh>
        <mesh geometry={bar} material={flatInk} position={[-0.03, -0.068, 0.008]} scale={[0.1, 0.014, 1]} />
        <mesh geometry={bar} material={flatInk} position={[-0.05, -0.094, 0.008]} scale={[0.06, 0.01, 1]} />
      </group>
      <group ref={c} position={[0.135, -0.055, 0.06]} rotation={[0, -0.25, -0.1]}>
        <mesh geometry={square} material={ivory} />
        <mesh position-z={0.008} material={flatInk}>
          <ringGeometry args={[0.036, 0.05, 40]} />
        </mesh>
        <mesh position-z={0.008} material={flatCobalt}>
          <circleGeometry args={[0.02, 24]} />
        </mesh>
      </group>
      <group position={[0.125, 0.155, 0.08]}>
        <mesh geometry={pill} material={ink} />
        <group ref={dots} position-z={0.008}>
          {[-0.03, 0, 0.03].map((x) => (
            <mesh key={x} position-x={x} material={flatIvory}>
              <circleGeometry args={[0.008, 16]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/** Web & Apps: one screen pulled apart into its layers (frame, grid, content). */
function PanelsEmblem() {
  const layers = useRef<Group>(null!);
  const cursor = useRef<Mesh>(null!);
  const frame = useDrawnTexture(640, 400, drawUi("layer", 0));
  const grid = useDrawnTexture(640, 400, drawUi("layer", 1));
  const content = useDrawnTexture(640, 400, drawUi("layer", 2));
  const mats = useMemo(
    () => [grid, frame, content].map((map) => new MeshBasicMaterial({ map, transparent: true, depthWrite: false, side: DoubleSide })),
    [grid, frame, content],
  );
  const arrow = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 0);
    s.lineTo(0.034, -0.03);
    s.lineTo(0.014, -0.031);
    s.lineTo(0.006, -0.047);
    s.lineTo(0, 0);
    return new ShapeGeometry(s);
  }, []);
  const ivory = useMemo(() => new MeshBasicMaterial({ color: palette.ivory, side: DoubleSide }), []);

  useFrame(({ clock }) => {
    const t = time(clock);
    const spread = 0.085 + Math.sin(t * 0.7) * 0.03;
    layers.current.children.forEach((l, i) => {
      l.position.z = (i - 1) * spread;
      l.position.x = (i - 1) * spread * 0.32;
      l.position.y = (i - 1) * spread * 0.2;
    });
    layers.current.rotation.y = -0.5 + Math.sin(t * 0.3) * 0.12;
    cursor.current.position.set(0.05 + Math.sin(t * 0.8) * 0.07, -0.02 + Math.cos(t * 0.6) * 0.05, 0.16);
  });

  return (
    <group rotation={[-0.14, 0, 0.03]}>
      <group ref={layers}>
        {mats.map((m, i) => (
          <mesh key={i} material={m} renderOrder={2 + i}>
            <planeGeometry args={[0.37, 0.231]} />
          </mesh>
        ))}
      </group>
      <mesh ref={cursor} geometry={arrow} material={ivory} renderOrder={6} />
    </group>
  );
}

export function Emblem({ id }: { id: ServiceId }) {
  if (id === "branding") return <BrandingEmblem />;
  if (id === "shooting") return <LensEmblem />;
  if (id === "social") return <FramesEmblem />;
  return <PanelsEmblem />;
}
