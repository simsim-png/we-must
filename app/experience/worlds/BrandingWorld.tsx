import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BoxGeometry, BufferGeometry, DoubleSide, EdgesGeometry, Float32BufferAttribute, type Group, type InstancedMesh, Line, LineBasicMaterial,
  LineSegments, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Object3D,
} from "three";
import { projectsFor } from "~/content/services";
import { palette } from "~/lib/palette";
import { easeOutCubic, sat, SIGNATURE_ANGLE, WORLD_WALL } from "~/state/layout";
import { useStore } from "~/state/store";
import { LOGO_HEIGHT, monogramOutline, slabGeometry, starGeometry } from "../lib/geometry";
import { drawText, useDrawnTexture, useVisualTextures } from "../lib/textures";
import { Appear, PictureFrame, useReveal, type WorldProps } from "./shared";

// World 01 — an ivory studio. Everything a visual identity is made of floats in the light:
// the zellige wall where one star stands out, type specimens, colour chips, pure solids,
// and the construction drawing of the WE MUST monogram itself.

const dummy = new Object3D();

/** A curved wall of zellige stars, tone on tone. Only the emblem at the centre is cobalt. */
function TileWall() {
  const mesh = useRef<InstancedMesh>(null!);
  const reveal = useReveal();
  const last = useRef(-1);
  const geometry = useMemo(() => starGeometry(0.08, 0.024, 0.006), []);
  const material = useMemo(() => new MeshStandardMaterial({ color: "#d6cfbc", roughness: 0.82 }), []);
  const tiles = useMemo(() => {
    const list: { x: number; y: number; z: number; delay: number }[] = [];
    for (let ix = 0; ix < 6; ix++) {
      for (let iy = -2; iy <= 2; iy++) {
        const theta = -1.42 + ix * 0.205;
        const phi = iy * 0.205 + (ix % 2) * 0.1;
        const r = 0.9;
        list.push({
          x: r * Math.sin(theta) * Math.cos(phi),
          y: r * Math.sin(phi),
          z: -r * Math.cos(theta) * Math.cos(phi),
          delay: ix * 0.07 + Math.abs(iy) * 0.04,
        });
      }
    }
    return list;
  }, []);

  useFrame(() => {
    const r = reveal();
    if (r === last.current) return;
    last.current = r;
    tiles.forEach((t, i) => {
      dummy.position.set(t.x, t.y, t.z);
      dummy.lookAt(0, 0, 0);
      dummy.scale.setScalar(Math.max(0.0001, easeOutCubic(sat((r - t.delay) / 0.4))));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, tiles.length]} frustumCulled={false} />;
}

/** Type specimens set in the brand's display face, with their guide lines. */
function Specimens() {
  const big = useDrawnTexture(640, 480, (ctx, w, h) => drawText(ctx, w, h, { lines: ["Aa"], size: 0.7, color: palette.ink }));
  const strip = useDrawnTexture(1024, 384, (ctx, w, h) =>
    drawText(ctx, w, h, { lines: ["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "0123456789"], size: 0.2, weight: 600, color: palette.ink, leading: 1.35, letterSpacing: 0.04 }),
  );
  const bigMat = useMemo(() => new MeshBasicMaterial({ map: big, transparent: true, depthWrite: false, side: DoubleSide }), [big]);
  const stripMat = useMemo(() => new MeshBasicMaterial({ map: strip, transparent: true, depthWrite: false, side: DoubleSide, opacity: 0.8 }), [strip]);
  const rule = useMemo(() => new MeshBasicMaterial({ color: palette.cobalt, transparent: true, opacity: 0.7, depthWrite: false, side: DoubleSide }), []);

  return (
    <>
      <Appear at={0.12} position={[-0.06, 0.37, -0.66]} rotation={[0.1, 0.12, 0]} from={[0, 0.25, 0]}>
        <mesh material={bigMat} renderOrder={3}>
          <planeGeometry args={[0.44, 0.33]} />
        </mesh>
        {[-0.098, 0.03, 0.105].map((y) => (
          <mesh key={y} position={[0, y, -0.002]} material={rule} renderOrder={2}>
            <planeGeometry args={[0.56, 0.0016]} />
          </mesh>
        ))}
      </Appear>
      <Appear at={0.3} position={[0.02, -0.33, -0.72]} rotation={[-0.1, 0.05, 0]} from={[0, -0.2, 0]}>
        <mesh material={stripMat} renderOrder={3}>
          <planeGeometry args={[0.5, 0.1875]} />
        </mesh>
      </Appear>
    </>
  );
}

/** The palette as physical chips: ink, cobalt, soft cobalt, sand. */
function Chips() {
  const group = useRef<Group>(null!);
  const slab = useMemo(() => slabGeometry(0.1, 0.145, 0.008, 0.008), []);
  const label = useMemo(() => new MeshBasicMaterial({ color: "#fbf9f4" }), []);
  const mats = useMemo(
    () => [palette.ink, palette.cobalt, palette.cobaltSoft, palette.sand].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.55 })),
    [],
  );

  useFrame(({ clock }) => {
    if (useStore.getState().reduced) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((chip, i) => {
      chip.position.y = Math.sin(t * 0.8 + i * 1.3) * 0.012;
      chip.rotation.z = (i - 1.5) * 0.14 + Math.sin(t * 0.5 + i) * 0.03;
    });
  });

  return (
    <Appear at={0.22} position={[-0.47, -0.2, -0.02]} rotation={[0.05, 0.85, 0]} from={[-0.3, -0.1, 0]}>
      <group ref={group}>
        {mats.map((m, i) => (
          <group key={i} position-x={(i - 1.5) * 0.085} position-z={i * 0.012}>
            <mesh geometry={slab} material={m} />
            <mesh position={[0, -0.05, 0.0045]} material={label}>
              <planeGeometry args={[0.1, 0.045]} />
            </mesh>
          </group>
        ))}
      </group>
    </Appear>
  );
}

/** Pure solids: the raw vocabulary of any mark. */
function Solids() {
  const cube = useRef<LineSegments>(null!);
  const sphere = useMemo(() => new MeshPhysicalMaterial({ color: palette.ink, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.22, metalness: 0.3 }), []);
  const cone = useMemo(() => new MeshStandardMaterial({ color: palette.cobalt, roughness: 0.4 }), []);
  const arch = useMemo(() => new MeshStandardMaterial({ color: "#cfc7b3", roughness: 0.75 }), []);
  const wire = useMemo(
    () => new LineSegments(new EdgesGeometry(new BoxGeometry(0.15, 0.15, 0.15)), new LineBasicMaterial({ color: palette.ink, transparent: true, opacity: 0.55 })),
    [],
  );

  useFrame((_, dt) => {
    if (useStore.getState().reduced) return;
    cube.current.rotation.x += dt * 0.2;
    cube.current.rotation.y += dt * 0.27;
  });

  return (
    <>
      <Appear at={0.3} position={[-0.36, 0.34, -0.3]} from={[0, 0.3, 0]}>
        <primitive ref={cube} object={wire} />
      </Appear>
      <Appear at={0.36} position={[0.3, 0.27, -0.2]} from={[0, 0.3, 0]}>
        <mesh material={sphere}>
          <sphereGeometry args={[0.055, 40, 32]} />
        </mesh>
      </Appear>
      <Appear at={0.42} position={[0.2, -0.3, -0.26]} rotation={[0, 0, -SIGNATURE_ANGLE * 0.35]} from={[0, -0.3, 0]}>
        <mesh material={cone}>
          <coneGeometry args={[0.06, 0.15, 48]} />
        </mesh>
      </Appear>
      <Appear at={0.46} position={[-0.2, -0.36, -0.3]} from={[0, -0.3, 0]}>
        <mesh material={arch}>
          <torusGeometry args={[0.085, 0.028, 20, 48, Math.PI]} />
        </mesh>
      </Appear>
    </>
  );
}

/** The monogram as a construction drawing: outline, horizon, and its 38.6° guide. */
function Construction() {
  const lines = useMemo(() => {
    const ink = new LineBasicMaterial({ color: palette.ink, transparent: true, opacity: 0.6 });
    const blue = new LineBasicMaterial({ color: palette.cobalt, transparent: true, opacity: 0.9 });
    const guides = new BufferGeometry();
    const h = LOGO_HEIGHT / 2;
    const run = 1.5;
    guides.setAttribute(
      "position",
      new Float32BufferAttribute(
        [-1.5, 0, 0, 1.5, 0, 0, -0.909, h, 0, -0.909 + run, h - run * Math.tan(SIGNATURE_ANGLE), 0, -0.909, h + 0.25, 0, -0.909, -h - 0.25, 0, 0.909, h + 0.25, 0, 0.909, -h - 0.25, 0],
        3,
      ),
    );
    return [new Line(monogramOutline("M"), ink), new Line(monogramOutline("W"), blue), new LineSegments(guides, blue)];
  }, []);

  return (
    <Appear at={0.18} position={[0.02, 0.02, -0.86]} scale={0.3} from={[0, 0, -0.2]} span={0.6}>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </Appear>
  );
}

export default function BrandingWorld({ id }: WorldProps) {
  const project = projectsFor(id)[0];
  const [texture] = useVisualTextures([project.visual!]);
  const { w, h } = project.visual!;
  const height = 0.42;

  return (
    <>
      <TileWall />
      <Construction />
      <Specimens />
      <Chips />
      <Solids />
      <Appear at={0.34} position={[WORLD_WALL.x, WORLD_WALL.y, WORLD_WALL.z]} rotation={[0, WORLD_WALL.ry, 0]} from={[0.25, 0, -0.1]}>
        <PictureFrame texture={texture} width={(height * w) / h} height={height} />
      </Appear>
    </>
  );
}
