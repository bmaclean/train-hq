import { json, useLoaderData, useParams, useCatch, MetaFunction } from "remix";
import type { LoaderFunction } from "remix";
import type { Plan } from "@prisma/client";

import { db } from "~/utils/db.server";
import { PlanInfo } from "~/components/pages/plans";

type LoaderData = { plan: Plan };
export const loader: LoaderFunction = async ({ params: { planId } }) => {
  const data = {
    plan: await db.plan.findUnique({ where: { id: planId } }),
  };

  if (!data.plan) {
    throw new Response("Plan not found.", {
      status: 404,
    });
  }

  return json(data);
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data?.plan) {
    return {
      title: "Not Found",
      description: "No plan found",
    };
  }

  return {
    title: `"${data.plan.name}"`,
    description: `Begin training with the ${data.plan.name} training plan`,
  };
};

export default function PlanRoute() {
  const { plan } = useLoaderData<LoaderData>();

  return <PlanInfo plan={plan} />;
}

/**
 * The exported CatchBoundary will render when the action or loader throws a
 * Response object.
 */
export function CatchBoundary() {
  const caught = useCatch();
  const { planId } = useParams();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <h1>The plan with id {planId} was not found!</h1>
      </div>
    );
  } else {
    throw caught;
  }
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
