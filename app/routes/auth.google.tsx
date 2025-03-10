import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { generateAuthUrl } from "~/lib/oauth-providers/google";
import { getSession, trackSessionAccess } from "~/services/session.server";
import Header from "~/components/header";
import { User } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await trackSessionAccess(request);
  const user = session.get("user") as User | null;
  if (user) {
    return redirect("/");
  }
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect") || "/";
  const googleAuthUrl = generateAuthUrl(redirectUrl);
  return json({ googleAuthUrl, redirectUrl, user });
}

export default function AuthGoogle() {
  const { googleAuthUrl, redirectUrl, user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = googleAuthUrl;
    }, 1000);
    return () => clearTimeout(timer);
  }, [googleAuthUrl]);

  return (
    <div>
      <Header user={user} />
      <div className="p-4 text-center">
        <h1 className="text-white text-4xl mb-4">Sign In to Plotnotes</h1>
        <p className="text-gray-300 text-lg mb-4">
          Redirecting to Google for authentication...
        </p>
        <p className="text-gray-400 text-md">
          If you are not redirected,{" "}
          <a
            href={googleAuthUrl}
            className="text-blue-500 font-bold"
          >
            click here to continue with Google
          </a>.
        </p>
      </div>
    </div>
  );
}