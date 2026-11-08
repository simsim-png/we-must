import type { L } from "../lib/types";
import type { MediaId } from "./media";

export type Service = {
  slug: string;
  num: string;
  media: MediaId;
  title: L;
  short: L;
  intro: L;
  forWho: L;
  deliverables: L<string[]>;
  seoDescription: L;
};

export const services: Service[] = [
  {
    slug: "branding",
    num: "01",
    media: "H-04",
    title: { fr: "Branding & identité visuelle", en: "Branding & visual identity" },
    short: {
      fr: "Des identités qu’on reconnaît avant même de les lire.",
      en: "Identities people recognise before they read them.",
    },
    intro: {
      fr: "Une marque forte commence par une idée claire. Nous définissons votre positionnement, puis nous le traduisons en un système visuel cohérent : logo, couleurs, typographies, règles d’usage. Chaque point de contact parle la même langue.",
      en: "A strong brand starts with a clear idea. We define your positioning, then turn it into a coherent visual system: logo, colours, typography and usage rules. Every touchpoint speaks the same language.",
    },
    forWho: {
      fr: "Entreprises qui se lancent, marques qui ont grandi plus vite que leur image, ou qui veulent monter en gamme.",
      en: "Businesses launching, brands that have outgrown their image, or brands moving upmarket.",
    },
    deliverables: {
      fr: ["Plateforme de marque : positionnement, ton, valeurs", "Logo et système d’identité", "Palette, typographies, iconographie", "Charte graphique", "Déclinaisons print et digitales", "Packaging, sur demande"],
      en: ["Brand platform: positioning, tone, values", "Logo and identity system", "Palette, typography, iconography", "Brand guidelines", "Print and digital applications", "Packaging, on request"],
    },
    seoDescription: {
      fr: "Agence de branding à Casablanca : stratégie de marque, logo, identité visuelle et charte graphique par WeMust.",
      en: "Branding agency in Casablanca: brand strategy, logo, visual identity and guidelines by WeMust.",
    },
  },
  {
    slug: "shooting",
    num: "02",
    media: "H-05",
    title: { fr: "Photo & vidéo", en: "Photography & video" },
    short: { fr: "Photo et vidéo, chez vous.", en: "Photo and video, on your premises." },
    intro: {
      fr: "Nous pensons chaque image comme un plan de cinéma : une intention, une lumière, un cadre. Nous venons tourner chez vous, dans vos espaces et avec vos équipes, puis nous livrons des contenus prêts pour chaque plateforme.",
      en: "We treat every image like a film shot: an intention, a light, a frame. We shoot on your premises, in your spaces and with your teams, then deliver content ready for every platform.",
    },
    forWho: {
      fr: "Restaurants, commerces, marques produit et entreprises qui veulent des images à la hauteur de ce qu’ils font.",
      en: "Restaurants, retailers, product brands and companies that want images as good as their work.",
    },
    deliverables: {
      fr: ["Direction artistique et moodboard", "Shooting produit, lifestyle et corporate", "Films de marque et reels", "Portraits d’équipe", "Post-production et étalonnage", "Formats adaptés à chaque plateforme"],
      en: ["Art direction and moodboard", "Product, lifestyle and corporate shoots", "Brand films and reels", "Team portraits", "Post-production and colour grading", "Formats for every platform"],
    },
    seoDescription: {
      fr: "Shooting photo et vidéo à Casablanca : produit, lifestyle, corporate, films de marque et reels par WeMust.",
      en: "Photo and video production in Casablanca: product, lifestyle, corporate, brand films and reels by WeMust.",
    },
  },
  {
    slug: "social-media",
    num: "03",
    media: "H-06",
    title: { fr: "Gestion des réseaux sociaux", en: "Social media management" },
    short: {
      fr: "Une présence qui arrête le scroll, semaine après semaine.",
      en: "A presence that stops the scroll, week after week.",
    },
    intro: {
      fr: "Nous prenons en charge vos réseaux de la stratégie à la publication : ligne éditoriale, calendrier, création, rédaction en français, darija ou anglais, et suivi de la communauté. Vous gardez la validation, nous gardons le rythme.",
      en: "We run your social channels from strategy to publishing: editorial line, calendar, creative, copywriting in French, Darija or English, and community management. You keep sign-off; we keep the pace.",
    },
    forWho: {
      fr: "Marques qui publient sans stratégie, ou qui n’ont pas le temps de publier du tout.",
      en: "Brands that post without a strategy, or don’t have time to post at all.",
    },
    deliverables: {
      fr: ["Stratégie éditoriale et calendrier", "Création de posts, carrousels et reels", "Rédaction FR, darija et EN", "Community management", "Rapport mensuel", "Accompagnement publicitaire Meta et TikTok"],
      en: ["Editorial strategy and calendar", "Posts, carousels and reels", "Copywriting in FR, Darija and EN", "Community management", "Monthly report", "Meta and TikTok ads support"],
    },
    seoDescription: {
      fr: "Gestion des réseaux sociaux à Casablanca : stratégie, création de contenu, community management par WeMust.",
      en: "Social media management in Casablanca: strategy, content creation and community management by WeMust.",
    },
  },
  {
    slug: "marketing",
    num: "04",
    media: "H-07",
    title: { fr: "Marketing digital & contenu", en: "Digital marketing & content" },
    short: {
      fr: "Des campagnes qui ont quelque chose à dire, et le disent bien.",
      en: "Campaigns with something to say, said well.",
    },
    intro: {
      fr: "Visibilité, prospects, ventes : nous partons de votre objectif et construisons la campagne qui y répond. Contenus, ciblage, pages d’atterrissage et mesure, pour savoir ce qui fonctionne et l’amplifier.",
      en: "Awareness, leads, sales: we start from your goal and build the campaign that serves it. Content, targeting, landing pages and measurement, so you know what works and can scale it.",
    },
    forWho: {
      fr: "Entreprises qui veulent des résultats mesurables de leur présence en ligne.",
      en: "Businesses that want measurable results from their online presence.",
    },
    deliverables: {
      fr: ["Stratégie d’acquisition", "Campagnes Meta Ads et Google Ads", "Contenus de campagne", "Pages d’atterrissage", "Suivi et analytics", "Tests et optimisation"],
      en: ["Acquisition strategy", "Meta Ads and Google Ads campaigns", "Campaign content", "Landing pages", "Tracking and analytics", "Testing and optimisation"],
    },
    seoDescription: {
      fr: "Marketing digital à Casablanca : campagnes Meta et Google Ads, contenus et landing pages par WeMust.",
      en: "Digital marketing in Casablanca: Meta and Google Ads campaigns, content and landing pages by WeMust.",
    },
  },
  {
    slug: "web",
    num: "05",
    media: "H-08",
    title: { fr: "Design & développement web", en: "Website design & development" },
    short: { fr: "Votre site rame ? Vos clients partent.", en: "Slow site? Your clients leave." },
    intro: {
      fr: "Nous concevons des sites rapides, beaux et pensés pour convertir. Chaque projet part de vos visiteurs : ce qu’ils cherchent, ce qui les convainc, ce qui les fait vous contacter. Design sur mesure, code propre, référencement intégré dès le départ.",
      en: "We build websites that are fast, beautiful and built to convert. Every project starts with your visitors: what they look for, what convinces them, what makes them get in touch. Custom design, clean code, SEO built in from day one.",
    },
    forWho: {
      fr: "Entreprises dont le site actuel est lent, daté, ou ne rapporte aucun contact.",
      en: "Businesses whose current site is slow, dated, or brings in no enquiries.",
    },
    deliverables: {
      fr: ["UX, arborescence et wireframes", "Design d’interface sur mesure", "Développement responsive et performant", "SEO technique et local", "Gestion de contenu autonome", "Hébergement et maintenance"],
      en: ["UX, sitemap and wireframes", "Custom interface design", "Fast, responsive development", "Technical and local SEO", "Self-managed content", "Hosting and maintenance"],
    },
    seoDescription: {
      fr: "Création de site web à Casablanca : design sur mesure, développement rapide et SEO par WeMust.",
      en: "Website design and development in Casablanca: custom design, fast builds and SEO by WeMust.",
    },
  },
  {
    slug: "applications",
    num: "06",
    media: "H-09",
    title: { fr: "Applications web", en: "Web applications" },
    short: {
      fr: "Des outils sur mesure, aussi soignés que votre marque.",
      en: "Custom tools, as polished as your brand.",
    },
    intro: {
      fr: "Plateformes, SaaS, espaces clients, outils internes : nous concevons et développons des applications web fiables, avec la même exigence de design que nos projets de marque. Du prototype au produit en ligne.",
      en: "Platforms, SaaS, client portals, internal tools: we design and build reliable web applications with the same design standard as our brand work. From prototype to live product.",
    },
    forWho: {
      fr: "Entreprises et porteurs de projet qui ont besoin d’un produit digital, pas seulement d’un site.",
      en: "Companies and founders who need a digital product, not just a website.",
    },
    deliverables: {
      fr: ["Cadrage produit et prototypes", "Design UX/UI", "Applications web et SaaS sur mesure", "Tableaux de bord et outils internes", "Intégrations API et paiement", "Évolution et support"],
      en: ["Product scoping and prototypes", "UX/UI design", "Custom web apps and SaaS", "Dashboards and internal tools", "API and payment integrations", "Ongoing development and support"],
    },
    seoDescription: {
      fr: "Développement d’applications web et SaaS sur mesure à Casablanca par WeMust.",
      en: "Custom web application and SaaS development in Casablanca by WeMust.",
    },
  },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
