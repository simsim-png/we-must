import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { enterCurves } from "~/state/layout";
import { rt } from "~/state/runtime";
import { Atmosphere } from "./Atmosphere";
import { CameraController } from "./CameraController";
import { CentralCore } from "./CentralCore";
import { OrbitalSystem } from "./OrbitalSystem";
import { ProjectShowcase } from "./ProjectShowcase";

/**
 * The whole WE MUST universe in one scene: the core, the four orbiting worlds, the gallery
 * arc and the space around them. Nothing is ever swapped out; the camera does the editing.
 */
export function UniverseScene({ high }: { high: boolean }) {
  const outer = useRef<Group>(null!);

  // Once the camera is fully inside a world, the rest of the universe is not drawn.
  useFrame(() => {
    outer.current.visible = enterCurves.expand(rt.enter) < 0.995;
  });

  return (
    <>
      <Atmosphere high={high} />
      <OrbitalSystem />
      <group ref={outer}>
        <CentralCore high={high} />
        <ProjectShowcase />
      </group>
      <CameraController />
    </>
  );
}
