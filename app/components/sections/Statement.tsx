import { useT } from "~/lib/i18n";
import { FocusText } from "../motion/FocusText";

export function Statement() {
  const t = useT();
  return (
    <section className="container-site py-section">
      <div className="grid gap-8 md:grid-cols-12">
        <p className="label-mono pt-3 text-ivory-dim md:col-span-3">
          <span className="text-cobalt-light">—</span> {t({ fr: "Manifeste", en: "Manifesto" })}
        </p>
        <FocusText
          as="p"
          stagger={0.025}
          className="text-[clamp(1.6rem,3.4vw,3.25rem)] font-semibold leading-[1.15] [font-stretch:112%] md:col-span-9"
          text={t({
            fr: "WeMust n’est pas une agence marketing de plus. Nous sommes un partenaire créatif : nous donnons aux marques une identité forte, des images qui arrêtent le scroll et des expériences digitales qui font la différence.",
            en: "WeMust is not another marketing agency. We are a creative partner: we give brands a strong identity, images that stop the scroll and digital experiences that make the difference.",
          })}
        />
      </div>
    </section>
  );
}
