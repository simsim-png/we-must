import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";

// The same page modules serve both languages; ids keep the two trees distinct.
function pages(lang: "fr" | "en") {
  const id = (name: string) => ({ id: `${lang}-${name}` });
  return [
    // The universe: one scroll journey through every scene.
    index("routes/home.tsx", id("home")),
    // One world per service, entered from its sphere or directly by URL.
    route("services/:service", "routes/world.tsx", id("world")),
    route("mentions-legales", "routes/legal.tsx", id("legal")),
    route("confidentialite", "routes/privacy.tsx", id("privacy")),
    // URLs from earlier versions of the site now point at scenes of the universe.
    route("services", "routes/legacy.tsx", id("legacy-services")),
    route("work/*", "routes/legacy.tsx", id("legacy-work")),
    route("about", "routes/legacy.tsx", id("legacy-about")),
    route("contact", "routes/legacy.tsx", id("legacy-contact")),
  ];
}

export default [
  layout("routes/layout.tsx", [
    ...pages("fr"),
    ...prefix("en", pages("en")),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
