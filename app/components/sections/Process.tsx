import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { process } from "~/content/process";
import { useT } from "~/lib/i18n";
import { Reveal } from "../motion/Reveal";
import { SectionHead } from "../ui/SectionHead";

/** Desktop: the section pins and the five steps travel sideways along a cobalt horizon. */
export function Process() {
  const t = useT();
  const target = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const head = (
    <SectionHead
      label={t({ fr: "Méthode", en: "Process" })}
      title={t({ fr: "Cinq étapes, aucune approximation.", en: "Five steps, no guesswork." })}
      className="md:mb-14"
    />
  );

  return (
    <section className="border-t border-ivory/10">
      <div ref={target} className="relative hidden lg:block" style={{ height: `calc(100svh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <div className="container-site">{head}</div>
          <motion.ol ref={track} style={{ x }} className="flex w-max pl-[max(2.5rem,calc((100vw-96rem)/2+2.5rem))] pr-[10vw]">
            {process.map((step) => (
              <li key={step.num} className="w-[30rem] shrink-0 border-l border-ivory/12 px-10 py-2">
                <span className="display block text-[5rem] leading-none text-cobalt">{step.num}</span>
                <h3 className="display mt-8 text-[2rem]">{t(step.title)}</h3>
                <p className="mt-4 max-w-[34ch] text-ivory-dim">{t(step.text)}</p>
              </li>
            ))}
          </motion.ol>
          <div className="container-site mt-14">
            <div className="h-px bg-ivory/15">
              <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-cobalt" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-section lg:hidden">
        {head}
        <ol className="border-t border-ivory/12">
          {process.map((step) => (
            <Reveal as="li" key={step.num} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-ivory/12 py-8">
              <span className="display text-[2.5rem] leading-none text-cobalt">{step.num}</span>
              <div>
                <h3 className="display text-2xl">{t(step.title)}</h3>
                <p className="mt-3 text-ivory-dim">{t(step.text)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
