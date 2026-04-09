import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

// Vi definierar vad komponenten behöver ta emot
type Props = {
  view: "calendar" | "list";
  setView: (view: "calendar" | "list") => void;
  onOpenModal: () => void;
};

export const BookingNavigation = ({ view, setView, onOpenModal }: Props) => {
  const { user } = useAuth();

  return (
    <div className="p-4 bg-accent flex justify-between items-center border-b rounded-t-lg">
      <div className="flex items-center gap-3">
        {/* Switch använder nu props från föräldern */}
        <button
          onClick={() => setView(view === "calendar" ? "list" : "calendar")}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            view === "calendar" ? "bg-secondary/80" : "bg-primary/80"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
              view === "calendar" ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>

        <span className="text-sm font-medium text-gray-700 w-24">
          {view === "calendar" ? "📅 Kalendervy" : "📋 Listvy"}
        </span>
      </div>

      <div className="flex gap-3">
        {user?.role === "admin" && (
          <>
            <Link
              to="/users"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm transition"
            >
              Hantera Användare
            </Link>
            <Link
              to="/rooms"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm transition"
            >
              Hantera Rum
            </Link>
          </>
        )}
        <button
          onClick={onOpenModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        >
          + Ny bokning
        </button>
      </div>
    </div>
  );
};
