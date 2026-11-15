import type { L } from "../lib/types";
import { realProjects, type Project, type ServiceId } from "./work";

/** Colour mood of a world. Drives the interface colours once the visitor is inside it. */
export type Tone = "ink" | "ivory" | "cobalt" | "midnight";

export type Service = {
  id: ServiceId;
  num: string;
  name: L;
  /** One line shown when a sphere is hovered in the universe. */
  hook: L;
  /** A line from WE MUST's own campaign for this service. Always French, as published. */
  line: string;
  /** English reading of the campaign line, shown as a gloss on the English site. */
  lineEn: string;
  text: L;
  capabilities: L<string[]>;
  tone: Tone;
};

// Order matters: it is the order of the spheres around the core (01 → 04).
export const services: Service[] = [
  {
    id: "branding",
    num: "01",
    name: { fr: "Branding", en: "Branding" },
    hook: {
      fr: "Identités mémorables, univers de marque distinctifs.",
      en: "Memorable identities, distinctive brand worlds.",
    },
    line: "Des marques qu’on remarque.",
    lineEn: "Brands that get noticed.",
    text: {
      fr: "Construire des identités mémorables et créer des univers de marque distinctifs. Du premier symbole au système complet, chaque élément est dessiné pour qu’on vous reconnaisse au premier regard.",
      en: "Building memorable identities and creating distinctive brand worlds. From the first symbol to the full system, every element is designed so people recognise you at a glance.",
    },
    capabilities: {
      fr: ["Stratégie de marque", "Logo & identité", "Charte graphique", "Direction artistique"],
      en: ["Brand strategy", "Logo & identity", "Brand guidelines", "Art direction"],
    },
    tone: "ivory",
  },
  {
    id: "shooting",
    num: "02",
    name: { fr: "Shooting", en: "Shooting" },
    hook: {
      fr: "Photo, vidéo et production visuelle.",
      en: "Photography, video and visual production.",
    },
    line: "Tout le reste, flou. Votre travail, net.",
    lineEn: "Everything else, blurred. Your work, sharp.",
    text: {
      fr: "Photographie, vidéo et production visuelle. On vient chez vous, on éclaire votre travail, et on livre des images prêtes à être publiées.",
      en: "Photography, videography and visual production. We come to you, light your work, and deliver images that are ready to publish.",
    },
    capabilities: {
      fr: ["Photo", "Vidéo & reels", "Tournage chez vous", "Post-production"],
      en: ["Photography", "Video & reels", "On-location shoots", "Post-production"],
    },
    tone: "ink",
  },
  {
    id: "social",
    num: "03",
    name: { fr: "Réseaux sociaux", en: "Social media" },
    hook: {
      fr: "Stratégie créative, contenu et gestion des réseaux.",
      en: "Creative strategy, content and social management.",
    },
    line: "Vous n’existez pas.",
    lineEn: "You don’t exist.",
    text: {
      fr: "Stratégie créative, création de contenu et gestion des réseaux sociaux. Des formats pensés pour arrêter le pouce : carrousels, reels et campagnes qui restent en tête.",
      en: "Creative strategy, content creation and social media management. Formats made to stop the thumb: carousels, reels and campaigns that stay in mind.",
    },
    capabilities: {
      fr: ["Stratégie créative", "Création de contenu", "Carrousels & reels", "Gestion des comptes"],
      en: ["Creative strategy", "Content creation", "Carousels & reels", "Account management"],
    },
    tone: "cobalt",
  },
  {
    id: "web",
    num: "04",
    name: { fr: "Web & Apps", en: "Web & Apps" },
    hook: {
      fr: "Sites modernes et applications digitales.",
      en: "Modern websites and digital applications.",
    },
    line: "Votre site rame. Vos clients partent.",
    lineEn: "Your site is slow. Your clients leave.",
    text: {
      fr: "Sites modernes et applications digitales qui transforment les idées en expériences. Rapides, clairs, et construits pour que vos clients restent.",
      en: "Modern websites and digital applications that turn ideas into experiences. Fast, clear, and built so your clients stay.",
    },
    capabilities: {
      fr: ["Sites rapides", "Applications web", "SaaS", "Design d’interface"],
      en: ["Fast websites", "Web applications", "SaaS", "Interface design"],
    },
    tone: "midnight",
  },
];

export const serviceIds: ServiceId[] = services.map((s) => s.id);

export const getService = (id?: string | null) => services.find((s) => s.id === id);

export const serviceName = (id: ServiceId) => services.find((s) => s.id === id)!.name;

/** Real campaigns published for a service. The first one is the one framed inside its world. */
export const projectsFor = (id: ServiceId): Project[] => {
  const own = realProjects.filter((p) => p.services[0] === id);
  const shared = realProjects.filter((p) => p.services[0] !== id && p.services.includes(id));
  return [...own, ...shared];
};

export const nextService = (id: ServiceId) => services[(serviceIds.indexOf(id) + 1) % services.length];
