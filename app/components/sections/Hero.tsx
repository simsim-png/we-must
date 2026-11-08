import { motion } from "motion/react";
import { useT } from "~/lib/i18n";
import { site } from "~/lib/site";
import { Horizon } from "../brand/Horizon";
import { LoopVideo } from "../media/LoopVideo";
import { FocusText } from "../motion/FocusText";
import { Button } from "../ui/Button";
import { LocalTime } from "../ui/LocalTime";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.2, 0.7, 0.1, 1] as const },
});

export function Hero() {
  const t = useT();
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* H-01: the city above, its reflection below. The type horizon sits on the water line. */}
      <LoopVideo id="H-01" priority className="absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/50 via-charcoal/10 to-charcoal/85 max-md:via-charcoal/40" />

      <div className="container-site flex flex-1 flex-col pt-28 md:pt-32">
        <h1 lang="en" className="flex flex-1 flex-col">
          <FocusText
            text="WE DON’T FOLLOW TRENDS."
            onLoad
            delay={0.2}
            className="display display-xl mt-auto max-w-[14ch] text-ivory"
          />
          <Horizon onLoad delay={0.5} className="my-5 text-ivory md:my-7" />
          <FocusText text="WE CREATE THEM." onLoad delay={0.9} className="display display-xl text-cobalt" />
        </h1>

        <div className="mt-10 grid gap-8 pb-10 md:mt-14 md:grid-cols-2 md:items-end md:pb-14 xl:grid-cols-12">
          <motion.p lang="fr" className="serif-accent text-[clamp(1.6rem,2.6vw,2.4rem)] md:col-span-2 xl:col-span-5" {...fadeUp(1.3)}>
            On ne suit pas les tendances. On les crée.
          </motion.p>
          <motion.p className="max-w-[46ch] text-ivory-dim xl:col-span-4" {...fadeUp(1.45)}>
            {t({
              fr: "WeMust est une agence créative et tech à Casablanca. Identité de marque, photo et vidéo, réseaux sociaux, sites et applications web : nous construisons des marques qu’on remarque.",
              en: "WeMust is a creative and technology agency in Casablanca. Brand identity, photo and video, social media, websites and web apps: we build brands people notice.",
            })}
          </motion.p>
          <motion.div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:flex-col md:items-stretch xl:col-span-3" {...fadeUp(1.6)}>
            <Button to="/contact">{t({ fr: "Créons quelque chose.", en: "Let’s create something." })}</Button>
            <Button to="/work" variant="ghost">{t({ fr: "Découvrir nos projets.", en: "Discover our work." })}</Button>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-ivory/12">
        <div className="container-site label-mono flex items-center justify-between gap-4 py-4 text-ivory-dim">
          <span>{site.city} · <span className="hidden sm:inline">{site.coords} · </span><LocalTime /></span>
          <a href="#services" className="flex items-center gap-2 hover:text-ivory">
            {t({ fr: "Défiler", en: "Scroll" })}
            <span aria-hidden className="block h-4 w-px animate-pulse bg-cobalt-light" />
          </a>
        </div>
      </div>
    </section>
  );
}
