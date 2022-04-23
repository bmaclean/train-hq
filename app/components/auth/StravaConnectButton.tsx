import { HTMLAttributes } from "react";

type StravaConnectButtonProps = Omit<
  HTMLAttributes<HTMLInputElement>,
  "src" | "type"
>;

export function StravaConnectButton(props: StravaConnectButtonProps) {
  return (
    <input
      type="image"
      src="images/strava-connect-button.svg"
      alt="Connect with Strava"
      {...props}
    />
  );
}
