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
  const intent = formData.get("intent") as string | null;

  const ollama = new Ollama({ host: process.env.OLLAMA_API });

  if (intent === "termDescription") {
    const term = formData.get("term") as string;
    if (!term) {
      return new Response("Term is required", { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        let description = "";
        const response = await ollama.chat({
          model: "wizardlm2",
          messages: [{ role: "user", content: `Generate a creative description for the term "${term}".` }],
          stream: true,
          keep_alive: -1,
        });

        const encoder = new TextEncoder();
        try {
          for await (const part of response) {
            const message = part.message.content;
            controller.enqueue(encoder.encode(`${message}`));
            description += message;
          }
        } catch (error) {
          console.error("Error in stream for term description:", error);
          controller.error(error);
        } finally {
          controller.close();
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
  }

  // Default case: Story generation
  const stream = new ReadableStream({
    async start(controller) {
      let story = "";
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


        const namePrompt = `Do not style the text at all, do not add any quotes, only give me the title for this story: "${story}"`;
        let storyName = "A Mysterious Tale";

        try {
          const nameResponse = await ollama.chat({
            model: "wizardlm2",
            messages: [{ role: "user", content: namePrompt }],
            stream: false,
            keep_alive: -1,
          });
          // Trim the name to 50 characters and remove any quotes
          storyName = nameResponse.message.content.trim().slice(0, 50).replace(/["']/g, "");
        } catch (error) {
          console.error("Error generating story name:", error);
        }

        // Save the story with the generated name
        await query(
          "INSERT INTO stories (userid, story, storyname) VALUES ($1, $2, $3)",
          [user.id, story, storyName]
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