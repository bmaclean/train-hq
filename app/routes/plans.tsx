/**
 * This acts as a root module for all plans/ paths (includes plans/index)
 *
 * The layout for these views is defined here. The contents of the request
 * route will be rendered by <Outlet />.
 */

import { Link, Outlet, json, useLoaderData } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";
import type { Plan } from "@prisma/client";

import plansStyles from "~/styles/plans.css";
import { getUserFromSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";

type PlanPreview = Pick<Plan, "id" | "name">;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: plansStyles }];
};

type LoaderData = {
  plans: Array<PlanPreview>;
  user: Awaited<ReturnType<typeof getUserFromSession>>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  const plans = await db.plan.findMany({
    take: 5,
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });
  const data: LoaderData = {
    plans,
    user,
  };
  return json(data);
};

export default function PlansRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="plans-layout">
      <header className="plans-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Train HQ" aria-label="Train Hq">
              Train HQ
            </Link>
          </h1>

          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="plans-main">
        <div className="container">
          <div className="plans-list">
            <p>Here are a few plans to check out:</p>
            <ul>
              {data.plans.map((plan) => (
                <li key={plan.id}>
                  <Link to={plan.id}>{plan.name}</Link>
                </li>
              ))}
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
