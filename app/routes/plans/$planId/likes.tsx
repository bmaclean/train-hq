import { json, ActionFunction } from "remix";

import { db } from "~/utils/db.server";
import { requireAuth } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (request.method !== "POST") {
    throw new Response(`The method ${form.get("method")} is not supported`, {
      status: 405,
    });
  }

  const userId = await requireAuth(request, { redirectTo: request.referrer });
  const plan = await db.plan.findUnique({
    where: { id: params.planId },
    include: { likes: true },
  });

  if (!plan) {
    return json({ error: "You can't like a plan that doesn't exist" }, 404);
  } else if (plan.likes.map((like) => like.userId).includes(userId)) {
    return json({ error: "A plan can only be liked once" }, 400);
  }

  await db.userLikes.create({
    data: { userId: userId, likedPlanId: plan.id },
  });

  return json("Plan liked successfully", 200);
};
