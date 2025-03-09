import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { generateAuthUrl } from "../lib/oauth-providers/google";

export async function loader({ request }: LoaderFunctionArgs) {
  // Put "register" in the state so we know where the user is 
  // coming from when they are sent back to us from Google.
  return json({ googleAuthUrl: generateAuthUrl("register") });
}

export default function Register() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return (
    <div>
      <a href={googleAuthUrl}>Continue with Google</a>
    </div>
  );
}