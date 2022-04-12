import {
  ActionFunction,
  LinksFunction,
  MetaFunction,
  useActionData,
} from "remix";
import { Link, useSearchParams } from "remix";

import { createUserSession, login, register } from "~/utils/session.server";
import stylesUrl from "~/styles/login.css";
import { badRequest } from "~/utils/response.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

function validateUrl(url: any) {
  console.log(url);
  const urls = ["/plans", "/"];
  if (urls.includes(url)) {
    return url;
  }

  return "/plans";
}

export const meta: MetaFunction = () => {
  return {
    title: "Train HQ | Login",
    description: "Login to start tracking your training progress!",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = validateUrl(form.get("redirectTo") || "/plans");

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  switch (loginType) {
    case "login": {
      // login to get the user
      const user = await login({ username, password });

      if (user === null) {
        // if there's no user, return the fields and a formError
        return badRequest({
          fields: { username },
          formError: "Invalid login details",
        });
      } else {
        // TODO: if there is a user, create their session and redirect to /plans
        return createUserSession({ userId: user.id, redirectTo });
      }
    }
    case "register": {
      try {
        const user = await register({ username, password });
        if (!user) {
          return badRequest({
            fields,
            formError: `Something went wrong trying to create a new user.`,
          });
        }

        return createUserSession({ userId: user.id, redirectTo });
      } catch (e) {
        if (e instanceof Response && e.status === 409) {
          return e;
        } else throw e;
      }
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

type AuthActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

export default function Login() {
  const actionData = useActionData<AuthActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked
              />{" "}
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/plans">plans</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
