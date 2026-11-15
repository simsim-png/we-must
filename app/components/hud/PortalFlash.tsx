import { useEffect, useRef } from "react";
import type { ServiceId } from "~/content/work";
import { rt } from "~/state/runtime";

// The burst of light as the camera crosses a sphere's surface, in that world's own colour.
const FLASH: Record<ServiceId, string> = {
  branding: "radial-gradient(circle at 50% 50%, #ffffff 0%, #f2eee5 70%)",
  shooting: "radial-gradient(circle at 50% 50%, #ffe3c2 0%, #6b3f16 34%, #060607 78%)",
  social: "radial-gradient(circle at 50% 50%, #e3e7ff 0%, #5a70ff 34%, #304bff 80%)",
  web: "radial-gradient(circle at 50% 50%, #cfd6ff 0%, #304bff 28%, #0a0d2c 78%)",
};

export function PortalFlash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let frame = 0;
    let shown = -1;
    let service: ServiceId | null = null;
    const tick = () => {
      if (rt.service && rt.service !== service) {
        service = rt.service;
        el.style.background = FLASH[service];
      }
      if (rt.flash !== shown) {
        shown = rt.flash;
        el.style.opacity = String(shown);
        el.style.visibility = shown > 0.002 ? "visible" : "hidden";
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-20" style={{ opacity: 0, visibility: "hidden" }} />;
}
