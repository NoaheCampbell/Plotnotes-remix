import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useEffect } from "react";
import { query } from "~/utils/pool";
import { getSession } from "~/services/session.server";
import { AiOutlineLeft } from "react-icons/ai";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    return redirect("/auth/google");
  }

  const storyId = parseInt(params.storyId as string, 10);

  try {
    const result = await query(
      "SELECT story, storyname FROM stories WHERE id = $1 AND userid = $2",
      [storyId, user.id]
    );
    const story = result.rows[0];

    if (!story) {
      throw new Response("Story not found", { status: 404 });
    }

    return json({ user, story, storyId });
  } catch (error) {
    console.error("Loader error in stories.$storyId.tsx:", error);
    throw new Error("Failed to load story: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export default function SingleStory() {
  const { user, story, storyId } = useLoaderData<{
    user: any;
    story: { storyname: string; story: string };
    storyId: number;
  }>();


  useEffect(() => {
  }, [storyId]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white" data-story-page="true">
      <div className="p-4">
        <Link to="/stories" className="text-white text-2xl flex items-center">
          <AiOutlineLeft />
          <span className="ml-2">Back</span>
        </Link>
      </div>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto text-center text-white p-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-8">
            {story.storyname || "Untitled Story"}
          </h1>
          <div className="bg-gray-800 p-6 rounded-md text-left">
            <p className="text-gray-300 whitespace-pre-wrap text-lg">
              {story.story}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export function CatchBoundary() {
  const caught = { status: 404, data: "Story not found" };
  if (caught.status === 404) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-5xl mx-auto text-center text-white p-6">
            <h1 className="text-4xl font-bold tracking-tighter mb-8">Story Not Found</h1>
            <p className="text-gray-400 text-lg">{caught.data}</p>
            <Link to="/stories" className="btn btn-secondary mt-6 text-lg py-2 px-4">
              Back to Stories
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
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto text-center text-white p-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-8">Error</h1>
          <p className="text-red-500 text-lg">An error occurred: {error.message}</p>
          <Link to="/stories" className="btn btn-secondary mt-6 text-lg py-2 px-4">
            Back to Stories
          </Link>
        </div>
      </main>
    </div>
  );
}