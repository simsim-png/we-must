import type { L } from "../lib/types";

// Real WE MUST visuals, taken from the public Instagram grid (@wemustagency).
//
// TODO(wemust): these files are the 512×640 thumbnails Instagram serves publicly. They are
// stand-ins. Replace each /public/work/<id>.jpg and .avif with the original export
// (1080×1350 or larger, same file name) and update `w` / `h` below.

export type Visual = {
  id: string;
  /** Path without extension; .avif and .jpg both exist. */
  src: string;
  w: number;
  h: number;
  alt: L;
  /** The Instagram post this visual comes from. */
  ig: string;
  date: string;
  reel?: boolean;
  /** CSS object-position, for visuals cropped into a 4:5 frame. */
  focus?: string;
};

const IG = "https://www.instagram.com/wemustagency";

export const visuals = {
  sortezDuLot: {
    id: "sortez-du-lot",
    src: "/work/sortez-du-lot",
    w: 512,
    h: 640,
    alt: {
      fr: "Affiche WE MUST « Sortez du lot. » : dans un mur de zellige gris, une étoile s’illumine en bleu cobalt.",
      en: "WE MUST poster “Sortez du lot.”: on a wall of grey zellige tiles, one star lights up in cobalt blue.",
    },
    ig: `${IG}/p/DfhuEABldif/`,
    date: "2026-11-09",
  },
  toutLeResteFlou: {
    id: "tout-le-reste-flou",
    src: "/work/tout-le-reste-flou",
    w: 512,
    h: 640,
    alt: {
      fr: "Affiche WE MUST « Tout le reste, flou. Votre travail, net. » : des mains tiennent un appareil photo dont l’écran montre un artisan au travail.",
      en: "WE MUST poster “Tout le reste, flou. Votre travail, net.”: hands hold a camera whose screen shows a craftsman at work.",
    },
    ig: `${IG}/p/DffJNPhFZkk/`,
    date: "2026-11-08",
  },
  nexistezPas: {
    id: "nexistez-pas",
    src: "/work/nexistez-pas",
    w: 360,
    h: 640,
    alt: {
      fr: "Couverture du reel WE MUST « Vous n’existez pas. » : une épicerie de quartier éclairée dans la nuit, une silhouette de dos.",
      en: "Cover of the WE MUST reel “Vous n’existez pas.”: a corner shop lit up at night, a figure seen from behind.",
    },
    ig: `${IG}/reel/DfYcTkIINfq/`,
    date: "2026-11-05",
    reel: true,
    focus: "50% 8%",
  },
  votreSiteRame: {
    id: "votre-site-rame",
    src: "/work/votre-site-rame",
    w: 512,
    h: 640,
    alt: {
      fr: "Affiche WE MUST « Votre site rame. Vos clients partent. » : un sablier au sable bleu et une barre de chargement à 12 %.",
      en: "WE MUST poster “Votre site rame. Vos clients partent.”: an hourglass with blue sand and a loading bar at 12%.",
    },
    ig: `${IG}/p/Dfaa6rgnOF_/`,
    date: "2026-11-06",
  },
  votreTravail: {
    id: "votre-travail",
    src: "/work/votre-travail",
    w: 512,
    h: 640,
    alt: {
      fr: "Affiche WE MUST « Votre travail. » sur fond ivoire : le mot « flou » en bleu cobalt devient net.",
      en: "WE MUST poster “Votre travail.” on ivory: the word “flou” in cobalt blue comes into focus.",
    },
    ig: `${IG}/p/DfVKlxiDZsw/`,
    date: "2026-11-04",
  },
  troisErreurs: {
    id: "3-erreurs",
    src: "/work/3-erreurs",
    w: 512,
    h: 640,
    alt: {
      fr: "Couverture du carrousel WE MUST « 3 erreurs qui font fuir vos clients. » : un 3 géant bleu cobalt sur fond ivoire.",
      en: "Cover of the WE MUST carousel “3 erreurs qui font fuir vos clients.”: a giant cobalt blue 3 on ivory.",
    },
    ig: `${IG}/p/DfpxgTWFUs7/`,
    date: "2026-11-12",
  },
  unexpectedHero: {
    id: "unexpected-hero",
    src: "/work/unexpected-hero",
    w: 512,
    h: 640,
    alt: {
      fr: "Visuel WE MUST « The Unexpected Hero » : une main tient une carte à jouer marocaine. « On reste fidèle à nos racines. »",
      en: "WE MUST visual “The Unexpected Hero”: a hand holds a Moroccan playing card. “On reste fidèle à nos racines.”",
    },
    ig: `${IG}/p/DfQEDOclacK/`,
    date: "2026-11-02",
  },
  whoAreWe: {
    id: "who-are-we",
    src: "/work/who-are-we",
    w: 512,
    h: 640,
    alt: {
      fr: "Visuel WE MUST « Who are we? Qui sommes-nous » : WEMUST CREATE, une agence basée à Casablanca.",
      en: "WE MUST visual “Who are we? Qui sommes-nous”: WEMUST CREATE, a Casablanca-based agency.",
    },
    ig: `${IG}/p/DfPsmbxjYrM/`,
    date: "2026-11-02",
  },
  letUsBoost: {
    id: "let-us-boost",
    src: "/work/let-us-boost",
    w: 512,
    h: 640,
    alt: {
      fr: "Visuel WE MUST « Let us boost your ideas » : un escargot sur un skateboard propulsé par des flammes.",
      en: "WE MUST visual “Let us boost your ideas”: a snail on a rocket-powered skateboard.",
    },
    ig: `${IG}/p/DfN6r-0FNC0/`,
    date: "2026-11-01",
  },
} satisfies Record<string, Visual>;
