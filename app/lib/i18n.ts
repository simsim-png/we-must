import { useCallback } from "react";
import { useLocation } from "react-router";
import type { L, Lang } from "./types";

// French lives at "/", English under "/en". Slugs are shared between languages.

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/** "/en/services" -> "/services" */
export function stripLang(pathname: string) {
  if (pathname === "/en" || pathname === "/en/") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

/** "/services#x" + "en" -> "/en/services#x" */
export function localize(to: string, lang: Lang) {
  if (lang === "fr" || /^[a-z]+:/i.test(to)) return to;
  const [path, hash] = to.split("#");
  const localized = path === "/" || path === "" ? "/en" : `/en${path}`;
  return hash ? `${localized}#${hash}` : localized;
}

export function useLang(): Lang {
  return langFromPath(useLocation().pathname);
}

/** Picks the current language from an L<T> value. */
export function useT() {
  const lang = useLang();
  return useCallback(<T,>(value: L<T>): T => value[lang], [lang]);
}
