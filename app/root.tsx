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

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Train HQ</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
