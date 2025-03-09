// app/routes/dashboard.tsx
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/services/session.server";
import type { User as AppUser } from "~/types";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user") as AppUser | null;
  return { user };
};

export default function Dashboard() {
  const { user } = useLoaderData<{ user: AppUser | null }>();
  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.name}!</p> : <p>Please log in.</p>}
    </div>
  );
}