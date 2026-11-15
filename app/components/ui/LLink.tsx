import type { Ref } from "react";
import { Link, type LinkProps } from "react-router";
import { localize, useLang } from "~/lib/i18n";

type Props = Omit<LinkProps, "to"> & { to: string; ref?: Ref<HTMLAnchorElement> };

/** Link that keeps the visitor in their current language. Pass French paths ("/#work"). */
export function LLink({ to, ...rest }: Props) {
  const lang = useLang();
  return <Link to={localize(to, lang)} {...rest} />;
}
