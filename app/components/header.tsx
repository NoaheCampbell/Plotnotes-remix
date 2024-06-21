import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';

type User = {
  name: string;
  email: string;
  avatarUrl: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user info from session or API
    fetch('/api/user')
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      });
  }, []);

  return (
    <header className="flex justify-between p-4 bg-gray-800">
      <div className="text-white text-xl flex items-center">
        <Link to="/" className="text-white text-xl flex items-center">
          <img src="/images/PlotNotesIcon.png" alt="PlotNotes Logo" className="h-10" />
        </Link>
        <span className="ml-2">PlotNotes</span>
      </div>
      <nav>
        {user ? (
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                {user.name}
              </button>
            </div>
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1" role="none">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700" role="menuitem">
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700" role="menuitem">
                  Settings
                </Link>
                <form method="post" action="/logout">
                  <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/signin" className="text-white text-sm">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
