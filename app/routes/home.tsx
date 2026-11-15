import { useCallback, useEffect, useRef } from "react";
import { useLocation, type MetaFunction } from "react-router";
import { SphereLabels } from "~/components/hud/SphereLabels";
import { AboutScene } from "~/components/scenes/AboutScene";
import { ContactScene } from "~/components/scenes/ContactScene";
import { IntroScene } from "~/components/scenes/IntroScene";
import { UniverseOverlay } from "~/components/scenes/UniverseOverlay";
import { WorkScene } from "~/components/scenes/WorkScene";
import { HASH_STATIONS } from "~/lib/route";
import { organizationLd, seo } from "~/lib/seo";
import { skipIntro } from "~/state/director";
import { STATION, STATION_COUNT } from "~/state/layout";
import { scrollToStep, useScrollTrack } from "~/state/scroll";
import { getState, setState, useStore } from "~/state/store";

export const meta: MetaFunction = ({ location }) =>
  seo({
    pathname: location.pathname,
    title: {
      fr: "WeMust — Agence créative à Casablanca",
      en: "WeMust — Creative agency in Casablanca",
    },
    description: {
      fr: "On ne suit pas les tendances. On les crée. Branding, shooting, réseaux sociaux, web & apps : WeMust, agence créative à Casablanca.",
      en: "We don’t follow trends. We create them. Branding, shooting, social media, web & apps: WeMust, a creative agency in Casablanca.",
    },
    jsonLd: organizationLd,
  });

/**
 * The universe. One tall track gives the page its length; scrolling it moves the camera
 * through the scenes (universe → six projects → about → contact) and each scene's text
 * comes into focus when the camera gets there.
 */
export default function Home() {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useStore((s) => s.reduced);
  const arrived = useStore((s) => s.arrived);
  const ready = useStore((s) => s.ready);
  const transit = useStore((s) => s.transit);
  const { hash, key } = useLocation();
  const handled = useRef<string | null>(null);

  const onStep = useCallback((index: number) => {
    // Leaving the first scene lets go of whichever sphere was in focus.
    setState(index === 0 ? { station: index } : { station: index, hovered: null });
  }, []);
  useScrollTrack(track, { key: "u", steps: STATION_COUNT, onStep, reduced });

  // Arriving without an anchor always starts at the first scene.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  // /#work, /#about, /#contact (and the old /work, /about, /contact URLs) land on their scene.
  useEffect(() => {
    const target = HASH_STATIONS[hash];
    if (!target) return;
    // An anchor that arrives while the opening is still on screen skips straight past it.
    if (ready && !getState().entered) skipIntro();
    if (!arrived || transit !== "idle" || handled.current === key) return;
    const first = handled.current === null && !getState().lifted;
    handled.current = key;
    scrollToStep(STATION[target], first);
  }, [hash, key, arrived, transit, ready]);

  return (
    <>
      <div ref={track} className="track" style={{ height: `${STATION_COUNT * 100}svh` }} aria-hidden />
      <IntroScene />
      <UniverseOverlay />
      <SphereLabels />
      <WorkScene />
      <AboutScene />
      <ContactScene />
    </>
  );
}
