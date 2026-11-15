import type { CSSProperties } from "react";
import { copy } from "~/content/copy";
import { nextService, projectsFor, services, type Service } from "~/content/services";
import { useLang, useT } from "~/lib/i18n";
import { actions } from "~/state/actions";
import { useStore } from "~/state/store";
import { LLink } from "../ui/LLink";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Scene 03 — inside a service world. Four beats, one per stop of the camera: the name and
 * the campaign line, what we do, work from this world, and the way to start a project.
 */
export function WorldOverlay({ service }: { service: Service }) {
  const t = useT();
  const lang = useLang();
  const beat = useStore((s) => s.beat);
  const inside = useStore((s) => s.transit === "inside" && s.service === service.id);
  const work = projectsFor(service.id);
  const next = nextService(service.id);
  const on = (n: number) => inside && beat === n;

  return (
    <section className="scene" data-active={inside} aria-labelledby="world-title">
      <div className="shade" />

      <div className="gutter absolute left-0 top-[4.5rem] md:top-24" data-on={inside}>
        <button type="button" className="btn-line rv !h-10 !px-3.5 backdrop-blur-sm" onClick={() => actions.closeWorld()}>
          <span aria-hidden>←</span> {t(copy.world.back)}
          <kbd className="ml-1 hidden font-mono text-[0.625rem] opacity-60 md:inline">ESC</kbd>
        </button>
      </div>

      <div className="gutter absolute inset-0 flex flex-col justify-end pb-9 lg:justify-center lg:pb-0 lg:pt-10">
        <div className="grid max-w-[36rem]">
          {/* Beat 1: the world's name and its line */}
          <div className="panel" data-on={on(0)}>
            <p className="label rv text-(--accent)">
              {t(copy.world.scene)} — {t(copy.world.label)} {service.num} / 0{services.length}
            </p>
            <h1 id="world-title" className="display rv mt-4 text-[clamp(2.3rem,7vw,6.6rem)] leading-[0.9]" style={i(1)}>
              {t(service.name)}
            </h1>
            <p lang="fr" className="headline rv mt-5 text-[clamp(1.1rem,2.1vw,1.9rem)]" style={i(2)}>
              {service.line}
            </p>
            {lang === "en" && (
              <p className="rv mt-2 text-[0.95rem] italic text-(--muted)" style={i(3)}>
                {service.lineEn}
              </p>
            )}
          </div>

          {/* Beat 2: what we do */}
          <div className="panel" data-on={on(1)}>
            <p className="label rv text-(--accent)">{t(copy.world.capabilities)}</p>
            <p className="rv mt-4 max-w-[46ch] text-base lg:text-lg" style={i(1)}>
              {t(service.text)}
            </p>
            <ul className="rv mt-6 border-t border-(--line)" style={i(2)}>
              {t(service.capabilities).map((c, n) => (
                <li key={c} className="flex items-baseline gap-4 border-b border-(--line) py-2.5 lg:py-3">
                  <span className="label text-(--accent)">0{n + 1}</span>
                  <span className="headline text-base lg:text-xl">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Beat 3: work that came out of this world */}
          <div className="panel" data-on={on(2)}>
            <p className="label rv text-(--accent)">{t(copy.world.work)}</p>
            <ul className="mt-4 grid gap-5">
              {work.slice(0, 2).map((p, n) => (
                <li key={p.slug} className="rv" style={i(n + 1)}>
                  <p className="label text-(--muted)">{t(p.format)}</p>
                  <p lang="fr" className={n === 0 ? "headline mt-1.5 text-[clamp(1.4rem,2.8vw,2.5rem)]" : "headline mt-1.5 text-lg"}>
                    {p.title}
                  </p>
                  {n === 0 && <p className="mt-2 hidden max-w-[44ch] text-[0.95rem] text-(--muted) sm:block">{t(p.summary)}</p>}
                  {p.visual && (
                    <a href={p.visual.ig} target="_blank" rel="noreferrer" className="link label mt-2">
                      {t(copy.world.seeOnInstagram)} <span aria-hidden>↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <LLink to="/#work" className="link label rv mt-6" style={i(3)}>
              {t(copy.world.allWork)} <span aria-hidden>→</span>
            </LLink>
          </div>

          {/* Beat 4: start a project, or keep exploring */}
          <div className="panel" data-on={on(3)}>
            <p className="label rv text-(--accent)">
              {service.num} — {t(service.name)}
            </p>
            <h2 className="display rv mt-4 text-[clamp(1.6rem,4vw,3.6rem)]" style={i(1)}>
              {t(copy.world.ctaTitle)}
            </h2>
            <p className="rv mt-4 max-w-[40ch] text-(--muted)" style={i(2)}>
              {t(copy.world.ctaText)}
            </p>
            <div className="rv mt-6 flex flex-wrap gap-3" style={i(3)}>
              <LLink to="/#contact" className="btn">
                {t(copy.world.cta)}
              </LLink>
              <LLink to={`/services/${next.id}`} className="btn-line">
                {t(copy.world.next)} · {t(next.name)} <span aria-hidden>→</span>
              </LLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
