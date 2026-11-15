import type { L } from "../lib/types";
import { visuals, type Visual } from "./visuals";

// Selected work.
//
// Everything here is real: these are WE MUST's own campaigns, as published on Instagram.
// No client, result or award is invented. Client projects go in the same list once they
// can be shown; until then two entries are marked `placeholder` and render as clearly
// labelled empty slots.

export type ServiceId = "branding" | "shooting" | "social" | "web";

export type Project = {
  slug: string;
  /** The campaign's own headline, in French as published. */
  title: string;
  /** English reading of the headline, shown on the English site. */
  titleEn: string;
  services: ServiceId[];
  format: L;
  summary: L;
  visual?: Visual;
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "sortez-du-lot",
    title: "Sortez du lot.",
    titleEn: "Stand out from the crowd.",
    services: ["branding"],
    format: { fr: "Affiche", en: "Poster" },
    summary: {
      fr: "Dans un mur de zellige gris, une seule étoile s’allume en bleu cobalt. Une image pour dire ce que fait une identité de marque : vous rendre impossible à confondre.",
      en: "On a wall of grey zellige, a single star lights up in cobalt blue. One image to say what a brand identity does: make you impossible to mistake for anyone else.",
    },
    visual: visuals.sortezDuLot,
  },
  {
    slug: "tout-le-reste-flou",
    title: "Tout le reste, flou. Votre travail, net.",
    titleEn: "Everything else, blurred. Your work, sharp.",
    services: ["shooting"],
    format: { fr: "Affiche", en: "Poster" },
    summary: {
      fr: "Un artisan au travail, vu à travers l’écran d’un boîtier. La promesse de nos tournages tient en quatre mots : photo et vidéo, chez vous.",
      en: "A craftsman at work, seen through a camera screen. The promise of our shoots fits in a few words: photo and video, at your place.",
    },
    visual: visuals.toutLeResteFlou,
  },
  {
    slug: "vous-nexistez-pas",
    title: "Vous n’existez pas.",
    titleEn: "You don’t exist.",
    services: ["social"],
    format: { fr: "Reel", en: "Reel" },
    summary: {
      fr: "Une épicerie de quartier éclairée dans la nuit, une silhouette de dos, et un constat en trois mots. Un reel pensé pour arrêter le pouce.",
      en: "A corner shop lit up at night, a figure seen from behind, and a three-word verdict. A reel made to stop the thumb.",
    },
    visual: visuals.nexistezPas,
  },
  {
    slug: "votre-site-rame",
    title: "Votre site rame. Vos clients partent.",
    titleEn: "Your site is slow. Your clients leave.",
    services: ["web"],
    format: { fr: "Affiche", en: "Poster" },
    summary: {
      fr: "Un sablier, une barre de chargement bloquée à 12 %, et des clients qui n’attendent pas. La campagne de notre offre web : sites rapides, apps et SaaS.",
      en: "An hourglass, a loading bar stuck at 12%, and clients who won’t wait. The campaign for our web offer: fast sites, apps and SaaS.",
    },
    visual: visuals.votreSiteRame,
  },
  {
    slug: "votre-travail",
    title: "Votre travail. Flou, puis net.",
    titleEn: "Your work. Blurred, then sharp.",
    services: ["branding", "shooting", "social"],
    format: { fr: "Affiche", en: "Poster" },
    summary: {
      fr: "« Les clients ne voient que le reflet. On le rend net. » L’affiche qui résume notre métier, sur fond ivoire et en bleu cobalt.",
      en: "“Les clients ne voient que le reflet. On le rend net.” Clients only see the reflection; we make it sharp. The poster that sums up what we do, in ivory and cobalt.",
    },
    visual: visuals.votreTravail,
  },
  {
    slug: "3-erreurs",
    title: "3 erreurs qui font fuir vos clients.",
    titleEn: "3 mistakes that drive your clients away.",
    services: ["social"],
    format: { fr: "Carrousel", en: "Carousel" },
    summary: {
      fr: "Un chiffre géant, une promesse claire, et on glisse. Un carrousel construit pour être lu jusqu’à la dernière slide.",
      en: "One giant numeral, one clear promise, then you swipe. A carousel built to be read to the last slide.",
    },
    visual: visuals.troisErreurs,
  },
  // TODO(wemust): replace with real client projects (title, services, summary, images).
  {
    slug: "projet-client-branding",
    title: "Projet client",
    titleEn: "Client project",
    services: ["branding"],
    format: { fr: "À venir", en: "Coming soon" },
    summary: { fr: "Emplacement réservé à un projet client.", en: "Slot reserved for a client project." },
    placeholder: true,
  },
  {
    slug: "projet-client-web",
    title: "Projet client",
    titleEn: "Client project",
    services: ["web"],
    format: { fr: "À venir", en: "Coming soon" },
    summary: { fr: "Emplacement réservé à un projet client.", en: "Slot reserved for a client project." },
    placeholder: true,
  },
];

export const realProjects = projects.filter((p) => !p.placeholder);

export const getProject = (slug?: string) => realProjects.find((p) => p.slug === slug);
