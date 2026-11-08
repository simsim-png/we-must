import type { Tone } from "~/content/media";
import { cn } from "~/lib/cn";

// On-brand stand-in drawn in CSS until the Higgsfield asset is delivered.
const tones: Record<Tone, string> = {
  horizon: [
    "radial-gradient(55% 30% at 50% 53%, rgba(242,238,229,0.22), transparent 70%)",
    "radial-gradient(70% 38% at 50% 70%, rgba(48,75,255,0.38), transparent 72%)",
    "linear-gradient(to bottom, #0b0c10 0%, #17181f 52%, #0e1236 53.5%, #0b0c14 100%)",
  ].join(","),
  cobalt: [
    "radial-gradient(60% 50% at var(--fx,70%) var(--fy,75%), rgba(48,75,255,0.55), transparent 70%)",
    "radial-gradient(40% 30% at 20% 15%, rgba(242,238,229,0.06), transparent 70%)",
    "linear-gradient(160deg, #15161c, #0c0d11)",
  ].join(","),
  warm: [
    "radial-gradient(55% 45% at var(--fx,30%) var(--fy,35%), rgba(242,238,229,0.2), transparent 70%)",
    "radial-gradient(45% 35% at 80% 90%, rgba(48,75,255,0.3), transparent 70%)",
    "linear-gradient(200deg, #1b1a1c, #0d0e12)",
  ].join(","),
};

type Props = { tone: Tone; label?: string; className?: string; focus?: [string, string] };

export function FallbackArt({ tone, label, className, focus }: Props) {
  const style = { backgroundImage: tones[tone], ...(focus ? { "--fx": focus[0], "--fy": focus[1] } : {}) } as React.CSSProperties;
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -inset-[6%] animate-breathe" style={style} />
      {tone === "horizon" && <div className="absolute inset-x-0 top-[53%] h-px bg-ivory/25" />}
      {import.meta.env.DEV && label && (
        <span className="label-mono absolute bottom-3 right-3 text-[10px] text-ivory/40">{label} · placeholder</span>
      )}
    </div>
  );
}
