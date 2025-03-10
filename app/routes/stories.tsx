import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, Outlet } from "@remix-run/react";
import { query } from "~/utils/pool";
import { getSession } from "~/services/session.server";
import Header from "~/components/header";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    return redirect("/auth/google");
  }

  try {
    const result = await query(
      "SELECT id, story, storyname FROM stories WHERE userid = $1",
      [user.id]
    );
    const stories = result.rows;

    return json({ user, stories });
  } catch (error) {
    console.error("Loader error in stories.tsx:", error);
    throw new Error("Failed to load stories: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    return redirect("/auth/google");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");
  const storyId = parseInt(formData.get("storyId") as string, 10);

  try {
    if (intent === "delete") {
      await query("DELETE FROM stories WHERE id = $1 AND userid = $2", [storyId, user.id]);
      return json({ success: true });
    }
  } catch (error) {
    console.error("Action error in stories.tsx:", error);
    throw new Error("Failed to delete story: " + (error instanceof Error ? error.message : "Unknown error"));
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

export default function Stories() {
  const { user, stories } = useLoaderData<{ user: any; stories: { id: number; story: string; storyname: string }[] }>();
  const navigation = useNavigation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <Header user={user} />
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Outlet to render nested routes */}
        <Outlet />
        <div className="max-w-5xl mx-auto text-center text-white p-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-8">Your Stories</h1>

          {stories.length === 0 ? (
            <p className="text-gray-400 text-lg">No stories created yet.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <li key={story.id} className="bg-gray-800 p-6 rounded-md w-full min-h-[250px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-2xl font-semibold mb-3">{story.storyname || "Untitled Story"}</h3>
                    <p className="text-gray-300 text-base mb-4 line-clamp-4">{story.story}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/stories/${story.id}`}
                      className="btn btn-secondary text-lg py-2 px-4"
                    >
                      View
                    </Link>
                    <Form method="post" onSubmit={(e) => confirm("Are you sure you want to delete this story?") || e.preventDefault()}>
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="storyId" value={story.id.toString()} />
                      <button
                        type="submit"
                        className="btn btn-secondary bg-red-500 hover:bg-red-600 text-lg py-2 px-4"
                        disabled={navigation.state === "submitting"}
                      >
                        {navigation.state === "submitting" ? "Deleting..." : "Delete"}
                      </button>
                    </Form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
  console.log("ErrorBoundary triggered in stories.tsx:", error);
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