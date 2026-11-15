import type { CSSProperties } from "react";
import { copy } from "~/content/copy";
import { useT } from "~/lib/i18n";
import { useStore } from "~/state/store";

/** Scene 02 — The Creative Universe. Kept to a corner: here the picture is the navigation. */
export function UniverseOverlay() {
  const t = useT();
  const active = useStore((s) => s.arrived && s.transit === "idle" && s.station === 0);
  const touch = useStore((s) => s.touch);

  return (
    <section id="universe" className="scene" data-active={active} data-on={active} aria-labelledby="universe-title">
      <div className="gutter absolute bottom-0 left-0 max-w-md pb-6 md:pb-9">
        <p className="label rv text-(--accent)">{t(copy.universe.scene)}</p>
        <h2 id="universe-title" className="display rv mt-3 text-[clamp(1.3rem,2.5vw,2.3rem)]" style={{ "--i": 1 } as CSSProperties}>
          {t(copy.universe.title)}
        </h2>
        <p className="rv mt-3 max-w-[36ch] text-[0.95rem] text-(--muted)" style={{ "--i": 2 } as CSSProperties}>
          {t(copy.universe.text)}
        </p>
        <p className="label rv mt-4 hidden text-(--muted) md:block" style={{ "--i": 3 } as CSSProperties}>
          {t(touch ? copy.universe.hintTouch : copy.universe.hintMouse)}
        </p>
      </div>
    </section>
  );
}
