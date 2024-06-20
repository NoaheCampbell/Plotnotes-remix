import { useState } from 'react';

export default function Index() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const apiUrl = '/ollama'; // The Remix action route

    try {
      // Send the prompt as a POST request and get a streaming response
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: new URLSearchParams({ prompt }),
        headers: {
          'Accept': 'text/event-stream', // Indicate that we expect an event stream response
        },
      });

      if (!res.body) {
        throw new Error('No response body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Reset response
      setResponse('');

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setResponse((prev) => prev + chunk);
        }
      };

      processStream();

    } catch (error) {
      console.error('Error making request', error);
      setResponse('An error occurred');
    }
  };

  return (
    <div>
      <h1>Ollama Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <h2>Response:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response}</pre>
        </div>
      )}
    </div>
  );
}
