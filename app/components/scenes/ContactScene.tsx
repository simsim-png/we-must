import { useEffect, useState, type CSSProperties } from "react";
import { copy } from "~/content/copy";
import { useT } from "~/lib/i18n";
import { site, whatsappUrl } from "~/lib/site";
import { STATION } from "~/state/layout";
import { scrollToStep } from "~/state/scroll";
import { useStore } from "~/state/store";
import { ContactForm, FORM_ENDPOINT } from "../pages/ContactForm";
import { LLink } from "../ui/LLink";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Scene 06 — Contact. The four worlds line up in front of the core, and the film ends on a
 * question. Only verified channels are shown: Instagram always; WhatsApp, email and the form
 * appear on their own once they are filled in (see app/lib/site.ts and .env.example).
 */
export function ContactScene() {
  const t = useT();
  const active = useStore((s) => s.arrived && s.transit === "idle" && s.station === STATION.contact);
  const [form, setForm] = useState(false);

  useEffect(() => {
    if (!active) setForm(false);
  }, [active]);

  const whatsapp = whatsappUrl();
  const socials = [
    { label: "Instagram", href: site.instagram },
    { label: "LinkedIn", href: site.linkedin },
    { label: "Threads", href: site.threads },
  ].filter((s) => s.href);

  return (
    <section id="contact" className="scene" data-active={active} data-on={active} aria-labelledby="contact-title">
      <div className="shade shade-center" />

      <div className="gutter absolute inset-x-0 top-0 flex flex-col items-center pt-[12svh] text-center">
        <p className="label rv text-(--accent)">
          {t(copy.contact.scene)} — {t(copy.contact.title)}
        </p>
        <h2 id="contact-title" className="display rv mt-5 text-[clamp(1.55rem,min(5.4vw,9svh),5.4rem)]" style={i(1)}>
          <span className="block">{copy.contact.headline[0]}</span>
          <span className="block text-cobalt-soft">{copy.contact.headline[1]}</span>
        </h2>
        <p className="rv mt-4 max-w-[44ch] text-[0.95rem] text-(--muted)" style={i(2)}>
          {t(copy.contact.text)}
        </p>
      </div>

      <div className="gutter absolute inset-x-0 bottom-0 pb-4">
        <div className="flex flex-col items-center text-center">
          <div className="rv flex flex-wrap justify-center gap-3" style={i(3)}>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-cobalt">
              {t(copy.contact.instagram)}
            </a>
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-line">
                {t(copy.contact.whatsapp)}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="btn-line">
                {t(copy.contact.email)}
              </a>
            )}
            {FORM_ENDPOINT && (
              <button type="button" className="btn-line" onClick={() => setForm(true)}>
                {t(copy.contact.form)}
              </button>
            )}
          </div>
          <ul className="label rv mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1" style={i(4)}>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link">
                  {s.label} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="label rv mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-(--line) pt-3.5 text-(--muted)" style={i(5)}>
          <span>© {new Date().getFullYear()} WeMust · Casablanca</span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <LLink to="/mentions-legales" className="link">
              {t(copy.contact.legal)}
            </LLink>
            <LLink to="/confidentialite" className="link">
              {t(copy.contact.privacy)}
            </LLink>
            <button type="button" className="link label" onClick={() => scrollToStep(0)}>
              {t(copy.contact.backToStart)} <span aria-hidden>↑</span>
            </button>
          </span>
        </footer>
      </div>

      {form && (
        <div className="gutter absolute inset-0 z-10 flex items-center justify-center bg-ink/88 py-20 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={t(copy.contact.form)}>
          <div className="max-h-full w-full max-w-xl overflow-y-auto text-ivory">
            <div className="mb-8 flex items-center justify-between">
              <p className="headline text-xl">{t(copy.nav.start)}</p>
              <button type="button" className="link label" onClick={() => setForm(false)}>
                {t(copy.contact.closeForm)} ✕
              </button>
            </div>
            <ContactForm />
          </div>
        </div>
      )}
    </section>
  );
}
