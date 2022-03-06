import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix";
import type { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export default function App() {
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <title>Remix: So great, it's funny!</title>
    </head>
    <body>
      <h1></h1>
      <LiveReload />
    </body>
    </html>
  );
}
