import { Link } from '@remix-run/react';
import Footer from './footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <main className="flex-1">
        <section className="flex items-center justify-center w-full py-12 sm:py-24 md:py-32 lg:py-40 xl:py-48">
          <div className="text-center text-white">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Unleash Your Creativity with PlotNotes
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl">
                Craft captivating stories with the help of an AI partner. Explore endless possibilities and bring your
                ideas to life.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/create"
                  className="btn btn-primary"                  >
                  Get Started
                </Link>
                <Link
                  to="#"
                  className="btn btn-secondary"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 sm:py-24 md:py-32 lg:py-40 xl:py-48 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">AI-Powered Storytelling</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Unleash Your Creativity with AI
                </h2>
                <p className="text-gray-700 md:text-xl">
                  PlotNotes' AI-powered story generation tools help you explore endless narrative possibilities.
                  Brainstorm ideas, develop characters, and craft captivating plots with the assistance of our
                  intelligent writing partner.
                </p>
                <Link
                  to="#"
                  className="btn btn-primary"
                >
                  Discover AI Storytelling
                </Link>
              </div>
              <div className="flex justify-center">
                {/* <img
                  src="/placeholder.svg"
                  width="600"
                  height="400"
                  alt="AI Storytelling"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                /> */}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 sm:py-24 md:py-32 lg:py-40 xl:py-48 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex justify-center">
                {/* <img
                  src="/placeholder.svg"
                  width="600"
                  height="400"
                  alt="Collaborative Writing"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                /> */}
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Collaborative Writing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Bring Your Ideas to Life Together
                </h2>
                <p className="text-gray-700 md:text-xl">
                  PlotNotes' collaborative tools make it easy to write, edit, and refine your stories with friends,
                  family, or your writing group. Track changes, leave comments, and work together to craft the perfect
                  narrative.
                </p>
                <Link
                  to="#"
                  className="btn btn-primary"
                >
                  Explore Collaborative Tools
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 sm:py-24 md:py-32 lg:py-40 xl:py-48 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">Publishing Options</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Share Your Stories with the World
                </h2>
                <p className="text-gray-700 md:text-xl">
                  Once your story is complete, PlotNotes offers a variety of publishing options to help you share your
                  work. Export your manuscript, publish directly to popular platforms, or even self-publish your own
                  book.
                </p>
                <Link
                  to="#"
                  className="btn btn-primary"
                >
                  Discover Publishing Tools
                </Link>
              </div>
              <div className="flex justify-center">
                {/* <img
                  src="/placeholder.svg"
                  width="600"
                  height="400"
                  alt="Publishing Options"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                /> */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
