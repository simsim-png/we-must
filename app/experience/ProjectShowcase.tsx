import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Texture } from "three";
import { realProjects } from "~/content/work";
import { galleryFrame, lerp, sat, smooth, STATION_COUNT, WORK_COUNT } from "~/state/layout";
import { rt } from "~/state/runtime";
import { scrollToStep } from "~/state/scroll";
import { getState, useStore } from "~/state/store";
import { useVisualTextures } from "./lib/textures";
import { type FrameState, PictureFrame } from "./worlds/shared";

const FRAME_HEIGHT = 4;
const projects = realProjects.slice(0, WORK_COUNT);

function GalleryFrame({ index, texture, aspect }: { index: number; texture: Texture; aspect: number }) {
  const group = useRef<Group>(null!);
  const live = useRef<FrameState>({ opacity: 0, dim: 1 });
  const pose = galleryFrame(index);

  useFrame(({ clock }) => {
    const station = rt.u * (STATION_COUNT - 1);
    // The gallery only exists between leaving the universe scene and arriving at "about".
    const present = smooth(sat((station - 0.3) / 0.5)) * (1 - smooth(sat((station - WORK_COUNT - 0.4) / 0.45))) * (1 - sat(rt.enter * 3));
    const focus = smooth(1 - sat(Math.abs(station - (index + 1))));
    live.current.opacity = present * lerp(0.4, 1, focus);
    live.current.dim = lerp(0.22, 1, focus);
    const g = group.current;
    g.visible = present > 0.003;
    g.scale.setScalar(lerp(0.84, 1, focus) * lerp(0.9, 1, present));
    const bob = useStore.getState().reduced ? 0 : Math.sin(clock.elapsedTime * 0.5 + index * 1.7) * 0.06;
    g.position.set(pose.x, pose.y + bob, pose.z);
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const s = getState();
    if (e.delta > 8 || s.view !== "home" || s.transit !== "idle" || live.current.opacity < 0.2) return;
    e.stopPropagation();
    scrollToStep(index + 1);
  };

  return (
    <group ref={group} rotation-y={pose.ry} visible={false} onClick={onClick}>
      <PictureFrame texture={texture} width={FRAME_HEIGHT * aspect} height={FRAME_HEIGHT} live={live} />
    </group>
  );
}

/**
 * Scene 04: WE MUST's own campaigns, hung on an arc outside the orbits. The camera travels
 * from one to the next; each picture stands above its cobalt reflection.
 */
export function ProjectShowcase() {
  const textures = useVisualTextures(projects.map((p) => p.visual!));
  return (
    <>
      {projects.map((p, i) => (
        <GalleryFrame key={p.slug} index={i} texture={textures[i]} aspect={p.visual!.w / p.visual!.h} />
      ))}
    </>
  );
}
