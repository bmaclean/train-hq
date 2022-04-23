import { Link } from "remix";
import { Container } from "~/components/layout";
import { BrandLogo } from "~/components/ui";

export default function Index() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center">
        <h1>
          Welcome to <BrandLogo type="text" className="h-16 inline-block" />
        </h1>
        <nav>
          <ul>
            <li>
              <Link prefetch="intent" to="plans">
                Plans
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Container>
  );
}
