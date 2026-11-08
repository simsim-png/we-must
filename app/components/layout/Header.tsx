import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { cn } from "~/lib/cn";
import { stripLang, useT } from "~/lib/i18n";
import { Monogram } from "../brand/Monogram";
import { Button } from "../ui/Button";
import { LangSwitch } from "../ui/LangSwitch";
import { LLink } from "../ui/LLink";
import { MobileMenu } from "./MobileMenu";
import { navItems, startProject } from "./nav";

export function Header() {
  const t = useT();
  const { pathname } = useLocation();
  const base = stripLang(pathname);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 240);
  });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-500",
          scrolled && !open ? "border-b border-ivory/10 bg-charcoal/95" : "border-b border-transparent",
        )}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
      >
        <div className="container-site flex h-16 items-center gap-8 md:h-20">
          <LLink to="/" className="flex items-center gap-3" aria-label={t({ fr: "WeMust, accueil", en: "WeMust, home" })}>
            <Monogram className="w-6" />
            <span className="display text-[0.95rem] tracking-[0.02em]">WEMUST</span>
          </LLink>

          <nav aria-label={t({ fr: "Navigation principale", en: "Main navigation" })} className="ml-auto hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const active = base === item.to || base.startsWith(`${item.to}/`);
                return (
                  <li key={item.to}>
                    <LLink
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[0.95rem] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-cobalt-light after:transition-transform after:duration-500 after:ease-brand",
                        active ? "text-ivory after:scale-x-100" : "text-ivory-dim after:scale-x-0 hover:text-ivory hover:after:scale-x-100",
                      )}
                    >
                      {t(item.label)}
                    </LLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <LangSwitch className="hidden md:flex" />
          <div className="hidden lg:block">
            <Button to="/contact" size="sm">{t(startProject)}</Button>
          </div>

          <button
            type="button"
            className="label-mono ml-auto flex h-11 items-center gap-3 text-ivory md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t({ fr: "Fermer", en: "Close" }) : "Menu"}
            <span aria-hidden className="relative block h-3 w-6">
              <span className={cn("absolute inset-x-0 top-0 h-px bg-ivory transition-transform duration-300", open && "translate-y-1.5 rotate-[38.6deg]")} />
              <span className={cn("absolute inset-x-0 bottom-0 h-px bg-cobalt-light transition-transform duration-300", open && "-translate-y-1.5 -rotate-[38.6deg]")} />
            </span>
          </button>
        </div>
      </motion.header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
