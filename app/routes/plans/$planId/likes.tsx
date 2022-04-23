import { json, ActionFunction } from "remix";

import { db, requireAuth } from "~/utils";

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (request.method !== "POST" && request.method !== "DELETE") {
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
    return json({ error: "That plan does not exist" }, 404);
  }

  if (request.method === "DELETE") {
    await db.userLikes.delete({
      where: { userId_likedPlanId: { userId, likedPlanId: plan.id } },
    });
    return json("Plan unliked successfully", 200);
  } else {
    if (plan.likes.map((like) => like.userId).includes(userId)) {
      return json({ error: "A plan can only be liked once" }, 400);
    }

    await db.userLikes.create({
      data: { userId: userId, likedPlanId: plan.id },
    });
    return json("Plan liked successfully", 200);
  }
};
