import type { ReactNode } from "react";
import { Horizon } from "../brand/Horizon";
import { FocusText } from "../motion/FocusText";

type Props = { label: string; title: string; reflection?: string; intro?: ReactNode; children?: ReactNode };

/** Inner-page opener: title above the horizon, its cobalt "reflection" below. */
export function PageHero({ label, title, reflection, intro, children }: Props) {
  return (
    <header className="container-site pt-36 pb-16 md:pt-48 md:pb-24">
      <p className="label-mono mb-10 text-ivory-dim"><span className="text-cobalt-light">—</span> {label}</p>
      <h1>
        <FocusText text={title} onLoad delay={0.15} className="display display-xl max-w-[18ch]" />
        <Horizon onLoad delay={0.4} className="my-5 text-ivory/70 md:my-7" />
        {reflection && <FocusText text={reflection} onLoad delay={0.7} className="display display-lg text-cobalt" />}
      </h1>
      {intro && <div className="mt-10 grid md:grid-cols-12"><div className="max-w-[60ch] text-lg text-ivory-dim md:col-span-6 md:col-start-7">{intro}</div></div>}
      {children}
    </header>
  );
}
