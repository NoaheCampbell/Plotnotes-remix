import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { TermModel, Term } from "~/models/term.server";
import { getSession } from "~/services/session.server";
import Header from "~/components/header";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    return redirect("/auth/google");
  }

  const terms = await TermModel.findByUserId(user.id);
  return json({ user, terms });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    return redirect("/auth/google");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const term = formData.get("term") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!term || !description) {
      return json({ error: "Term and description are required" }, { status: 400 });
    }

    await TermModel.create({ userId: user.id, term, description, category });
    return json({ success: true });
  }

  if (intent === "delete") {
    const termId = parseInt(formData.get("termId") as string, 10);
    await TermModel.delete(termId);
    return json({ success: true });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

export default function Terms() {
  const { user, terms } = useLoaderData<{ user: any; terms: Term[] }>();
  const actionData = useActionData<{ error?: string; success?: boolean }>();
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col">
      <Header user={user} />
      <div className="flex-grow p-4">
        <h1 className="text-white text-3xl mb-4">Manage Custom Terms</h1>

        {/* Form to create a new term */}
        <div className="mb-8">
          <h2 className="text-white text-2xl mb-2">Add a New Term</h2>
          {actionData?.error && <p className="text-red-500 mb-2">{actionData.error}</p>}
          {actionData?.success && <p className="text-green-500 mb-2">Term created successfully!</p>}
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <div>
              <label className="block text-white mb-1">Term or Phrase</label>
              <input
                type="text"
                name="term"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder="e.g., Dragon of Eldoria"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Description</label>
              <textarea
                name="description"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder="e.g., A fire-breathing dragon that guards the Eldorian Forest..."
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Category (optional)</label>
              <select
                name="category"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              >
                <option value="">Select a category</option>
                <option value="character">Character</option>
                <option value="event">Event</option>
                <option value="location">Location</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Creating..." : "Create Term"}
            </button>
          </Form>
        </div>

        {/* List of terms */}
        <div>
          <h2 className="text-white text-2xl mb-2">Your Terms</h2>
          {terms.length === 0 ? (
            <p className="text-gray-400">No terms created yet.</p>
          ) : (
            <ul className="space-y-4">
              {terms.map((term) => (
                <li key={term.id} className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white text-xl">{term.term}</h3>
                      {term.category && <p className="text-gray-400 text-sm">Category: {term.category}</p>}
                      <p className="text-gray-300 mt-2">{term.description}</p>
                    </div>
                    <Form method="post" onSubmit={(e) => confirm("Are you sure you want to delete this term?") || e.preventDefault()}>
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="termId" value={term.id} />
                      <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>
                    </Form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}