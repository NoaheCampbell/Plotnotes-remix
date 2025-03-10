import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession, trackSessionAccess } from "../services/session.server";
import LandingPage from "~/components/landingPage";
import Header from "~/components/header";
import { User } from "~/types";

export async function loader({ request }: { request: Request }) {
  const session = await trackSessionAccess(request);
  const user = session.get("user") as User | null;
  return json({ user });
}

export default function Index() {
  const { user } = useLoaderData<{ user: User | null }>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col">
      <Header user={user} />
      <div className="flex-grow">
        {user ? (
          <div className="p-4 text-center">
            <p className="text-white text-lg">
              You are signed in as {user.email}!
            </p>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-white text-lg">You are signed out</p>
          </div>
        )}
        <LandingPage />
      </div>
    </div>
  );
}