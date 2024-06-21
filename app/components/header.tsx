import { Link, Form } from '@remix-run/react';
import { SocialsProvider } from "remix-auth-socials";

export default function Header() {

  return (
    <header className="flex justify-between p-4 bg-gray-800">
      <div className="text-white text-xl flex items-center">
        <Link to="/" className="text-white text-xl flex items-center">
          <img src="/images/PlotNotesIcon.png" alt="PlotNotes Logo" className="h-10" />
        </Link>
        <span className="ml-2">PlotNotes</span>
      </div>
      <nav>
        {
          <Form
            method="post"
            action={`/auth/${SocialsProvider.GOOGLE}`}
          >
            <button>Login with Google</button>
          </Form>
        }
      </nav>
    </header>
  );
}
