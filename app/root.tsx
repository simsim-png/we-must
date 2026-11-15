import type { ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, useLocation, type LinksFunction } from "react-router";
import { MotionConfig } from "motion/react";
import { langFromPath } from "./lib/i18n";
import "./app.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@500..900&display=swap",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

// If the app never starts (script blocked or failed), drop the loading screen and lay the
// scenes out as an ordinary document. See `html[data-static]` in app.css.
const FAILSAFE =
  "setTimeout(function(){if(!window.__wm)document.documentElement.setAttribute('data-static','')},7000)";

const NOSCRIPT_CSS =
  ".loader,.track{display:none!important}.scene{position:relative!important;visibility:visible!important;min-height:70svh}.panel{visibility:visible!important}.rv{opacity:1!important;filter:none!important;transform:none!important}";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <html lang={langFromPath(pathname)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#08090d" />
        <Meta />
        <Links />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
        </noscript>
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: FAILSAFE }} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Outlet />
    </MotionConfig>
  );
}

/** Shown for a moment on URLs that were not prerendered, while the app starts. */
export function HydrateFallback() {
  return <div className="min-h-svh bg-ink" />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const title = isRouteErrorResponse(error) ? `${error.status}` : "Erreur";
  return (
    <main className="gutter grid min-h-svh content-center gap-6 bg-ink text-ivory">
      <h1 className="display text-[clamp(4rem,18vw,14rem)] text-cobalt">{title}</h1>
      <p className="text-ivory/70">Une erreur est survenue. / Something went wrong.</p>
      <a href="/" className="label underline underline-offset-4">WeMust</a>
    </main>
  );
}
