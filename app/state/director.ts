import gsap from "gsap";
import type { ServiceId } from "~/content/work";
import { dockPhase } from "./layout";
import { rt, SERVICE_IDS } from "./runtime";
import { getState, setState, type View } from "./store";

// The director runs every timed transition of the film: the opening, entering a world and
// coming back. It only animates numbers in `rt`; the scene and the interface follow them.

const ENTER_SECONDS = 3;
const EXIT_SECONDS = 2.4;

let timeline: gsap.core.Timeline | null = null;
let phaseTween: gsap.core.Tween | null = null;

function stop() {
  timeline?.kill();
  timeline = null;
  phaseTween?.kill();
  phaseTween = null;
}

/** Scene 01: the monogram assembles out of the dark and the horizon between M and W ignites. */
export function playEmerge() {
  const { reduced } = getState();
  gsap.killTweensOf(rt, "emerge");
  gsap.to(rt, { emerge: 1, duration: reduced ? 0.01 : 3.4, ease: "power2.inOut" });
}

/** "Enter the universe": the camera pulls back and the four worlds leave the core for their orbits. */
export function enterUniverse() {
  const s = getState();
  if (s.entered || !s.ready) return;
  setState({ entered: true });
  gsap.killTweensOf(rt, "emerge,reveal");
  gsap.to(rt, { emerge: 1, duration: 0.5, ease: "power2.out" });
  gsap.to(rt, {
    reveal: 1,
    duration: s.reduced ? 0.01 : 3.8,
    ease: "power2.inOut",
    onUpdate: () => {
      if (rt.reveal > 0.72 && !getState().arrived) setState({ arrived: true });
    },
    onComplete: () => setState({ arrived: true }),
  });
}

/** Deep links and return visits land directly in the universe. */
export function skipIntro() {
  gsap.killTweensOf(rt, "emerge,reveal");
  rt.emerge = 1;
  rt.reveal = 1;
  setState({ entered: true, arrived: true });
}

/** Fly to a sphere, let it grow around the camera, then hand over to the world's own scroll. */
export function goWorld(id: ServiceId, instant = false) {
  const s = getState();
  const index = SERVICE_IDS.indexOf(id);
  stop();
  rt.w = 0;
  setState({ hovered: null, beat: 0 });

  if (instant) {
    rt.service = id;
    rt.orbitSpeed = 0;
    rt.phase = dockPhase(index, rt.phase);
    rt.enter = 1;
    rt.flash = 0;
    setState({ transit: "inside" });
    return;
  }

  setState({ transit: "entering" });
  const tl = (timeline = gsap.timeline());

  if (s.reduced) {
    // Reduced motion: no flight. Fade through, swap, fade back.
    tl.to(rt, { flash: 1, duration: 0.3, ease: "power1.in" });
    tl.add(() => {
      rt.service = id;
      rt.orbitSpeed = 0;
      rt.phase = dockPhase(index, rt.phase);
      rt.enter = 1;
      setState({ transit: "inside" });
    });
    tl.to(rt, { flash: 0, duration: 0.5, ease: "power1.out" });
    return;
  }

  if (rt.service && rt.service !== id && rt.enter > 0.02) {
    // Already inside another world: back out until the universe shows, then go again.
    tl.to(rt, { enter: 0, duration: 1.3 * rt.enter, ease: "power1.inOut" });
  }
  tl.addLabel("fly");
  tl.add(() => {
    rt.service = id;
    // The whole system turns to bring the chosen world to the front.
    phaseTween = gsap.to(rt, { phase: dockPhase(index, rt.phase), duration: 1.6, ease: "power2.inOut" });
  }, "fly");
  tl.to(rt, { orbitSpeed: 0, duration: 0.5, ease: "power2.out" }, "fly");
  tl.to(rt, { enter: 1, duration: ENTER_SECONDS, ease: "none" }, "fly");
  // The camera crosses the sphere's surface around 78 % of the way in.
  tl.to(rt, { flash: 1, duration: 0.4, ease: "power2.in" }, `fly+=${ENTER_SECONDS * 0.65}`);
  tl.to(rt, { flash: 0, duration: 0.7, ease: "power2.out" }, `fly+=${ENTER_SECONDS * 0.79}`);
  tl.add(() => setState({ transit: "inside" }), `fly+=${ENTER_SECONDS * 0.9}`);
}

/** Back to the universe: the reverse flight. */
export function leaveWorld(instant = false) {
  const s = getState();
  stop();
  rt.u = 0;

  if (instant || !rt.service || rt.enter < 0.001) {
    rt.enter = 0;
    rt.service = null;
    rt.orbitSpeed = 1;
    rt.flash = 0;
    setState({ transit: "idle", beat: 0 });
    return;
  }

  setState({ transit: "exiting" });
  const tl = (timeline = gsap.timeline());

  if (s.reduced) {
    tl.to(rt, { flash: 1, duration: 0.3, ease: "power1.in" });
    tl.add(() => {
      rt.enter = 0;
      rt.service = null;
      rt.orbitSpeed = 1;
      setState({ transit: "idle", beat: 0 });
    });
    tl.to(rt, { flash: 0, duration: 0.5, ease: "power1.out" });
    return;
  }

  const d = EXIT_SECONDS * rt.enter;
  tl.to(rt, { enter: 0, duration: d, ease: "none" }, 0);
  tl.to(rt, { flash: 0.85, duration: d * 0.13, ease: "power2.in" }, d * 0.08);
  tl.to(rt, { flash: 0, duration: d * 0.3, ease: "power2.out" }, d * 0.22);
  tl.to(rt, { orbitSpeed: 1, duration: 1.4, ease: "power2.in" }, d * 0.55);
  tl.add(() => setState({ transit: "idle", beat: 0 }), d * 0.78);
  tl.add(() => {
    rt.service = null;
  }, d);
}

/** Keeps the 3D scene in step with the URL. Called whenever the route (or readiness) changes. */
export function syncRoute(view: View, service: ServiceId | null, instant: boolean) {
  if (view === "world" && service) {
    if (rt.service !== service || rt.enter < 1) goWorld(service, instant);
  } else if (rt.service || rt.enter > 0 || getState().transit !== "idle") {
    leaveWorld(instant || view === "page");
  }
}
