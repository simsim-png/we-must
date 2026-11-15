import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace, type Texture } from "three";
import type { Visual } from "~/content/visuals";
import { palette } from "~/lib/palette";

// Every texture that is not a campaign visual is drawn here with the 2D canvas API:
// glows, type specimens, interface wireframes, film stock. No extra downloads.

export const DISPLAY_FONT = '"Unbounded", "Arial Black", sans-serif';
export const MONO_FONT = '"JetBrains Mono", ui-monospace, monospace';

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function finish(canvas: HTMLCanvasElement) {
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function drawn(w: number, h: number, draw: Draw) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  return { texture: finish(canvas), redraw: () => { ctx.clearRect(0, 0, w, h); draw(ctx, w, h); } };
}

let fonts: Promise<unknown> | null = null;
/** Resolves once the brand typefaces can be drawn to a canvas. */
export function fontsReady() {
  if (!fonts) {
    fonts =
      typeof document !== "undefined" && document.fonts
        ? Promise.all([
            document.fonts.load('800 64px "Unbounded"'),
            document.fonts.load('600 64px "Unbounded"'),
            document.fonts.load('500 24px "JetBrains Mono"'),
          ]).catch(() => undefined)
        : Promise.resolve();
  }
  return fonts;
}

/** A canvas texture that redraws itself once the web fonts have arrived. */
export function useDrawnTexture(w: number, h: number, draw: Draw): CanvasTexture {
  const made = useMemo(() => drawn(w, h, draw), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let alive = true;
    fontsReady().then(() => {
      if (!alive) return;
      made.redraw();
      made.texture.needsUpdate = true;
    });
    return () => {
      alive = false;
      made.texture.dispose();
    };
  }, [made]);
  return made.texture;
}

/** Campaign visuals as sRGB textures (suspends while loading). */
export function useVisualTextures(visuals: Visual[]): Texture[] {
  const textures = useTexture(visuals.map((v) => `${v.src}.jpg`));
  useMemo(() => {
    for (const t of textures) {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
  }, [textures]);
  return textures;
}

/* ------------------------------------------------------------------ glows */

let glow: CanvasTexture | null = null;
/** Soft round glow, used wherever something needs a halo. */
export function glowTexture() {
  if (glow) return glow;
  glow = drawn(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,255,255,0.55)");
    g.addColorStop(0.45, "rgba(255,255,255,0.14)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }).texture;
  return glow;
}

let streak: CanvasTexture | null = null;
/** Anamorphic streak: the horizon line of the logo, as a lens would see it. */
export function streakTexture() {
  if (streak) return streak;
  streak = drawn(1024, 64, (ctx, w, h) => {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x - w / 2) / (w / 2);
        const dy = (y - h / 2) / (h / 2);
        const a = Math.pow(Math.max(0, 1 - Math.abs(dx)), 2.4) * Math.exp(-dy * dy * 26);
        const i = (y * w + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
        img.data[i + 3] = Math.round(a * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
  }).texture;
  return streak;
}

let disc: CanvasTexture | null = null;
/** Out-of-focus point of light, for bokeh. */
export function bokehTexture() {
  if (disc) return disc;
  disc = drawn(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,0.5)");
    g.addColorStop(0.78, "rgba(255,255,255,0.62)");
    g.addColorStop(0.9, "rgba(255,255,255,0.9)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }).texture;
  return disc;
}

/* ------------------------------------------------------------------- type */

export type TextOptions = {
  lines: string[];
  color?: string;
  weight?: number;
  /** Font size as a fraction of the canvas height. */
  size?: number;
  font?: string;
  align?: CanvasTextAlign;
  letterSpacing?: number;
  leading?: number;
  uppercase?: boolean;
};

export function drawText(ctx: CanvasRenderingContext2D, w: number, h: number, o: TextOptions) {
  const size = (o.size ?? 0.5) * h;
  ctx.font = `${o.weight ?? 800} ${size}px ${o.font ?? DISPLAY_FONT}`;
  ctx.fillStyle = o.color ?? palette.ink;
  ctx.textBaseline = "middle";
  ctx.textAlign = o.align ?? "center";
  if (o.letterSpacing !== undefined) ctx.letterSpacing = `${o.letterSpacing * size}px`;
  const leading = (o.leading ?? 1.05) * size;
  const x = ctx.textAlign === "center" ? w / 2 : ctx.textAlign === "right" ? w - size * 0.1 : size * 0.1;
  const top = h / 2 - ((o.lines.length - 1) * leading) / 2;
  o.lines.forEach((line, i) => ctx.fillText(o.uppercase ? line.toUpperCase() : line, x, top + i * leading));
}

/* -------------------------------------------------------------- interface */

const line = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const box = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill?: string) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  } else ctx.stroke();
};

export type UiKind = "site" | "phone" | "dashboard" | "code" | "layer";

/** Wireframes of interfaces, drawn in light on glass. Abstract on purpose: no fake brands. */
export function drawUi(kind: UiKind, variant = 0): Draw {
  return (ctx, w, h) => {
    const ivory = "rgba(242,238,229,0.92)";
    const soft = "rgba(122,139,255,0.95)";
    const faint = "rgba(242,238,229,0.2)";
    const glass = "rgba(21,26,77,0.55)";
    const u = w / 100;
    ctx.lineWidth = Math.max(2, u * 0.45);

    box(ctx, u, u, w - 2 * u, h - 2 * u, kind === "phone" ? u * 9 : u * 2.2, glass);
    ctx.strokeStyle = soft;
    box(ctx, u, u, w - 2 * u, h - 2 * u, kind === "phone" ? u * 9 : u * 2.2);

    if (kind === "site" || kind === "layer") {
      ctx.strokeStyle = faint;
      line(ctx, u, u * 9, w - u, u * 9);
      [0, 1, 2].forEach((i) => box(ctx, u * (4 + i * 3.4), u * 4, u * 2, u * 2, u, i === 0 ? soft : faint));
      box(ctx, u * 62, u * 3.6, u * 22, u * 2.8, u * 1.4, faint);
      if (kind === "layer" && variant === 1) {
        // layout layer: columns
        for (let i = 0; i < 4; i++) box(ctx, u * (6 + i * 22.5), u * 16, u * 19, h - u * 24, u, "rgba(122,139,255,0.16)");
        return;
      }
      if (kind === "layer" && variant === 2) {
        // content layer: blocks only
        box(ctx, u * 8, u * 18, u * 52, u * 7, u, ivory);
        box(ctx, u * 8, u * 29, u * 36, u * 3, u, faint);
        box(ctx, u * 8, u * 40, u * 18, u * 6, u * 3, soft);
        return;
      }
      box(ctx, u * 8, u * 17, u * 46, u * 6.5, u, ivory);
      box(ctx, u * 8, u * 26, u * 34, u * 6.5, u, soft);
      box(ctx, u * 8, u * 37, u * 30, u * 2.2, u, faint);
      box(ctx, u * 8, u * 41.5, u * 24, u * 2.2, u, faint);
      box(ctx, u * 8, u * 49, u * 17, u * 5.5, u * 2.8, soft);
      ctx.strokeStyle = soft;
      box(ctx, u * 62, u * 16, u * 30, h - u * 23, u * 1.5);
      line(ctx, u * 62, u * 16, u * 92, h - u * 7);
      line(ctx, u * 92, u * 16, u * 62, h - u * 7);
    }

    if (kind === "phone") {
      box(ctx, w / 2 - u * 12, u * 5, u * 24, u * 4, u * 2, faint);
      box(ctx, u * 10, u * 18, w - u * 20, u * 46, u * 4, "rgba(122,139,255,0.3)");
      box(ctx, u * 10, u * 70, w - u * 34, u * 7, u * 2, ivory);
      box(ctx, u * 10, u * 82, w - u * 46, u * 4, u * 2, faint);
      for (let i = 0; i < 3; i++) {
        box(ctx, u * 10, u * (96 + i * 26), u * 20, u * 20, u * 4, faint);
        box(ctx, u * 36, u * (100 + i * 26), w - u * 50, u * 4, u * 2, i === 0 ? soft : faint);
        box(ctx, u * 36, u * (108 + i * 26), w - u * 62, u * 3, u * 1.5, faint);
      }
      box(ctx, u * 14, h - u * 22, w - u * 28, u * 12, u * 6, soft);
    }

    if (kind === "dashboard") {
      ctx.strokeStyle = faint;
      line(ctx, u * 22, u, u * 22, h - u);
      for (let i = 0; i < 5; i++) box(ctx, u * 5, u * (8 + i * 8), u * 12, u * 2.4, u, i === 1 ? soft : faint);
      box(ctx, u * 27, u * 7, u * 26, u * 4, u, ivory);
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = faint;
        box(ctx, u * (27 + i * 23.5), u * 16, u * 21, u * 13, u * 1.5);
        box(ctx, u * (30 + i * 23.5), u * 19.5, u * 9, u * 2.4, u, faint);
        box(ctx, u * (30 + i * 23.5), u * 23.5, u * 14, u * 3.2, u, i === 0 ? soft : ivory);
      }
      ctx.strokeStyle = faint;
      for (let i = 0; i < 4; i++) line(ctx, u * 27, u * (38 + i * 6), u * 95, u * (38 + i * 6));
      ctx.strokeStyle = soft;
      ctx.lineWidth = u * 0.9;
      ctx.beginPath();
      const pts = [54, 50, 52, 44, 46, 41, 43, 36];
      pts.forEach((y, i) => (i ? ctx.lineTo(u * (27 + i * 9.7), u * y) : ctx.moveTo(u * 27, u * y)));
      ctx.stroke();
      pts.forEach((y, i) => box(ctx, u * (27 + i * 9.7) - u * 0.9, u * y - u * 0.9, u * 1.8, u * 1.8, u, ivory));
    }

    if (kind === "code") {
      const rows = [
        [0, 22, soft], [3, 40, ivory], [3, 30, faint], [6, 46, ivory], [6, 18, soft], [6, 34, faint],
        [3, 12, ivory], [0, 8, soft], [0, 0, ""], [0, 30, soft], [3, 52, ivory], [3, 26, faint], [0, 8, soft],
      ] as const;
      rows.forEach(([indent, len, c], i) => {
        if (!len) return;
        box(ctx, u * 5, u * (9 + i * 6.6), u * 3, u * 2.2, u, faint);
        box(ctx, u * (13 + indent * 2), u * (9 + i * 6.6), u * len, u * 2.2, u, c);
      });
    }
  };
}

/** 35mm film: perforations top and bottom, empty frames in between. Tiles horizontally. */
export const drawFilm: Draw = (ctx, w, h) => {
  ctx.fillStyle = "rgba(10,10,12,0.92)";
  ctx.fillRect(0, 0, w, h);
  const frames = 8;
  const fw = w / frames;
  for (let i = 0; i < frames; i++) {
    ctx.fillStyle = i % 3 === 1 ? "rgba(255,178,107,0.26)" : "rgba(242,238,229,0.09)";
    ctx.fillRect(i * fw + fw * 0.06, h * 0.2, fw * 0.88, h * 0.6);
    ctx.fillStyle = "rgba(242,238,229,0.5)";
    for (let p = 0; p < 4; p++) {
      const x = i * fw + (p + 0.5) * (fw / 4) - fw * 0.035;
      ctx.fillRect(x, h * 0.05, fw * 0.07, h * 0.08);
      ctx.fillRect(x, h * 0.87, fw * 0.07, h * 0.08);
    }
  }
};
