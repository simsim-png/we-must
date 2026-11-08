import { motion, type Variants } from "motion/react";
import type { ElementType } from "react";
import { cn } from "~/lib/cn";

// "Flou → Net": each word arrives blurred and settles into focus.
const word: Variants = {
  hidden: { opacity: 0, filter: "blur(14px)", y: "0.2em" },
  show: { opacity: 1, filter: "blur(0px)", y: "0em", transition: { duration: 1.1, ease: [0.2, 0.7, 0.1, 1] } },
};

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  onLoad?: boolean;
  lang?: string;
  id?: string;
};

export function FocusText({ text, as: Tag = "span", className, delay = 0, stagger = 0.07, onLoad = false, lang, id }: Props) {
  const trigger = onLoad
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, amount: 0.3 } };
  return (
    <Tag className={className} lang={lang} id={id}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        {...trigger}
        variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {text.split(" ").map((w, i) => (
          <span key={i}>
            {i > 0 && " "}
            <motion.span className={cn("inline-block will-change-[filter,opacity]")} variants={word}>
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
