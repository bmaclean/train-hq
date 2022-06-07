import { json } from "@remix-run/node";

export function badRequest<T>(data: T) {
  return json(data, { status: 400 });
}

export function conflict<T>(data: T) {
  return json(data, { status: 409 });
}
