import { useEffect, type CSSProperties } from "react";
import { copy } from "~/content/copy";
import { useT } from "~/lib/i18n";
import { enterUniverse } from "~/state/director";
import { useStore } from "~/state/store";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Scene 01 — Enter the universe. The monogram assembles in the dark above; the name, the
 * line and the invitation come into focus under it. Clicking, scrolling, swiping up or
 * pressing a key all count as "enter".
 */
export function IntroScene() {
  const t = useT();
  const lifted = useStore((s) => s.lifted);
  const entered = useStore((s) => s.entered);
  const active = lifted && !entered;

  useEffect(() => {
    if (!active) return;
    let startY = 0;
    const wheel = (e: WheelEvent) => {
      if (e.deltaY > 6) enterUniverse();
    };
    const touchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const touchMove = (e: TouchEvent) => {
      if (startY - e.touches[0].clientY > 28) enterUniverse();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") enterUniverse();
    };
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("keydown", key);
    };
  }, [active]);

  return (
    <section className="scene" data-active={active} data-on={active} aria-labelledby="intro-title">
      <div className="absolute inset-x-0 bottom-0 top-[54%] flex flex-col items-center px-5 text-center">
        <h1 id="intro-title" className="display rv text-[clamp(2.5rem,min(11vw,14svh),10.5rem)] leading-[0.88]" style={delay(1500)}>
          We Must
          <span className="sr-only"> — {t(copy.baseline)}</span>
        </h1>
        <p className="headline rv mt-[2.2svh] max-w-[30ch] text-[clamp(0.9rem,1.55vw,1.4rem)]" style={delay(1900)}>
          {t(copy.tagline)}
        </p>
        <p className="label rv mt-2.5 text-(--muted)" style={delay(2100)}>
          {t(copy.taglineEcho)}
        </p>
        <button type="button" className="btn rv mt-[3.6svh]" style={delay(2500)} onClick={enterUniverse}>
          {t(copy.intro.enter)}
        </button>
        <p className="label rv mt-3.5 hidden text-(--muted) sm:block" style={delay(2800)}>
          {t(copy.intro.hint)}
        </p>
      </div>
    </section>
  );
}
