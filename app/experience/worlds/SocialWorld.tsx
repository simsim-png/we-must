import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BackSide, DoubleSide, type Group, type InstancedMesh, type Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, RepeatWrapping, type Texture } from "three";
import { projectsFor } from "~/content/services";
import { realProjects } from "~/content/work";
import { palette } from "~/lib/palette";
import { sat, TAU, WORLD_WALL } from "~/state/layout";
import { useStore } from "~/state/store";
import { slabGeometry } from "../lib/geometry";
import { imageMaterial } from "../lib/shaders";
import { drawText, useDrawnTexture, useVisualTextures } from "../lib/textures";
import { Appear, PictureFrame, useReveal, type WorldProps } from "./shared";

// World 03 — inside the feed. A cobalt space that never sits still: WE MUST's own posts
// stream past in two lanes, a headline runs in a loop, replies pop up, signals ripple out.

const dummy = new Object3D();
const speed = () => (useStore.getState().reduced ? 0 : 1);

/** One post travelling along the back of the world, then coming round again. */
function StreamCard({ texture, aspect, lane, slot, count }: { texture: Texture; aspect: number; lane: 1 | -1; slot: number; count: number }) {
  const ref = useRef<Mesh>(null!);
  const material = useMemo(() => imageMaterial({ map: texture, aspect, radius: 0.07 }), [texture, aspect]);
  const reveal = useReveal();
  const height = 0.25;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed();
    // 0 → 1 along the arc; the two lanes run in opposite directions.
    let s = (slot / count + t * 0.028) % 1;
    if (lane < 0) s = 1 - s;
    const angle = Math.PI * (1.08 + s * 0.84);
    const r = 0.74;
    const m = ref.current;
    m.position.set(r * Math.cos(angle), lane * 0.31 + Math.sin(s * TAU * 1.5 + t * 0.6) * 0.035, r * Math.sin(angle));
    // Face the centre of this world (lookAt would aim at the centre of the universe instead).
    m.rotation.set(0, Math.atan2(-m.position.x, -m.position.z), 0);
    material.uniforms.uOpacity.value = Math.sin(Math.PI * s) ** 0.6 * sat((reveal() - 0.15 - slot * 0.05) / 0.4);
  });

  return (
    <mesh ref={ref} material={material} renderOrder={3}>
      <planeGeometry args={[height * aspect, height]} />
    </mesh>
  );
}

/** The campaign headline as a moving band, the way a caption scrolls. */
function Marquee() {
  const texture = useDrawnTexture(2048, 128, (ctx, w, h) =>
    drawText(ctx, w, h, { lines: ["VOUS N’EXISTEZ PAS.  ·  VOUS N’EXISTEZ PAS.  ·"], size: 0.5, color: palette.ivory, letterSpacing: 0.02 }),
  );
  // Only the inside of the band is drawn, so the line runs behind the emblem and always
  // reads the right way round (the texture is flipped to compensate).
  const material = useMemo(() => {
    texture.wrapS = RepeatWrapping;
    texture.repeat.x = -1;
    return new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: BackSide });
  }, [texture]);

  useFrame((_, dt) => {
    texture.offset.x -= dt * 0.045 * speed();
  });

  return (
    <Appear at={0.2} rotation={[0.24, 0, -0.1]} span={0.6}>
      <mesh material={material} renderOrder={5}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 96, 1, true]} />
      </mesh>
    </Appear>
  );
}

/** Replies being typed: pills that pop in, hold, and go. */
function Bubbles() {
  const group = useRef<Group>(null!);
  const pill = useMemo(() => slabGeometry(0.17, 0.07, 0.035, 0.012), []);
  const ivory = useMemo(() => new MeshStandardMaterial({ color: palette.ivory, roughness: 0.5 }), []);
  const ink = useMemo(() => new MeshStandardMaterial({ color: palette.ink, roughness: 0.45 }), []);
  const dotInk = useMemo(() => new MeshBasicMaterial({ color: palette.ink }), []);
  const dotIvory = useMemo(() => new MeshBasicMaterial({ color: palette.ivory }), []);
  const spots: { p: [number, number, number]; r: number; dark: boolean }[] = [
    { p: [-0.5, 0.06, -0.1], r: 0.9, dark: false },
    { p: [-0.36, -0.14, 0.12], r: 0.75, dark: true },
    { p: [-0.6, -0.04, -0.34], r: 0.7, dark: true },
    { p: [0.2, 0.06, -0.72], r: 0, dark: false },
  ];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const still = useStore.getState().reduced;
    group.current.children.forEach((b, i) => {
      // Each bubble lives on its own 5-second loop: pop in, hold, shrink away.
      const life = still ? 0.5 : (t * 0.2 + i * 0.27) % 1;
      const pop = Math.min(1, life * 9) * Math.min(1, (1 - life) * 7);
      b.scale.setScalar(Math.max(0.0001, pop * (1 + Math.sin(life * 40) * 0.02)));
      b.children[1].children.forEach((d, j) => d.scale.setScalar(0.75 + Math.max(0, Math.sin(t * 5 - j * 0.9)) * 0.7));
    });
  });

  return (
    <Appear at={0.35}>
      <group ref={group}>
        {spots.map((s, i) => (
          <group key={i} position={s.p} rotation-y={s.r}>
            <mesh geometry={pill} material={s.dark ? ink : ivory} />
            <group position-z={0.008}>
              {[-0.04, 0, 0.04].map((x) => (
                <mesh key={x} position-x={x} material={s.dark ? dotIvory : dotInk}>
                  <circleGeometry args={[0.011, 16]} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>
    </Appear>
  );
}

/** Rings that leave the centre and fade: a post going out. */
function Ripples() {
  const group = useRef<Group>(null!);
  const mats = useMemo(
    () => [0, 1, 2].map(() => new MeshBasicMaterial({ color: palette.ivory, transparent: true, opacity: 0, depthWrite: false, side: DoubleSide })),
    [],
  );
  const reveal = useReveal();

  useFrame(({ clock }) => {
    const still = useStore.getState().reduced;
    group.current.children.forEach((ring, i) => {
      const life = still ? (i + 1) / 4 : (clock.elapsedTime * 0.16 + i / 3) % 1;
      ring.scale.setScalar(0.28 + life * 0.6);
      mats[i].opacity = (1 - life) ** 2 * 0.5 * sat(reveal() * 2);
    });
  });

  return (
    <group ref={group} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
      {mats.map((m, i) => (
        <mesh key={i} material={m} renderOrder={2}>
          <ringGeometry args={[0.992, 1, 96]} />
        </mesh>
      ))}
    </group>
  );
}

/** Notifications: a restless swarm of dots on tilted orbits. */
function Swarm() {
  const mesh = useRef<InstancedMesh>(null!);
  const material = useMemo(() => new MeshBasicMaterial({ color: palette.ivory }), []);
  const reveal = useReveal();
  const count = 28;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed();
    const r = reveal();
    for (let i = 0; i < count; i++) {
      const tilt = (i * 2.399) % Math.PI;
      const radius = 0.44 + ((i * 0.618) % 1) * 0.14;
      const a = t * (0.5 + ((i * 0.37) % 1) * 0.7) + i * 1.7;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      dummy.position.set(x * Math.cos(tilt) - 0 * Math.sin(tilt), x * Math.sin(tilt) * 0.55, z);
      dummy.scale.setScalar(Math.max(0.0001, (0.005 + ((i * 0.77) % 1) * 0.006) * sat((r - 0.3) / 0.4)));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, material, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 10]} />
    </instancedMesh>
  );
}

export default function SocialWorld({ id }: WorldProps) {
  const project = projectsFor(id)[0];
  const stream = realProjects;
  const textures = useVisualTextures(stream.map((p) => p.visual!));
  const main = textures[stream.indexOf(project)];
  const height = 0.44;
  const cards = 5;

  return (
    <>
      <Ripples />
      <Marquee />
      <Swarm />
      <Bubbles />
      {([1, -1] as const).map((lane) =>
        Array.from({ length: cards }, (_, slot) => {
          const i = (slot + (lane > 0 ? 0 : 3)) % stream.length;
          const v = stream[i].visual!;
          return <StreamCard key={`${lane}-${slot}`} texture={textures[i]} aspect={v.w / v.h} lane={lane} slot={slot} count={cards} />;
        }),
      )}
      <Appear at={0.3} position={[WORLD_WALL.x, WORLD_WALL.y, WORLD_WALL.z]} rotation={[0, WORLD_WALL.ry, 0]} from={[0.25, 0, -0.1]}>
        <PictureFrame texture={main} width={(height * project.visual!.w) / project.visual!.h} height={height} mirror={false} />
      </Appear>
    </>
  );
}
