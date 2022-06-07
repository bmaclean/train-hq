import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Button, ErrorContainer } from "~/components/ui";

import { db, badRequest, requireAuth } from "~/utils";

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

export default function NewPlanRoute() {
  const actionData = useActionData<PlanActionData>();

  return (
    <div>
      <h3>Create your plan</h3>
      <Form method="post">
        <div>
          <label>
            Plan Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
              name="name"
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="m-0 mt-1 text-red-500 text-xs"
              role="alert"
              id="name-error"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="m-0 mt-1 text-red-500 text-xs" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <Button type="submit">Add</Button>
        </div>
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
