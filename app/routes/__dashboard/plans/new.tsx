import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { Activity } from "@prisma/client";

import { db, badRequest, requireAuth } from "~/utils";
import { Input, Submit } from "~/components/forms";
import { Select } from "~/components/forms/Select";
import { ErrorContainer } from "~/components/ui";

function validatePlanName(content: string) {
  if (content.length < 4) {
    return `The plan name is too short.`;
  }
}

type PlanActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
  };
  // fields are included so that the form can be re-rendered with the values
  // from the server in the event that JavaScript fails to load
  fields?: {
    name: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const userId = await requireAuth(request, { redirectTo: "/login" });

  // we do this type check to be extra sure and to make TypeScript happy
  if (typeof name !== "string") {
    return badRequest<PlanActionData>({
      formError: `Invalid plan name`,
    });
  }

  const fieldErrors = {
    name: validatePlanName(name),
  };
  const fields = { name };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const plan = await db.plan.create({
    data: { ...fields, createdById: userId },
  });
  return redirect(`/plans/${plan.id}`);
};

type LoaderData = { activities: Activity[] };
export const loader: LoaderFunction = async ({ request }) => {
  const data = {
    activities: await db.activity.findMany({
      include: { activityTypes: true },
    }),
  };

  if (!data.activities) {
    throw new Response("Activities not found.", {
      status: 404,
    });
  }

  return json(data);
};

export default function NewPlanRoute() {
  const actionData = useActionData<PlanActionData>();
  const { activities } = useLoaderData<LoaderData>();

  return (
    <div>
      <Form method="post">
        <Input
          type="text"
          defaultValue={actionData?.fields?.name}
          aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
          aria-errormessage={
            actionData?.fieldErrors?.name ? "name-error" : undefined
          }
          name="name"
          placeholder="Plan Name"
          error={actionData?.fieldErrors?.name}
          className="bg-gray-50 bg-opacity-50 focus:bg-opacity-100"
        />
        <Select
          items={activities.map((activity) => ({
            title: activity.name,
            value: activity.name,
          }))}
          placeholder="Select a plan type"
        />
        <Submit formError={actionData?.formError}>Create</Submit>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorContainer>
      <p>There was a problem preparing a new plan.</p>
      <p>{error.message}</p>
    </ErrorContainer>
  );
}
