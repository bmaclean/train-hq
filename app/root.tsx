import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";

import styles from "./styles/app.css";

/**
 * CSS files can be cached long-term and your CSS is naturally code-split
 */
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => {
  const description = `Craft your plan and meet your training goals.`;
  return {
    charset: "utf-8",
    description,
    keywords: "Train,hq,training,trainhq",
    "twitter:image": "",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@trainhq",
    "twitter:site": "@trainhq",
    "twitter:title": "Train HQ",
    "twitter:description": description,
  };
};

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
        <Meta />
        <title>{title}</title>
        <Links />
        <Scripts />
        <ScrollRestoration />
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
 * The exported CatchBoundary will render when the action or loader throws a
 * Response object.
 */
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
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
