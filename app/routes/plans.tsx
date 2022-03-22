import { Link, Outlet, json, useLoaderData } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";
import type { Plan } from "@prisma/client";

import plansStyles from "~/styles/plans.css";
import { db } from "~/utils/db.server";

type PlanPreview = Pick<Plan, "id" | "name">;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: plansStyles }];
};

type LoaderData = { plans: Array<PlanPreview> };
export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    plans: await db.plan.findMany({
      take: 5,
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
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
