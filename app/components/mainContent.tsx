import { Link } from "@remix-run/react";

export default function MainContent() {
  return (
    <main className="flex flex-col justify-center items-center h-screen text-white bg-black m-0 p-0">
      <img src="/images/PlotNotesLogo.png" alt="PlotNotes Logo" className="w-92" />
      <h1 className="text-4xl mt-4 mb-2">Welcome to PlotNotes!</h1>
      <p className="text-xl mb-8">A place to write your stories and share them with the world</p>
      <Link to="/start-writing">
        <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700">
          Start Writing
        </button>
      </Link>
    </main>
  );
}