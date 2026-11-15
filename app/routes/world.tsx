import { useCallback, useEffect, useRef } from "react";
import type { MetaFunction } from "react-router";
import { WorldOverlay } from "~/components/world/WorldOverlay";
import { getService, type Service } from "~/content/services";
import { useRouteView } from "~/lib/route";
import { seo } from "~/lib/seo";
import { BEAT_COUNT } from "~/state/layout";
import { useScrollTrack } from "~/state/scroll";
import { setState, useStore } from "~/state/store";
import NotFound from "./not-found";

export const meta: MetaFunction = ({ params, location }) => {
  const service = getService(params.service);
  if (!service) return [{ title: "404 — WeMust" }, { name: "robots", content: "noindex" }];
  return seo({ pathname: location.pathname, title: service.name, description: service.text });
};

function World({ service }: { service: Service }) {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useStore((s) => s.reduced);
  const onStep = useCallback((index: number) => setState({ beat: index }), []);
  useScrollTrack(track, { key: "w", steps: BEAT_COUNT, onStep, reduced });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div ref={track} className="track" style={{ height: `${BEAT_COUNT * 100}svh` }} aria-hidden />
      <WorldOverlay service={service} />
    </>
  );
}

/** One service world. The URL is real, so each world can be linked to and indexed. */
export default function WorldRoute() {
  const { service } = useRouteView();
  if (!service) return <NotFound />;
  return <World key={service.id} service={service} />;
}
