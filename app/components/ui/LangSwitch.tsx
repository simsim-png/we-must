import { Link, useLocation } from "react-router";
import { cn } from "~/lib/cn";
import { langFromPath, localize, stripLang } from "~/lib/i18n";
import type { Lang } from "~/lib/types";

const langs: { id: Lang; label: string; name: string }[] = [
  { id: "fr", label: "FR", name: "Français" },
  { id: "en", label: "EN", name: "English" },
];

export function LangSwitch({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const current = langFromPath(pathname);
  const base = stripLang(pathname);
  return (
    <div className={cn("label flex items-center", className)}>
      {langs.map((l) => (
        <Link
          key={l.id}
          to={localize(base, l.id)}
          hrefLang={l.id}
          lang={l.id}
          aria-label={l.name}
          aria-current={current === l.id ? "true" : undefined}
          className={cn("px-1.5 py-3 transition-opacity", current === l.id ? "opacity-100" : "opacity-45 hover:opacity-100")}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
