import { ActionFunction, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/services/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
