import { AdditiveBlending, BackSide, Color, DoubleSide, FrontSide, ShaderMaterial, type Texture } from "three";
import { palette } from "~/lib/palette";

// Custom materials of the universe. Each factory returns a fresh ShaderMaterial whose
// uniforms are animated from useFrame. All of them end with <colorspace_fragment> so they
// look the same with and without the post-processing chain.

const color = (hex: string) => new Color(hex);

const OBJECT_VERTEX = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vObj;
  varying vec2 vUv;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vObj = position;
    vUv = uv;
    gl_Position = projectionMatrix * mv;
  }
`;

/** exp(-x²). Written without pow(): a negative base there is undefined and can return NaN,
 *  which the bloom then spreads over the whole frame. */
const GAUSS_FN = /* glsl */ `
  float gauss(float x) {
    return exp(-x * x);
  }
`;

const GRID_FN = /* glsl */ `
  float gridLine(float x) {
    float fw = min(fwidth(x), 0.5);
    return 1.0 - smoothstep(0.0, fw * 1.5, abs(fract(x + 0.5) - 0.5));
  }
  float sphereGrid(vec3 p, float meridians, float parallels) {
    float lon = atan(p.z, p.x) / 6.2831853 * meridians;
    float lat = asin(clamp(p.y, -1.0, 1.0)) / 3.14159265 * parallels;
    return max(gridLine(lon), gridLine(lat));
  }
`;

/* ------------------------------------------------------------ glass shell */

export type GlassOptions = { tint: string; rim: string; base: number; grid?: number };

/**
 * Glass for the spheres: clear in the middle, reflective toward the silhouette, with a studio
 * softbox and a strip light reflected in it. Cheaper and steadier than real transmission,
 * and the inside of the sphere stays undistorted.
 */
export function glassMaterial({ tint, rim, base, grid = 0 }: GlassOptions) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: FrontSide,
    uniforms: {
      uTint: { value: color(tint) },
      uRim: { value: color(rim) },
      uBase: { value: base },
      uHover: { value: 0 },
      uOpacity: { value: 1 },
      uGrid: { value: grid },
    },
    vertexShader: OBJECT_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint;
      uniform vec3 uRim;
      uniform float uBase;
      uniform float uHover;
      uniform float uOpacity;
      uniform float uGrid;
      varying vec3 vN;
      varying vec3 vV;
      varying vec3 vObj;
      ${GRID_FN}
      void main() {
        vec3 N = normalize(vN);
        vec3 V = normalize(vV);
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float fres = pow(max(1.0 - ndv, 0.0), 2.6);
        vec3 R = reflect(-V, N);

        float softbox = smoothstep(0.5, 0.78, R.y) * smoothstep(0.8, 0.15, abs(R.x + 0.1));
        float strip = smoothstep(0.07, 0.0, abs(R.x + 0.6)) * smoothstep(0.75, 0.1, abs(R.y));
        float spark = pow(max(dot(R, normalize(vec3(-0.42, 0.62, 0.66))), 0.0), 220.0);

        vec3 col = uTint * (uBase + 0.2 * fres);
        col += uRim * fres * (0.75 + uHover * 0.95);
        col += vec3(0.96, 0.94, 0.9) * (softbox * 0.3 + spark * 1.8);
        col += uRim * strip * 0.45;
        float a = uBase + fres * (0.7 + uHover * 0.25) + softbox * 0.24 + spark + strip * 0.25;

        if (uGrid > 0.0) {
          float g = sphereGrid(normalize(vObj), 24.0, 12.0);
          col += uRim * g * (0.5 + uHover * 0.5);
          a += g * 0.3 * uGrid;
        }

        gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * uOpacity);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* -------------------------------------------------- inner wall of a world */

export type WallOptions = { top: string; bottom: string; glow: string; glowAmount: number; grid?: number };

/** The sky of a world: seen faintly through the glass from outside, complete from inside. */
export function wallMaterial({ top, bottom, glow, glowAmount, grid = 0 }: WallOptions) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    side: BackSide,
    uniforms: {
      uTop: { value: color(top) },
      uBottom: { value: color(bottom) },
      uGlow: { value: color(glow) },
      uGlowAmount: { value: glowAmount },
      uOpacity: { value: 0.6 },
      uGrid: { value: grid },
    },
    vertexShader: OBJECT_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop;
      uniform vec3 uBottom;
      uniform vec3 uGlow;
      uniform float uGlowAmount;
      uniform float uOpacity;
      uniform float uGrid;
      varying vec3 vObj;
      varying vec3 vN;
      varying vec3 vV;
      ${GRID_FN}
      ${GAUSS_FN}
      void main() {
        vec3 p = normalize(vObj);
        float h = p.y * 0.5 + 0.5;
        vec3 col = mix(uBottom, uTop, smoothstep(0.08, 0.92, h));
        // Slightly darker toward the silhouette, so the sphere keeps its volume.
        float facing = abs(dot(normalize(vN), normalize(vV)));
        col *= mix(0.72, 1.0, pow(max(facing, 0.0001), 0.7));
        float band = gauss((p.y + 0.1) * 3.0);
        col += uGlow * band * uGlowAmount;
        if (uGrid > 0.0) {
          float g = sphereGrid(p, 48.0, 24.0);
          col += uGlow * g * 0.22 * uGrid * (0.35 + band);
        }
        gl_FragColor = vec4(col, uOpacity);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* ----------------------------------------------------------------- images */

export type ImageOptions = {
  map: Texture;
  aspect: number;
  radius?: number;
  flip?: boolean;
  fade?: number;
  tint?: string;
  tintAmount?: number;
  /** Writes depth, so glass and light behind the picture cannot show through it. */
  solid?: boolean;
};

/** A photograph or poster on a plane: rounded corners, fade, dimming, and a tinted mirror mode. */
export function imageMaterial({ map, aspect, radius = 0, flip = false, fade = 0, tint = palette.cobalt, tintAmount = 0, solid = false }: ImageOptions) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: solid,
    side: DoubleSide,
    uniforms: {
      uMap: { value: map },
      uAspect: { value: aspect },
      uRadius: { value: radius },
      uFlip: { value: flip ? 1 : 0 },
      uFade: { value: fade },
      uTint: { value: color(tint) },
      uTintAmount: { value: tintAmount },
      uOpacity: { value: 1 },
      uDim: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uAspect;
      uniform float uRadius;
      uniform float uFlip;
      uniform float uFade;
      uniform vec3 uTint;
      uniform float uTintAmount;
      uniform float uOpacity;
      uniform float uDim;
      varying vec2 vUv;
      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }
      void main() {
        vec2 uv = vUv;
        if (uFlip > 0.5) uv.y = 1.0 - uv.y;
        vec3 col = texture2D(uMap, uv).rgb * uDim;
        float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(col, uTint * l * 1.9, uTintAmount);
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        float d = roundedBox(p, vec2(uAspect, 1.0) * 0.5, uRadius);
        float a = (1.0 - smoothstep(-0.003, 0.003, d)) * uOpacity;
        if (uFade > 0.0) a *= pow(clamp(vUv.y, 0.0, 1.0), 2.4) * uFade;
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* ---------------------------------------------------------------- horizon */

/**
 * The light that leaks from the gap between the M and the W: a disc lying on the horizon
 * plane. Seen almost edge-on it reads as a single bright line through the logo.
 */
export function horizonMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
    uniforms: {
      uIntensity: { value: 0 },
      uTime: { value: 0 },
      uWarm: { value: color(palette.ivory) },
      uCold: { value: color(palette.cobalt) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() {
        vP = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uIntensity;
      uniform float uTime;
      uniform vec3 uWarm;
      uniform vec3 uCold;
      varying vec2 vP;
      ${GAUSS_FN}
      void main() {
        float r = length(vP);
        float ang = atan(vP.y, vP.x);
        float haze = exp(-r * 1.05) * 1.1;
        float rays = 0.72 + 0.28 * sin(ang * 22.0 + uTime * 0.22) * sin(ang * 9.0 - uTime * 0.17);
        float rings = gauss((r - 1.38) / 0.035) * 0.55 + gauss((r - 2.75) / 0.02) * 0.3;
        float edge = smoothstep(4.5, 2.4, r);
        float a = (haze * rays + rings) * edge * uIntensity;
        vec3 col = mix(uCold, uWarm, exp(-r * 1.5)) * 2.2;
        gl_FragColor = vec4(col * a, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* --------------------------------------------------------------- backdrop */

/** Deep space in brand colours: ink, a midnight haze along the horizon, slow cobalt wisps. */
export function backdropMaterial(detail: boolean) {
  return new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uInk: { value: color(palette.ink) },
      uMidnight: { value: color(palette.midnight) },
      uCobalt: { value: color(palette.cobalt) },
      uGlow: { value: 1 },
    },
    defines: detail ? { DETAIL: "" } : {},
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uInk;
      uniform vec3 uMidnight;
      uniform vec3 uCobalt;
      uniform float uGlow;
      varying vec3 vDir;
      ${GAUSS_FN}
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
          mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
          f.z);
      }
      float fbm(vec3 p) {
        float a = 0.5;
        float s = 0.0;
        for (int i = 0; i < 4; i++) {
          s += a * noise(p);
          p = p * 2.03 + 11.7;
          a *= 0.5;
        }
        return s;
      }
      void main() {
        vec3 d = normalize(vDir);
        float hz = gauss(d.y * 6.5);
        vec3 col = uInk * (0.3 + 0.22 * (1.0 - abs(d.y)));
        #ifdef DETAIL
          float n = fbm(d * 2.1 + vec3(0.0, uTime * 0.008, uTime * 0.004));
          float wisps = smoothstep(0.46, 0.82, n);
        #else
          float n = 0.5;
          float wisps = 0.0;
        #endif
        col += uMidnight * hz * (0.05 + 0.17 * n) * uGlow;
        col += uCobalt * pow(hz, 6.0) * 0.025 * uGlow;
        col += uMidnight * wisps * 0.2 * (1.0 - abs(d.y) * 0.7) * uGlow;
        col += (hash(vec3(gl_FragCoord.xy, 1.0)) - 0.5) / 180.0;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* -------------------------------------------------------------- particles */

export function dustMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uOpacity: { value: 0 },
      uIvory: { value: color(palette.ivory) },
      uCobalt: { value: color(palette.cobaltSoft) },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aSeed;
      uniform float uTime;
      uniform float uScale;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.12 + aSeed * 6.2831) * 0.25;
        p.x += cos(uTime * 0.09 + aSeed * 12.0) * 0.18;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * uScale * (26.0 / max(0.5, -mv.z));
        gl_Position = projectionMatrix * mv;
        vAlpha = 0.45 + 0.55 * sin(uTime * 0.7 + aSeed * 40.0);
        vSeed = aSeed;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform vec3 uIvory;
      uniform vec3 uCobalt;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        a *= a;
        vec3 col = mix(uIvory, uCobalt, step(0.78, vSeed));
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* ------------------------------------------------------------ light cones */

/** A soft beam of light for the Shooting world: brightest at the lamp, gone at the far end. */
export function beamMaterial(hex: string, strength = 1) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: color(hex) }, uStrength: { value: strength }, uOpacity: { value: 1 } },
    vertexShader: OBJECT_VERTEX,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uStrength;
      uniform float uOpacity;
      varying vec3 vN;
      varying vec3 vV;
      varying vec2 vUv;
      void main() {
        float facing = pow(max(abs(dot(normalize(vN), normalize(vV))), 0.0001), 1.6);
        float along = pow(clamp(vUv.y, 0.0, 1.0), 1.7);
        float a = facing * along * uStrength * uOpacity;
        gl_FragColor = vec4(uColor * a, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

/* ------------------------------------------------------------- grid floor */

/** The floor of the Web world: a drafting grid that fades with distance. */
export function gridFloorMaterial(hex: string) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: { uColor: { value: color(hex) }, uOpacity: { value: 1 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() {
        vP = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vP;
      ${GAUSS_FN}
      float gridLine(float x) {
        float fw = min(fwidth(x), 0.5);
        return 1.0 - smoothstep(0.0, fw * 1.4, abs(fract(x + 0.5) - 0.5));
      }
      void main() {
        vec2 g = vP * 14.0;
        float fine = max(gridLine(g.x), gridLine(g.y));
        float coarse = max(gridLine(g.x * 0.25), gridLine(g.y * 0.25));
        float r = length(vP);
        float pulse = gauss((r - fract(uTime * 0.12) * 1.1) / 0.03);
        float fade = smoothstep(0.92, 0.15, r);
        float a = (fine * 0.22 + coarse * 0.5 + pulse * 0.5) * fade * uOpacity;
        gl_FragColor = vec4(uColor * (1.0 + pulse), a);
        #include <colorspace_fragment>
      }
    `,
  });
}
