import { motion } from "motion/react";
import { cn } from "~/lib/cn";

type Props = { className?: string; delay?: number; onLoad?: boolean };

/** The gap between the M and the W, drawn as a hairline that grows from the left. */
export function Horizon({ className, delay = 0, onLoad = false }: Props) {
  const trigger = onLoad ? { animate: { scaleX: 1 } } : { whileInView: { scaleX: 1 }, viewport: { once: true, amount: 1 } };
  return (
    <motion.div
      aria-hidden
      className={cn("h-px origin-left bg-current", className)}
      initial={{ scaleX: 0 }}
      {...trigger}
      transition={{ duration: 1.4, delay, ease: [0.7, 0, 0.2, 1] }}
    />
  );
}
