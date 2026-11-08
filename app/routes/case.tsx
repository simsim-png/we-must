import type { MetaFunction } from "react-router";
import { useParams } from "react-router";
import { Reveal } from "~/components/motion/Reveal";
import { FinalCta } from "~/components/sections/FinalCta";
import { PageHero } from "~/components/sections/PageHero";
import { Button } from "~/components/ui/Button";
import { getProject, projects, workCategories } from "~/content/work";
import { cn } from "~/lib/cn";
import { useT } from "~/lib/i18n";
import { seo } from "~/lib/seo";
import NotFound from "./not-found";

export const meta: MetaFunction = ({ params, location }) => {
  const p = getProject(params.slug);
  if (!p) return [{ title: "404 — WeMust" }, { name: "robots", content: "noindex" }];
  return seo({ pathname: location.pathname, title: p.title, description: p.summary, image: p.cover.src });
};

/** Case study template. Every section renders only when the project supplies it. */
export default function CaseStudy() {
  const t = useT();
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const cats = project.categories.map((c) => t(workCategories.find((w) => w.id === c)!.label));
  const story = [
    { label: { fr: "Le défi", en: "The challenge" }, body: project.challenge },
    { label: { fr: "Notre approche", en: "Our approach" }, body: project.approach },
    { label: { fr: "Le résultat", en: "The outcome" }, body: project.outcome },
  ].filter((s) => s.body);

  return (
    <>
      <PageHero label={cats.join(" · ")} title={t(project.title)} intro={t(project.summary)}>
        <dl className="label-mono mt-14 flex flex-wrap gap-x-12 gap-y-4 text-ivory-dim">
          {project.client && (
            <div><dt className="text-ivory-faint">Client</dt><dd className="mt-1 text-ivory">{project.client}</dd></div>
          )}
          <div><dt className="text-ivory-faint">{t({ fr: "Année", en: "Year" })}</dt><dd className="mt-1 text-ivory">{project.year}</dd></div>
          <div><dt className="text-ivory-faint">{t({ fr: "Expertises", en: "Expertise" })}</dt><dd className="mt-1 text-ivory">{cats.join(", ")}</dd></div>
        </dl>
      </PageHero>

      <div className="container-site">
        <img src={project.cover.src} alt={t(project.cover.alt)} className="aspect-[16/9] w-full object-cover" />
      </div>

      {story.length > 0 && (
        <section className="container-site grid gap-12 py-section md:grid-cols-3">
          {story.map((s) => (
            <Reveal key={s.label.fr}>
              <h2 className="label-mono text-cobalt-light">{t(s.label)}</h2>
              <p className="mt-5 text-lg text-ivory-dim">{t(s.body!)}</p>
            </Reveal>
          ))}
        </section>
      )}

      {project.gallery && (
        <section className="container-site grid gap-5 pb-section md:grid-cols-2">
          {project.gallery.map((img) => (
            <Reveal key={img.src} className={cn(img.wide && "md:col-span-2")}>
              <img src={img.src} alt={t(img.alt)} loading="lazy" className="w-full" />
            </Reveal>
          ))}
        </section>
      )}

      {project.credits && (
        <section className="container-site border-t border-ivory/10 py-12">
          <h2 className="label-mono text-ivory-faint">Credits</h2>
          <p className="mt-3 text-ivory-dim">{project.credits.join(" · ")}</p>
        </section>
      )}

      {next && next !== project && (
        <section className="container-site border-t border-ivory/10 py-16">
          <Button to={`/work/${next.slug}`} variant="ghost" size="lg">
            {t({ fr: "Projet suivant", en: "Next project" })} — {t(next.title)}
          </Button>
        </section>
      )}
      <FinalCta />
    </>
  );
}
