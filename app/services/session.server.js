// app/services/session.server.js
import { createCookieSessionStorage } from '@remix-run/node';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: ["your-secret"], // Replace with your actual secret
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export { getSession, commitSession, destroySession };
