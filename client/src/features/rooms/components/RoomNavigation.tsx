import { Link } from "react-router-dom";

type Props = {
  onOpenModal: () => void;
};

export const RoomNavigation = ({ onOpenModal }: Props) => {
  return (
    <div className="p-4 bg-accent flex justify-between items-center border-b rounded-t-lg">
      <div className="flex gap-3">
        <Link
          to="/bookings"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          ← Till Bokningar
        </Link>
      </div>

      <button
        onClick={onOpenModal}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-sm"
      >
        + Nytt Rum
      </button>
    </div>
  );
};
