import { ActionFunction } from '@remix-run/node';
import { Ollama } from 'ollama'
import { query } from '~/utils/pool';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const prompt = formData.get('prompt');
  
  const stream = new ReadableStream({
    async start(controller) {  
      let story = '';    
      const ollama = new Ollama({ host: "http://localhost:11434" });
      const response = await ollama.chat({
        model: 'wizardlm2',
        messages: [{ role: 'user', content: prompt as string }],
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
        console.error('Error in stream:', error);
        controller.error(error);
      } finally {
        controller.close();
        console.log('Story:', story);
        // Save the story to the database
        await query('INSERT INTO stories (userid, story, storyname) VALUES ($1, $2, $3)', [1, story, "TempName"]);
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
