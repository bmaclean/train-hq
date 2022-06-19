import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all([
    ...getPlans().map((plan) => {
      return db.plan.create({ data: plan });
    }),
    ...getUsers().map((user) => {
      return db.user.create({ data: user });
    }),
    ...getActivities().map((activity) => {
      return db.activity.create({ data: activity });
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

function getActivities(): Prisma.ActivityCreateInput[] {
  return [
    {
      // TODO: rewrite as enum
      name: "Running",
      activityTypes: {
        create: [
          {
            name: "Long Run",
          },
          { name: "Tempo Run" },
          { name: "Recovery Run" },
        ],
      },
    },
  ];
}
