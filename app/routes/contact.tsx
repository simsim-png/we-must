import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/sections/ContactSection";
import { seo } from "~/lib/seo";

export const meta: MetaFunction = ({ location }) =>
  seo({
    pathname: location.pathname,
    title: { fr: "Contact", en: "Contact" },
    description: {
      fr: "Parlons de votre projet. Contactez WeMust à Casablanca par formulaire, WhatsApp, Instagram ou LinkedIn.",
      en: "Let’s talk about your project. Contact WeMust in Casablanca by form, WhatsApp, Instagram or LinkedIn.",
    },
  });

export default function Contact() {
  return <ContactSection asPage />;
}
