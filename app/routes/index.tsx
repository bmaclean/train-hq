import { Link } from "remix";
import { Container } from "~/components/layout";

export default function Index() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center">
        <h1>Welcome to Train HQ</h1>
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
