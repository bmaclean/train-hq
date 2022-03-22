import { Prisma, PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getPlans().map((plan) => {
      return db.plan.create({ data: plan });
    })
  );
}

seed();

function getPlans(): Prisma.PlanCreateInput[] {
  return [
    {
      name: "Couch to 5K",
    },
    {
      name: "Sub-55 Minute 10K",
    },
    {
      name: "5K Beast",
    },
  ];
}
