import { Link } from "react-router-dom";

export const SettingNavigation = () => {
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

      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
        Inställningar
      </span>
    </div>
  );
};
