import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";

import globalStyles from "~/styles/global.css";
import globalLargeStyles from "~/styles/global-large.css";
import globalMedStyles from "~/styles/global-medium.css";

/**
 * CSS files can be cached long-term and your CSS is naturally code-split
 */
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStyles },
    {
      rel: "stylesheet",
      href: globalLargeStyles,
      media: "print, (min-width: 1024px)",
    },
    {
      rel: "stylesheet",
      href: globalMedStyles,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => ({ title: "New Remix App" });

function Document({
  children,
  title = `Train HQ`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

/**
 * Remix will render exported ErrorBoundary components in place of
 * the page when an unexpected error occurs
 */
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Ah Shit">
      <div className="error-container">
        <h1>There was an error with your request.</h1>
        <h2>Our team has been notified, and this will be resolved shortly.</h2>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
