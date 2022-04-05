import { Link, json, useLoaderData, useParams } from "remix";
import type { LoaderFunction } from "remix";
import type { Plan } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { plan: Plan | null };
export const loader: LoaderFunction = async ({ params: { planId } }) => {
  const data: LoaderData = {
    plan: await db.plan.findUnique({ where: { id: planId } }),
  };
  return json(data);
};

export default function PlanRoute() {
  const { plan } = useLoaderData<LoaderData>();

  return (
    <div>
      <h2>{plan?.name}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { planId } = useParams();

  return (
    <div className="error-container">
      <p>There was a problem loading the plan with ID {planId}</p>
      <p>{error.message}</p>
    </div>
  );
}
