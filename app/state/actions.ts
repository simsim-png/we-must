import type { ServiceId } from "~/content/work";

// The WebGL scene cannot use the router directly (it renders in its own React root), so the
// layout registers navigation here and the scene calls it.
export const actions = {
  openWorld: (_id: ServiceId) => {},
  closeWorld: () => {},
};
