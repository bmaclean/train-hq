export default function PlansIndexRoute() {
  return (
    <ul>
      <li>Joggers Plan - 3 Runs / Week</li>
      <li>Runners Plan - 4 Runs / Week</li>
      <li>Racers Plan - 5 Runs / Week</li>
      <li>Custom Plan</li>
    </ul>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <p>There was a problem loading available plans.</p>
      <p>{error.message}</p>
    </div>
  );
}
