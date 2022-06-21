import type { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { Container } from "../layout";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./Button";

export function DashboardHeader({ user }: { user?: Partial<User> }) {
  return (
    <header>
      <Container className="flex-row justify-between items-center p-4">
        <h1>
          <Link prefetch="intent" to="/" title="Train HQ" aria-label="Train Hq">
            <BrandLogo type="text" className="h-16" />
          </Link>
        </h1>

        {user ? (
          <div className="flex gap-4 items-center whitespace-nowrap">
            <span>{`Hi ${user.username}`}</span>
            <Form action="/logout" method="post">
              <Button>Logout</Button>
            </Form>
          </div>
        ) : (
          <Link prefetch="intent" to="/login">
            Login
          </Link>
        )}
      </Container>
    </header>
  );
}
