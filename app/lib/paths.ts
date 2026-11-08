import { services } from "../content/services";
import { projects } from "../content/work";

// Every URL to prerender, used by react-router.config.ts for HTML and sitemap.xml.
export function allPaths() {
  const fr = [
    "/",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/work",
    ...projects.map((p) => `/work/${p.slug}`),
    "/about",
    "/contact",
    "/mentions-legales",
    "/confidentialite",
  ];
  const en = fr.map((p) => (p === "/" ? "/en" : `/en${p}`));
  return [...fr, ...en];
}
