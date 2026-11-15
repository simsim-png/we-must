import type { CSSProperties } from "react";
import { approach } from "~/content/approach";
import { copy } from "~/content/copy";
import { useT } from "~/lib/i18n";
import { STATION } from "~/state/layout";
import { useStore } from "~/state/store";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Scene 05 — About WE MUST. The camera sits close on the monogram; the manifesto beside it. */
export function AboutScene() {
  const t = useT();
  const active = useStore((s) => s.arrived && s.transit === "idle" && s.station === STATION.about);

  return (
    <section id="about" className="scene" data-active={active} data-on={active} aria-labelledby="about-title">
      <div className="shade" />
      <div className="gutter absolute inset-0 flex flex-col justify-end pb-9 lg:justify-center lg:pb-0 lg:pt-16">
        <div className="max-w-[40rem]">
          <p className="label rv text-(--accent)">
            {t(copy.about.scene)} — {t(copy.about.title)}
          </p>
          <h2 id="about-title" className="display rv mt-5 text-[clamp(1.6rem,4.3vw,4.2rem)]" style={i(1)}>
            <span className="block">{copy.about.statement[0]}</span>
            <span className="block text-cobalt-soft">{copy.about.statement[1]}</span>
          </h2>
          <p lang="fr" className="headline rv mt-3 text-[0.95rem] text-(--muted) lg:text-lg" style={i(2)}>
            {copy.tagline.fr}
          </p>
          <p className="rv mt-5 max-w-[54ch] text-[0.95rem] text-(--muted) lg:text-base" style={i(3)}>
            {t(copy.about.body)}
          </p>
          <blockquote className="rv mt-5 hidden border-l border-(--accent) pl-4 sm:block" style={i(4)}>
            <p className="headline text-base lg:text-lg">“{copy.about.quote}”</p>
            <cite className="label mt-1.5 block not-italic text-(--muted)">{t(copy.about.quoteSource)}</cite>
          </blockquote>
        </div>
        <div className="rv mt-6 max-w-[34rem] lg:mt-9 2xl:max-w-[56rem]" style={i(5)}>
          <p className="label text-(--muted)">{t(copy.about.approach)}</p>
          <ol className="mt-3 grid grid-cols-4 gap-x-4 border-t border-(--line) pt-4 lg:gap-x-8">
            {approach.map((step) => (
              <li key={step.num}>
                <span className="label text-(--accent)">0{step.num}</span>
                <p className="headline mt-1 text-[0.8rem] lg:text-[0.95rem]">{t(step.title)}</p>
                <p className="mt-1 hidden text-sm text-(--muted) 2xl:block">{t(step.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
