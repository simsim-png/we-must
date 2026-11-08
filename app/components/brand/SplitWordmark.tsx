import { cn } from "~/lib/cn";

/**
 * The name set huge and cut by the horizon: ivory above, cobalt below.
 * Typeset in Archivo; swap for the official wordmark SVG once supplied.
 */
export function SplitWordmark({ className }: { className?: string }) {
  const text = "display block whitespace-nowrap text-center text-[15.5vw] leading-[0.82]";
  return (
    <div aria-hidden className={cn("relative select-none overflow-hidden", className)}>
      <span className={cn(text, "text-ivory [clip-path:inset(0_0_calc(50%+0.25vw)_0)]")}>WEMUST</span>
      <span className={cn(text, "absolute inset-0 text-cobalt [clip-path:inset(calc(50%+0.25vw)_0_0_0)]")}>
        WEMUST
      </span>
    </div>
  );
}
