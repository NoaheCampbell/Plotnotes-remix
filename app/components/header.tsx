import { Link } from '@remix-run/react';

export default function Header() {
  return (
    <header className="flex justify-between p-4">
      <div className="text-white text-xl flex items-center">
      <Link to="/" className="text-white text-xl flex items-center">
        <img src="/images/PlotNotesIcon.png" alt="PlotNotes Logo" className="h-10" />
        </Link>
        <span className="ml-2">PlotNotes</span>
      </div>
    </header>
  );
}
