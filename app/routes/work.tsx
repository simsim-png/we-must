import { useState } from "react";
import type { MetaFunction } from "react-router";
import { Reveal } from "~/components/motion/Reveal";
import { FinalCta } from "~/components/sections/FinalCta";
import { PageHero } from "~/components/sections/PageHero";
import { WorkCard, WorkPlaceholder } from "~/components/sections/WorkCard";
import { Button } from "~/components/ui/Button";
import { projects, workCategories, type WorkCategory } from "~/content/work";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { seo } from "~/lib/seo";
import { site } from "~/lib/site";

export const meta: MetaFunction = ({ location }) =>
  seo({
    pathname: location.pathname,
    title: { fr: "Travaux", en: "Work" },
    description: {
      fr: "Projets de branding, shooting, campagnes sociales et expériences digitales réalisés par WeMust.",
      en: "Branding, photo and video, social campaigns and digital experiences by WeMust.",
    },
  });

export default function Work() {
  const t = useT();
  const [filter, setFilter] = useState<WorkCategory | "all">("all");
  const shown = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const filters = [{ id: "all" as const, label: { fr: "Tout", en: "All" } }, ...workCategories];

  return (
    <>
      <PageHero
        label={t({ fr: "Travaux", en: "Work" })}
        title={t({ fr: "Tout le reste, flou.", en: "Everything else, blurred." })}
        reflection={t({ fr: "Votre travail, net.", en: "Your work, in focus." })}
      />

      <section className="container-site pb-section">
        <div role="group" aria-label={t({ fr: "Filtrer par catégorie", en: "Filter by category" })} className="mb-14 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "label-mono border px-4 py-2.5 transition-colors",
                filter === f.id ? "border-ivory bg-ivory text-charcoal" : "border-ivory/25 text-ivory-dim hover:border-ivory hover:text-ivory",
              )}
            >
              {t(f.label)}
            </button>
          ))}
        </div>

        {shown.length > 0 ? (
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.1} className={i % 2 ? "md:mt-32" : ""}>
                <WorkCard project={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {(filter === "all" ? workCategories.map((c) => c.id) : [filter]).map((c, i) => (
                <Reveal key={c} delay={(i % 2) * 0.1} className={i % 2 ? "md:mt-32" : ""}>
                  <WorkPlaceholder category={c} index={i} />
                </Reveal>
              ))}
            </div>
            <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory/12 pt-8 md:flex-row md:items-center">
              <p className="max-w-[52ch] text-ivory-dim">
                {t({
                  fr: "Nos études de cas sont en préparation. Nos dernières créations sont visibles sur Instagram.",
                  en: "Our case studies are in preparation. Our latest work is on Instagram.",
                })}
              </p>
              <Button href={site.instagram} variant="ghost">{site.instagramHandle}</Button>
            </div>
          </>
        )}
      </section>
      <FinalCta />
    </>
  );
}
