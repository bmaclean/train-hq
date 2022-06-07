import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Strava } from "~/utils";

export const loader: LoaderFunction = async () => {
  if (typeof process.env.STRAVA_CLIENT_ID !== "string") {
    throw new Error();
  }
  const strava = new Strava({ clientId: process.env.STRAVA_CLIENT_ID });
  return redirect(strava.authorizeUrl());
};
