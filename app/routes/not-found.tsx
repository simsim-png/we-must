import type { MetaFunction } from "react-router";
import { LLink } from "~/components/ui/LLink";
import { useT } from "~/lib/i18n";

export const meta: MetaFunction = () => [{ title: "404 — WeMust" }, { name: "robots", content: "noindex" }];

export default function NotFound() {
  const t = useT();
  return (
    <section className="gutter flex min-h-svh items-center pb-24 pt-32">
      <div>
        <p className="label text-(--accent)">{t({ fr: "Hors de l’univers", en: "Outside the universe" })}</p>
        <p aria-hidden className="display mt-4 text-[min(40vw,52svh)] leading-[0.8] text-cobalt">
          404
        </p>
        <h1 className="headline mt-8 text-[clamp(1.4rem,3.2vw,3rem)]">
          {t({ fr: "Cette page n’existe pas.", en: "This page doesn’t exist." })}{" "}
          <span className="text-(--muted)">{t({ fr: "Pas encore.", en: "Not yet." })}</span>
        </h1>
        <div className="mt-9 flex flex-wrap gap-3">
          <LLink to="/" className="btn">
            {t({ fr: "Retour à l’univers", en: "Back to the universe" })}
          </LLink>
          <LLink to="/#work" className="btn-line">
            {t({ fr: "Voir les travaux", en: "See the work" })}
          </LLink>
        </div>
      </div>
    </section>
  );
}
