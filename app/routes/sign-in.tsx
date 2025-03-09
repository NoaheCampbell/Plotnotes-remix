import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { generateAuthUrl } from "../lib/oauth-providers/google";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ googleAuthUrl: generateAuthUrl("sign-in") });
}

export default function SignIn() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return (
    <div>
      <a href={googleAuthUrl}>Continue with Google</a>
    </div>
  );
}