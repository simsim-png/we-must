import type { MetaDescriptor } from "react-router";
import { SITE_URL } from "./constants";
import { langFromPath, localize, stripLang } from "./i18n";
import type { L } from "./types";

type SeoInput = {
  pathname: string;
  title: L;
  description: L;
  /** Path under /public. Defaults to the hero share image (asset H-03). */
  image?: string;
  jsonLd?: object;
};

export function seo({ pathname, title, description, image = "/media/og.jpg", jsonLd }: SeoInput): MetaDescriptor[] {
  const lang = langFromPath(pathname);
  const base = stripLang(pathname);
  const fullTitle = base === "/" ? title[lang] : `${title[lang]} — WeMust`;
  const url = SITE_URL + localize(base, lang);

  const tags: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: description[lang] },
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "fr", href: SITE_URL + localize(base, "fr") },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: SITE_URL + localize(base, "en") },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: SITE_URL + localize(base, "fr") },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "WeMust" },
    { property: "og:locale", content: lang === "fr" ? "fr_MA" : "en_US" },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description[lang] },
    { property: "og:url", content: url },
    { property: "og:image", content: SITE_URL + image },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (jsonLd) tags.push({ "script:ld+json": jsonLd });
  return tags;
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "WeMust",
  url: SITE_URL,
  slogan: "On ne suit pas les tendances. On les crée.",
  address: { "@type": "PostalAddress", addressLocality: "Casablanca", addressCountry: "MA" },
  areaServed: "MA",
  sameAs: [
    "https://www.instagram.com/wemustagency/",
    "https://www.linkedin.com/company/wemustagency",
  ],
};
