import { useEffect, useRef } from "react";
import { Monogram } from "~/components/brand/Monogram";
import { copy } from "~/content/copy";
import { useT } from "~/lib/i18n";
import { playEmerge } from "~/state/director";
import { getState, setState, useStore } from "~/state/store";

/**
 * Loading screen. It is part of the prerendered HTML, so it is on screen before any script
 * runs. The progress bar is the logo's own horizon: the line between the M and the W grows
 * across the screen as the universe loads.
 */
export function Loader() {
  const t = useT();
  const ready = useStore((s) => s.ready);
  const lifted = useStore((s) => s.lifted);
  const count = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);

  // A fresh scene (first visit, or coming back from a text page) starts behind the curtain.
  useEffect(() => {
    if (!ready) setState({ lifted: false });
  }, [ready]);

  useEffect(() => {
    if (lifted) return;
    let frame = 0;
    let timer = 0;
    let shown = 0;
    const start = performance.now();
    let last = start;
    const tick = (now: number) => {
      const s = getState();
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      // Creeps forward while the 3D chunk downloads, then follows the real texture progress.
      const creep = Math.min(0.32, (now - start) / 5000);
      const target = s.ready ? 1 : Math.min(0.94, creep + s.progress * 0.6);
      shown += (target - shown) * (1 - Math.exp(-(s.ready ? 9 : 3) * dt));
      if (s.ready && shown > 0.992) shown = 1;
      if (count.current) count.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      if (line.current) line.current.style.transform = `scaleX(${shown})`;
      if (shown < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      timer = window.setTimeout(() => {
        setState({ lifted: true });
        if (!getState().entered) playEmerge();
      }, 320);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [lifted]);

  return (
    <div className="loader" data-gone={lifted} role="status" aria-live="polite" aria-hidden={lifted}>
      <div ref={line} className="absolute inset-x-0 top-1/2 h-px origin-center bg-cobalt-soft" style={{ transform: "scaleX(0)" }} />
      <Monogram className="relative w-14 md:w-16" />
      <div className="absolute inset-x-0 top-[calc(50%+4.25rem)] text-center">
        <span ref={count} className="display text-xl tabular-nums md:text-2xl">000</span>
        <p className="label mt-3 text-ivory/55" style={{ animation: "loader-pulse 2.4s ease-in-out infinite" }}>
          {t(copy.loader)}
        </p>
      </div>
      <p className="label gutter absolute left-0 top-6 text-ivory/55">WeMust</p>
      <p className="label gutter absolute right-0 top-6 text-ivory/55">Casablanca</p>
    </div>
  );
}
