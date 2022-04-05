import bcrypt from "bcryptjs";
import { createCookieSessionStorage, json, redirect } from "remix";

import { db } from "~/utils/db.server";
import { conflict } from "./response.server";

interface LoginForm {
  username: string;
  password: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

const storage = createCookieSessionStorage({
  cookie: {
    name: "trainhq_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
    httpOnly: true,
  },
});

// Update app/utils/session.server.ts to get the userId from the session.
// In my solution I create three functions:
// getUserSession(request: Request),
// getUserId(request: Request)
// and requireUserId(request: Request, redirectTo: string)

type RedirectPath = URL["pathname"];

async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);

  const userId = session.get("trainhq_session");

  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireAuth(
  request: Request,
  { redirectTo }: { redirectTo: RedirectPath }
) {
  const session = await getUserSession(request);
  const userId = session.get("trainhq_session");
  // TODO: verify corresponding valid session for ID
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    // Remix will catch that thrown response and send it back to the client.
    // It's a great way to "exit early" in abstractions like this so users
    // of our requireUserId function can just assume that the return will
    // always give us the userId and don't need to worry about what happens
    // if there isn't a userId because the response is thrown which stops
    // their code execution
    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

interface UserSessionParams {
  userId: string;
  redirectTo: RedirectPath;
}

export async function createUserSession({
  userId,
  redirectTo,
}: UserSessionParams) {
  const { getSession, commitSession } = storage;

  const session = await getSession();
  session.set("trainhq_session", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getUserFromSession(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function login({ username, password }: LoginForm) {
  const userResult = await db.user.findUnique({ where: { username } });

  if (!userResult) {
    return null;
  } else {
    return (await bcrypt.compare(password, userResult.passwordHash))
      ? userResult
      : null;
  }
}

export async function logout(request: Request) {
  const { destroySession } = storage;
  const userSession = await getUserSession(request);

  // TODO: "if user is logged in based on session" ?
  // or just destroy the session data regardless ?
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(userSession),
    },
  });
}

interface RegistrationForm {
  username: string;
  password: string;
}

export async function register({ username, password }: RegistrationForm) {
  const userExists = await db.user.findFirst({
    where: { username },
  });

  if (userExists) {
    throw conflict({
      fields: { username },
      formError: "This username has been taken",
    });
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { username, passwordHash },
    });
    return { id: user.id, username };
  }
}
