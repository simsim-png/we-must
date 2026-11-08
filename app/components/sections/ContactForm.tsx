import { useId, useState, type FormEvent } from "react";
import { services } from "~/content/services";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { site } from "~/lib/site";
import { Button } from "../ui/Button";
import { LLink } from "../ui/LLink";

// Set VITE_FORM_ENDPOINT (e.g. a Formspree form URL) to receive submissions as JSON.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";
type Errors = Partial<Record<"name" | "contact" | "message" | "consent", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s().-]{8,}$/;

export function ContactForm() {
  const t = useT();
  const uid = useId();
  const [selected, setSelected] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot

    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = t({ fr: "Indiquez votre nom.", en: "Please enter your name." });
    if (!EMAIL.test(contact) && !PHONE.test(contact))
      next.contact = t({ fr: "Indiquez un email ou un numéro WhatsApp valide.", en: "Enter a valid email or WhatsApp number." });
    if (message.length < 10)
      next.message = t({ fr: "Décrivez votre projet en quelques mots.", en: "Describe your project in a few words." });
    if (!data.get("consent"))
      next.consent = t({ fr: "Votre accord est nécessaire pour vous répondre.", en: "We need your consent to reply." });
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    if (!ENDPOINT) {
      setStatus("unconfigured");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          company: String(data.get("company") ?? ""),
          contact,
          services: selected,
          budget,
          message,
          page: window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
      setSelected([]);
      setBudget("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-cobalt/60 p-8">
        <p className="display text-3xl">{t({ fr: "Message reçu.", en: "Message received." })}</p>
        <p className="mt-4 text-ivory-dim">
          {t({ fr: "Merci. Nous revenons vers vous rapidement.", en: "Thank you. We’ll get back to you shortly." })}
        </p>
      </div>
    );
  }

  const field = "w-full border-0 border-b border-ivory/25 bg-transparent py-3 text-lg text-ivory placeholder:text-ivory-faint transition-colors focus:border-cobalt-light focus:outline-none aria-[invalid=true]:border-red-400";
  const label = "label-mono text-ivory-dim";
  const err = (key: keyof Errors) =>
    errors[key] && (
      <p id={`${uid}-${key}-err`} className="mt-2 text-sm text-red-300">{errors[key]}</p>
    );
  const described = (key: keyof Errors) => (errors[key] ? `${uid}-${key}-err` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>{t({ fr: "Nom *", en: "Name *" })}</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={described("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-company`} className={label}>{t({ fr: "Entreprise", en: "Company" })}</label>
          <input id={`${uid}-company`} name="company" autoComplete="organization" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-contact`} className={label}>{t({ fr: "Email ou WhatsApp *", en: "Email or WhatsApp *" })}</label>
        <input id={`${uid}-contact`} name="contact" autoComplete="email" inputMode="email" className={field} aria-invalid={!!errors.contact} aria-describedby={described("contact")} />
        {err("contact")}
      </div>

      <fieldset>
        <legend className={label}>{t({ fr: "Services souhaités", en: "Services needed" })}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {services.map((s) => {
            const on = selected.includes(s.slug);
            return (
              <button
                key={s.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s.slug)}
                className={cn("border px-4 py-2 text-sm transition-colors", on ? "border-cobalt bg-cobalt text-ivory" : "border-ivory/25 text-ivory-dim hover:border-ivory hover:text-ivory")}
              >
                {t(s.title)}
              </button>
            );
          })}
        </div>
      </fieldset>

      {site.budgetRanges.length > 0 && (
        <fieldset>
          <legend className={label}>{t({ fr: "Budget indicatif (MAD)", en: "Indicative budget (MAD)" })}</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.budgetRanges.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={budget === b}
                onClick={() => setBudget(budget === b ? "" : b)}
                className={cn("border px-4 py-2 text-sm tabular-nums transition-colors", budget === b ? "border-cobalt bg-cobalt text-ivory" : "border-ivory/25 text-ivory-dim hover:border-ivory hover:text-ivory")}
              >
                {b}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor={`${uid}-message`} className={label}>{t({ fr: "Votre projet *", en: "Your project *" })}</label>
        <textarea id={`${uid}-message`} name="message" rows={4} className={cn(field, "resize-y")} aria-invalid={!!errors.message} aria-describedby={described("message")} />
        {err("message")}
      </div>

      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ivory-dim">
          <input type="checkbox" name="consent" className="mt-1 size-4 accent-cobalt" aria-invalid={!!errors.consent} aria-describedby={described("consent")} />
          <span>
            {t({
              fr: "J’accepte que WeMust utilise ces informations pour répondre à ma demande, conformément à la ",
              en: "I agree that WeMust may use this information to reply to my request, in line with the ",
            })}
            <LLink to="/confidentialite" className="text-ivory underline underline-offset-4">{t({ fr: "politique de confidentialité", en: "privacy policy" })}</LLink>.
          </span>
        </label>
        {err("consent")}
      </div>

      <div className="flex flex-col items-start gap-4">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? t({ fr: "Envoi…", en: "Sending…" }) : t({ fr: "Envoyer", en: "Send" })}
        </Button>
        <div role="status" aria-live="polite" className="text-sm">
          {status === "error" && (
            <p className="text-red-300">{t({ fr: "L’envoi a échoué. Réessayez, ou écrivez-nous sur Instagram.", en: "Sending failed. Try again, or message us on Instagram." })}</p>
          )}
          {status === "unconfigured" && (
            <p className="text-ivory-dim">
              {t({ fr: "Le formulaire n’est pas encore connecté. En attendant, écrivez-nous sur ", en: "The form isn’t connected yet. In the meantime, message us on " })}
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-ivory underline underline-offset-4">Instagram</a>.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
