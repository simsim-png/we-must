import { useEffect, useState } from "react";

/**
 * Media query that is always false during prerender and the first client render,
 * so server HTML and hydration match. Updates after mount.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useReducedMotionSafe = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)");
