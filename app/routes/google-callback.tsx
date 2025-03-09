// app/routes/google-callback.tsx
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { getTokenFromCode } from "~/lib/oauth-providers/google";
import { UserModel } from "../models/user.server";
import { commitSession, getSession } from "~/services/session.server";
import type { User } from "~/types";
import Header from "../components/header";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log("Processing Google OAuth callback...");
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    console.log("Callback Query Params:", { code, state });

    if (!code || !state) {
      console.error("Missing code or state in callback URL");
      return json({ error: "Missing authentication parameters" }, { status: 400 });
    }

    const userData = await getTokenFromCode(code);
    console.log("User Data from Google:", userData);

    // Debug before passing to UserModel
    console.log("Passing to UserModel.findOrCreate:", {
      email: userData.email!,
      name: userData.name!,
      googleId: userData.googleId!,
      picture: userData.picture,
    });

    const userFromModel = await UserModel.findOrCreate({
      email: userData.email!,
      name: userData.name!,
      googleId: userData.googleId!,
      picture: userData.picture, // Ensure this matches the log
    });

    const user: User = {
      id: userFromModel.id,
      email: userFromModel.email,
      name: userFromModel.name,
      googleId: userFromModel.googleId,
      picture: userFromModel.picture || userData.picture, // Fallback to userData.picture
    };

    console.log("Authenticated User with Picture:", user);

    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", user);

    const sessionCookie = await commitSession(session);
    console.log("Session Cookie:", sessionCookie);

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