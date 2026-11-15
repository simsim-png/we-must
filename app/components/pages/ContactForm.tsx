import { useId, useState, type FormEvent } from "react";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { LLink } from "../ui/LLink";

// Set VITE_FORM_ENDPOINT (for example a Formspree form URL) to receive enquiries as JSON.
// Without it the form is not offered at all and Instagram stays the contact channel.
export const FORM_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || "";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "contact" | "message" | "consent", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s().-]{8,}$/;

export function ContactForm() {
  const t = useT();
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

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
      next.contact = t({ fr: "Indiquez un email ou un numéro valide.", en: "Enter a valid email or phone number." });
    if (message.length < 10)
      next.message = t({ fr: "Décrivez votre projet en quelques mots.", en: "Describe your project in a few words." });
    if (!data.get("consent"))
      next.consent = t({ fr: "Votre accord est nécessaire pour vous répondre.", en: "We need your consent to reply." });
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, contact, message, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-ivory/25 p-8">
        <p className="display text-2xl">{t({ fr: "Message reçu.", en: "Message received." })}</p>
        <p className="mt-3 text-ivory/75">{t({ fr: "Merci. On revient vers vous rapidement.", en: "Thank you. We’ll get back to you shortly." })}</p>
      </div>
    );
  }

  const field =
    "w-full border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-base text-ivory placeholder:text-ivory/40 transition-colors focus:border-cobalt-soft focus:outline-none aria-[invalid=true]:border-amber";
  const error = (key: keyof Errors) =>
    errors[key] && (
      <p id={`${uid}-${key}-err`} className="mt-2 text-sm text-amber">{errors[key]}</p>
    );
  const described = (key: keyof Errors) => (errors[key] ? `${uid}-${key}-err` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="label block text-ivory/60">{t({ fr: "Nom *", en: "Name *" })}</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={described("name")} />
          {error("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-contact`} className="label block text-ivory/60">{t({ fr: "Email ou téléphone *", en: "Email or phone *" })}</label>
          <input id={`${uid}-contact`} name="contact" autoComplete="email" className={field} aria-invalid={!!errors.contact} aria-describedby={described("contact")} />
          {error("contact")}
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="label block text-ivory/60">{t({ fr: "Votre projet *", en: "Your project *" })}</label>
        <textarea id={`${uid}-message`} name="message" rows={3} className={cn(field, "resize-y")} aria-invalid={!!errors.message} aria-describedby={described("message")} />
        {error("message")}
      </div>

      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ivory/75">
          <input type="checkbox" name="consent" className="mt-1 size-4 accent-cobalt" aria-invalid={!!errors.consent} aria-describedby={described("consent")} />
          <span>
            {t({
              fr: "J’accepte que WeMust utilise ces informations pour répondre à ma demande, selon la ",
              en: "I agree that WeMust may use this information to reply to my request, in line with the ",
            })}
            <LLink to="/confidentialite" className="underline underline-offset-4">
              {t({ fr: "politique de confidentialité", en: "privacy policy" })}
            </LLink>
            .
          </span>
        </label>
        {error("consent")}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-cobalt" disabled={status === "sending"}>
          {status === "sending" ? t({ fr: "Envoi…", en: "Sending…" }) : t({ fr: "Envoyer", en: "Send" })}
        </button>
        <p role="status" aria-live="polite" className="text-sm text-amber">
          {status === "error" && t({ fr: "L’envoi a échoué. Réessayez, ou écrivez-nous sur Instagram.", en: "Sending failed. Try again, or message us on Instagram." })}
        </p>
      </div>
    </form>
  );
}
