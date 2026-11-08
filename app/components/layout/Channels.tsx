import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { site, whatsappUrl } from "~/lib/site";

/** Direct contact channels. Missing details render as clearly marked placeholders. */
export function Channels({ className }: { className?: string }) {
  const t = useT();
  const pending = t({ fr: "À compléter", en: "To be added" });
  const rows = [
    { label: "WhatsApp", value: site.whatsapp ? `+${site.whatsapp}` : pending, href: whatsappUrl(t({ fr: "Bonjour WeMust, j’ai un projet.", en: "Hello WeMust, I have a project." })) },
    { label: "Instagram", value: site.instagramHandle, href: site.instagram },
    { label: "LinkedIn", value: "WeMust Agency", href: site.linkedin },
    { label: "Email", value: site.email || pending, href: site.email ? `mailto:${site.email}` : "" },
    { label: t({ fr: "Studio", en: "Studio" }), value: t({ fr: "Casablanca, Maroc", en: "Casablanca, Morocco" }), href: "" },
  ];
  return (
    <ul className={cn("border-t border-ivory/12", className)}>
      {rows.map((row) => {
        const placeholder = row.value === pending;
        const content = (
          <>
            <span className="label-mono w-28 shrink-0 pt-1 text-ivory-dim">{row.label}</span>
            <span className={cn("flex-1 text-lg", placeholder && "label-mono pt-1 text-ivory-faint")}>{row.value}</span>
            {row.href && (
              <ArrowUpRight aria-hidden className="size-5 shrink-0 text-ivory-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory" />
            )}
          </>
        );
        return (
          <li key={row.label} className="border-b border-ivory/12">
            {row.href ? (
              <a href={row.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 py-5">
                {content}
              </a>
            ) : (
              <div className="flex items-start gap-4 py-5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
