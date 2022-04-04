import { Plan, Prisma } from "@prisma/client";
import { ActionFunction, json, redirect, useActionData } from "remix";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/response.server";
import { requireAuth } from "~/utils/session.server";

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
      <form method="post">
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
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
