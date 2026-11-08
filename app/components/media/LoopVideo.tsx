import { useEffect, useRef, useState } from "react";
import { media, type MediaId } from "~/content/media";
import { cn } from "~/lib/cn";
import { FallbackArt } from "./FallbackArt";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>\")";

type Props = {
  id: MediaId;
  className?: string;
  /** Hero poster: load eagerly with high priority (it is the LCP image). */
  priority?: boolean;
  /** Controlled playback (e.g. hover). Omit to autoplay while on screen. */
  playing?: boolean;
  /** Placeholder glow position, so repeated placeholders differ. */
  focus?: [string, string];
};

/**
 * Poster first, video second. The video element mounts only once the block nears
 * the viewport, and never for reduced motion or Save-Data visitors.
 */
export function LoopVideo({ id, className, priority, playing, focus }: Props) {
  const asset = media[id];
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setAllowed(!reduce && !saveData);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !asset.video) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [asset.video]);

  useEffect(() => {
    if (allowed && inView) setMounted(true);
  }, [allowed, inView]);

  const shouldPlay = allowed && inView && (playing ?? true);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay, mounted]);

  return (
    <div ref={wrap} aria-hidden className={cn("overflow-hidden bg-charcoal-2", className)}>
      {asset.poster ? (
        <picture>
          {asset.posterFallback && <source srcSet={asset.poster} type="image/avif" />}
          <img
            src={asset.posterFallback ?? asset.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: asset.focus }}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </picture>
      ) : (
        <FallbackArt tone={asset.tone} label={id} focus={focus} />
      )}
      {asset.video && mounted && (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: asset.focus }}
          muted
          loop
          playsInline
          preload="auto"
          poster={asset.poster}
        >
          {asset.mobile && <source media="(max-width: 767px)" src={asset.mobile} type="video/mp4" />}
          {asset.video.webm && <source src={asset.video.webm} type="video/webm" />}
          <source src={asset.video.mp4} type="video/mp4" />
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}
