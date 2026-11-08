import { useT } from "~/lib/i18n";
import { Horizon } from "../brand/Horizon";
import { LoopVideo } from "../media/LoopVideo";
import { FocusText } from "../motion/FocusText";
import { Button } from "../ui/Button";

/** Ends the page on the same horizon it opened with (H-11, the Atlantic at dusk). */
export function FinalCta() {
  const t = useT();
  return (
    <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden">
      <LoopVideo id="H-11" className="absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-charcoal/45" />
      <div className="container-site py-section text-center">
        <FocusText
          as="h2"
          className="display display-xl mx-auto max-w-[16ch]"
          text={t({ fr: "Votre marque mérite mieux que l’ordinaire.", en: "Your brand deserves more than ordinary." })}
        />
        <Horizon className="mx-auto my-12 max-w-xl text-ivory/60" delay={0.3} />
        <Button to="/contact" size="lg">{t({ fr: "Créons quelque chose.", en: "Let’s create something." })}</Button>
      </div>
    </section>
  );
}
