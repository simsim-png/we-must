import type { ReactNode } from "react";
import { useT } from "~/lib/i18n";
import { LLink } from "../ui/LLink";

/** Plain reading layout for legal text. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const t = useT();
  return (
    <article className="gutter min-h-svh pb-28 pt-32 lg:pt-44">
      <div className="mx-auto max-w-[52rem]">
        <LLink to="/" className="link label text-(--muted)">
          <span aria-hidden>←</span> {t({ fr: "Retour à l’univers", en: "Back to the universe" })}
        </LLink>
        <h1 className="display mt-8 text-[clamp(2rem,6vw,5rem)]">{title}</h1>
        <p className="label mt-8 inline-block border border-dashed border-(--line) px-4 py-2 text-(--muted)">
          {t({
            fr: "Modèle à compléter : champs entre crochets, puis validation juridique.",
            en: "Template to complete: bracketed fields, then legal review.",
          })}
        </p>
        <div className="mt-12 grid max-w-[68ch] gap-9 text-lg text-(--muted) [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-(--fg)">
          {children}
        </div>
      </div>
    </article>
  );
}
