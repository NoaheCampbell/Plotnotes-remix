import { useState, useEffect, useRef } from "react"; // Added useRef for AbortController
import { useLoaderData, json, redirect } from "@remix-run/react";
import { getSession } from "../services/session.server";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { TermModel, Term } from "~/models/term.server";
import { User } from "~/types";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user") as User | null;
  if (!user) {
    return redirect("/auth/google");
  }

  const terms = await TermModel.findByUserId(user.id);
  return json({ user, terms });
};

export default function Create() {
  const { user, terms: initialTerms } = useLoaderData<{ user: User | null; terms: Term[] }>();
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Story");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Generating");
  const [showAlert, setShowAlert] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null); // Ref to store AbortController

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => (prev.endsWith("...") ? "Generating" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleGenerateStory = async () => {
    if (!user) {
      setShowAlert(true);
      return;
    }
    setIsLoading(true);
    setStory(""); // Clear previous story

    // Initialize AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Use initialTerms from loader
    const terms = initialTerms;

    // Process the prompt: inject term descriptions
    let modifiedPrompt = prompt;
    console.log("Original prompt:", prompt);
    for (const term of terms) {
      const regex = new RegExp(`\\b${term.term}\\b`, "gi");
      if (regex.test(modifiedPrompt)) {
        const injection = `\n(Note: ${term.term} refers to: ${term.description})`;
        modifiedPrompt += injection;
        console.log(`Injected term: ${term.term}, Description: ${term.description}, New prompt: ${modifiedPrompt}`);
      }
    }
    console.log("Final modified prompt:", modifiedPrompt);

    try {
      const formData = new URLSearchParams();
      formData.append("prompt", modifiedPrompt);

      const res = await fetch("/ollama", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "text/event-stream",
        },
        signal, // Pass the abort signal to the fetch request
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (signal.aborted) {
            setStory("Generation stopped by user.");
            break; // Exit the loop if aborted
          }
          const chunk = decoder.decode(value, { stream: true });
          setStory((prev) => prev + chunk);
        }
        if (!signal.aborted) setIsLoading(false); // Only stop loading if not aborted
      };

      await processStream();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Generation aborted by user.");
        setStory("Generation stopped by user.");
      } else {
        console.error("Error generating story:", error);
        setStory("Error generating story. Please try again.");
      }
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null; // Clean up AbortController
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the fetch request
      setIsLoading(false); // Immediately stop the loading state
      console.log("Stop button clicked, aborting generation.");
    }
  };

  const handleContinue = () => {
    setShowAlert(false);
    handleGenerateStory();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(story).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy Story");
      }, 3000);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <Header user={user} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Start Your Story
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8">
            Enter your prompt below to generate a story. Your custom terms will be included!
          </p>
          <textarea
            className="w-full p-4 mb-4 bg-gray-800 text-white rounded-md"
            rows={10}
            cols={60}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt here..."
            style={{ resize: "none", overflow: "auto", height: "100px" }}
          />
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={handleGenerateStory}
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: "150px" }}
            >
              {isLoading ? loadingText : "Generate"}
            </button>
            {isLoading && (
              <button
                onClick={handleStopGeneration}
                className="btn btn-danger"
                style={{ width: "150px" }}
              >
                Stop
              </button>
            )}
          </div>
          <textarea
            className="w-full p-4 mt-4 bg-gray-800 text-white rounded-md"
            rows={10}
            cols={60}
            value={story}
            readOnly
            placeholder="Your story will appear here..."
            style={{ resize: "none", overflow: "auto", height: "200px" }}
          />
          <button onClick={handleCopy} className="mt-2 btn btn-secondary">
            {copyButtonText}
          </button>
          {initialTerms && initialTerms.length > 0 && (
            <div className="mt-4">
              <h2 className="text-white text-2xl mb-2">Your Custom Terms</h2>
              <ul className="space-y-4">
                {initialTerms.map((term) => (
                  <li key={term.id} className="bg-gray-800 p-4 rounded">
                    <h3 className="text-white text-xl">{term.term}</h3>
                    {term.category && <p className="text-gray-400 text-sm">Category: {term.category}</p>}
                    <p className="text-gray-300 mt-2">{term.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      {showAlert && (
        <div className="alert alert-warning text-center">
          <p>You are not logged in. Nothing will be saved. Do you want to continue?</p>
          <button onClick={handleContinue} className="btn btn-danger">
            Continue
          </button>
          <button onClick={() => setShowAlert(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}