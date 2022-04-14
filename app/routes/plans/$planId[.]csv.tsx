import { Plan } from "@prisma/client";
import type { LoaderFunction } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = { plan: Plan | null };
export const loader: LoaderFunction = async ({ params: { planId } }) => {
  const data: LoaderData = {
    plan: await db.plan.findUnique({ where: { id: planId } }),
  };

  return new Response("\n", {
    headers: {
      "Content-Type": "text/csv",
    },
  });
};
