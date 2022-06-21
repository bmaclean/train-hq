import { Link, useMatches } from "@remix-run/react";
import classNames from "classnames";
import { useIsRouteActive } from "~/hooks";

interface DashboardMenuItemProps {
  route: string;
  label: string;
}

function DashboardMenuItem({ route, label }: DashboardMenuItemProps) {
  const active = useIsRouteActive(route);

  return (
    <li className="my-4">
      <Link
        className={classNames({
          "text-green-500 font-bold": active,
          "text-gray-600": !active,
        })}
        prefetch="intent"
        to={route}
      >
        {label}
      </Link>
    </li>
  );
}

export function DashboardMenu() {
  return (
    <nav className="height-full flex items-center justify-center p-4 w-64">
      <ul>
        <DashboardMenuItem route="/schedule" label="Training Schedule" />
        <DashboardMenuItem route="/plans" label="Plans" />
        <DashboardMenuItem route="/settings" label="Settings" />
      </ul>
    </nav>
  );
}
