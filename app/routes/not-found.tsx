import type { MetaFunction } from "react-router";
import { LoopVideo } from "~/components/media/LoopVideo";
import { FocusText } from "~/components/motion/FocusText";
import { Button } from "~/components/ui/Button";
import { useT } from "~/lib/i18n";

export const meta: MetaFunction = () => [{ title: "404 — WeMust" }, { name: "robots", content: "noindex" }];

export default function NotFound() {
  const t = useT();
  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden">
      <LoopVideo id="H-12" className="absolute inset-0 -z-10" />
      <div className="container-site pt-24">
        <p className="label-mono text-ivory-dim">404</p>
        <FocusText
          as="h1"
          onLoad
          className="display display-xl mt-6 max-w-[14ch]"
          text={t({ fr: "Cette page n’existe pas.", en: "This page doesn’t exist." })}
        />
        <FocusText
          as="p"
          onLoad
          delay={0.4}
          className="display display-md mt-4 text-cobalt"
          text={t({ fr: "Pas encore.", en: "Not yet." })}
        />
        <Button to="/" className="mt-12">{t({ fr: "Retour à l’accueil", en: "Back to home" })}</Button>
      </div>
    </section>
  );
}
