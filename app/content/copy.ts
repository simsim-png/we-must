import type { L } from "../lib/types";

// Interface copy for the universe.
//
// Signature lines ("Enter the universe", scene titles, the contact headline) stay in English
// on both language versions, the way WE MUST's own posts mix an English headline with French
// copy. Everything explanatory is translated. Change a line here and it changes everywhere.

const both = (s: string): L => ({ fr: s, en: s });

export const copy = {
  tagline: {
    fr: "On ne suit pas les tendances. On les crée.",
    en: "We don’t follow trends. We create them.",
  } satisfies L,
  /** The same line in the other language, shown small under the main one. */
  taglineEcho: {
    fr: "We don’t follow trends. We create them.",
    en: "On ne suit pas les tendances. On les crée.",
  } satisfies L,
  baseline: {
    fr: "Agence créative & tech · Casablanca",
    en: "Creative & tech agency · Casablanca",
  } satisfies L,

  loader: { fr: "Chargement de l’univers", en: "Loading the universe" } satisfies L,

  intro: {
    scene: both("Scene 01"),
    enter: both("Enter the universe"),
    hint: { fr: "Cliquez ou faites défiler", en: "Click or scroll" } satisfies L,
  },

  universe: {
    scene: both("Scene 02"),
    title: both("The Creative Universe"),
    text: {
      fr: "Quatre mondes gravitent autour d’une seule identité. Choisissez-en un, et entrez.",
      en: "Four worlds orbit a single identity. Pick one, and step inside.",
    } satisfies L,
    hintMouse: {
      fr: "Survolez · Cliquez pour entrer · Glissez pour faire tourner",
      en: "Hover · Click to enter · Drag to rotate",
    } satisfies L,
    hintTouch: {
      fr: "Touchez un monde · Glissez pour faire tourner",
      en: "Tap a world · Swipe sideways to rotate",
    } satisfies L,
    enter: { fr: "Entrer", en: "Enter" } satisfies L,
    scroll: { fr: "Défiler", en: "Scroll" } satisfies L,
  },

  world: {
    scene: both("Scene 03"),
    label: { fr: "Monde", en: "World" } satisfies L,
    back: { fr: "Retour à l’univers", en: "Back to universe" } satisfies L,
    capabilities: { fr: "Ce qu’on fait", en: "What we do" } satisfies L,
    work: { fr: "Dans ce monde", en: "From this world" } satisfies L,
    seeOnInstagram: { fr: "Voir sur Instagram", en: "View on Instagram" } satisfies L,
    allWork: { fr: "Tous les travaux", en: "All work" } satisfies L,
    ctaTitle: {
      fr: "Un projet dans ce monde ?",
      en: "A project in this world?",
    } satisfies L,
    ctaText: {
      fr: "Racontez-nous ce que vous voulez construire. On vous répond rapidement.",
      en: "Tell us what you want to build. We reply quickly.",
    } satisfies L,
    cta: { fr: "Discuter d’un projet", en: "Discuss a project" } satisfies L,
    next: { fr: "Monde suivant", en: "Next world" } satisfies L,
  },

  work: {
    scene: both("Scene 04"),
    title: both("Selected Work"),
    note: {
      fr: "Nos propres campagnes, telles que publiées.",
      en: "Our own campaigns, as published.",
    } satisfies L,
    view: { fr: "Voir sur Instagram", en: "View on Instagram" } satisfies L,
  },

  about: {
    scene: both("Scene 05"),
    title: both("About WE MUST"),
    statement: ["We don’t follow trends.", "We create them."],
    body: {
      fr: "WeMust est une agence créative & tech basée à Casablanca. Quatre métiers gravitent autour d’une même exigence : rendre une marque impossible à confondre. Identité, image, contenu et produit digital sont pensés ensemble, pour que tout raconte la même histoire.",
      en: "WeMust is a creative & tech agency based in Casablanca. Four crafts orbit one demand: making a brand impossible to mistake for another. Identity, image, content and digital product are designed together, so everything tells the same story.",
    } satisfies L,
    /** WE MUST's own words, from the "Who are we?" post. Kept in English as published. */
    quote: "Real humans, real energy, real ideas.",
    quoteSource: both("@wemustagency"),
    approach: { fr: "Notre approche", en: "Our approach" } satisfies L,
  },

  contact: {
    scene: both("Scene 06"),
    title: both("Contact"),
    headline: ["Ready to create", "your next universe?"],
    text: {
      fr: "Parlez-nous de votre projet. Le plus rapide : un message privé sur Instagram.",
      en: "Tell us about your project. The fastest way: a direct message on Instagram.",
    } satisfies L,
    instagram: { fr: "Écrire sur Instagram", en: "Message us on Instagram" } satisfies L,
    whatsapp: both("WhatsApp"),
    email: { fr: "Envoyer un email", en: "Send an email" } satisfies L,
    form: { fr: "Remplir le formulaire", en: "Use the form" } satisfies L,
    closeForm: { fr: "Fermer", en: "Close" } satisfies L,
    legal: { fr: "Mentions légales", en: "Legal notice" } satisfies L,
    privacy: { fr: "Confidentialité", en: "Privacy" } satisfies L,
    backToStart: { fr: "Retour au début", en: "Back to start" } satisfies L,
  },

  nav: {
    universe: { fr: "Univers", en: "Universe" } satisfies L,
    work: { fr: "Travaux", en: "Work" } satisfies L,
    about: { fr: "À propos", en: "About" } satisfies L,
    contact: both("Contact"),
    worlds: { fr: "Les quatre mondes", en: "The four worlds" } satisfies L,
    start: { fr: "Démarrer un projet", en: "Start a project" } satisfies L,
    menu: both("Menu"),
    close: { fr: "Fermer", en: "Close" } satisfies L,
    skip: { fr: "Aller au contenu", en: "Skip to content" } satisfies L,
  },

  place: both("Casablanca · 33.57°N 7.59°W"),
};
