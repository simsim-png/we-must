import type { ReactNode } from "react";
import { cn } from "~/lib/cn";
import { FocusText } from "../motion/FocusText";

type Props = {
  label: string;
  title: string;
  intro?: ReactNode;
  className?: string;
  tone?: "dark" | "light";
  as?: "h1" | "h2";
};

export function SectionHead({ label, title, intro, className, tone = "dark", as = "h2" }: Props) {
  return (
    <div className={cn("mb-14 grid gap-6 md:mb-20 md:grid-cols-12", className)}>
      <p className={cn("label-mono pt-2 md:col-span-3", tone === "dark" ? "text-ivory-dim" : "text-charcoal/60")}>
        <span className={tone === "dark" ? "text-cobalt-light" : "text-cobalt"}>—</span> {label}
      </p>
      <FocusText as={as} text={title} className="display display-lg md:col-span-9" />
      {intro && (
        <div className={cn("max-w-[60ch] text-lg md:col-span-6 md:col-start-4", tone === "dark" ? "text-ivory-dim" : "text-charcoal/70")}>
          {intro}
        </div>
      )}
    </div>
  );
}
