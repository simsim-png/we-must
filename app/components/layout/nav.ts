import type { L } from "~/lib/types";

export const navItems: { to: string; label: L }[] = [
  { to: "/work", label: { fr: "Travaux", en: "Work" } },
  { to: "/services", label: { fr: "Services", en: "Services" } },
  { to: "/about", label: { fr: "À propos", en: "About" } },
  { to: "/contact", label: { fr: "Contact", en: "Contact" } },
];

export const startProject: L = { fr: "Démarrer un projet", en: "Start a project" };
