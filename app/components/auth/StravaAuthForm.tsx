import { Form, FormProps } from "remix";
import { StravaConnectButton } from "./StravaConnectButton";

export function StravaAuthForm(props: FormProps) {
  return (
    <Form action="/auth/strava" method="get" {...props}>
      <StravaConnectButton />
    </Form>
  );
}
