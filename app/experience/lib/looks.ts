import type { ServiceId } from "~/content/work";
import { palette } from "~/lib/palette";
import type { GlassOptions, WallOptions } from "./shaders";

// One universe, four personalities. Each world keeps to the brand palette but owns a mood:
// an ivory studio, a dark set, a cobalt feed, a midnight grid.

export type Look = {
  glass: GlassOptions;
  wall: WallOptions;
  /** How solid the world's sky looks through the glass, from the universe. */
  wallOutside: number;
  halo: string;
  haloStrength: number;
  ring: string;
  /** Two lamps that travel with the sphere: key and accent. Power is per unit of sphere scale squared. */
  key: string;
  accent: string;
  keyPower: number;
  accentPower: number;
};

export const LOOKS: Record<ServiceId, Look> = {
  branding: {
    glass: { tint: palette.ivory, rim: "#ffffff", base: 0.1 },
    wall: { top: "#f4f0e8", bottom: "#d8d1bf", glow: "#ffffff", glowAmount: 0.1 },
    wallOutside: 0.78,
    halo: palette.ivory,
    haloStrength: 0.22,
    ring: palette.ivory,
    key: "#fff6e6",
    accent: palette.cobalt,
    keyPower: 3.2,
    accentPower: 1.2,
  },
  shooting: {
    glass: { tint: "#0b0c10", rim: palette.amber, base: 0.26 },
    wall: { top: "#050506", bottom: "#15100b", glow: palette.amber, glowAmount: 0.06 },
    wallOutside: 0.86,
    halo: palette.amber,
    haloStrength: 0.26,
    ring: palette.amber,
    key: palette.amber,
    accent: palette.cobalt,
    keyPower: 3.2,
    accentPower: 2.6,
  },
  social: {
    glass: { tint: palette.cobalt, rim: "#b9c2ff", base: 0.14 },
    wall: { top: "#3d57ff", bottom: "#1626b8", glow: "#8a9aff", glowAmount: 0.28 },
    wallOutside: 0.82,
    halo: palette.cobalt,
    haloStrength: 0.5,
    ring: palette.cobaltSoft,
    key: "#ffffff",
    accent: "#9fb0ff",
    keyPower: 2.6,
    accentPower: 1.6,
  },
  web: {
    glass: { tint: palette.midnight, rim: palette.cobaltSoft, base: 0.06, grid: 1 },
    wall: { top: "#080a22", bottom: "#090a10", glow: palette.cobalt, glowAmount: 0.13, grid: 1 },
    wallOutside: 0.7,
    halo: palette.cobaltSoft,
    haloStrength: 0.3,
    ring: palette.cobaltSoft,
    key: "#cfd6ff",
    accent: palette.cobalt,
    keyPower: 2.2,
    accentPower: 2.8,
  },
};
