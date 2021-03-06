import { useLoaderData, useParams, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Plan } from "@prisma/client";

import { db, requireAuth } from "~/utils";
import { ErrorContainer } from "~/components/ui";
import { PlanHeader } from "~/components/plans";

type LoaderData = { plan: Plan; isLiked: boolean };
export const loader: LoaderFunction = async ({
  request,
  params: { planId },
}) => {
  const userId = await requireAuth(request, { redirectTo: "/login" });

  const data = {
    plan: await db.plan.findUnique({
      where: { id: planId },
    }),
    isLiked: await db.userLikes.findFirst({
      where: { userId, likedPlanId: planId },
    }),
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
  const { plan, isLiked } = useLoaderData<LoaderData>();

  return <PlanHeader plan={plan} isLiked={isLiked} />;
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
      <ErrorContainer>
        <h1>The plan with id {planId} was not found!</h1>
      </ErrorContainer>
    );
  } else {
    throw caught;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { planId } = useParams();

  return (
    <ErrorContainer>
      <p>There was a problem loading the plan with ID {planId}</p>
      <p>{error.message}</p>
    </ErrorContainer>
  );
}
