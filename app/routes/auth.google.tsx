import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { generateAuthUrl } from "~/lib/oauth-providers/google";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Generating Google Auth URL...");
  // Check if the user is already authenticated
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect") || "/";
  const googleAuthUrl = generateAuthUrl(redirectUrl);
  return json({ googleAuthUrl, redirectUrl });
}

export default function AuthGoogle() {
  const { googleAuthUrl, redirectUrl } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to Google OAuth URL after a short delay
    const timer = setTimeout(() => {
      window.location.href = googleAuthUrl;
    }, 1000); // 1-second delay to show the message

    return () => clearTimeout(timer);
  }, [googleAuthUrl]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#333", fontSize: "2.5rem", marginBottom: "20px" }}>
        Sign In to Plotnotes
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#777", marginBottom: "20px" }}>
        Redirecting to Google for authentication...
      </p>
      <p style={{ fontSize: "1rem", color: "#555" }}>
        If you are not redirected,{" "}
        <a
          href={googleAuthUrl}
          style={{
            color: "#4285f4",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          click here to continue with Google
        </a>.
      </p>
    </div>
  );
}