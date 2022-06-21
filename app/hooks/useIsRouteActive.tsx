import { useMatches } from "@remix-run/react";

export function useIsRouteActive(pathname: string) {
  const matches = useMatches();

  return matches.some((match) => match.pathname.startsWith(pathname));
}
