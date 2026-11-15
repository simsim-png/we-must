import type { CSSProperties } from "react";
import { copy } from "~/content/copy";
import { serviceName } from "~/content/services";
import { realProjects } from "~/content/work";
import { useLang, useT } from "~/lib/i18n";
import { WORK_COUNT } from "~/state/layout";
import { useStore } from "~/state/store";

const projects = realProjects.slice(0, WORK_COUNT);
const pad = (n: number) => String(n).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Scene 04 — Selected Work. One campaign per stop of the camera: the picture fills one side
 * of the screen, its words take the other. Everything shown is WE MUST's own published work.
 */
export function WorkScene() {
  const t = useT();
  const lang = useLang();
  const station = useStore((s) => s.station);
  const open = useStore((s) => s.arrived && s.transit === "idle");
  const active = open && station >= 1 && station <= WORK_COUNT;

  return (
    <section id="work" className="scene" data-active={active} aria-label={t(copy.work.title)}>
      <div className="shade" />
      <div className="gutter absolute inset-0 flex flex-col justify-end pb-9 lg:justify-center lg:pb-0">
        <div className="grid max-w-[34rem]">
          {projects.map((p, n) => (
            <article key={p.slug} className="panel" data-on={active && station === n + 1}>
              <p className="label rv text-(--accent)">
                {t(copy.work.scene)} — {t(copy.work.title)}
              </p>
              <p className="label rv mt-5 flex flex-wrap gap-x-4 gap-y-1 lg:mt-8" style={i(1)}>
                <span>
                  {pad(n + 1)} / {pad(projects.length)}
                </span>
                <span className="text-(--muted)">
                  {t(p.format)} · {p.services.map((s) => t(serviceName(s))).join(" · ")}
                </span>
              </p>
              <h2 lang="fr" className="headline rv mt-3 text-[clamp(1.55rem,3.5vw,3.3rem)]" style={i(2)}>
                {p.title}
              </h2>
              {lang === "en" && (
                <p className="rv mt-2 text-[0.95rem] italic text-(--muted)" style={i(3)}>
                  {p.titleEn}
                </p>
              )}
              <p className="rv mt-4 max-w-[46ch] text-[0.95rem] text-(--muted) lg:text-base" style={i(4)}>
                {t(p.summary)}
              </p>
              {p.visual && (
                <a href={p.visual.ig} target="_blank" rel="noreferrer" className="link label rv mt-5" style={i(5)}>
                  {t(copy.work.view)} <span aria-hidden>↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
