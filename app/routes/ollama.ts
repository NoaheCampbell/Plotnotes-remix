import { ActionFunction } from '@remix-run/node';
import ollama from 'ollama';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const prompt = formData.get('prompt');
  
  const stream = new ReadableStream({
    async start(controller) {      
      const response = await ollama.chat({
        model: 'phi3:14b',
        messages: [{ role: 'user', content: prompt as string }],
        stream: true,
        keep_alive: 100,
      });

      const encoder = new TextEncoder();
      try {
        for await (const part of response) {
          const message = part.message.content;  
          controller.enqueue(encoder.encode(`${message}`));
        }
      } catch (error) {
        console.error('Error in stream:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
