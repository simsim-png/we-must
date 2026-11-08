import type { MetaFunction } from "react-router";
import { AboutTeaser } from "~/components/sections/AboutTeaser";
import { ContactSection } from "~/components/sections/ContactSection";
import { FinalCta } from "~/components/sections/FinalCta";
import { Hero } from "~/components/sections/Hero";
import { Process } from "~/components/sections/Process";
import { SelectedWork } from "~/components/sections/SelectedWork";
import { ServicesGrid } from "~/components/sections/ServicesGrid";
import { Statement } from "~/components/sections/Statement";
import { organizationLd, seo } from "~/lib/seo";

export const meta: MetaFunction = ({ location }) =>
  seo({
    pathname: location.pathname,
    title: {
      fr: "WeMust — Agence créative & tech à Casablanca",
      en: "WeMust — Creative & technology agency in Casablanca",
    },
    description: {
      fr: "On ne suit pas les tendances. On les crée. Branding, photo et vidéo, réseaux sociaux, marketing digital, sites et applications web à Casablanca.",
      en: "We don’t follow trends. We create them. Branding, photo and video, social media, digital marketing, websites and web apps in Casablanca.",
    },
    jsonLd: organizationLd,
  });

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <ServicesGrid />
      <SelectedWork />
      <AboutTeaser />
      <Process />
      <FinalCta />
      <ContactSection />
    </>
  );
}
