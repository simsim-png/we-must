import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, type Group, type Mesh, MeshPhysicalMaterial, MeshStandardMaterial, type Sprite, SpriteMaterial } from "three";
import { palette } from "~/lib/palette";
import { damp, easeOutCubic, lerp, sat, SIGNATURE_ANGLE, smooth } from "~/state/layout";
import { rt } from "~/state/runtime";
import { useStore } from "~/state/store";
import { monogramGeometry } from "./lib/geometry";
import { glassMaterial, horizonMaterial } from "./lib/shaders";
import { glowTexture, streakTexture } from "./lib/textures";

/**
 * The centre of the universe: the WE MUST monogram in three dimensions.
 * An ivory M above a cobalt W, exactly as in the logo, with light escaping from the thin gap
 * between them. That gap, the horizon, is the one line everything else orbits.
 */
export function CentralCore({ high }: { high: boolean }) {
  const root = useRef<Group>(null!);
  const m = useRef<Mesh>(null!);
  const w = useRef<Mesh>(null!);
  const rings = useRef<Group>(null!);
  const ringA = useRef<Group>(null!);
  const ringB = useRef<Group>(null!);
  const flare = useRef<Sprite>(null!);
  const halo = useRef<Sprite>(null!);
  const hover = useRef(0);

  const geoM = useMemo(() => monogramGeometry("M"), []);
  const geoW = useMemo(() => monogramGeometry("W"), []);
  const matM = useMemo(
    () => new MeshPhysicalMaterial({ color: palette.ivory, roughness: 0.36, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.28 }),
    [],
  );
  const matW = useMemo(
    () => new MeshPhysicalMaterial({ color: palette.cobalt, emissive: palette.cobalt, emissiveIntensity: 0.1, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 }),
    [],
  );
  const horizon = useMemo(() => horizonMaterial(), []);
  const shell = useMemo(() => glassMaterial({ tint: palette.cobalt, rim: palette.cobaltSoft, base: 0 }), []);
  const chrome = useMemo(() => new MeshStandardMaterial({ color: "#dfe3f6", metalness: 1, roughness: 0.2 }), []);
  const flareMat = useMemo(
    () => new SpriteMaterial({ map: streakTexture(), color: new Color(palette.ivory), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }),
    [],
  );
  const haloMat = useMemo(
    () => new SpriteMaterial({ map: glowTexture(), color: new Color(palette.cobalt), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }),
    [],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { hovered, reduced } = useStore.getState();
    hover.current = damp(hover.current, hovered ? 1 : 0, 4, dt);

    // Scene 01: the two letters swing in from above and below and lock onto the horizon.
    const join = easeOutCubic(sat(rt.emerge / 0.7));
    const ignite = smooth(sat((rt.emerge - 0.55) / 0.45));
    const rv = smooth(sat(rt.reveal));

    root.current.visible = rt.emerge > 0.002;
    m.current.position.y = lerp(1.9, 0, join);
    m.current.rotation.x = lerp(-1.35, 0, join);
    w.current.position.y = lerp(-1.9, 0, join);
    w.current.rotation.x = lerp(1.35, 0, join);
    const appear = smooth(sat(rt.emerge / 0.25));
    m.current.scale.setScalar(Math.max(0.0001, appear));
    w.current.scale.setScalar(Math.max(0.0001, appear));

    const breathe = reduced ? 0 : Math.sin(t * 1.1) * 0.08;
    matW.emissiveIntensity = lerp(0.05, high ? 1.25 : 0.7, ignite) + hover.current * 0.35 + breathe * ignite;
    horizon.uniforms.uTime.value = t;
    horizon.uniforms.uIntensity.value = ignite * (0.8 + hover.current * 0.45 + breathe);

    // The streak overshoots when the horizon ignites, then settles.
    const flash = Math.sin(sat((rt.emerge - 0.55) / 0.45) * Math.PI);
    flare.current.scale.set(lerp(0.01, lerp(11, 7.5, rv), ignite) + flash * 5, 0.2 + flash * 0.16, 1);
    flareMat.opacity = ignite * lerp(0.95, 0.6, rv) * (high ? 1 : 0.8);
    halo.current.scale.setScalar(lerp(3, 5.4, ignite) + hover.current);
    haloMat.opacity = ignite * (high ? 0.075 : 0.2) + hover.current * 0.06;

    shell.uniforms.uOpacity.value = rv * 0.5;
    shell.uniforms.uHover.value = hover.current;
    const grow = easeOutCubic(sat((rt.reveal - 0.08) / 0.6));
    rings.current.scale.setScalar(Math.max(0.0001, grow));
    if (!reduced) {
      ringA.current.rotation.z += dt * 0.11;
      ringB.current.rotation.z -= dt * 0.07;
    }

    // The mark always turns most of the way toward the camera so it never reads edge-on,
    // then leans a little toward the pointer.
    const azimuth = Math.atan2(state.camera.position.x, state.camera.position.z);
    const sway = reduced ? 0 : Math.sin(t * 0.22) * 0.14 * rv;
    const lean = reduced ? 0 : rt.pointer.x * 0.2;
    root.current.rotation.y = damp(root.current.rotation.y, azimuth * 0.78 + sway + lean, 3, dt);
    root.current.rotation.x = damp(root.current.rotation.x, reduced ? 0 : -rt.pointer.y * 0.07, 3, dt);
    root.current.position.y = reduced ? 0 : Math.sin(t * 0.5) * 0.05 * rv;
  });

  return (
    <group ref={root}>
      <mesh ref={m} geometry={geoM} material={matM} />
      <mesh ref={w} geometry={geoW} material={matW} />

      <mesh rotation-x={-Math.PI / 2} material={horizon} renderOrder={2}>
        <circleGeometry args={[4.6, 96]} />
      </mesh>
      <sprite ref={flare} material={flareMat} renderOrder={3} />
      <sprite ref={halo} material={haloMat} position={[0, 0, -0.4]} renderOrder={1} />

      <mesh material={shell} renderOrder={4}>
        <sphereGeometry args={[1.78, 64, 48]} />
      </mesh>

      <group ref={rings}>
        {/* Tilted at the logo's own 38.6°. A bead rides each ring so the turn is visible. */}
        <group rotation={[Math.PI / 2 - SIGNATURE_ANGLE, 0, 0.35]}>
          <group ref={ringA}>
            <mesh material={chrome}>
              <torusGeometry args={[2.12, 0.011, 10, 180]} />
            </mesh>
            <mesh position={[2.12, 0, 0]} material={chrome}>
              <sphereGeometry args={[0.04, 16, 16]} />
            </mesh>
          </group>
        </group>
        <group rotation={[Math.PI / 2 + SIGNATURE_ANGLE * 0.5, 0.4, -0.2]}>
          <group ref={ringB}>
            <mesh material={chrome}>
              <torusGeometry args={[2.36, 0.007, 10, 180]} />
            </mesh>
            <mesh position={[-2.36, 0, 0]} material={chrome}>
              <sphereGeometry args={[0.028, 16, 16]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
