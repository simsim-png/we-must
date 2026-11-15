import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ExperienceHost } from "~/components/hud/ExperienceHost";
import { Loader } from "~/components/hud/Loader";
import { NavigationSystem } from "~/components/hud/NavigationSystem";
import { PortalFlash } from "~/components/hud/PortalFlash";
import { copy } from "~/content/copy";
import { localize, useT } from "~/lib/i18n";
import { useRouteView } from "~/lib/route";
import { actions } from "~/state/actions";
import { useBoot } from "~/state/boot";
import { skipIntro, syncRoute } from "~/state/director";
import { lockScroll } from "~/state/scroll";
import { getState, setState, useStore } from "~/state/store";

/**
 * The stage. The WebGL universe is mounted here once and stays mounted while the visitor
 * moves between the universe and the four worlds; the routes underneath only add their
 * scroll track and their text. Legal pages and the 404 are plain pages without the canvas.
 */
export default function SiteLayout() {
  const { view, service, lang } = useRouteView();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const ready = useStore((s) => s.ready);
  const entered = useStore((s) => s.entered);
  const transit = useStore((s) => s.transit);
  const menuOpen = useStore((s) => s.menuOpen);
  const serviceId = service?.id ?? null;
  const immersive = view !== "page";

  useBoot();

  // The 3D scene asks for navigation through these (it has no access to the router).
  useEffect(() => {
    actions.openWorld = (id) => navigate(localize(`/services/${id}`, lang));
    actions.closeWorld = () => navigate(localize("/", lang));
  }, [navigate, lang]);

  useEffect(() => {
    setState({ view, service: serviceId, menuOpen: false, hovered: null });
  }, [view, serviceId]);

  // Keep the scene in step with the URL. The first sync after loading is a cut, not a flight.
  const fresh = useRef(true);
  useEffect(() => {
    if (view === "page") {
      syncRoute("page", null, true);
      fresh.current = true;
      return;
    }
    if (!ready) {
      fresh.current = true;
      return;
    }
    const first = fresh.current;
    fresh.current = false;
    // Deep links and return visits skip the opening and land where the URL points.
    if (first && (view === "world" || hash || getState().entered)) skipIntro();
    syncRoute(view, serviceId, first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, view, serviceId]);

  // No scrolling before "Enter the universe", nor while the camera is in flight.
  const locked = immersive && (!entered || transit === "entering" || transit === "exiting" || menuOpen);
  useEffect(() => {
    lockScroll(locked);
    return () => lockScroll(false);
  }, [locked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = getState();
      if (s.menuOpen) setState({ menuOpen: false });
      else if (s.view === "world" && s.transit === "inside") actions.closeWorld();
      else if (s.hovered) setState({ hovered: null });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tone = view === "world" && service && transit === "inside" && !menuOpen ? service.tone : "ink";

  return (
    <div className="stage" data-tone={tone} data-view={view}>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[100] -translate-y-24 bg-cobalt px-5 py-3 text-ivory transition-transform focus:translate-y-0"
      >
        {t(copy.nav.skip)}
      </a>
      {immersive && <ExperienceHost />}
      {immersive && <PortalFlash />}
      <NavigationSystem />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      {immersive && <Loader />}
    </div>
  );
}
