import { useRef } from "react";
import { workCategories, type Project, type WorkCategory } from "~/content/work";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { FallbackArt } from "../media/FallbackArt";
import { LLink } from "../ui/LLink";

export function WorkCard({ project, className }: { project: Project; className?: string }) {
  const t = useT();
  const preview = useRef<HTMLVideoElement>(null);
  const cats = project.categories.map((c) => t(workCategories.find((w) => w.id === c)!.label)).join(" · ");

  return (
    <LLink
      to={`/work/${project.slug}`}
      data-cursor="view"
      className={cn("group block", className)}
      onPointerEnter={() => preview.current?.play().catch(() => {})}
      onPointerLeave={() => preview.current?.pause()}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-2">
        <img
          src={project.cover.src}
          alt={t(project.cover.alt)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-brand group-hover:scale-[1.04]"
        />
        {project.preview && (
          <video
            ref={preview}
            src={project.preview}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="display text-[clamp(1.3rem,2vw,1.8rem)]">{t(project.title)}</h3>
        <span className="label-mono shrink-0 text-ivory-dim">{project.year}</span>
      </div>
      <p className="label-mono mt-2 text-cobalt-light">{cats}</p>
    </LLink>
  );
}

/** Stand-in for a slot with no real project yet. Labelled as such, never dressed up as work. */
export function WorkPlaceholder({ category, className, index = 0 }: { category: WorkCategory; className?: string; index?: number }) {
  const t = useT();
  const label = t(workCategories.find((w) => w.id === category)!.label);
  const focus: [string, string][] = [["30%", "70%"], ["70%", "30%"], ["50%", "80%"], ["20%", "20%"]];
  return (
    <div className={className}>
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden border border-dashed border-ivory/15 bg-charcoal-2">
        <FallbackArt tone={index % 2 ? "warm" : "cobalt"} focus={focus[index % focus.length]} className="opacity-60" />
        <span className="label-mono relative text-ivory-dim">{t({ fr: "Projet à venir", en: "Project coming soon" })}</span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="display text-[clamp(1.3rem,2vw,1.8rem)] text-ivory-faint">{label}</p>
      </div>
      <p className="label-mono mt-2 text-ivory-faint">{t({ fr: "Emplacement réservé", en: "Placeholder" })}</p>
    </div>
  );
}
