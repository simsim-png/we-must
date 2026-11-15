import { useEffect, useRef } from "react";
import { copy } from "~/content/copy";
import { services } from "~/content/services";
import { useT } from "~/lib/i18n";
import { rt } from "~/state/runtime";
import { canExplore, getState, setState, useStore } from "~/state/store";
import { LLink } from "../ui/LLink";

/**
 * Names of the four worlds, pinned under their spheres. They are real links, so the worlds
 * can be reached by keyboard and screen reader, and they open up with a description when a
 * sphere is hovered, focused or tapped.
 */
export function SphereLabels() {
  const t = useT();
  const hovered = useStore((s) => s.hovered);
  const on = useStore((s) => canExplore(s));
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      rt.labels.forEach((label, i) => {
        const el = items.current[i];
        if (!el) return;
        const y = label.up ? label.y - label.r - 10 : label.y + label.r + 10;
        el.style.transform = `translate3d(${label.x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.display = label.visible ? "" : "none";
        if (el.dataset.up !== String(label.up)) el.dataset.up = String(label.up);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const focus = (id: (typeof services)[number]["id"]) => () => {
    if (canExplore()) setState({ hovered: id });
  };
  const blur = (id: (typeof services)[number]["id"]) => () => {
    if (getState().hovered === id) setState({ hovered: null });
  };

  return (
    <nav className="contents" data-on={on} aria-label={t(copy.nav.worlds)}>
      {services.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => {
            items.current[i] = el;
          }}
          className="sphere-label"
          data-hovered={hovered === s.id}
          data-dim={hovered !== null && hovered !== s.id}
        >
          <LLink
            to={`/services/${s.id}`}
            tabIndex={on ? 0 : -1}
            onMouseEnter={focus(s.id)}
            onMouseLeave={blur(s.id)}
            onFocus={focus(s.id)}
            onBlur={blur(s.id)}
          >
            <span className="label block text-(--accent)">{s.num}</span>
            <span className="headline mt-1 block whitespace-nowrap text-[0.8rem] md:text-[0.95rem]">{t(s.name)}</span>
            <span className="more">
              <span className="block overflow-hidden">
                <span className="mx-auto block w-48 pt-2 text-[0.8rem] leading-snug text-(--muted)">{t(s.hook)}</span>
                <span className="label mt-2.5 inline-block border-b border-(--accent) pb-1 text-(--fg)">{t(copy.universe.enter)} →</span>
              </span>
            </span>
          </LLink>
        </div>
      ))}
    </nav>
  );
}
