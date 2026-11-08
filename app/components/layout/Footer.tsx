import { useT } from "~/lib/i18n";
import { site } from "~/lib/site";
import { SplitWordmark } from "../brand/SplitWordmark";
import { Button } from "../ui/Button";
import { LangSwitch } from "../ui/LangSwitch";
import { LLink } from "../ui/LLink";
import { navItems, startProject } from "./nav";

export function Footer() {
  const t = useT();
  return (
    <footer className="overflow-hidden border-t border-ivory/10 pt-20 md:pt-28">
      <div className="container-site grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="serif-accent max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)]">On ne suit pas les tendances. On les crée.</p>
          <Button to="/contact" className="mt-10">{t(startProject)}</Button>
        </div>
        <nav className="md:col-span-3" aria-label={t({ fr: "Pied de page", en: "Footer" })}>
          <p className="label-mono mb-5 text-ivory-faint">{t({ fr: "Pages", en: "Pages" })}</p>
          <ul className="grid gap-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <LLink to={item.to} className="text-ivory-dim transition-colors hover:text-ivory">{t(item.label)}</LLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="label-mono mb-5 text-ivory-faint">{t({ fr: "Suivre", en: "Follow" })}</p>
          <ul className="grid gap-3">
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-ivory-dim transition-colors hover:text-ivory">Instagram</a></li>
            <li><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-ivory-dim transition-colors hover:text-ivory">LinkedIn</a></li>
            <li><a href={site.threads} target="_blank" rel="noopener noreferrer" className="text-ivory-dim transition-colors hover:text-ivory">Threads</a></li>
          </ul>
        </div>
      </div>

      <SplitWordmark className="mt-20 md:mt-28" />

      <div className="container-site label-mono flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-ivory-faint">
        <span>© {new Date().getFullYear()} WeMust · Casablanca</span>
        <span className="flex gap-6">
          <LLink to="/mentions-legales" className="hover:text-ivory">{t({ fr: "Mentions légales", en: "Legal notice" })}</LLink>
          <LLink to="/confidentialite" className="hover:text-ivory">{t({ fr: "Confidentialité", en: "Privacy" })}</LLink>
        </span>
        <LangSwitch />
      </div>
    </footer>
  );
}
