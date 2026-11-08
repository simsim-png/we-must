import type { MetaFunction } from "react-router";
import { useParams } from "react-router";
import { LoopVideo } from "~/components/media/LoopVideo";
import { Reveal } from "~/components/motion/Reveal";
import { ContactSection } from "~/components/sections/ContactSection";
import { PageHero } from "~/components/sections/PageHero";
import { ServiceCard } from "~/components/sections/ServiceCard";
import { Button } from "~/components/ui/Button";
import { process } from "~/content/process";
import { getService, services } from "~/content/services";
import { SITE_URL } from "~/lib/constants";
import { langFromPath, useT } from "~/lib/i18n";
import { seo } from "~/lib/seo";
import NotFound from "./not-found";

export const meta: MetaFunction = ({ params, location }) => {
  const s = getService(params.slug);
  if (!s) return [{ title: "404 — WeMust" }, { name: "robots", content: "noindex" }];
  const lang = langFromPath(location.pathname);
  return seo({
    pathname: location.pathname,
    title: { fr: `${s.title.fr} à Casablanca`, en: `${s.title.en} in Casablanca` },
    description: s.seoDescription,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title[lang],
      description: s.seoDescription[lang],
      areaServed: "Casablanca, MA",
      provider: { "@type": "ProfessionalService", name: "WeMust", url: SITE_URL },
    },
  });
};

export default function ServicePage() {
  const t = useT();
  const { slug } = useParams();
  const service = getService(slug);
  if (!service) return <NotFound />;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const index = services.indexOf(service);

  return (
    <>
      <PageHero label={`Service ${service.num}`} title={t(service.title)} reflection={t(service.short)} />

      <section className="container-site grid gap-16 pb-24 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <LoopVideo id={service.media} focus={["40%", "60%"]} className="relative aspect-[4/5]" />
        </Reveal>
        <div className="md:col-span-6 md:col-start-7">
          <p className="text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug">{t(service.intro)}</p>

          <h2 className="label-mono mt-16 text-ivory-dim">{t({ fr: "Ce que nous livrons", en: "What we deliver" })}</h2>
          <ul className="mt-6 border-t border-ivory/12">
            {t(service.deliverables).map((d, i) => (
              <li key={d} className="flex gap-6 border-b border-ivory/12 py-4 text-lg">
                <span className="label-mono w-6 pt-1.5 text-cobalt-light">{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ul>

          <h2 className="label-mono mt-16 text-ivory-dim">{t({ fr: "Pour qui", en: "Who it’s for" })}</h2>
          <p className="mt-4 text-lg text-ivory-dim">{t(service.forWho)}</p>

          <h2 className="label-mono mt-16 text-ivory-dim">{t({ fr: "Comment nous travaillons", en: "How we work" })}</h2>
          <ol className="mt-6 grid gap-3">
            {process.map((p) => (
              <li key={p.num} className="flex gap-6">
                <span className="label-mono w-6 pt-1 text-cobalt-light">{p.num}</span>
                <span><strong className="font-semibold">{t(p.title)}.</strong> <span className="text-ivory-dim">{t(p.text)}</span></span>
              </li>
            ))}
          </ol>

          <Button to="/contact" className="mt-14">{t({ fr: "Parler de ce projet", en: "Discuss this project" })}</Button>
        </div>
      </section>

      <section className="container-site border-t border-ivory/10 py-section">
        <p className="label-mono mb-10 text-ivory-dim"><span className="text-cobalt-light">—</span> {t({ fr: "Autres services", en: "Other services" })}</p>
        <ul className="grid gap-5 md:grid-cols-3">
          {others.map((s, i) => (
            <li key={s.slug}><ServiceCard service={s} index={index + i + 1} /></li>
          ))}
        </ul>
      </section>
      <ContactSection />
    </>
  );
}
