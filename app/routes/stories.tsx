import { Outlet } from "@remix-run/react";
import Header from "~/components/header";
import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "~/services/session.server";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    return redirect("/auth/google");
  }

  return json({ user });
};

export default function StoriesLayout() {
  const { user } = useLoaderData<{ user: any }>();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <Header user={user} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export function CatchBoundary() {
  const caught = { status: 404, data: "Stories not found" };
  if (caught.status === 404) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
        <Header user={null} />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-5xl mx-auto text-center text-white p-6">
            <h1 className="text-4xl font-bold tracking-tighter mb-8">Stories Not Found</h1>
            <p className="text-gray-400 text-lg">{caught.data}</p>
            <Link to="/" className="btn btn-secondary mt-4 text-lg py-2 px-4">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <Header user={null} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto text-center text-white p-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-8">Error</h1>
          <p className="text-red-500 text-lg">An error occurred: {error.message}</p>
          <Link to="/stories" className="btn btn-secondary mt-4 text-lg py-2 px-4">
            Back to Stories
          </Link>
        </div>
      </main>
    </div>
  );
}