import { Link, useLocation } from "react-router";
import { cn } from "~/lib/cn";
import { langFromPath, localize, stripLang } from "~/lib/i18n";
import type { Lang } from "~/lib/types";

export function LangSwitch({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const current = langFromPath(pathname);
  const base = stripLang(pathname);
  const langs: { id: Lang; label: string; name: string }[] = [
    { id: "fr", label: "FR", name: "Français" },
    { id: "en", label: "EN", name: "English" },
  ];
  return (
    <div className={cn("label-mono flex items-center gap-1", className)}>
      {langs.map((l, i) => (
        <span key={l.id} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-ivory-faint">/</span>}
          <Link
            to={localize(base, l.id)}
            hrefLang={l.id}
            lang={l.id}
            aria-label={l.name}
            aria-current={current === l.id ? "true" : undefined}
            className={cn("px-1 py-2 transition-colors", current === l.id ? "text-ivory" : "text-ivory-faint hover:text-ivory")}
          >
            {l.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
