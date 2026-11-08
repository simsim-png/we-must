import type { MetaFunction } from "react-router";
import { LegalPage } from "~/components/sections/LegalPage";
import { useLang } from "~/lib/i18n";
import { seo } from "~/lib/seo";

export const meta: MetaFunction = ({ location }) => [
  ...seo({
    pathname: location.pathname,
    title: { fr: "Politique de confidentialité", en: "Privacy policy" },
    description: { fr: "Comment WeMust traite vos données personnelles.", en: "How WeMust handles your personal data." },
  }),
  { name: "robots", content: "noindex" },
];

export default function Privacy() {
  const lang = useLang();
  if (lang === "en") {
    return (
      <LegalPage title="Privacy policy">
        <section><h2>Data we collect</h2><p>Through the contact form: your name, company, email address or phone number, the services you are interested in and your message.</p></section>
        <section><h2>Why</h2><p>Only to reply to your request and, if you become a client, to follow up on your project. Your data is never sold or shared for advertising.</p></section>
        <section><h2>Retention</h2><p>[Duration, e.g. 3 years after our last contact], then deleted.</p></section>
        <section><h2>Your rights</h2><p>Under Moroccan Law 09-08 on the protection of individuals with regard to the processing of personal data, you have the right to access, rectify and object to the processing of your data. Write to [email address].</p></section>
        <section><h2>CNDP</h2><p>[Declaration or authorisation number with the Commission Nationale de contrôle de la protection des Données à caractère Personnel, if applicable.]</p></section>
        <section><h2>Cookies and analytics</h2><p>[Describe the analytics tool used, if any, and whether it sets cookies.]</p></section>
      </LegalPage>
    );
  }
  return (
    <LegalPage title="Politique de confidentialité">
      <section><h2>Données collectées</h2><p>Via le formulaire de contact : votre nom, votre entreprise, votre adresse email ou votre numéro de téléphone, les services qui vous intéressent et votre message.</p></section>
      <section><h2>Finalité</h2><p>Uniquement pour répondre à votre demande et, si vous devenez client, assurer le suivi de votre projet. Vos données ne sont jamais vendues ni utilisées à des fins publicitaires.</p></section>
      <section><h2>Durée de conservation</h2><p>[Durée, par exemple 3 ans après le dernier contact], puis suppression.</p></section>
      <section><h2>Vos droits</h2><p>Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel, vous disposez d’un droit d’accès, de rectification et d’opposition. Écrivez à [adresse email].</p></section>
      <section><h2>CNDP</h2><p>[Numéro de déclaration ou d’autorisation auprès de la Commission Nationale de contrôle de la protection des Données à caractère Personnel, le cas échéant.]</p></section>
      <section><h2>Cookies et mesure d’audience</h2><p>[Indiquer l’outil de mesure d’audience utilisé, le cas échéant, et s’il dépose des cookies.]</p></section>
    </LegalPage>
  );
}
