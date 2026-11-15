import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Line, LineBasicMaterial, type PointLight } from "three";
import { services } from "~/content/services";
import { palette } from "~/lib/palette";
import {
  alignAngle, angleDelta, damp, easeOutCubic, gatherAngle, enterCurves, lerp, ORBIT_RADII, ORBIT_SPEED, orbitPoint,
  portraitFactor, sat, smooth, sphereAngle, STATION, STATION_COUNT, WORLD_SCALE,
} from "~/state/layout";
import { rt, SERVICE_IDS } from "~/state/runtime";
import { canExplore, useStore } from "~/state/store";
import { circlePoints } from "./lib/geometry";
import { LOOKS } from "./lib/looks";
import { ServiceSphere } from "./ServiceSphere";

const RING_SEGMENTS = 220;

/** The faint ellipses the four worlds travel on. They draw themselves when the universe opens. */
function OrbitRings() {
  const { size } = useThree();
  const k = Math.round(portraitFactor(size.width / size.height) * 40) / 40;
  const lines = useMemo(
    () =>
      ORBIT_RADII.map(
        () => new Line(new BufferGeometry(), new LineBasicMaterial({ color: palette.ivory, transparent: true, opacity: 0, depthWrite: false })),
      ),
    [],
  );
  useMemo(() => {
    lines.forEach((line, i) => {
      line.geometry.dispose();
      line.geometry = circlePoints(RING_SEGMENTS, (a, out) => orbitPoint(out, ORBIT_RADII[i], a, k));
      line.frustumCulled = false;
    });
  }, [lines, k]);

  const mix = useRef([0, 0, 0, 0]);
  const cobalt = useMemo(() => new Color(palette.cobaltSoft), []);
  const ivory = useMemo(() => new Color(palette.ivory), []);

  useFrame((_, dt) => {
    const { hovered } = useStore.getState();
    const expand = enterCurves.expand(rt.enter);
    lines.forEach((line, i) => {
      const drawn = easeOutCubic(sat((rt.reveal - 0.3 - i * 0.05) / 0.6));
      line.geometry.setDrawRange(0, Math.floor((RING_SEGMENTS + 1) * drawn));
      mix.current[i] = damp(mix.current[i], hovered === SERVICE_IDS[i] ? 1 : 0, 6, dt);
      const m = line.material as LineBasicMaterial;
      m.opacity = (0.1 + mix.current[i] * 0.4) * (1 - expand);
      m.color.copy(ivory).lerp(cobalt, mix.current[i]);
      line.visible = drawn > 0 && expand < 0.99;
    });
  });

  return (
    <>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}

/**
 * Keeps the four service spheres in orbit around the core, lets the visitor turn the system
 * by dragging, and carries the two lamps that light whichever world is in focus.
 */
export function OrbitalSystem() {
  const { gl, size } = useThree();
  const drag = useRef({ active: false, x: 0, velocity: 0 });
  const slow = useRef(0);
  const focus = useRef(0);
  const key = useRef<PointLight>(null!);
  const accent = useRef<PointLight>(null!);

  // A line of light from the core to the hovered world: the universe answering the pointer.
  const beam = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(new Float32Array(6), 3));
    const line = new Line(g, new LineBasicMaterial({ color: palette.cobaltSoft, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    line.frustumCulled = false;
    return line;
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    const down = (e: PointerEvent) => {
      if (!canExplore()) return;
      d.active = true;
      d.x = e.clientX;
      d.velocity = 0;
    };
    const move = (e: PointerEvent) => {
      if (!d.active) return;
      const delta = -(e.clientX - d.x) * 0.0042;
      d.x = e.clientX;
      rt.phase += delta;
      d.velocity = delta;
    };
    const up = () => {
      d.active = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  useFrame((_, dt) => {
    const st = useStore.getState();
    const k = portraitFactor(size.width / size.height);
    const d = drag.current;

    // Hovering a world almost stops the orbit so it can be read and clicked.
    slow.current = damp(slow.current, st.hovered ? 1 : 0, 5, dt);
    if (!d.active) {
      const idle = st.reduced ? 0 : ORBIT_SPEED * rt.orbitSpeed * (1 - 0.94 * slow.current);
      rt.phase += idle * dt + d.velocity;
      d.velocity *= Math.exp(-4.5 * dt);
    }

    // Scene 05: as the camera closes in on the monogram, the worlds gather behind the core
    // so none of them crosses the lens. Scene 06: they swing round and line up in front.
    const station = rt.u * (STATION_COUNT - 1);
    const outside = 1 - sat(rt.enter * 4);
    const gather = smooth(sat((station - STATION.about + 0.75) / 0.6)) * outside;
    const align = smooth(sat((station - STATION.about - 0.25) / 0.6)) * outside;

    for (let i = 0; i < 4; i++) {
      let angle = sphereAngle(i, rt.phase);
      angle += angleDelta(angle, gatherAngle(i)) * gather;
      angle += angleDelta(angle, alignAngle(i)) * align;
      const out = easeOutCubic(sat((rt.reveal - 0.2 - i * 0.06) / 0.62));
      orbitPoint(rt.spheres[i], ORBIT_RADII[i] * out, angle, k);
    }

    // Lamps follow the world being entered, otherwise the hovered one.
    const activeIndex = rt.service ? SERVICE_IDS.indexOf(rt.service) : -1;
    const hoverIndex = st.hovered ? SERVICE_IDS.indexOf(st.hovered) : -1;
    const index = activeIndex >= 0 ? activeIndex : hoverIndex;
    const expand = activeIndex >= 0 ? enterCurves.expand(rt.enter) : 0;
    const want = activeIndex >= 0 ? Math.max(0.55, enterCurves.approach(rt.enter)) : hoverIndex >= 0 ? 0.55 : 0;
    focus.current = damp(focus.current, want, 5, dt);
    if (index >= 0) {
      const p = rt.spheres[index];
      const look = LOOKS[SERVICE_IDS[index]];
      const s = lerp(1, WORLD_SCALE, expand);
      key.current.position.set(p.x - 0.55 * s, p.y + 0.72 * s, p.z + 0.78 * s);
      accent.current.position.set(p.x + 0.7 * s, p.y - 0.28 * s, p.z - 0.15 * s);
      key.current.color.set(look.key);
      accent.current.color.set(look.accent);
      key.current.intensity = look.keyPower * s * s * focus.current;
      accent.current.intensity = look.accentPower * s * s * focus.current;
      key.current.distance = accent.current.distance = 3.4 * s;
    } else {
      key.current.intensity = damp(key.current.intensity, 0, 6, dt);
      accent.current.intensity = damp(accent.current.intensity, 0, 6, dt);
    }

    const pos = beam.geometry.attributes.position as Float32BufferAttribute;
    const target = hoverIndex >= 0 ? rt.spheres[hoverIndex] : null;
    const m = beam.material as LineBasicMaterial;
    m.opacity = damp(m.opacity, target && activeIndex < 0 ? 0.55 : 0, 6, dt);
    if (target) {
      pos.setXYZ(1, target.x, target.y, target.z);
      pos.needsUpdate = true;
    }
    beam.visible = m.opacity > 0.01;
  }, -2);

  return (
    <>
      <OrbitRings />
      <primitive object={beam} />
      <pointLight ref={key} intensity={0} decay={2} distance={4} />
      <pointLight ref={accent} intensity={0} decay={2} distance={4} />
      {services.map((service, i) => (
        <ServiceSphere key={service.id} index={i} service={service} />
      ))}
    </>
  );
}
