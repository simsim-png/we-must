import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/cn";
import { LLink } from "./LLink";

type Variant = "primary" | "ghost" | "dark" | "ghost-dark";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  icon?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "bg-cobalt text-ivory hover:bg-ivory hover:text-charcoal",
  ghost: "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal",
  dark: "bg-charcoal text-ivory hover:bg-cobalt",
  "ghost-dark": "border border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-13 px-6 text-[0.95rem]",
  lg: "h-16 px-8 text-lg",
};

export function Button({ children, to, href, variant = "primary", size = "md", className, icon = true, ...rest }: Props) {
  const classes = cn(
    "group inline-flex items-center justify-between gap-4 font-semibold transition-colors duration-300 ease-brand disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden
          className="size-[1.1em] shrink-0 transition-transform duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (to) return <LLink to={to} className={classes}>{inner}</LLink>;
  if (href)
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  return (
    <button className={classes} type={rest.type ?? "button"} disabled={rest.disabled} onClick={rest.onClick}>
      {inner}
    </button>
  );
}
