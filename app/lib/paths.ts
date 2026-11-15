import { services } from "../content/services";

// Every URL to prerender, used by react-router.config.ts for HTML and sitemap.xml.
export function allPaths() {
  const fr = ["/", ...services.map((s) => `/services/${s.id}`), "/mentions-legales", "/confidentialite"];
  const en = fr.map((p) => (p === "/" ? "/en" : `/en${p}`));
  return [...fr, ...en];
}
