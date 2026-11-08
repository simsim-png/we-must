import { index, layout, prefix, route, type RouteConfig } from "@react-router/dev/routes";

// The same page modules serve both languages; ids keep the two trees distinct.
function pages(lang: "fr" | "en") {
  const id = (name: string) => ({ id: `${lang}-${name}` });
  return [
    index("routes/home.tsx", id("home")),
    route("services", "routes/services.tsx", id("services")),
    route("services/:slug", "routes/service.tsx", id("service")),
    route("work", "routes/work.tsx", id("work")),
    route("work/:slug", "routes/case.tsx", id("case")),
    route("about", "routes/about.tsx", id("about")),
    route("contact", "routes/contact.tsx", id("contact")),
    route("mentions-legales", "routes/legal.tsx", id("legal")),
    route("confidentialite", "routes/privacy.tsx", id("privacy")),
  ];
}

export default [
  layout("routes/layout.tsx", [
    ...pages("fr"),
    ...prefix("en", pages("en")),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
