import { useProgress } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { setState, useStore } from "~/state/store";
import { Effects } from "./Effects";
import { fontsReady } from "./lib/textures";
import { UniverseScene } from "./UniverseScene";

/** Reports real loading progress (textures) to the loading screen. */
function Progress() {
  useEffect(() => useProgress.subscribe((s) => setState({ progress: s.progress / 100 })), []);
  return null;
}

/**
 * Watches the frame rate and steps the quality down once if the device cannot keep up.
 * Long gaps between frames are ignored: they mean the tab was in the background, not that
 * the GPU is slow, and must not cost the visitor the full-quality picture when they return.
 */
function FrameWatch({ onSlow }: { onSlow: () => void }) {
  const sample = useRef({ time: 0, frames: 0, strikes: 0 });
  useFrame((_, dt) => {
    if (dt > 0.25 || document.hidden) return;
    const s = sample.current;
    s.time += dt;
    s.frames += 1;
    if (s.time < 2) return;
    const fps = s.frames / s.time;
    s.time = 0;
    s.frames = 0;
    s.strikes = fps < 30 ? s.strikes + 1 : 0;
    if (s.strikes >= 2) onSlow();
  });
  return null;
}

/** Development only: exposes the live three.js state as `wm.three` in the console. */
function DevHandle() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const w = window as unknown as { wm?: Record<string, unknown> };
    if (w.wm) w.wm.three = get;
  }, [get]);
  return null;
}

/** Mounts only once everything inside the Suspense boundary has loaded. */
function Ready() {
  useEffect(() => {
    let frame = 0;
    let alive = true;
    // Let the first frames render (shader compilation) before lifting the curtain.
    fontsReady().then(() => {
      const wait = (n: number) => {
        if (!alive) return;
        if (n <= 0) setState({ ready: true, progress: 1 });
        else frame = requestAnimationFrame(() => wait(n - 1));
      };
      wait(4);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      setState({ ready: false });
    };
  }, []);
  return null;
}

/**
 * The WebGL canvas. Loaded as its own chunk, on the client only, after the page has painted.
 * `high` adds post-processing and more particles; if the frame rate cannot hold, it steps
 * down by itself.
 */
export default function Experience() {
  const quality = useStore((s) => s.quality);
  const [degraded, setDegraded] = useState(false);
  const high = quality === "high" && !degraded;

  return (
    <Canvas
      flat
      dpr={high ? [1, 1.75] : [1, 1.5]}
      gl={{ antialias: quality !== "high", alpha: false, stencil: false, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.05, far: 400, position: [0, 0.1, 7.4] }}
      style={{ touchAction: "pan-y" }}
      onPointerMissed={() => setState({ hovered: null })}
    >
      <color attach="background" args={["#08090d"]} />
      {high && <FrameWatch onSlow={() => setDegraded(true)} />}
      <Progress />
      {import.meta.env.DEV && <DevHandle />}
      <Suspense fallback={null}>
        <UniverseScene high={high} />
        <Ready />
      </Suspense>
      {high && <Effects />}
    </Canvas>
  );
}
