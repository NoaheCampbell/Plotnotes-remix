import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { getTokenFromCode } from "~/lib/oauth-providers/google";
import { UserModel } from "../models/user.server";
import { createSession, commitSession, trackSessionAccess } from "~/services/session.server";
import type { User } from "~/types";
import Header from "~/components/header"; // Updated to lowercase

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");


    if (!code || !state) {
      console.error("Missing code or state in callback URL");
      return json({ error: "Missing authentication parameters" }, { status: 400 });
    }

    const userData = await getTokenFromCode(code);

    const userFromModel = await UserModel.findOrCreate({
      email: userData.email!,
      name: userData.name!,
      googleId: userData.googleId!,
      picture: userData.picture,
    });

    const user: User = {
      id: userFromModel.id,
      email: userFromModel.email,
      name: userFromModel.name,
      googleId: userFromModel.googleId,
      picture: userFromModel.picture || userData.picture,
    };

    const session = await createSession(request);
    session.set("user", user);

    const sessionCookie = await commitSession(session);

    return redirect(state || "/", {
      headers: {
        "Set-Cookie": sessionCookie,
      },
    });
  } catch (error: unknown) {
    console.error("Google Callback Error:", error);
    if (error instanceof Error) {
      return json(
        { error: "Failed to complete Google authentication", details: error.message },
        { status: 500 }
      );
    }
    return json(
      { error: "Failed to complete Google authentication" },
      { status: 500 }
    );
  }
}

export default function GoogleCallback() {
  return (
    <div>
      <Header user={null} />
      <div className="p-4 text-center">
        <h1 className="text-white text-4xl mb-4">Plotnotes</h1>
        <p className="text-gray-300 text-lg">Completing Google authentication...</p>
      </div>
    </div>
  );
}