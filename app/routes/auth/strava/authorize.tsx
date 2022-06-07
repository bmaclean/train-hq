import { LoaderFunction, redirect } from "@remix-run/node";
import { Strava } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const code = new URLSearchParams(request.url).get("code");
  console.log({ code });
  if (
    !code ||
    !process.env.STRAVA_CLIENT_ID ||
    !process.env.STRAVA_CLIENT_SECRET
  ) {
    throw Error;
  }

  const strava = new Strava({
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
  });
  const stravaAuth = await strava.authenticate(code);
  console.log({ stravaAuth });

  // for response from strava
  return redirect("/");
};
