import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { AdditiveBlending, type Group, MeshBasicMaterial, type Texture } from "three";
import type { ServiceId } from "~/content/work";
import { palette } from "~/lib/palette";
import { easeOutCubic, enterCurves, sat } from "~/state/layout";
import { rt } from "~/state/runtime";
import { imageMaterial } from "../lib/shaders";

export type WorldProps = { id: ServiceId };

/** 0 → 1 while a world's own elements animate in (the last third of the flight). */
export const worldReveal = (id: ServiceId) => (rt.service === id ? enterCurves.reveal(rt.enter) : 0);

const RevealContext = createContext<() => number>(() => 1);

export function RevealProvider({ id, children }: { id: ServiceId; children: ReactNode }) {
  const get = useMemo(() => () => worldReveal(id), [id]);
  return <RevealContext.Provider value={get}>{children}</RevealContext.Provider>;
}

export const useReveal = () => useContext(RevealContext);

type AppearProps = {
  children: ReactNode;
  /** When in the reveal (0 → 1) this element starts, and how long it takes. */
  at?: number;
  span?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Offset it travels in from. */
  from?: [number, number, number];
};

/** Brings one element of a world into the scene: it grows and glides to its place. */
export function Appear({ children, at = 0, span = 0.5, position = [0, 0, 0], rotation, scale = 1, from = [0, 0, 0] }: AppearProps) {
  const ref = useRef<Group>(null!);
  const reveal = useReveal();
  useFrame(() => {
    const t = easeOutCubic(sat((reveal() - at) / span));
    const g = ref.current;
    g.visible = t > 0.001;
    g.scale.setScalar(Math.max(0.0001, t * scale));
    g.position.set(position[0] + from[0] * (1 - t), position[1] + from[1] * (1 - t), position[2] + from[2] * (1 - t));
  });
  return (
    <group ref={ref} rotation={rotation} visible={false}>
      {children}
    </group>
  );
}

export type FrameState = { opacity: number; dim: number };

type PictureFrameProps = {
  texture: Texture;
  width: number;
  height: number;
  /** Animated from outside (the gallery fades and dims its frames). */
  live?: RefObject<FrameState>;
  /** Width of the dark border around the picture. */
  border?: number;
  /** Show the cobalt reflection under the horizon line. */
  mirror?: boolean;
};

/**
 * A campaign visual hung in space. Under it runs a hairline of light, and below that the
 * picture's reflection in cobalt: the logo's M-over-W idea applied to every piece of work.
 */
export function PictureFrame({ texture, width, height, live, border = 0.03, mirror = true }: PictureFrameProps) {
  const aspect = width / height;
  const b = border * height;
  const image = useMemo(() => imageMaterial({ map: texture, aspect, solid: true }), [texture, aspect]);
  const reflection = useMemo(
    () => imageMaterial({ map: texture, aspect, flip: true, fade: 0.5, tint: palette.cobalt, tintAmount: 0.78 }),
    [texture, aspect],
  );
  const backing = useMemo(() => new MeshBasicMaterial({ color: palette.ink, transparent: true, depthWrite: false }), []);
  const edge = useMemo(() => new MeshBasicMaterial({ color: palette.ivory, transparent: true, depthWrite: false }), []);
  const hairline = useMemo(
    () => new MeshBasicMaterial({ color: palette.cobaltSoft, transparent: true, depthWrite: false, blending: AdditiveBlending }),
    [],
  );

  useFrame(() => {
    const o = live?.current?.opacity ?? 1;
    const d = live?.current?.dim ?? 1;
    image.uniforms.uOpacity.value = o;
    image.uniforms.uDim.value = d;
    reflection.uniforms.uOpacity.value = o;
    reflection.uniforms.uDim.value = d;
    backing.opacity = o;
    edge.opacity = o * 0.5 * d;
    hairline.opacity = o * d;
  });

  const gap = height * 0.035;
  return (
    <group>
      <mesh position-z={-0.004 * height} material={edge} renderOrder={3}>
        <planeGeometry args={[width + b * 2 + height * 0.006, height + b * 2 + height * 0.006]} />
      </mesh>
      <mesh position-z={-0.002 * height} material={backing} renderOrder={4}>
        <planeGeometry args={[width + b * 2, height + b * 2]} />
      </mesh>
      <mesh material={image} renderOrder={5}>
        <planeGeometry args={[width, height]} />
      </mesh>
      {mirror && (
        <>
          <mesh position={[0, -height / 2 - b - gap / 2, 0]} material={hairline} renderOrder={5}>
            <planeGeometry args={[width + b * 2 + height * 0.5, height * 0.004]} />
          </mesh>
          <mesh position={[0, -height - b - gap, 0]} material={reflection} renderOrder={5}>
            <planeGeometry args={[width, height]} />
          </mesh>
        </>
      )}
    </group>
  );
}
