import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import { getSession } from "~/services/session.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return json({ user });
};

export default function PrivacyPolicy() {
  const { user } = useLoaderData<{ user: any }>();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-white">
      <Header user={user} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-left text-white p-4">
          <h1 className="text-4xl font-bold tracking-tighter mb-8">Privacy Policy</h1>
          <p className="text-gray-300 mb-4">
            Last updated: March 10, 2025
          </p>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
            <p className="text-gray-300">
              Welcome to Plotnotes! We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our website, <a href="https://www.plotnotes.ai" className="underline">www.plotnotes.ai</a>, and its associated services.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
            <p className="text-gray-300">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li><strong>Personal Information:</strong> When you sign up using Google Authentication, we collect your email address and name to create and manage your account.</li>
              <li><strong>Content Data:</strong> Stories, terms, and other content you create on Plotnotes are stored in our database.</li>
              <li><strong>Usage Data:</strong> We may collect information about how you interact with our site, such as IP addresses, browser type, and pages visited, to improve our services.</li>
              <li><strong>Third-Party Data:</strong> When you use the "Autogenerate Description" feature, your input data (terms and categories) is sent to an Ollama endpoint for processing.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
            <p className="text-gray-300">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Provide and maintain our services, including user authentication, story storage, and term management.</li>
              <li>Generate descriptions for your terms using the Ollama endpoint (if you opt for autogeneration).</li>
              <li>Analyze usage patterns to improve our website’s functionality and user experience.</li>
              <li>Communicate with you, such as responding to inquiries or sending service updates (if applicable).</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">How We Share Your Information</h2>
            <p className="text-gray-300">
              We do not sell or rent your personal information to third parties. We may share your information in the following cases:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li><strong>Third-Party Services:</strong> We use Google Authentication for login and an Ollama endpoint for description generation. These services may process your data according to their own privacy policies:</li>
              <ul className="list-disc list-inside ml-4">
                <li><a href="https://policies.google.com/privacy" className="underline">Google Privacy Policy</a></li>
              </ul>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights, safety, or property.</li>
            </ul>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
            <p className="text-gray-300">
              We implement industry-standard security measures to protect your data, including encryption during transmission and secure storage. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
            <p className="text-gray-300">
              Depending on your location, you may have rights under data protection laws, such as:
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Accessing, correcting, or deleting your personal information.</li>
              <li>Objecting to or restricting the processing of your data.</li>
              <li>Requesting data portability.</li>
            </ul>
            <p className="text-gray-300">
              To exercise these rights, please contact us at plotnoted@gmail.com.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Cookies</h2>
            <p className="text-gray-300">
              We use cookies to manage user sessions (e.g., via Google Authentication). You can disable cookies in your browser settings, but this may affect the functionality of Plotnotes.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at [insert contact email].
            </p>
          </section>
          <div className="mt-8">
            <Link to="/" className="text-blue-400 underline hover:text-blue-300">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}