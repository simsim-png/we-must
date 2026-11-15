import { create } from "zustand";
import type { ServiceId } from "~/content/work";

/** high = full effects, low = phones and modest GPUs, none = no WebGL (2D fallback). */
export type Quality = "high" | "low" | "none";
export type View = "home" | "world" | "page";
/** Where the visitor is between the universe and a world. */
export type Transit = "idle" | "entering" | "inside" | "exiting";

type State = {
  /** Null until the browser has been inspected (always null in the prerendered HTML). */
  quality: Quality | null;
  reduced: boolean;
  touch: boolean;
  /** The scene (WebGL or fallback) has drawn its first frames. */
  ready: boolean;
  /** Real loading progress of the 3D assets, 0 → 1. */
  progress: number;
  /** The loading screen has lifted. */
  lifted: boolean;
  /** The visitor has passed "Enter the universe". */
  entered: boolean;
  /** The opening camera move has (nearly) landed: the universe interface may appear. */
  arrived: boolean;
  view: View;
  service: ServiceId | null;
  transit: Transit;
  /** Sphere under the pointer, or focused by tap / keyboard. */
  hovered: ServiceId | null;
  station: number;
  beat: number;
  menuOpen: boolean;
  /** How many world interiors may be mounted ahead of time (staggered after load). */
  preload: number;
  set: (patch: Partial<State>) => void;
};

export const useStore = create<State>((set) => ({
  quality: null,
  reduced: false,
  touch: false,
  ready: false,
  progress: 0,
  lifted: false,
  entered: false,
  arrived: false,
  view: "home",
  service: null,
  transit: "idle",
  hovered: null,
  station: 0,
  beat: 0,
  menuOpen: false,
  preload: 0,
  set: (patch) => set(patch),
}));

export const getState = () => useStore.getState();
export const setState = (patch: Partial<State>) => useStore.setState(patch);

/** True when the spheres can be hovered and entered: universe scene, at rest. */
export const canExplore = (s: State = useStore.getState()) =>
  s.view === "home" && s.arrived && s.transit === "idle" && s.station === 0 && !s.menuOpen;
