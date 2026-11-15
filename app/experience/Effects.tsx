import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction, type ChromaticAberrationEffect, Effect } from "postprocessing";
import { useMemo, useRef } from "react";
import { Uniform, Vector2 } from "three";
import { rt } from "~/state/runtime";

/**
 * Film grain. Zero-mean (it neither lifts the blacks nor dulls the whites) and applied in
 * a perceptual space so it stays even from shadow to highlight, including on the bright
 * values that feed the bloom.
 */
class GrainEffect extends Effect {
  constructor(amount = 0.035) {
    super(
      "GrainEffect",
      /* glsl */ `
        uniform float amount;
        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          float n = fract(sin(dot(uv + fract(time) * 0.37, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
          vec3 s = sqrt(max(inputColor.rgb, 0.0));
          s = max(s + n * amount, 0.0);
          outputColor = vec4(s * s, inputColor.a);
        }
      `,
      { blendFunction: BlendFunction.NORMAL, uniforms: new Map([["amount", new Uniform(amount)]]) },
    );
  }
}

/**
 * The lens. Bloom only picks up what is genuinely brighter than white (the horizon, the
 * cobalt W, the lamps), so the ivory world stays clean. Grain and a vignette tie the
 * rendered image to WE MUST's photography; the colour fringe swells as a world rushes past.
 */
export function Effects() {
  const fringe = useRef<ChromaticAberrationEffect>(null);
  const offset = useMemo(() => new Vector2(0.0004, 0.0003), []);
  const grain = useMemo(() => new GrainEffect(), []);

  useFrame(() => {
    const amount = 0.0004 + rt.flash * 0.0045;
    fringe.current?.offset.set(amount, amount * 0.7);
  });

  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.12} intensity={0.7} radius={0.78} />
      <ChromaticAberration ref={fringe} offset={offset} radialModulation modulationOffset={0.25} />
      <Vignette offset={0.26} darkness={0.58} />
      <primitive object={grain} dispose={null} />
    </EffectComposer>
  );
}
