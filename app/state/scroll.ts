import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";
import { rt } from "./runtime";

// Scroll is the playhead of the film. A tall, empty "track" element gives the page its
// length; ScrollTrigger turns the scroll position into a smoothed 0 → 1 progress value and
// settles on the nearest scene when the visitor stops.

let registered = false;
function register() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

type Track = { trigger: ScrollTrigger; steps: number };
let current: Track | null = null;

type Options = {
  /** Which runtime value this track drives. */
  key: "u" | "w";
  /** Number of scenes along the track. */
  steps: number;
  onStep: (index: number) => void;
  reduced: boolean;
};

export function useScrollTrack(ref: RefObject<HTMLElement | null>, { key, steps, onStep, reduced }: Options) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    register();

    let last = -1;
    const report = () => {
      const i = Math.round(rt[key] * (steps - 1));
      if (i !== last) {
        last = i;
        onStep(i);
      }
    };
    const tween = gsap.fromTo(rt, { [key]: 0 }, { [key]: 1, ease: "none", paused: true, onUpdate: report });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      animation: tween,
      scrub: reduced ? true : 0.85,
      snap: reduced
        ? undefined
        : {
            // Settle on the nearest scene, leaning in the direction of travel: a quarter of a
            // screen is enough to move on, but landing exactly on a scene never overshoots it.
            snapTo: (progress, self) => {
              const at = progress * (steps - 1) + (self?.direction ?? 0) * 0.28;
              return Math.min(steps - 1, Math.max(0, Math.round(at))) / (steps - 1);
            },
            duration: { min: 0.25, max: 0.9 },
            delay: 0.16,
            ease: "power2.inOut",
          },
    });
    current = { trigger, steps };
    report();

    return () => {
      if (current?.trigger === trigger) current = null;
      trigger.kill();
      tween.kill();
    };
  }, [ref, key, steps, onStep, reduced]);
}

/** Scrolls the current track to one of its scenes. */
export function scrollToStep(index: number, immediate = false) {
  if (!current) return;
  const { trigger, steps } = current;
  const y = trigger.start + (trigger.end - trigger.start) * (index / (steps - 1));
  if (immediate) {
    gsap.killTweensOf(window);
    window.scrollTo(0, y);
    ScrollTrigger.update();
    return;
  }
  const screens = Math.abs(window.scrollY - y) / Math.max(1, window.innerHeight);
  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration: Math.min(2.8, 0.9 + screens * 0.3),
    ease: "power2.inOut",
    overwrite: true,
  });
}

/** Freezes page scrolling during the intro and while the camera is in flight. */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
