import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending, BufferGeometry, Color, DoubleSide, Float32BufferAttribute, type InstancedMesh, LineBasicMaterial, LineSegments, type Mesh,
  MeshBasicMaterial, Object3D,
} from "three";
import { projectsFor } from "~/content/services";
import { palette } from "~/lib/palette";
import { easeOutCubic, sat, WORLD_WALL } from "~/state/layout";
import { useStore } from "~/state/store";
import { gridFloorMaterial } from "../lib/shaders";
import { drawUi, type UiKind, useDrawnTexture, useVisualTextures } from "../lib/textures";
import { Appear, PictureFrame, useReveal, type WorldProps } from "./shared";

// World 04 — the build room. A midnight space on a drafting grid: interfaces hang as panes
// of light, a system of connected services passes messages overhead, and the loading bar
// that sticks at 12 % on the "Votre site rame." poster runs straight to the end here.

const dummy = new Object3D();

/** An interface drawn in light on a pane of dark glass. */
function Pane({ kind, width, height, pixels }: { kind: UiKind; width: number; height: number; pixels: [number, number] }) {
  const texture = useDrawnTexture(pixels[0], pixels[1], drawUi(kind));
  const material = useMemo(() => new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: DoubleSide }), [texture]);
  const ref = useRef<Mesh>(null!);
  const phase = useMemo(() => width * 37, [width]);

  useFrame(({ clock }) => {
    if (useStore.getState().reduced) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.55 + phase) * 0.012;
  });

  return (
    <mesh ref={ref} material={material} renderOrder={3}>
      <planeGeometry args={[width, height]} />
    </mesh>
  );
}

/** Stuck at 12 % on the poster. Here it finishes, every time. */
function LoadingBar() {
  const fill = useRef<Mesh>(null!);
  const track = useMemo(() => new MeshBasicMaterial({ color: palette.ivory, transparent: true, opacity: 0.18, depthWrite: false }), []);
  const bar = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.cobaltSoft).multiplyScalar(1.7), transparent: true, depthWrite: false }), []);
  const width = 0.42;

  useFrame(({ clock }) => {
    // Hold at 12 %, race to 100 %, hold, start again.
    const life = useStore.getState().reduced ? 1 : (clock.elapsedTime * 0.22) % 1;
    const p = life < 0.25 ? 0.12 : life < 0.6 ? 0.12 + 0.88 * easeOutCubic((life - 0.25) / 0.35) : 1;
    fill.current.scale.x = Math.max(0.0001, p);
    fill.current.position.x = -width / 2 + (width * p) / 2;
  });

  return (
    <Appear at={0.45} position={[0, -0.27, 0.06]} rotation={[-0.2, 0, 0]} from={[0, -0.15, 0]}>
      <mesh material={track} renderOrder={3}>
        <planeGeometry args={[width, 0.012]} />
      </mesh>
      <mesh ref={fill} material={bar} position-z={0.001} renderOrder={4}>
        <planeGeometry args={[width, 0.012]} />
      </mesh>
    </Appear>
  );
}

/** Services, the connections between them, and the requests travelling along. */
function Architecture() {
  const pulses = useRef<InstancedMesh>(null!);
  const nodes: [number, number, number][] = [
    [0, 0, 0], [-0.2, 0.09, 0.04], [0.19, 0.1, -0.03], [-0.11, -0.12, 0.06], [0.14, -0.11, 0.05], [-0.33, -0.02, -0.02], [0.34, -0.01, 0.02], [0.02, 0.2, 0],
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6], [1, 7], [2, 7], [3, 5], [4, 6]];
  const lines = useMemo(() => {
    const pts: number[] = [];
    edges.forEach(([a, b]) => pts.push(...nodes[a], ...nodes[b]));
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return new LineSegments(g, new LineBasicMaterial({ color: palette.cobaltSoft, transparent: true, opacity: 0.55 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const node = useMemo(() => new MeshBasicMaterial({ color: palette.ivory, wireframe: true }), []);
  const core = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.cobaltSoft).multiplyScalar(1.6) }), []);
  const spark = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.ivory).multiplyScalar(1.8), blending: AdditiveBlending, depthWrite: false, transparent: true }), []);

  useFrame(({ clock }) => {
    const t = useStore.getState().reduced ? 0.3 : clock.elapsedTime;
    edges.forEach(([a, b], i) => {
      const s = (t * (0.35 + (i % 3) * 0.12) + i * 0.37) % 1;
      const from = i % 2 ? nodes[b] : nodes[a];
      const to = i % 2 ? nodes[a] : nodes[b];
      dummy.position.set(from[0] + (to[0] - from[0]) * s, from[1] + (to[1] - from[1]) * s, from[2] + (to[2] - from[2]) * s);
      dummy.scale.setScalar(0.007 * Math.sin(Math.PI * s) + 0.0001);
      dummy.updateMatrix();
      pulses.current.setMatrixAt(i, dummy.matrix);
    });
    pulses.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <Appear at={0.35} position={[0.06, 0.4, -0.5]} rotation={[0.2, -0.1, 0]} from={[0, 0.25, 0]} span={0.6}>
      <primitive object={lines} />
      {nodes.map((p, i) => (
        <mesh key={i} position={p} material={i === 0 ? core : node}>
          <icosahedronGeometry args={[i === 0 ? 0.03 : 0.02, i === 0 ? 1 : 0]} />
        </mesh>
      ))}
      <instancedMesh ref={pulses} args={[undefined, spark, edges.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
      </instancedMesh>
    </Appear>
  );
}

function Floor() {
  const material = useMemo(() => gridFloorMaterial(palette.cobaltSoft), []);
  const reveal = useReveal();
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = useStore.getState().reduced ? 0 : clock.elapsedTime;
    material.uniforms.uOpacity.value = sat(reveal() / 0.6);
  });
  return (
    <mesh material={material} position-y={-0.44} rotation-x={-Math.PI / 2} renderOrder={1}>
      <circleGeometry args={[0.9, 64]} />
    </mesh>
  );
}

export default function WebWorld({ id }: WorldProps) {
  const project = projectsFor(id)[0];
  const [texture] = useVisualTextures([project.visual!]);
  const height = 0.42;

  return (
    <>
      <Floor />
      <Architecture />
      <LoadingBar />
      <Appear at={0.1} position={[-0.47, 0.1, -0.46]} rotation={[0, 0.72, 0]} from={[-0.3, 0, 0]}>
        <Pane kind="site" width={0.58} height={0.3625} pixels={[1024, 640]} />
      </Appear>
      <Appear at={0.2} position={[-0.62, -0.12, 0.08]} rotation={[0, 1.15, 0]} from={[-0.25, 0, 0.1]}>
        <Pane kind="phone" width={0.17} height={0.34} pixels={[400, 800]} />
      </Appear>
      <Appear at={0.3} position={[-0.16, -0.2, -0.72]} rotation={[-0.06, 0.22, 0]} from={[0, -0.25, 0]}>
        <Pane kind="code" width={0.34} height={0.34} pixels={[640, 640]} />
      </Appear>
      <Appear at={0.26} position={[-0.02, 0.16, -0.84]} rotation={[0.05, 0.05, 0]} from={[0, 0.2, -0.1]}>
        <Pane kind="dashboard" width={0.5} height={0.3125} pixels={[1024, 640]} />
      </Appear>
      <Appear at={0.34} position={[WORLD_WALL.x, WORLD_WALL.y, WORLD_WALL.z]} rotation={[0, WORLD_WALL.ry, 0]} from={[0.25, 0, -0.1]}>
        <PictureFrame texture={texture} width={(height * project.visual!.w) / project.visual!.h} height={height} />
      </Appear>
    </>
  );
}
