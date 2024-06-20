import { useState } from 'react';
import Footer from '~/components/footer';
import Header from '~/components/header';

export default function Create() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');

  const handleGenerateStory = async () => {
    console.log('handleGenerateStory called');
    const apiUrl = '/ollama'; // The Remix action route

    try {
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

      setStory('');

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setStory((prev) => prev + chunk);
          console.log('Chunk:', chunk); // Add log here
        }
      };

      processStream();
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Start Your Story
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8">
            Enter your prompt below to generate a story.
          </p>
          <textarea
            className="w-full p-4 mb-4 bg-gray-800 text-white rounded-md"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt here..."
          />
          <button
            onClick={handleGenerateStory}
            className="btn btn-primary"
          >
            Generate Story
          </button>
          {story && (
            <div className="mt-8 p-4 bg-gray-800 text-white rounded-md">
              <h2 className="text-2xl font-bold mb-4">Your Generated Story</h2>
              <p>{story}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
