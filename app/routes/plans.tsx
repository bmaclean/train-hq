/**
 * This acts as a root module for all plans/ paths (includes plans/index)
 *
 * The layout for these views is defined here. The contents of the request
 * route will be rendered by <Outlet />.
 */

import { Link, Outlet, json, useLoaderData, Form } from "remix";
import type { LoaderFunction } from "remix";
import type { Plan } from "@prisma/client";

import { getUserFromSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Container } from "~/components/layout";
import { Button } from "~/components/ui/Button";
import { BrandLogo } from "~/components/ui";

type PlanPreview = Pick<Plan, "id" | "name">;

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
    <div>
      <header>
        <Container className="flex-row justify-between items-center">
          <h1>
            <Link
              prefetch="intent"
              to="/"
              title="Train HQ"
              aria-label="Train Hq"
            >
              <BrandLogo type="text" className="h-16" />
            </Link>
          </h1>

          {data.user ? (
            <div className="flex gap-4 items-center whitespace-nowrap">
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <Button>Logout</Button>
              </Form>
            </div>
          ) : (
            <Link prefetch="intent" to="/login">
              Login
            </Link>
          )}
        </Container>
      </header>
      <main>
        <Container>
          <div>
            <p>Here are a few plans to check out:</p>
            <ul>
              {data.plans.map((plan) => (
                <li key={plan.id}>
                  <Link prefetch="intent" to={plan.id}>
                    {plan.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link prefetch="intent" to="new">
              Add your own
            </Link>
          </div>
          <div>
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  );
}
