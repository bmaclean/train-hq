/**
 * This acts as a root module for all plans/ paths (includes plans/index)
 *
 * The layout for these views is defined here. The contents of the request
 * route will be rendered by <Outlet />.
 */

import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet, Form } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

import { getUserFromSession, db } from "~/utils";
import { Container } from "~/components/layout";
import { Button, BrandLogo, DashboardHeader } from "~/components/ui";
import { DashboardMenu } from "~/components/ui/DashboardMenu";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUserFromSession>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  const data: LoaderData = {
    user,
  };
  return json(data);
};

export default function PlansRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <main className="flex flex-1">
        <Container className="flex-1">
          <DashboardMenu />
          <div className="flex-1 margin-auto flex items-center justify-center">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  );
}
