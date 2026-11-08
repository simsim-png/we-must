import { services } from "~/content/services";
import { useT } from "~/lib/i18n";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";
import { SectionHead } from "../ui/SectionHead";
import { ServiceCard } from "./ServiceCard";

export function ServicesGrid() {
  const t = useT();
  return (
    <section id="services" className="container-site py-section scroll-mt-20">
      <SectionHead
        label={t({ fr: "Services", en: "Services" })}
        title={t({ fr: "Six métiers. Une seule exigence.", en: "Six crafts. One standard." })}
        intro={t({
          fr: "De l’identité de marque à l’application web, une seule équipe porte votre projet du concept à la mise en ligne.",
          en: "From brand identity to web applications, one team carries your project from concept to launch.",
        })}
      />
      <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal as="li" key={s.slug} delay={(i % 3) * 0.08} className="w-[80vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none">
            <ServiceCard service={s} index={i} />
          </Reveal>
        ))}
      </ul>
      <div className="mt-12 flex justify-end">
        <Button to="/services" variant="ghost">{t({ fr: "Tous les services", en: "All services" })}</Button>
      </div>
    </section>
  );
}
