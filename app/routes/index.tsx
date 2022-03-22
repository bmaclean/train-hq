import { Link, LinksFunction } from "remix";

import stylesUrl from "~/styles/index.css";

/**
 * CSS files can be cached long-term and your CSS is naturally code-split
 */
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        {" "}
        <h1>Welcome to Train HQ</h1>
        <nav>
          <ul>
            <li>
              <Link to="plans">Plans</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
