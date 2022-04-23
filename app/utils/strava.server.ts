import { fetch } from "@remix-run/node";

export interface StravaInit {
  clientId: string;
  clientSecret?: string;
}

export type StravaAuth = {
  expiresAt: number;
  expiresIn: number;
  refreshToken: string;
  athlete: string;
};

export class Strava {
  clientId: string;
  clientSecret?: string;

  constructor({ clientId, clientSecret }: StravaInit) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  authorizeUrl() {
    const stravaAuthorizeUrl = new URL("http://www.strava.com/oauth/authorize");
    stravaAuthorizeUrl.searchParams.set("client_id", this.clientId);
    stravaAuthorizeUrl.searchParams.set("response_type", "code");
    stravaAuthorizeUrl.searchParams.set(
      "redirect_uri",
      "http://localhost:3000/auth/strava/authorize"
    );
    stravaAuthorizeUrl.searchParams.set("approval_prompt", "auto"); // only prompt approval if the user has not yet authorized
    stravaAuthorizeUrl.searchParams.set("scope", "read_all");
    return stravaAuthorizeUrl.toString();
  }

  async authenticate(code: string): Promise<StravaAuth> {
    if (!this.clientSecret) {
      throw new Error();
    }

    const stravaAuthenticateUrl = new URL(
      "https://www.strava.com/api/v3/oauth/token"
    );
    stravaAuthenticateUrl.searchParams.set("client_id", this.clientId);
    stravaAuthenticateUrl.searchParams.set("client_secret", this.clientSecret);
    stravaAuthenticateUrl.searchParams.set("grant_type", "authorization_code");
    stravaAuthenticateUrl.searchParams.set("code", code); // only prompt approval if the user has not yet authorized

    const authenticationResponse: StravaAuth = await (
      await fetch(stravaAuthenticateUrl, { method: "POST" })
    ).json();

    return authenticationResponse;
  }
}
