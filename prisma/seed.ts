import { Prisma, PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all([
    ...getPlans().map((plan) => {
      return db.plan.create({ data: plan });
    }),
    ...getUsers().map((user) => {
      return db.user.create({ data: user });
    }),
  ]);
}

seed();

function getPlans(): Prisma.PlanCreateInput[] {
  return [];
}

function getUsers(): Prisma.UserCreateInput[] {
  return [
    {
      username: "bmaclean",
      passwordHash:
        // "twixrox"
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  ];
}
