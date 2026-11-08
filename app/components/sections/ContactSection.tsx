import { useT } from "~/lib/i18n";
import { Channels } from "../layout/Channels";
import { SectionHead } from "../ui/SectionHead";
import { ContactForm } from "./ContactForm";

export function ContactSection({ asPage = false }: { asPage?: boolean }) {
  const t = useT();
  return (
    <section id="contact" className={asPage ? "container-site pt-36 pb-24 md:pt-44" : "container-site py-section scroll-mt-20"}>
      <SectionHead
        as={asPage ? "h1" : "h2"}
        label="Contact"
        title={t({ fr: "Parlons de votre projet.", en: "Let’s talk about your project." })}
        intro={t({
          fr: "Quelques lignes suffisent. Nous répondons par email ou sur WhatsApp, comme vous préférez.",
          en: "A few lines are enough. We reply by email or on WhatsApp, whichever you prefer.",
        })}
      />
      <div className="relative grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm />
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <p className="label-mono mb-4 text-ivory-dim">{t({ fr: "Ou directement", en: "Or directly" })}</p>
          <Channels />
        </aside>
      </div>
    </section>
  );
}
