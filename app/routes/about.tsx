import type { MetaFunction } from "react-router";
import { Monogram } from "~/components/brand/Monogram";
import { LoopVideo } from "~/components/media/LoopVideo";
import { FocusText } from "~/components/motion/FocusText";
import { Reveal } from "~/components/motion/Reveal";
import { principles } from "~/components/sections/AboutTeaser";
import { FinalCta } from "~/components/sections/FinalCta";
import { PageHero } from "~/components/sections/PageHero";
import { useT } from "~/lib/i18n";
import { seo } from "~/lib/seo";
import type { L } from "~/lib/types";

export const meta: MetaFunction = ({ location }) =>
  seo({
    pathname: location.pathname,
    title: { fr: "À propos", en: "About" },
    description: {
      fr: "WeMust, agence créative et tech à Casablanca : notre philosophie, notre façon de travailler et notre équipe.",
      en: "WeMust, a creative and technology agency in Casablanca: our philosophy, how we work and our team.",
    },
  });

const commitments: { title: L; text: L }[] = [
  {
    title: { fr: "Une équipe, toutes les disciplines", en: "One team, every discipline" },
    text: {
      fr: "Branding, production, réseaux sociaux et développement sous le même toit. Pas de relais entre prestataires, pas de message perdu en route.",
      en: "Branding, production, social and development under one roof. No hand-offs between vendors, nothing lost along the way.",
    },
  },
  {
    title: { fr: "Trois langues, une voix", en: "Three languages, one voice" },
    text: {
      fr: "Nous écrivons en français, en darija et en anglais, pour parler à vos clients comme ils se parlent entre eux.",
      en: "We write in French, Darija and English, to speak to your customers the way they speak to each other.",
    },
  },
  {
    title: { fr: "Du concept à la mise en ligne", en: "From concept to launch" },
    text: {
      fr: "Nous ne livrons pas une idée à exécuter ailleurs. Nous la construisons jusqu’au bout, puis nous la faisons évoluer.",
      en: "We don’t hand over an idea to be built elsewhere. We build it all the way, then keep improving it.",
    },
  },
];

export default function About() {
  const t = useT();
  return (
    <>
      <PageHero
        label={t({ fr: "À propos", en: "About" })}
        title={t({ fr: "On ne suit pas les tendances.", en: "We don’t follow trends." })}
        reflection={t({ fr: "On les crée.", en: "We create them." })}
      />

      <section className="container-site grid gap-16 pb-section md:grid-cols-12">
        <div className="md:col-span-6">
          <FocusText
            as="p"
            stagger={0.025}
            className="text-[clamp(1.4rem,2.4vw,2.2rem)] font-semibold leading-[1.2] [font-stretch:112%]"
            text={t({
              fr: "WeMust est née d’une conviction simple : au Maroc comme ailleurs, les marques méritent un travail créatif de niveau international. Nous réunissons stratégie, image et technologie pour construire des marques fortes, cohérentes et visibles.",
              en: "WeMust was born from a simple belief: in Morocco as anywhere, brands deserve creative work of international standard. We bring strategy, image and technology together to build brands that are strong, consistent and seen.",
            })}
          />
        </div>
        <Reveal className="md:col-span-5 md:col-start-8">
          <LoopVideo id="H-10" className="relative aspect-[4/5]" focus={["35%", "30%"]} />
          <p className="label-mono mt-4 text-ivory-faint">Casablanca</p>
        </Reveal>
      </section>

      <section className="bg-ivory text-charcoal">
        <div className="container-site py-section">
          <div className="mb-16 flex items-center justify-between">
            <h2 className="label-mono text-charcoal/60"><span className="text-cobalt">—</span> {t({ fr: "Philosophie", en: "Philosophy" })}</h2>
            <Monogram variant="dark" className="w-7" />
          </div>
          <ol className="grid gap-0">
            {principles.map((p, i) => (
              <Reveal as="li" key={i} className="grid gap-6 border-t border-charcoal/15 py-12 md:grid-cols-12">
                <h3 className="display display-md md:col-span-6">{t(p.title)}</h3>
                <p className="max-w-[52ch] text-lg text-charcoal/70 md:col-span-5 md:col-start-8">{t(p.text)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site py-section">
        <p className="label-mono mb-14 text-ivory-dim"><span className="text-cobalt-light">—</span> {t({ fr: "Notre façon de travailler", en: "How we work" })}</p>
        <ul className="grid gap-12 md:grid-cols-3">
          {commitments.map((c, i) => (
            <Reveal as="li" key={i} delay={i * 0.1} className="border-t border-cobalt pt-8">
              <h3 className="display text-2xl">{t(c.title)}</h3>
              <p className="mt-4 text-ivory-dim">{t(c.text)}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-site border-t border-ivory/10 py-section">
        <div className="mb-14 grid gap-6 md:grid-cols-12">
          <p className="label-mono pt-2 text-ivory-dim md:col-span-3"><span className="text-cobalt-light">—</span> {t({ fr: "Équipe", en: "Team" })}</p>
          <h2 className="display display-lg md:col-span-9">{t({ fr: "Les visages derrière WeMust.", en: "The faces behind WeMust." })}</h2>
        </div>
        {/* TODO(wemust): replace with real portraits, names and roles. */}
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <li key={i}>
              <div className="grid aspect-[3/4] place-items-center border border-dashed border-ivory/15 bg-charcoal-2">
                <span className="label-mono text-ivory-faint">{t({ fr: "Portrait à venir", en: "Portrait coming soon" })}</span>
              </div>
              <p className="mt-4 text-ivory-faint">{t({ fr: "Nom à compléter", en: "Name to be added" })}</p>
              <p className="label-mono mt-1 text-ivory-faint">{t({ fr: "Rôle", en: "Role" })}</p>
            </li>
          ))}
        </ul>
      </section>
      <FinalCta />
    </>
  );
}
