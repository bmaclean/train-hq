import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";

export const meta: MetaFunction = () => ({ title: "New Remix App" });

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Train HQ</title>
      </head>
      <body>
        <h1>Train HQ</h1>
        <LiveReload />
      </body>
    </html>
  );
}
