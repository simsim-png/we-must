import { ArrowUpRight } from "lucide-react";
import type { MetaFunction } from "react-router";
import { LoopVideo } from "~/components/media/LoopVideo";
import { Reveal } from "~/components/motion/Reveal";
import { FinalCta } from "~/components/sections/FinalCta";
import { PageHero } from "~/components/sections/PageHero";
import { Process } from "~/components/sections/Process";
import { LLink } from "~/components/ui/LLink";
import { services } from "~/content/services";
import { useT } from "~/lib/i18n";
import { seo } from "~/lib/seo";

export const meta: MetaFunction = ({ location }) =>
  seo({
    pathname: location.pathname,
    title: { fr: "Services", en: "Services" },
    description: {
      fr: "Branding, photo et vidéo, réseaux sociaux, marketing digital, sites web et applications : les six métiers de WeMust à Casablanca.",
      en: "Branding, photo and video, social media, digital marketing, websites and web apps: WeMust’s six crafts in Casablanca.",
    },
  });

export default function Services() {
  const t = useT();
  return (
    <>
      <PageHero
        label="Services"
        title={t({ fr: "Ce que nous faisons.", en: "What we do." })}
        reflection={t({ fr: "Et comment.", en: "And how." })}
        intro={t({
          fr: "Six métiers complémentaires, portés par une seule équipe. Vous pouvez nous confier un projet précis ou l’ensemble de votre présence de marque.",
          en: "Six complementary crafts, carried by one team. Bring us a single project or your whole brand presence.",
        })}
      />
      <ol className="container-site pb-24">
        {services.map((s, i) => (
          <Reveal as="li" key={s.slug} className="border-t border-ivory/12 last:border-b">
            <LLink to={`/services/${s.slug}`} className="group grid gap-8 py-12 md:grid-cols-12 md:py-16">
              <span className="display text-[3rem] leading-none text-cobalt md:col-span-2">{s.num}</span>
              <div className="md:col-span-5">
                <h2 className="display display-md transition-colors group-hover:text-cobalt-light">{t(s.title)}</h2>
                <p className="mt-5 max-w-[50ch] text-ivory-dim">{t(s.intro)}</p>
                <span className="label-mono mt-8 inline-flex items-center gap-2 text-ivory">
                  {t({ fr: "En savoir plus", en: "Learn more" })}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="grid gap-6 md:col-span-5 md:grid-cols-2">
                <ul className="label-mono grid content-start gap-2 text-ivory-dim">
                  {t(s.deliverables).map((d) => (
                    <li key={d} className="flex gap-2"><span aria-hidden className="text-cobalt-light">+</span>{d}</li>
                  ))}
                </ul>
                <LoopVideo
                  id={s.media}
                  focus={[`${20 + i * 12}%`, `${70 - i * 8}%`]}
                  className="relative hidden aspect-[4/5] opacity-80 transition-opacity group-hover:opacity-100 md:block"
                />
              </div>
            </LLink>
          </Reveal>
        ))}
      </ol>
      <Process />
      <FinalCta />
    </>
  );
}
