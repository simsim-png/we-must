import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type ComponentType, lazy, type LazyExoticComponent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending, Color, type Group, MeshBasicMaterial, type Sprite, SpriteMaterial } from "three";
import type { Service } from "~/content/services";
import type { ServiceId } from "~/content/work";
import { actions } from "~/state/actions";
import { damp, easeOutBack, enterCurves, lerp, sat, SIGNATURE_ANGLE, smooth, WORLD_SCALE } from "~/state/layout";
import { rt } from "~/state/runtime";
import { canExplore, getState, setState, useStore } from "~/state/store";
import { LOOKS } from "./lib/looks";
import { glassMaterial, wallMaterial } from "./lib/shaders";
import { glowTexture } from "./lib/textures";
import { Emblem } from "./worlds/emblems";
import { RevealProvider, type WorldProps } from "./worlds/shared";

// The interior of each world is its own chunk, fetched when the sphere is first hovered,
// entered, or a few seconds after load when the browser is idle.
const WORLDS: Record<ServiceId, LazyExoticComponent<ComponentType<WorldProps>>> = {
  branding: lazy(() => import("./worlds/BrandingWorld")),
  shooting: lazy(() => import("./worlds/ShootingWorld")),
  social: lazy(() => import("./worlds/SocialWorld")),
  web: lazy(() => import("./worlds/WebWorld")),
};

/** The emblem is shown larger through the glass than it is once you stand next to it. */
const EMBLEM_OUTSIDE = 2.1;
const EMBLEM_INSIDE = 0.78;

/** Compiles a freshly loaded world's shaders ahead of time so entering it does not stutter. */
function Precompile({ target }: { target: React.RefObject<Group | null> }) {
  const { gl, camera, scene } = useThree();
  useEffect(() => {
    if (target.current) gl.compileAsync(target.current, camera, scene).catch(() => undefined);
  }, [gl, camera, scene, target]);
  return null;
}

/**
 * One service as a world in a glass sphere. From the universe you see its sky and its emblem
 * through the glass; select it and it grows around the camera until it is the environment.
 */
export function ServiceSphere({ index, service }: { index: number; service: Service }) {
  const id = service.id;
  const look = LOOKS[id];
  const World = WORLDS[id];

  const group = useRef<Group>(null!);
  const emblem = useRef<Group>(null!);
  const interior = useRef<Group>(null);
  const ring = useRef<Group>(null!);
  const halo = useRef<Sprite>(null!);
  const hover = useRef(0);
  const dimmed = useRef(0);

  const wanted = useStore((s) => s.hovered === id || s.service === id || s.preload > index);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (wanted) setMounted(true);
  }, [wanted]);

  const glass = useMemo(() => glassMaterial(look.glass), [look]);
  const wall = useMemo(() => wallMaterial(look.wall), [look]);
  const haloMat = useMemo(
    () => new SpriteMaterial({ map: glowTexture(), color: new Color(look.halo), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }),
    [look],
  );
  const ringMat = useMemo(() => new MeshBasicMaterial({ color: look.ring, transparent: true, opacity: 0.4, depthWrite: false }), [look]);

  useFrame((_, dt) => {
    const st = useStore.getState();
    const p = rt.spheres[index];
    const g = group.current;
    g.position.set(p.x, p.y, p.z);

    const active = rt.service === id;
    const e = active ? rt.enter : 0;
    const approach = enterCurves.approach(e);
    const expand = enterCurves.expand(e);
    // Another world is being entered: step back and fade out of its way.
    const away = rt.service && !active ? smooth(sat(rt.enter / 0.55)) : 0;

    hover.current = damp(hover.current, st.hovered === id ? 1 : 0, 7, dt);
    dimmed.current = damp(dimmed.current, st.hovered && st.hovered !== id ? 1 : 0, 5, dt);
    const h = hover.current;
    const dim = 1 - 0.45 * dimmed.current;

    // The four worlds are born from the core, one after the other.
    const spawn = easeOutBack(sat((rt.reveal - 0.22 - index * 0.06) / 0.5));
    g.visible = spawn > 0.001 && away < 0.995;
    g.scale.setScalar(Math.max(0.0001, spawn * (1 + 0.1 * h) * lerp(1, WORLD_SCALE, expand) * (1 - 0.4 * away)));

    glass.uniforms.uHover.value = h;
    glass.uniforms.uOpacity.value = (1 - smooth(sat((e - 0.56) / 0.16))) * dim;
    wall.uniforms.uOpacity.value = lerp(look.wallOutside + 0.1 * h, 1, sat(approach * 1.15));
    haloMat.opacity = (look.haloStrength * (0.5 + h) + approach * 0.25) * (1 - expand) * dim;
    halo.current.scale.setScalar(3.1 + h * 0.5);
    ringMat.opacity = (0.3 + h * 0.6) * (1 - expand) * dim;
    if (!st.reduced) ring.current.rotation.z += dt * (0.22 + h * 0.7);

    emblem.current.scale.setScalar(lerp(EMBLEM_OUTSIDE, EMBLEM_INSIDE, expand));
    if (interior.current) interior.current.visible = e > 0.5;
  });

  const isTouch = (e: ThreeEvent<PointerEvent | MouseEvent>) => (e.nativeEvent as PointerEvent).pointerType === "touch";

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isTouch(e) || !canExplore()) return;
    setState({ hovered: id });
    document.body.style.cursor = "pointer";
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    if (isTouch(e)) return;
    if (getState().hovered === id) setState({ hovered: null });
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // A drag that happens to end on a sphere is a rotation, not a selection.
    if (e.delta > 8 || !canExplore()) return;
    // Touch has no hover: the first tap focuses the world, the second one enters it.
    if (isTouch(e) && getState().hovered !== id) {
      setState({ hovered: id });
      return;
    }
    document.body.style.cursor = "";
    actions.openWorld(id);
  };

  return (
    <group ref={group} visible={false}>
      <mesh onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <sphereGeometry args={[1.18, 24, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh material={wall} renderOrder={-1}>
        <sphereGeometry args={[0.985, 64, 48]} />
      </mesh>

      <group ref={emblem}>
        <Emblem id={id} />
      </group>

      {mounted && (
        <Suspense fallback={null}>
          <group ref={interior} visible={false}>
            <RevealProvider id={id}>
              <World id={id} />
            </RevealProvider>
          </group>
          <Precompile target={interior} />
        </Suspense>
      )}

      <mesh material={glass} renderOrder={8}>
        <sphereGeometry args={[1, 64, 48]} />
      </mesh>
      <sprite ref={halo} material={haloMat} />

      <group rotation={[Math.PI / 2 - SIGNATURE_ANGLE * 0.55, 0, index * 0.8]}>
        <group ref={ring}>
          <mesh material={ringMat}>
            <torusGeometry args={[1.32, 0.005, 8, 128]} />
          </mesh>
          <mesh position={[1.32, 0, 0]} material={ringMat}>
            <sphereGeometry args={[0.022, 12, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
