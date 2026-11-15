import { useMemo } from "react";
import { useLocation } from "react-router";
import { getService, type Service } from "~/content/services";
import type { View } from "~/state/store";
import { langFromPath, stripLang } from "./i18n";
import type { Lang } from "./types";

export type RouteView = { lang: Lang; view: View; service: Service | null };

/** What a URL means for the experience: the universe, one world, or a plain page. */
export function parseRoute(pathname: string): RouteView {
  const lang = langFromPath(pathname);
  const base = stripLang(pathname).replace(/\/+$/, "") || "/";
  if (base === "/") return { lang, view: "home", service: null };
  const match = base.match(/^\/services\/([a-z-]+)$/);
  const service = match ? getService(match[1]) : undefined;
  if (service) return { lang, view: "world", service };
  return { lang, view: "page", service: null };
}

export function useRouteView(): RouteView {
  const { pathname } = useLocation();
  return useMemo(() => parseRoute(pathname), [pathname]);
}

/** Hash anchors of the universe journey, mapped to station indices in ~/state/layout. */
export const HASH_STATIONS: Record<string, "universe" | "work" | "about" | "contact"> = {
  "#universe": "universe",
  "#services": "universe",
  "#work": "work",
  "#about": "about",
  "#contact": "contact",
};
