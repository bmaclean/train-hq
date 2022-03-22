import { Link, Outlet, json, useLoaderData } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";

import plansStyles from "~/styles/plans.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: plansStyles }];
};

export default function PlansRoute() {
  return (
    <div className="plans-layout">
      <header className="plans-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Train HQ" aria-label="Train Hq">
              Train HQ
            </Link>
          </h1>
        </div>
      </header>
      <main className="plans-main">
        <div className="container">
          <div className="plans-list">
            <p>Here are a few plans to check out:</p>
            <ul>
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="plans-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
