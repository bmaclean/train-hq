import { ActionFunction, json, redirect, useActionData } from "remix";


export default function NewPlanRoute() {

  return (
    <div>
      <h3>Create your plan</h3>
      <form method="post">
        <div>
          <label>
            Plan Name:{" "}
            <input
              type="text"
              name="name"
            />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
