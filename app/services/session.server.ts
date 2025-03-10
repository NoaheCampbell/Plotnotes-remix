import { createCookieSessionStorage } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in .env");
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  },
});

// Helper to create a new session with a unique session ID
async function createSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("sessionId")) {
    const sessionId = uuidv4();
    session.set("sessionId", sessionId);
  }
  return session;
}

// Helper to track session access
async function trackSessionAccess(request: Request) {
  return await getSession(request.headers.get("Cookie"));
}

// Helper to destroy a session and log the event
async function destroySessionWithTracking(session: Awaited<ReturnType<typeof getSession>>) {
  return destroySession(session);
}

export { getSession, commitSession, destroySessionWithTracking as destroySession, createSession, trackSessionAccess };