import { createCookieSessionStorage } from '@remix-run/node';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secrets: process.env.SESSION_SECRET,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: false,
  },
});

export { getSession, commitSession, destroySession };
