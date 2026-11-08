import { projects, type WorkCategory } from "~/content/work";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { site } from "~/lib/site";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";
import { SectionHead } from "../ui/SectionHead";
import { WorkCard, WorkPlaceholder } from "./WorkCard";

// Staggered editorial grid: wide, narrow (dropped), narrow, wide (dropped).
const slots = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5", "md:col-span-7 md:mt-40"];
const placeholderCategories: WorkCategory[] = ["branding", "shooting", "social", "web"];

export function SelectedWork() {
  const t = useT();
  const featured = projects.slice(0, 4);

  return (
    <section className="container-site py-section">
      <SectionHead
        label={t({ fr: "Projets choisis", en: "Selected work" })}
        title={t({ fr: "Votre travail, net.", en: "Your work, in focus." })}
      />
      <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
        {slots.map((slot, i) => (
          <Reveal key={i} className={cn(slot)} delay={(i % 2) * 0.1}>
            {featured[i] ? (
              <WorkCard project={featured[i]} />
            ) : (
              <WorkPlaceholder category={placeholderCategories[i]} index={i} />
            )}
          </Reveal>
        ))}
      </div>
      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory/12 pt-8 md:flex-row md:items-center">
        <p className="max-w-[52ch] text-ivory-dim">
          {featured.length === 0
            ? t({
                fr: "Nos études de cas arrivent ici. En attendant, nos dernières créations sont sur Instagram.",
                en: "Our case studies will appear here. In the meantime, our latest work is on Instagram.",
              })
            : t({ fr: "Branding, shooting, campagnes sociales et expériences digitales.", en: "Branding, shoots, social campaigns and digital experiences." })}
        </p>
        <div className="flex flex-wrap gap-3">
          {featured.length > 0 && <Button to="/work">{t({ fr: "Tous les projets", en: "All work" })}</Button>}
          <Button href={site.instagram} variant="ghost">{site.instagramHandle}</Button>
        </div>
      </div>
    </section>
  );
}
