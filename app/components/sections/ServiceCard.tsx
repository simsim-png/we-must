import { useState } from "react";
import type { Service } from "~/content/services";
import { cn } from "~/lib/cn";
import { useCanHover } from "~/lib/hooks";
import { useT } from "~/lib/i18n";
import { LoopVideo } from "../media/LoopVideo";
import { LLink } from "../ui/LLink";

const FOCUS: [string, string][] = [["30%", "30%"], ["75%", "70%"], ["20%", "80%"], ["70%", "25%"], ["50%", "60%"], ["85%", "85%"]];

/**
 * At rest: number, name, one line. On hover or focus the loop plays and the
 * deliverables rise from below a horizon line, the "after" half of the card.
 */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t = useT();
  const canHover = useCanHover();
  const [active, setActive] = useState(false);

  return (
    <LLink
      to={`/services/${service.slug}`}
      className="group relative flex aspect-[4/5] flex-col overflow-hidden bg-charcoal-2"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <LoopVideo
        id={service.media}
        playing={canHover ? active : undefined}
        focus={FOCUS[index % FOCUS.length]}
        className="absolute inset-0 opacity-70 transition-[opacity,transform] duration-700 ease-out-brand group-hover:scale-[1.04] group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />

      <div className="relative flex items-start justify-between p-6 md:p-7">
        <span className="display text-[2.5rem] text-ivory/90">{service.num}</span>
        <span className="label-mono text-ivory-dim">{t({ fr: "Service", en: "Service" })}</span>
      </div>

      <div className="relative mt-auto p-6 md:p-7">
        <h3 className="display text-[clamp(1.4rem,2vw,1.9rem)] leading-[1]">{t(service.title)}</h3>
        <p className="mt-3 max-w-[34ch] text-ivory-dim">{t(service.short)}</p>

        <div className="hidden grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-out-brand group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:hover)]:grid">
          <div className="overflow-hidden">
            <div className="translate-y-6 pt-5 opacity-0 transition-[transform,opacity] duration-700 ease-out-brand group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <div className="mb-4 h-px bg-cobalt" />
              <ul className="label-mono grid gap-1.5 text-cobalt-light">
                {t(service.deliverables).slice(0, 4).map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <span className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-cobalt transition-transform duration-700 ease-brand group-hover:scale-x-100")} />
    </LLink>
  );
}
