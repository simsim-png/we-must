import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useT } from "~/lib/i18n";
import { site, whatsappUrl } from "~/lib/site";
import { useLenis } from "../motion/SmoothScroll";
import { LangSwitch } from "../ui/LangSwitch";
import { LLink } from "../ui/LLink";
import { navItems, startProject } from "./nav";

const EASE = [0.7, 0, 0.2, 1] as const;

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const lenis = useLenis();
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => firstLink.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  const links = [...navItems, { to: "/contact", label: startProject }];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-charcoal pt-24 md:hidden"
          initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 50% 0%, 0% 0%)" }}
          animate={{
            clipPath: [
              "polygon(0% 0%, 100% 0%, 100% 0%, 50% 0%, 0% 0%)",
              "polygon(0% 0%, 100% 0%, 100% 45%, 50% 80%, 0% 45%)",
              "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)",
            ],
          }}
          exit={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 50% 0%, 0% 0%)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <nav className="container-site flex-1" aria-label={t({ fr: "Navigation principale", en: "Main navigation" })}>
            <ul className="grid gap-2">
              {links.map((item, i) => (
                <motion.li
                  key={`${item.to}-${i}`}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.2, 0.7, 0.1, 1] }}
                >
                  <LLink
                    ref={i === 0 ? firstLink : undefined}
                    to={item.to}
                    onClick={onClose}
                    className={`display block py-2 text-[clamp(2.2rem,11vw,3.5rem)] ${i === links.length - 1 ? "text-cobalt-light" : "text-ivory"}`}
                  >
                    {t(item.label)}
                  </LLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="container-site flex items-end justify-between gap-6 border-t border-ivory/10 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <ul className="label-mono grid gap-3 text-ivory-dim">
              <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">Instagram</a></li>
              <li><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">LinkedIn</a></li>
              {site.whatsapp && (
                <li><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">WhatsApp</a></li>
              )}
            </ul>
            <LangSwitch />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
