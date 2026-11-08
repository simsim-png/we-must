import type { L } from "../lib/types";

export type WorkCategory = "branding" | "shooting" | "social" | "web";

export const workCategories: { id: WorkCategory; label: L }[] = [
  { id: "branding", label: { fr: "Branding", en: "Branding" } },
  { id: "shooting", label: { fr: "Photo & vidéo", en: "Photo & video" } },
  { id: "social", label: { fr: "Réseaux sociaux", en: "Social media" } },
  { id: "web", label: { fr: "Web & apps", en: "Web & apps" } },
];

export type Project = {
  slug: string;
  title: L;
  /** Only name the client with their permission. */
  client?: string;
  year: string;
  categories: WorkCategory[];
  summary: L;
  /** Images live in /public/work/<slug>/. */
  cover: { src: string; alt: L };
  /** Optional muted loop shown on hover in grids. */
  preview?: string;
  challenge?: L;
  approach?: L;
  /** Outcome in words. Add figures only if the client has verified them. */
  outcome?: L;
  gallery?: { src: string; alt: L; wide?: boolean }[];
  credits?: string[];
};

// Real projects only. Each entry gets its own page at /work/<slug> and is prerendered.
// Example shape:
// {
//   slug: "nom-du-projet",
//   title: { fr: "Nom du projet", en: "Project name" },
//   year: "2026",
//   categories: ["branding", "shooting"],
//   summary: { fr: "…", en: "…" },
//   cover: { src: "/work/nom-du-projet/cover.avif", alt: { fr: "…", en: "…" } },
// },
export const projects: Project[] = [];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);
