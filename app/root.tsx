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
    href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <html lang={langFromPath(pathname)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#101116" />
        <Meta />
        <Links />
      </head>
      <body className="bg-charcoal text-ivory">
        {children}
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

export function ErrorBoundary({ error }: { error: unknown }) {
  const title = isRouteErrorResponse(error) ? `${error.status}` : "Erreur";
  return (
    <main className="container-site grid min-h-svh content-center gap-6">
      <h1 className="display display-xl">{title}</h1>
      <p className="text-ivory-dim">Une erreur est survenue. / Something went wrong.</p>
      <a href="/" className="label-mono text-cobalt-light">← WeMust</a>
    </main>
  );
}
