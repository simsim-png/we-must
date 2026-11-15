import { Component, lazy, Suspense, type ReactNode } from "react";
import { setState, useStore } from "~/state/store";
import { FallbackUniverse } from "../fallback/FallbackUniverse";

// three.js, React Three Fiber and the whole scene live in this chunk. It is requested only
// in the browser, after the page (and its loading screen) has painted.
const Experience = lazy(() => import("~/experience/Experience"));

/** If WebGL fails at any point, fall back to the 2D universe instead of a blank page. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    setState({ quality: "none" });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ExperienceHost() {
  const quality = useStore((s) => s.quality);
  if (quality === null) return null;
  if (quality === "none") return <FallbackUniverse />;
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Boundary>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Boundary>
    </div>
  );
}
