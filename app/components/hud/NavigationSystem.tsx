import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { Monogram } from "~/components/brand/Monogram";
import { copy } from "~/content/copy";
import { services } from "~/content/services";
import { cn } from "~/lib/cn";
import { localize, useT } from "~/lib/i18n";
import { useRouteView } from "~/lib/route";
import { site } from "~/lib/site";
import { STATION, STATION_COUNT, WORK_COUNT } from "~/state/layout";
import { scrollToStep } from "~/state/scroll";
import { setState, useStore } from "~/state/store";
import { LangSwitch } from "../ui/LangSwitch";
import { LLink } from "../ui/LLink";

type Target = "universe" | "work" | "about" | "contact";
const TARGETS: Target[] = ["universe", "work", "about", "contact"];

const pad = (n: number) => String(n).padStart(2, "0");

/** Which of the four top-level scenes a station belongs to. */
function targetOf(station: number): Target {
  if (station >= STATION.contact) return "contact";
  if (station >= STATION.about) return "about";
  if (station >= STATION.work) return "work";
  return "universe";
}

/**
 * The discreet interface around the picture: who we are (top left), where you can go (top
 * right), and where you are (the rail on the right edge, one tick per scene).
 */
export function NavigationSystem() {
  const { view, service, lang } = useRouteView();
  const t = useT();
  const navigate = useNavigate();
  const arrived = useStore((s) => s.arrived);
  const station = useStore((s) => s.station);
  const beat = useStore((s) => s.beat);
  const transit = useStore((s) => s.transit);
  const menuOpen = useStore((s) => s.menuOpen);

  const immersive = view !== "page";
  // During the opening and while the camera is in flight, only the logo stays.
  const quiet = immersive && (!arrived || transit === "entering" || transit === "exiting");
  const current = view === "home" ? targetOf(station) : null;
  // On the ivory world the M of the monogram turns ink, as in the brand's light lockup.
  const onIvory = view === "world" && service?.tone === "ivory" && transit === "inside" && !menuOpen;

  // The first scene of the universe and of each world invites the visitor to scroll.
  const cue = view === "home" ? station === 0 : beat === 0;
  // The contact scene has its own footer in that corner.
  const atContact = view === "home" && station === STATION.contact;

  const go = (target: Target) => {
    setState({ menuOpen: false });
    if (view === "home") scrollToStep(STATION[target]);
    else navigate(localize(target === "universe" ? "/" : `/#${target}`, lang));
  };

  const openWorld = (id: string) => {
    setState({ menuOpen: false });
    navigate(localize(`/services/${id}`, lang));
  };

  return (
    <>
      <header className="gutter fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between md:h-20">
        <LLink
          to="/"
          aria-label="WeMust"
          className="flex items-center gap-3"
          onClick={(e) => {
            if (view !== "home") return;
            e.preventDefault();
            go("universe");
          }}
        >
          <Monogram className="w-6 md:w-7" variant={onIvory ? "dark" : "light"} />
          <span className="display text-[0.8rem] tracking-[-0.02em] md:text-[0.9rem]">WeMust</span>
        </LLink>

        <div className={cn("flex items-center gap-2 transition-opacity duration-700 md:gap-6", quiet && "pointer-events-none opacity-0")}>
          <nav aria-label="Scenes" className="hidden items-center gap-7 lg:flex">
            {TARGETS.map((target) => (
              <button key={target} type="button" onClick={() => go(target)} aria-current={current === target ? "true" : undefined} className="link label">
                {t(copy.nav[target])}
              </button>
            ))}
          </nav>
          <LangSwitch />
          <button type="button" onClick={() => go("contact")} className="btn btn-sm btn-cobalt hidden lg:inline-flex">
            {t(copy.nav.start)}
          </button>
          <button
            type="button"
            className="label -mr-2 flex h-11 items-center gap-2 px-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setState({ menuOpen: !menuOpen })}
          >
            <span aria-hidden className="grid w-5 gap-1.5">
              <span className={cn("h-px bg-current transition-transform duration-500", menuOpen && "translate-y-[3.5px] rotate-[38.6deg]")} />
              <span className={cn("h-px bg-current transition-transform duration-500", menuOpen && "-translate-y-[3.5px] -rotate-[38.6deg]")} />
            </span>
            <span className="sr-only">{menuOpen ? t(copy.nav.close) : t(copy.nav.menu)}</span>
          </button>
        </div>
      </header>

      {/* Scene rail: where you are in the film. */}
      {immersive && (
        <nav
          aria-label="Progress"
          className={cn(
            "fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 pr-6 transition-opacity duration-700 lg:flex",
            quiet && "pointer-events-none opacity-0",
          )}
        >
          {view === "home" &&
            Array.from({ length: STATION_COUNT }, (_, i) => {
              const target = targetOf(i);
              const first = STATION[target] === i;
              const here = station === i;
              const name = t(copy.nav[target]);
              const text = target === "work" ? `${name} ${pad(i)} / ${pad(WORK_COUNT)}` : name;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToStep(i)}
                  aria-current={here ? "true" : undefined}
                  aria-label={text}
                  className="label flex h-3 items-center gap-3"
                >
                  <span className={cn("transition-opacity duration-300", here ? "opacity-100" : first ? "opacity-0 hover:opacity-70" : "opacity-0")}>{text}</span>
                  <span className={cn("rail-tick", !first && !here && "!w-2")} />
                </button>
              );
            })}
          {view === "world" &&
            service &&
            [t(service.name), t(copy.world.capabilities), t(copy.nav.work), t(copy.nav.contact)].map((text, i) => (
              <button key={i} type="button" onClick={() => scrollToStep(i)} aria-current={beat === i ? "true" : undefined} aria-label={text} className="label flex h-3 items-center gap-3">
                <span className={cn("transition-opacity duration-300", beat === i ? "opacity-100" : "opacity-0")}>{text}</span>
                <span className="rail-tick" />
              </button>
            ))}
        </nav>
      )}

      {/* Bottom right: a scroll cue on the opening scenes, the studio's coordinates elsewhere. */}
      {immersive && (
        <div className={cn("gutter pointer-events-none fixed bottom-5 right-0 z-30 hidden transition-opacity duration-700 md:block", quiet && "opacity-0")}>
          <p className={cn("label flex items-center gap-3 text-(--muted) transition-opacity duration-500", cue ? "opacity-100" : "absolute opacity-0")}>
            {t(copy.universe.scroll)}
            <span className="block h-6 w-px bg-current" style={{ animation: "cue 2.2s cubic-bezier(0.76,0,0.24,1) infinite" }} />
          </p>
          <p className={cn("label text-(--muted) transition-opacity duration-500", cue || atContact ? "absolute opacity-0" : "opacity-100")}>{t(copy.place)}</p>
        </div>
      )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label={t(copy.nav.menu)}
            className="gutter fixed inset-0 z-[35] flex flex-col justify-between overflow-y-auto bg-ink pb-8 pt-24 text-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="grid gap-1">
              {TARGETS.map((target, i) => (
                <motion.li key={target} initial={{ opacity: 0, y: 18, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.08 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                  <button type="button" onClick={() => go(target)} className="display flex w-full items-baseline gap-4 py-2 text-left text-[clamp(2rem,11vw,4rem)]">
                    <span className="label text-cobalt-soft">{pad(i + 1)}</span>
                    {t(copy.nav[target])}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10">
              <p className="label text-ivory/55">{t(copy.nav.worlds)}</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 border-t border-ivory/20">
                {services.map((s) => (
                  <li key={s.id} className="border-b border-ivory/20">
                    <button type="button" onClick={() => openWorld(s.id)} className="headline flex w-full items-baseline gap-3 py-3.5 text-left text-base">
                      <span className="label text-cobalt-soft">{s.num}</span>
                      {t(s.name)}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="label mt-8 flex flex-wrap items-center justify-between gap-4 text-ivory/70">
                <a href={site.instagram} target="_blank" rel="noreferrer" className="link">
                  {site.instagramHandle}
                </a>
                <span>Casablanca</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
