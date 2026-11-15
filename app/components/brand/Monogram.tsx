import { cn } from "~/lib/cn";

// The official WE MUST monogram. Geometry traced from the 1080px logo file
// (viewBox units = source pixels); proportions and colours are unchanged.
const M = "M0 0L214 171L428 0V250H375V112L214 239L53 112V250H0Z";
const W = "M0 267H53V406L214 279L375 406V267H428V518L214 347L0 518Z";

type Props = {
  className?: string;
  /** "dark" is the lockup for ivory backgrounds: the M turns ink, the W stays cobalt. */
  variant?: "light" | "dark";
  title?: string;
};

export function Monogram({ className, variant = "light", title }: Props) {
  return (
    <svg
      viewBox="0 0 428 518"
      className={cn("h-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={M} fill={variant === "light" ? "#F2EEE5" : "#101116"} />
      <path d={W} fill="#304BFF" />
    </svg>
  );
}
