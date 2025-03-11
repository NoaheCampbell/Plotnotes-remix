import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { query } from "~/utils/pool";
import { getSession } from "~/services/session.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

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
    console.error("Loader error in stories._index.tsx:", error);
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
    console.error("Action error in stories._index.tsx:", error);
    throw new Error("Failed to delete story: " + (error instanceof Error ? error.message : "Unknown error"));
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

export default function StoriesIndex() {
  const { user, stories } = useLoaderData<{ user: any; stories: { id: number; story: string; storyname: string }[] }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<number | null>(null);

  const handleDeleteClick = (storyId: number) => {
    setStoryToDelete(storyId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (storyToDelete) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("storyId", storyToDelete.toString());
      submit(formData, { method: "post" });
    }
    setIsModalOpen(false);
    setStoryToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setStoryToDelete(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto text-center text-white p-6">
        <h1 className="text-4xl font-bold tracking-tighter mb-8">Your Stories</h1>

        {stories.length === 0 ? (
          <p className="text-lg text-gray-400">No stories created yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <li
                key={story.id}
                className="bg-gray-800 p-6 rounded-md w-full min-h-[350px] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{story.storyname || "Untitled Story"}</h3>
                  <p className="text-base text-gray-300 mb-4 line-clamp-6"> {/* Changed to line-clamp-6 to show more text */}
                    {story.story}
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Link
                    to={`/stories/${story.id}`}
                    className="btn btn-secondary text-lg py-2 px-4"
                    reloadDocument
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(story.id)}
                    className="btn btn-secondary bg-red-500 hover:bg-red-600 text-lg py-1 px-2 flex items-center justify-center"
                    disabled={navigation.state === "submitting"}
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this story? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-secondary bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}