import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useT } from "~/lib/i18n";

type Mode = "default" | "link" | "view";

/**
 * Small ivory dot on fine pointers. Grows into a ring over links and into a cobalt
 * "Voir" disc over [data-cursor="view"]. The native cursor stays everywhere else.
 */
export function Cursor() {
  const t = useT();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const view = target?.closest<HTMLElement>("[data-cursor='view']");
      if (view) {
        setMode("view");
        setLabel(view.dataset.cursorLabel ?? "");
        return;
      }
      setMode(target?.closest("a, button, [role='button'], label") ? "link" : "default");
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 104 : mode === "link" ? 44 : 10;
  return (
    <motion.div
      aria-hidden
      className={mode === "view" ? "pointer-events-none fixed left-0 top-0 z-[70]" : "pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"}
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="label-mono grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-ivory"
        animate={{
          width: size,
          height: size,
          backgroundColor: mode === "view" ? "#304BFF" : mode === "link" ? "rgba(242,238,229,0)" : "#F2EEE5",
          borderWidth: mode === "link" ? 1 : 0,
        }}
        style={{ borderColor: "#F2EEE5", borderStyle: "solid" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {mode === "view" && <span>{label || t({ fr: "Voir", en: "View" })}</span>}
      </motion.div>
    </motion.div>
  );
}
