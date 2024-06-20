import { useState, useEffect } from 'react';
import Footer from '~/components/footer';
import Header from '~/components/header';

export default function Create() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy Story');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [loadingText, setLoadingText] = useState('Generating'); // Text for loading

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText(prev => {
          if (prev.endsWith('...')) return 'Generating';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleGenerateStory = async () => {
    setIsLoading(true); // Set loading state to true
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
        }
      };

      await processStream();
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(story).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy Story');
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
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
            cols={60}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt here..."
            style={{ resize: 'none', overflow: 'auto', height: '100px' }}
          />
          <button
            onClick={handleGenerateStory}
            className="btn btn-primary mb-4"
            disabled={isLoading} // Disable button when loading
            style={{ width: '150px' }}
          >
            {isLoading ? loadingText : 'Generate'}
          </button>
          <textarea 
            className="w-full p-4 mt-4 bg-gray-800 text-white rounded-md"
            rows={10}
            cols={60}
            value={story}
            readOnly
            placeholder="Your story will appear here..."
            style={{ resize: 'none', overflow: 'auto', height: '200px' }}
          />
          <button
            onClick={handleCopy}
            className="mt-2 btn btn-secondary"
          >
            {copyButtonText}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
