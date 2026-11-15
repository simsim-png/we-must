import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute, type Mesh, type Points } from "three";
import { palette } from "~/lib/palette";
import { enterCurves, lerp, sat, smooth } from "~/state/layout";
import { rt } from "~/state/runtime";
import { useStore } from "~/state/store";
import { backdropMaterial, dustMaterial } from "./lib/shaders";

/** Deterministic pseudo-random numbers, so the dust is the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Everything around the objects: the lights, a small studio the chrome and glass can reflect
 * (drawn with light panels in brand colours rather than a downloaded HDR), deep space behind,
 * and a slow field of dust that gives the camera moves their sense of depth.
 */
export function Atmosphere({ high }: { high: boolean }) {
  const { gl, size } = useThree();
  const sky = useRef<Mesh>(null!);
  const points = useRef<Points>(null!);
  const backdrop = useMemo(() => backdropMaterial(high), [high]);
  const dust = useMemo(() => dustMaterial(), []);

  const geometry = useMemo(() => {
    const count = high ? 1900 : 750;
    const rand = seeded(7);
    const position = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.pow(rand(), 0.7) * 44;
      const angle = rand() * Math.PI * 2;
      // Denser near the orbital plane, like a disc of dust around the core.
      const spread = lerp(1.5, 16, Math.pow(rand(), 2.2));
      position[i * 3] = Math.cos(angle) * radius;
      position[i * 3 + 1] = (rand() - 0.5) * 2 * spread;
      position[i * 3 + 2] = Math.sin(angle) * radius;
      size[i] = 1 + Math.pow(rand(), 3) * 5;
      seed[i] = rand();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(position, 3));
    g.setAttribute("aSize", new Float32BufferAttribute(size, 1));
    g.setAttribute("aSeed", new Float32BufferAttribute(seed, 1));
    return g;
  }, [high]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { reduced } = useStore.getState();
    const outside = enterCurves.expand(rt.enter) < 0.995;
    sky.current.visible = points.current.visible = outside;
    if (!outside) return;

    sky.current.position.copy(state.camera.position);
    backdrop.uniforms.uTime.value = reduced ? 0 : t;
    backdrop.uniforms.uGlow.value = lerp(0.25, 1, smooth(sat(rt.emerge)));
    dust.uniforms.uTime.value = reduced ? 0 : t;
    dust.uniforms.uScale.value = gl.getPixelRatio() * (size.height / 900);
    dust.uniforms.uOpacity.value = smooth(sat(rt.emerge)) * lerp(0.3, 0.8, sat(rt.reveal));
    if (!reduced) points.current.rotation.y += dt * 0.006;
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#e6e2da" />
      <directionalLight position={[-7, 9, 11]} intensity={2.3} color={palette.ivory} />
      <directionalLight position={[9, -3, -7]} intensity={1.1} color={palette.cobalt} />
      <pointLight position={[0, 0, 0.6]} intensity={9} distance={18} decay={2} color={palette.cobalt} />

      <Environment resolution={256} frames={1} environmentIntensity={0.9}>
        <color attach="background" args={["#040508"]} />
        <Lightformer form="rect" intensity={3.2} color={palette.ivory} position={[0, 7, 2]} scale={[14, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.4} color={palette.cobalt} position={[-9, 0.5, 2]} scale={[1.6, 10, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} color={palette.ivory} position={[9, 1.5, 0]} scale={[0.8, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={2.2} color={palette.amber} position={[4, -6, -5]} scale={3} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.2} color={palette.cobaltSoft} position={[0, 0, 9]} scale={6} target={[0, 0, 0]} />
      </Environment>

      <mesh ref={sky} material={backdrop} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[150, 32, 24]} />
      </mesh>
      <points ref={points} geometry={geometry} material={dust} frustumCulled={false} />
    </>
  );
}
