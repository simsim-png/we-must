import type { ReactNode } from "react";
import { useT } from "~/lib/i18n";

type Props = { title: string; children: ReactNode };

/** Plain reading layout for legal text. */
export function LegalPage({ title, children }: Props) {
  const t = useT();
  return (
    <article className="container-site pt-36 pb-24 md:pt-48">
      <h1 className="display display-lg max-w-[18ch]">{title}</h1>
      <p className="label-mono mt-8 border border-dashed border-ivory/25 p-4 text-ivory-dim">
        {t({
          fr: "Modèle à compléter : les éléments entre crochets doivent être renseignés et le texte validé par un conseil juridique.",
          en: "Template to complete: bracketed items must be filled in and the text reviewed by a legal adviser.",
        })}
      </p>
      <div className="mt-14 grid max-w-[68ch] gap-10 text-ivory-dim [&_h2]:display [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:text-ivory [&_p+p]:mt-3">
        {children}
      </div>
    </article>
  );
}
