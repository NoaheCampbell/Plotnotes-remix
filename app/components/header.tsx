// app/components/Header.tsx
import { useState } from "react";
import { Link, Form } from "@remix-run/react";
import type { User } from "~/types";

export default function Header({ user }: { user: User | null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
          <div className="relative">
            <img
              src={user.picture || "https://via.placeholder.com/40"} // Fallback image
              alt="Profile"
              className="h-10 w-10 rounded-full cursor-pointer border-2 border-gray-600"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <div className="px-4 py-2 text-white border-b border-gray-600">
                  {user.name || "Unknown User"}
                </div>
                <Form action="/logout" method="post" onSubmit={() => setDropdownOpen(false)}>
                  <button type="submit" className="w-full text-left px-4 py-2 text-white hover:bg-gray-600">
                    Logout
                  </button>
                </Form>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth/google" className="text-white">
            Sign In with Google
          </Link>
        )}
      </nav>
    </header>
  );
}