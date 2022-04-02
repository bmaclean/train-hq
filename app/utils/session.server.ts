import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "remix";

import { db } from "~/utils/db.server";

interface LoginForm {
  username: string;
  password: string;
}

interface UserSessionParams {
  userId: string;
  redirectTo: URL["pathname"];
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

export async function createUserSession({ userId, redirectTo }: UserSessionParams) {
  const { getSession, commitSession } = storage;

  const session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
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

interface RegistrationForm {
  username: string;
  password: string;
}

// TODO:
const UserExistsError = Error;

export async function register({ username, password }: RegistrationForm) {
  const userExists = await db.user.findFirst({
    where: { username },
  });
  if (userExists) {
    throw UserExistsError;
  }
}
