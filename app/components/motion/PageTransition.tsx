import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useOutlet } from "react-router";
import { useReducedMotionSafe } from "~/lib/hooks";
import { useLenis } from "./SmoothScroll";

// "La Fermeture": an ivory M-panel drops, a cobalt W-panel rises, they meet on the
// horizon, the route swaps underneath, then they part again.
const EASE = [0.7, 0, 0.2, 1] as const;

const top: Variants = {
  covered: {
    y: "0%",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)",
    transition: { duration: 0.5, ease: EASE },
  },
  open: {
    y: "-105%",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 55%, 50% 100%, 0% 55%)",
    transition: { duration: 0.7, ease: EASE, delay: 0.08 },
  },
};

const bottom: Variants = {
  covered: {
    y: "0%",
    clipPath: "polygon(0% 0%, 50% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.5, ease: EASE },
  },
  open: {
    y: "105%",
    clipPath: "polygon(0% 45%, 50% 0%, 100% 45%, 100% 100%, 0% 100%)",
    transition: { duration: 0.7, ease: EASE, delay: 0.08 },
  },
};

export function TransitionOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const lenis = useLenis();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }}
    >
      <Page key={location.pathname} outlet={outlet} hash={location.hash} />
    </AnimatePresence>
  );
}

function Page({ outlet, hash }: { outlet: ReactNode; hash: string }) {
  // Keep rendering the old route while it animates out.
  const [frozen] = useState(outlet);
  const reduce = useReducedMotionSafe();
  const lenis = useLenis();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    const id = window.setTimeout(() => {
      if (lenis) lenis.scrollTo(el, { offset: -80 });
      else el.scrollIntoView();
    }, 650);
    return () => window.clearTimeout(id);
  }, [hash, lenis]);

  return (
    <motion.div initial="covered" animate="open" exit="covered">
      {frozen}
      {!reduce && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
          <motion.div variants={top} className="absolute inset-x-0 top-0 h-[calc(50%-2px)] bg-ivory" />
          <motion.div variants={bottom} className="absolute inset-x-0 bottom-0 h-[calc(50%-2px)] bg-cobalt" />
        </div>
      )}
    </motion.div>
  );
}
