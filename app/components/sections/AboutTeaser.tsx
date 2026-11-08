import { useT } from "~/lib/i18n";
import type { L } from "~/lib/types";
import { Monogram } from "../brand/Monogram";
import { LoopVideo } from "../media/LoopVideo";
import { FocusText } from "../motion/FocusText";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";

export const principles: { title: L; text: L }[] = [
  {
    title: { fr: "La clarté d’abord", en: "Clarity first" },
    text: {
      fr: "Avant le style, l’idée. Une marque qu’on comprend en une seconde vaut mieux qu’une marque qu’on admire sans la retenir.",
      en: "Idea before style. A brand understood in one second beats a brand admired and forgotten.",
    },
  },
  {
    title: { fr: "L’image comme standard", en: "Image as the standard" },
    text: {
      fr: "Chaque visuel, chaque vidéo, chaque écran est traité avec la même exigence. Rien n’est « juste pour les réseaux ».",
      en: "Every visual, every video, every screen gets the same care. Nothing is “just for social”.",
    },
  },
  {
    title: { fr: "Partenaires, pas prestataires", en: "Partners, not vendors" },
    text: {
      fr: "Nous nous engageons sur votre objectif, pas seulement sur un livrable. Nous disons ce que nous pensons, même quand c’est inattendu.",
      en: "We commit to your goal, not just a deliverable. We say what we think, even when it’s unexpected.",
    },
  },
];

/** The page's one ivory section, mirroring the light post in the Instagram grid. */
export function AboutTeaser() {
  const t = useT();
  return (
    <section className="bg-ivory text-charcoal">
      <div className="container-site py-section">
        <div className="mb-16 flex items-center justify-between">
          <p className="label-mono text-charcoal/60"><span className="text-cobalt">—</span> {t({ fr: "À propos", en: "About" })}</p>
          <Monogram variant="dark" className="w-7" />
        </div>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <FocusText
              as="h2"
              className="display display-lg"
              text={t({ fr: "Les clients ne voient que le reflet.", en: "Clients only see the reflection." })}
            />
            <FocusText
              as="p"
              delay={0.3}
              className="display display-lg mt-2 text-cobalt"
              text={t({ fr: "On le rend net.", en: "We make it sharp." })}
            />
            <p className="mt-10 max-w-[56ch] text-lg text-charcoal/70">
              {t({
                fr: "Votre marque est jugée sur ce qu’on en voit : un logo, une photo, une page, un post. WeMust réunit branding, production visuelle et développement pour que chacun de ces reflets dise la même chose, avec la même précision.",
                en: "Your brand is judged on what people see: a logo, a photo, a page, a post. WeMust brings branding, visual production and development together so every one of those reflections says the same thing, just as precisely.",
              })}
            </p>
            <Button to="/about" variant="dark" className="mt-10">{t({ fr: "Découvrir WeMust", en: "About WeMust" })}</Button>
          </div>
          <Reveal className="md:col-span-5">
            <LoopVideo id="H-10" className="relative aspect-[4/5] md:aspect-[3/4]" focus={["40%", "30%"]} />
          </Reveal>
        </div>
        <ul className="mt-20 grid border-t border-charcoal/15 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal as="li" key={i} delay={i * 0.1} className="border-b border-charcoal/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <h3 className="display text-xl">{t(p.title)}</h3>
              <p className="mt-3 text-charcoal/70">{t(p.text)}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
