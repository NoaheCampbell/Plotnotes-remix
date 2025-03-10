import { ActionFunction } from "@remix-run/node";
import { Ollama } from "ollama";
import { query } from "~/utils/pool";
import { getSession } from "../services/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) {
    throw new Error("User not authenticated");
  }

  const formData = await request.formData();
  const prompt = formData.get("prompt");

  const stream = new ReadableStream({
    async start(controller) {
      let story = "";
      const ollama = new Ollama({ host: process.env.OLLAMA_API });
      const response = await ollama.chat({
        model: "wizardlm2",
        messages: [{ role: "user", content: prompt as string }],
        stream: true,
        keep_alive: -1,
      });

      const encoder = new TextEncoder();
      try {
        for await (const part of response) {
          const message = part.message.content;
          controller.enqueue(encoder.encode(`${message}`));
          story += message;
        }
      } catch (error) {
        console.error("Error in stream:", error);
        controller.error(error);
      } finally {
        controller.close();
        await query(
          "INSERT INTO stories (userid, story, storyname) VALUES ($1, $2, $3)",
          [user.id, story, "TempName"]
        );
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};