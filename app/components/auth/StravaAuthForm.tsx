import type { FormProps } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { StravaConnectButton } from "./StravaConnectButton";

export function StravaAuthForm(props: FormProps) {
  return (
    <Form action="/auth/strava" method="get" {...props}>
      <StravaConnectButton />
    </Form>
  );
}
