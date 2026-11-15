import type { MetaFunction } from "react-router";
import { LegalPage } from "~/components/pages/LegalPage";
import { useLang } from "~/lib/i18n";
import { seo } from "~/lib/seo";

export const meta: MetaFunction = ({ location }) => [
  ...seo({
    pathname: location.pathname,
    title: { fr: "Mentions légales", en: "Legal notice" },
    description: { fr: "Mentions légales du site WeMust.", en: "Legal notice for the WeMust website." },
  }),
  { name: "robots", content: "noindex" },
];

export default function Legal() {
  const lang = useLang();
  if (lang === "en") {
    return (
      <LegalPage title="Legal notice">
        <section><h2>Publisher</h2><p>[Company name], [legal form] with a share capital of [amount] MAD. Registered office: [address], Casablanca, Morocco. RC: [number]. ICE: [number]. IF: [number].</p></section>
        <section><h2>Publication director</h2><p>[Full name], [title].</p></section>
        <section><h2>Contact</h2><p>Email: [address]. Phone: [number].</p></section>
        <section><h2>Hosting</h2><p>[Hosting provider], [address].</p></section>
        <section><h2>Intellectual property</h2><p>All content on this site (text, images, videos, logos, brand elements) belongs to WeMust or its clients and may not be reproduced without prior written permission.</p></section>
      </LegalPage>
    );
  }
  return (
    <LegalPage title="Mentions légales">
      <section><h2>Éditeur</h2><p>[Raison sociale], [forme juridique] au capital de [montant] MAD. Siège social : [adresse], Casablanca, Maroc. RC : [numéro]. ICE : [numéro]. IF : [numéro].</p></section>
      <section><h2>Directeur de la publication</h2><p>[Nom et prénom], [fonction].</p></section>
      <section><h2>Contact</h2><p>Email : [adresse]. Téléphone : [numéro].</p></section>
      <section><h2>Hébergement</h2><p>[Hébergeur], [adresse].</p></section>
      <section><h2>Propriété intellectuelle</h2><p>L’ensemble des contenus de ce site (textes, images, vidéos, logos, éléments de marque) appartient à WeMust ou à ses clients et ne peut être reproduit sans autorisation écrite préalable.</p></section>
    </LegalPage>
  );
}
