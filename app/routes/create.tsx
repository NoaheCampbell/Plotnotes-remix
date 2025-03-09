import { useState, useEffect } from "react";
import { useLoaderData, json } from "@remix-run/react";
import { getSession } from "../services/session.server";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { User } from "~/types";

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user") as User | null;
  return json({ user });
}

export default function Create() {
  const { user } = useLoaderData<{ user: User | null }>();
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Story");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Generating");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => (prev.endsWith("...") ? "Generating" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleGenerateStory = () => {
    if (!user) {
      setShowAlert(true);
      return;
    }
    generateStory();
  };

  const generateStory = async () => {
    setIsLoading(true);
    const apiUrl = "/ollama";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: new URLSearchParams({ prompt }),
        headers: {
          Accept: "text/event-stream",
        },
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setStory("");

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
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowAlert(false);
    generateStory();
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
            Enter your prompt below to generate a story.
          </p>
          <textarea
            className="w-full p-4 mb-4 bg-gray-800 text-white rounded-md"
            rows={5}
            cols={60}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt here..."
            style={{ resize: "none", overflow: "auto", height: "100px" }}
          />
          <button
            onClick={handleGenerateStory}
            className="btn btn-primary mb-4"
            disabled={isLoading}
            style={{ width: "150px" }}
          >
            {isLoading ? loadingText : "Generate"}
          </button>
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