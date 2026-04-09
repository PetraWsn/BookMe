import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const UserNavigation = ({ searchQuery, setSearchQuery }: Props) => {
  return (
    <div className="p-4 bg-accent flex justify-between items-center border-b rounded-t-lg">
      <div className="flex gap-3">
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          ← Till Bokningar
        </Link>
      </div>

      {/* Sökruta */}
      <div className="relative w-64">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sök namn eller e-post..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition shadow-sm"
        />
      </div>
    </div>
  );
};
