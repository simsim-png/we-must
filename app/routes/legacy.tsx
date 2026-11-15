import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { langFromPath, localize, stripLang } from "~/lib/i18n";

// The first version of the site had separate pages. Their URLs now land on the matching
// section of the homepage. (On Vercel, vercel.json does this before the app even loads.)
const SECTION: Record<string, string> = {
  services: "universe",
  work: "work",
  about: "about",
  contact: "contact",
};

export default function Legacy() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const done = useRef(false);

  // Redirect exactly once. This component stays mounted while the page transition plays,
  // by which time the location has already changed; a second pass would drop the anchor.
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const first = stripLang(pathname).split("/").filter(Boolean)[0] ?? "";
    const section = SECTION[first];
    navigate(localize(section ? `/#${section}` : "/", langFromPath(pathname)), { replace: true });
  }, [navigate, pathname]);

  return <div className="min-h-svh" />;
}
