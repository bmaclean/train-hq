import {
  json,
  useLoaderData,
  useParams,
  useCatch,
  ActionFunction,
  MetaFunction,
  Form,
} from "remix";
import type { LoaderFunction } from "remix";
import type { Plan } from "@prisma/client";

import { db } from "~/utils/db.server";
import { LikeButton } from "~/components/ui/LikeButton";
import { requireAuth } from "~/utils/session.server";

type LoaderData = { plan: Plan | null };
export const loader: LoaderFunction = async ({ params: { planId } }) => {
  const data: LoaderData = {
    plan: await db.plan.findUnique({ where: { id: planId } }),
  };

  if (!data.plan) {
    throw new Response("Plan not found.", {
      status: 404,
    });
  }

  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") !== "like") {
    throw new Response(`The _method ${form.get("_method")} is not supported`, {
      status: 423,
    });
  }

  const userId = await requireAuth(request, { redirectTo: request.referrer });
  const plan = await db.plan.findUnique({
    where: { id: params.planId },
    include: { likes: true },
  });

  if (!plan) {
    return json("You can't like a plan that doesn't exist", 404);
  } else if (plan.likes.map((like) => like.userId).includes(userId)) {
    return json("A plan can only be liked once", 400);
  }

  await db.userLikes.create({
    data: { userId: userId, likedPlanId: plan.id },
  });

  return json("Plan liked successfully", 200);
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

  return (
    <div>
      <h2>
        {plan?.name}
        <Form method="post" className="like-button-form">
          <input type="hidden" name="_method" value="like" />
          <input type="hidden" name="planId" value={plan?.id} />
          <LikeButton liked={false} type="submit" />
        </Form>
      </h2>
    </div>
  );
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
