import { useEffect, useRef } from "react";
import { Monogram } from "~/components/brand/Monogram";
import { getService, projectsFor, services } from "~/content/services";
import { realProjects, type ServiceId } from "~/content/work";
import { cn } from "~/lib/cn";
import { actions } from "~/state/actions";
import { easeOutCubic, sat, WORK_COUNT } from "~/state/layout";
import { rt } from "~/state/runtime";
import { canExplore, getState, setState, useStore } from "~/state/store";

// The universe without WebGL (old or locked-down devices, or `?lite` in the URL).
// Same idea, drawn with CSS: the monogram on its horizon and the four worlds as discs on an
// elliptical orbit. The interface on top is exactly the same, so nothing is lost but depth.

const DISC: Record<ServiceId, string> = {
  branding: "radial-gradient(circle at 34% 28%, #ffffff 0%, #f2eee5 42%, #cbc3ae 100%)",
  shooting: "radial-gradient(circle at 34% 28%, #5a3d1e 0%, #15120f 46%, #050506 100%)",
  social: "radial-gradient(circle at 34% 28%, #98a6ff 0%, #304bff 50%, #1626b8 100%)",
  web: "radial-gradient(circle at 34% 28%, #2a3696 0%, #0e1240 55%, #090a1c 100%)",
};
const WORLD_BG: Record<ServiceId, string> = { branding: "#f2eee5", shooting: "#08080a", social: "#304bff", web: "#0a0d2c" };

export function FallbackUniverse() {
  const discs = useRef<(HTMLButtonElement | null)[]>([]);
  const mark = useRef<HTMLDivElement>(null);
  const horizon = useRef<HTMLDivElement>(null);
  const transit = useStore((s) => s.transit);
  const serviceId = useStore((s) => s.service);
  const station = useStore((s) => s.station);
  const view = useStore((s) => s.view);
  const hovered = useStore((s) => s.hovered);
  const inside = view === "world" && transit === "inside" && !!serviceId;
  const service = getService(serviceId);

  useEffect(() => {
    setState({ ready: true, progress: 1 });
    return () => setState({ ready: false });
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let phase = rt.phase;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = getState();
      if (!s.reduced && !s.hovered) phase += dt * 0.11;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const portrait = h > w;
      const cx = w / 2;
      const cy = h * (portrait ? 0.4 : 0.46);
      const rx = portrait ? w * 0.31 : Math.min(w * 0.34, 470);
      const ry = portrait ? h * 0.25 : rx * 0.34;
      const grow = easeOutCubic(sat((rt.reveal - 0.15) / 0.7));
      for (let i = 0; i < 4; i++) {
        const a = phase + (i * Math.PI) / 2;
        const depth = Math.sin(a);
        const r = (portrait ? 30 : 44) * (0.82 + 0.18 * depth) * Math.max(0.001, grow);
        const x = cx + rx * Math.cos(a) * grow;
        const y = cy + ry * Math.sin(a) * grow;
        const el = discs.current[i];
        if (el) {
          el.style.transform = `translate3d(${x - r}px, ${y - r}px, 0)`;
          el.style.width = el.style.height = `${r * 2}px`;
          el.style.zIndex = depth > 0 ? "3" : "1";
        }
        const label = rt.labels[i];
        label.x = x;
        label.y = y;
        label.r = r;
        label.visible = grow > 0.5;
        label.up = depth < -0.2;
      }
      // The monogram sits higher during the opening, then settles at the centre of the orbit.
      // The horizon line always runs through the gap between its two letters.
      const top = `${(portrait ? 40 : 46) - 13 * (1 - sat(rt.reveal))}%`;
      if (mark.current) {
        mark.current.style.opacity = String(sat(rt.emerge * 1.4));
        mark.current.style.transform = `translate(-50%, -50%) scale(${0.72 + 0.28 * (1 - sat(rt.reveal))})`;
        mark.current.style.top = top;
      }
      if (horizon.current) {
        horizon.current.style.top = top;
        horizon.current.style.opacity = String(sat(rt.emerge * 1.4));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // A still of the relevant campaign stands in for the 3D frame.
  const project =
    inside && serviceId ? projectsFor(serviceId)[0] : view === "home" && station >= 1 && station <= WORK_COUNT ? realProjects[station - 1] : null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#08090d]" aria-hidden>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 42% at 50% 46%, rgb(21 26 77 / 0.9) 0%, rgb(16 17 22 / 0) 70%)" }} />
      <div ref={horizon} className="absolute inset-x-0 z-[2] -mt-px" style={{ opacity: 0 }}>
        <div
          className="h-px"
          style={{ background: "linear-gradient(90deg, transparent, #7a8bff 30%, #f2eee5 50%, #7a8bff 70%, transparent)", animation: "halo-breathe 6s ease-in-out infinite" }}
        />
      </div>
      <div ref={mark} className="absolute left-1/2 z-[2] w-[min(26vw,9.5rem)]" style={{ opacity: 0 }}>
        <Monogram className="w-full" />
      </div>

      {services.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => {
            discs.current[i] = el;
          }}
          type="button"
          tabIndex={-1}
          onClick={() => canExplore() && actions.openWorld(s.id)}
          onMouseEnter={() => canExplore() && setState({ hovered: s.id })}
          onMouseLeave={() => getState().hovered === s.id && setState({ hovered: null })}
          className={cn(
            "absolute left-0 top-0 rounded-full border transition-[box-shadow,opacity] duration-500",
            s.id === "web" || s.id === "shooting" ? "border-cobalt-soft/50" : "border-ivory/40",
            hovered && hovered !== s.id && "opacity-50",
          )}
          style={{
            background: DISC[s.id],
            boxShadow: hovered === s.id ? "0 0 46px 6px rgb(122 139 255 / 0.55)" : "0 0 26px 0 rgb(48 75 255 / 0.25)",
          }}
        />
      ))}

      {/* Inside a world: its colour takes over the screen. */}
      <div
        className="absolute inset-0 z-[5] transition-opacity duration-700"
        style={{ background: service ? WORLD_BG[service.id] : "transparent", opacity: inside ? 1 : 0 }}
      />

      {project?.visual && (
        <picture key={project.slug} className="absolute inset-x-0 top-[12svh] z-[6] flex justify-center lg:inset-x-auto lg:right-[9vw] lg:top-1/2 lg:-translate-y-1/2">
          <source srcSet={`${project.visual.src}.avif`} type="image/avif" />
          <img
            src={`${project.visual.src}.jpg`}
            alt=""
            onError={(e) => {
              // Never show a broken-image icon: without the file, the frame simply stays out.
              const picture = e.currentTarget.parentElement;
              if (picture) picture.style.display = "none";
            }}
            width={project.visual.w}
            height={project.visual.h}
            className="h-[38svh] w-auto border border-ivory/30 lg:h-[66svh]"
          />
        </picture>
      )}
    </div>
  );
}
