import gsap from "gsap";
import { useEffect } from "react";
import { rt } from "./runtime";
import { setState, useStore, type Quality } from "./store";

/**
 * Decides how much of the experience this device gets.
 * `?lite` in the URL forces the 2D fallback, which is handy for testing it.
 */
function detectQuality(): Quality {
  if (new URLSearchParams(window.location.search).has("lite")) return "none";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return "none";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "none";
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const modest = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return coarse || small || modest ? "low" : "high";
}

/** Runs once on the client: device checks, motion preference, pointer tracking. */
export function useBoot() {
  useEffect(() => {
    (window as unknown as { __wm?: boolean }).__wm = true;
    // Development handle for inspecting and driving the scene from the console.
    if (import.meta.env.DEV) Object.assign(window, { wm: { rt, useStore, gsap } });
    document.documentElement.removeAttribute("data-static");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const apply = () => setState({ reduced: reduce.matches, touch: coarse.matches });
    apply();
    reduce.addEventListener("change", apply);
    coarse.addEventListener("change", apply);
    setState({ quality: detectQuality() });

    const move = (e: PointerEvent) => {
      rt.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      rt.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      reduce.removeEventListener("change", apply);
      coarse.removeEventListener("change", apply);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // World interiors are separate chunks. Fetch them one at a time once the universe is up,
  // so entering a world never waits on the network.
  const ready = useStore((s) => s.ready);
  const quality = useStore((s) => s.quality);
  useEffect(() => {
    if (!ready || quality === "none" || quality === null) return;
    const timers = [1, 2, 3, 4].map((n) => window.setTimeout(() => setState({ preload: n }), 2600 + n * 1300));
    return () => timers.forEach(clearTimeout);
  }, [ready, quality]);
}
