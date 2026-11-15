import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending, BufferGeometry, Color, DoubleSide, Float32BufferAttribute, type Group, type InstancedMesh, LineBasicMaterial, LineSegments,
  MeshBasicMaterial, MeshStandardMaterial, Object3D, Quaternion, RepeatWrapping, Vector3,
} from "three";
import { projectsFor } from "~/content/services";
import { visuals } from "~/content/visuals";
import { palette } from "~/lib/palette";
import { sat, WORLD_WALL } from "~/state/layout";
import { useStore } from "~/state/store";
import { beamMaterial } from "../lib/shaders";
import { bokehTexture, drawFilm, useDrawnTexture, useVisualTextures } from "../lib/textures";
import { Appear, PictureFrame, useReveal, type WorldProps } from "./shared";

// World 02 — a dark set. Two lamps cut through the black, one warm and one cobalt, the way
// WE MUST lights its own photographs. Prints hang in the air, film runs past, and everything
// that is not the subject falls into bokeh: "Tout le reste, flou. Votre travail, net."

const dummy = new Object3D();
const DOWN = new Vector3(0, -1, 0);

/** A lamp head and its beam, aimed from `at` toward `target`. */
function Lamp({ at, target, color, length, spread, delay }: { at: [number, number, number]; target: [number, number, number]; color: string; length: number; spread: number; delay: number }) {
  const beam = useMemo(() => beamMaterial(color, 0.5), [color]);
  const body = useMemo(() => new MeshStandardMaterial({ color: "#0c0c10", metalness: 0.8, roughness: 0.4 }), []);
  const face = useMemo(() => new MeshBasicMaterial({ color: new Color(color).multiplyScalar(2.4) }), [color]);
  const quaternion = useMemo(() => {
    const dir = new Vector3(target[0] - at[0], target[1] - at[1], target[2] - at[2]).normalize();
    return new Quaternion().setFromUnitVectors(DOWN, dir);
  }, [at, target]);
  const reveal = useReveal();

  useFrame(({ clock }) => {
    const flicker = useStore.getState().reduced ? 1 : 0.94 + Math.sin(clock.elapsedTime * 2.3 + delay * 20) * 0.06;
    beam.uniforms.uOpacity.value = sat((reveal() - delay) / 0.4) * flicker;
  });

  return (
    <Appear at={delay} position={at} from={[0, 0.2, 0]}>
      <group quaternion={quaternion}>
        <mesh material={body} position-y={0.03}>
          <cylinderGeometry args={[0.03, 0.05, 0.09, 24]} />
        </mesh>
        <mesh material={face} position-y={-0.016} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.045, 24]} />
        </mesh>
        <mesh material={beam} position-y={-length / 2 - 0.02} renderOrder={4}>
          <coneGeometry args={[spread, length, 40, 1, true]} />
        </mesh>
      </group>
    </Appear>
  );
}

/** Viewfinder corners around the print in focus. */
function FocusBrackets({ width, height }: { width: number; height: number }) {
  const ref = useRef<LineSegments>(null!);
  const lines = useMemo(() => {
    const w = width / 2 + 0.03;
    const h = height / 2 + 0.03;
    const l = 0.05;
    const pts: number[] = [];
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        pts.push(sx * w, sy * h, 0, sx * (w - l), sy * h, 0, sx * w, sy * h, 0, sx * w, sy * (h - l), 0);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return new LineSegments(g, new LineBasicMaterial({ color: palette.ivory, transparent: true, opacity: 0.9 }));
  }, [width, height]);

  useFrame(({ clock }) => {
    if (useStore.getState().reduced) return;
    // Hunting for focus, then locking.
    const hunt = Math.max(0, Math.sin(clock.elapsedTime * 0.9)) ** 6;
    ref.current.scale.setScalar(1 + hunt * 0.06);
  });

  return <primitive ref={ref} object={lines} position-z={0.01} />;
}

/** Points of light far out of focus. */
function Bokeh() {
  const mesh = useRef<InstancedMesh>(null!);
  const material = useMemo(
    () => new MeshBasicMaterial({ map: bokehTexture(), transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0, side: DoubleSide }),
    [],
  );
  const count = 54;
  const reveal = useReveal();
  const ready = useRef(false);

  useFrame(({ clock }) => {
    if (!ready.current) {
      ready.current = true;
      const tint = new Color();
      let seed = 3;
      const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      for (let i = 0; i < count; i++) {
        const theta = -1.9 + rand() * 3.8;
        const phi = -0.5 + rand() * 1.25;
        const r = 0.82 + rand() * 0.1;
        dummy.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(phi), -r * Math.cos(theta) * Math.cos(phi));
        dummy.lookAt(0, 0, 0);
        dummy.scale.setScalar(0.03 + rand() ** 2 * 0.1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        const pick = rand();
        tint.set(pick < 0.62 ? palette.amber : pick < 0.86 ? palette.ivory : palette.cobalt).multiplyScalar(0.25 + rand() * 0.5);
        mesh.current.setColorAt(i, tint);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    }
    const breathe = useStore.getState().reduced ? 1 : 0.85 + Math.sin(clock.elapsedTime * 0.6) * 0.15;
    material.opacity = sat((reveal() - 0.1) / 0.5) * breathe;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, material, count]} frustumCulled={false} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
    </instancedMesh>
  );
}

/** A length of film sweeping around the set. */
function FilmStrip() {
  const texture = useDrawnTexture(1024, 128, drawFilm);
  const material = useMemo(() => {
    texture.wrapS = RepeatWrapping;
    texture.repeat.set(3, 1);
    return new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: DoubleSide });
  }, [texture]);
  const strip = useRef<Group>(null!);

  useFrame((_, dt) => {
    if (useStore.getState().reduced) return;
    texture.offset.x -= dt * 0.03;
    strip.current.rotation.y += dt * 0.012;
  });

  return (
    <Appear at={0.25} position={[0, -0.36, 0]} rotation={[0.16, 0, -0.07]} span={0.7}>
      <group ref={strip}>
        <mesh material={material} renderOrder={2}>
          <cylinderGeometry args={[0.84, 0.84, 0.105, 120, 1, true, Math.PI * 0.62, Math.PI * 1.25]} />
        </mesh>
      </group>
    </Appear>
  );
}

export default function ShootingWorld({ id }: WorldProps) {
  const project = projectsFor(id)[0];
  const [main, reel, still] = useVisualTextures([project.visual!, visuals.nexistezPas, visuals.votreSiteRame]);
  const height = 0.42;
  const width = (height * project.visual!.w) / project.visual!.h;

  return (
    <>
      <Bokeh />
      <FilmStrip />
      <Lamp at={[-0.5, 0.62, 0.22]} target={[0, -0.05, 0]} color={palette.amber} length={1.05} spread={0.3} delay={0.05} />
      <Lamp at={[0.42, 0.6, -0.5]} target={[0.2, -0.3, -0.2]} color={palette.cobalt} length={0.95} spread={0.26} delay={0.2} />

      <Appear at={0.3} position={[WORLD_WALL.x, WORLD_WALL.y, WORLD_WALL.z]} rotation={[0, WORLD_WALL.ry, 0]} from={[0.25, 0, -0.1]}>
        <PictureFrame texture={main} width={width} height={height} />
        <FocusBrackets width={width} height={height} />
      </Appear>
      <Appear at={0.4} position={[-0.52, 0.02, -0.42]} rotation={[0, 0.78, 0.03]} from={[-0.25, 0, 0]}>
        <PictureFrame texture={reel} width={0.19} height={0.338} mirror={false} />
      </Appear>
      <Appear at={0.5} position={[-0.14, 0.33, -0.76]} rotation={[0.14, 0.14, -0.04]} from={[0, 0.25, 0]}>
        <PictureFrame texture={still} width={0.22} height={0.275} mirror={false} />
      </Appear>
    </>
  );
}
