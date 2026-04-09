import React, { useState, useMemo } from "react";
import type { Booking } from "../types/bookingTypes";
import type { Room } from "../../rooms/types/roomTypes";
import type { User } from "../../users/types/userTypes";
import {
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import * as bookingService from "../services/bookingServices";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  currentUser: User | null;
  onBookingClick: (id: string) => void;
  onRefresh: () => void;
};

type SortKey = "room" | "date" | "user";

export const BookingList: React.FC<Props> = ({
  bookings,
  rooms,
  currentUser,
  onBookingClick,
  onRefresh,
}) => {
  const isAdmin = currentUser?.role === "admin";
  const [showHistory, setShowHistory] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "date",
    direction: "asc",
  });

  // --- SORTERING & FILTRERING ---
  const { activeBookings, pastBookings } = useMemo(() => {
    const now = new Date().getTime();

    // 1. FILTRERING: Visa endast egna bokningar (om man inte är admin)
    const filteredByRole = bookings.filter((b) => {
      if (isAdmin) return true;
      const isOwn =
        typeof b.userId === "object" && b.userId !== null
          ? b.userId._id === currentUser?.id
          : b.userId === currentUser?.id;
      return isOwn;
    });

    // 2. Dela upp i två listor baserat på tid
    const active = filteredByRole.filter(
      (b) => new Date(b.endTime).getTime() >= now,
    );
    const past = filteredByRole.filter(
      (b) => new Date(b.endTime).getTime() < now,
    );

    // 3. Hjälpfunktion för sortering
    const sortFn = (a: Booking, b: Booking) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortConfig.key === "room") {
        const roomA =
          typeof a.roomId === "object"
            ? a.roomId
            : rooms.find((r) => r._id === a.roomId);
        const roomB =
          typeof b.roomId === "object"
            ? b.roomId
            : rooms.find((r) => r._id === b.roomId);
        valA = roomA?.name || "";
        valB = roomB?.name || "";
      } else if (sortConfig.key === "user") {
        valA = typeof a.userId === "object" ? a.userId.name : "Okänd";
        valB = typeof b.userId === "object" ? b.userId.name : "Okänd";
      } else {
        valA = new Date(a.startTime).getTime();
        valB = new Date(b.startTime).getTime();
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    };

    return {
      activeBookings: [...active].sort(sortFn),
      pastBookings: [...past].sort(sortFn),
    };
  }, [bookings, sortConfig, rooms, isAdmin, currentUser]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Vill du verkligen avboka detta rum?")) {
      try {
        await bookingService.deleteBooking(id);
        onRefresh();
      } catch (err: unknown) {
        console.error(
          "Raderingsfel:",
          err instanceof Error ? err.message : "Okänt fel",
        );
      }
    }
  };

  const renderBookingRow = (booking: Booking, isPast: boolean) => {
    const room =
      typeof booking.roomId === "object"
        ? booking.roomId
        : rooms.find((r) => r._id === booking.roomId);
    const isOwn =
      (typeof booking.userId === "object"
        ? booking.userId._id
        : booking.userId) === currentUser?.id;
    const bookerName =
      typeof booking.userId === "object" ? booking.userId.name : "Okänd";
    const canEdit = (isOwn || isAdmin) && !isPast;

    const rowStyle = {
      backgroundColor: isPast
        ? `${room?.color || "#ccc"}08`
        : `${room?.color || "#ccc"}15`,
      opacity: isPast ? 0.75 : 1,
      filter: isPast ? "saturate(0.4)" : "none",
    };

    return (
      <div
        key={booking._id}
        style={rowStyle}
        className={`grid grid-cols-12 items-center p-4 rounded-xl border transition-all mb-2
        ${isPast ? "border-gray-100 grayscale-[0.2]" : "border-gray-100 shadow-sm hover:shadow-md"}`}
      >
        <div className="col-span-4 flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            style={{
              backgroundColor: room?.color || "#ccc",
              filter: isPast ? "brightness(1.2) saturate(0.5)" : "none",
            }}
          />
          <span
            className={`font-bold truncate ${isPast ? "text-gray-500" : "text-gray-800"}`}
          >
            {room?.name || "Okänt rum"}
          </span>
        </div>

        <div className="col-span-4">
          <div
            className={`text-sm font-medium ${isPast ? "text-gray-500" : "text-gray-700"}`}
          >
            {new Date(booking.startTime).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "short",
            })}
          </div>
          <div className="text-xs text-gray-400 italic lowercase">
            kl.{" "}
            {new Date(booking.startTime).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="col-span-3">
          <span
            className={`text-sm truncate block ${isOwn && !isPast ? "text-blue-600 font-bold" : "text-gray-400"}`}
          >
            {isOwn ? "Jag" : bookerName}
          </span>
        </div>

        <div className="col-span-1 flex justify-end gap-1">
          {canEdit ? (
            <>
              <button
                onClick={() => onBookingClick(booking._id)}
                className="p-1.5 text-gray-400 hover:bg-white rounded-full transition"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleDelete(e, booking._id)}
                className="p-1.5 text-red-300 hover:bg-red-50 rounded-full transition"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <ClockIcon className="w-5 h-5 text-gray-300 mr-2" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase border-b border-gray-100 mb-4">
        <button
          className="col-span-4 flex items-center gap-1 hover:text-blue-600 outline-none"
          onClick={() =>
            setSortConfig({
              key: "room",
              direction: sortConfig.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          Rum{" "}
          {sortConfig.key === "room" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
        <button
          className="col-span-4 flex items-center gap-1 hover:text-blue-600 outline-none"
          onClick={() =>
            setSortConfig({
              key: "date",
              direction: sortConfig.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          Datum & Tid{" "}
          {sortConfig.key === "date" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
        <button
          className="col-span-3 flex items-center gap-1 hover:text-blue-600 outline-none"
          onClick={() =>
            setSortConfig({
              key: "user",
              direction: sortConfig.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          Person{" "}
          {sortConfig.key === "user" &&
            (sortConfig.direction === "asc" ? "↑" : "↓")}
        </button>
      </div>

      <div className="space-y-2">
        {activeBookings.length > 0 ? (
          activeBookings.map((b) => renderBookingRow(b, false))
        ) : (
          <p className="text-center py-10 text-gray-400">
            Inga aktiva bokningar hittades.
          </p>
        )}

        {pastBookings.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition mb-4"
            >
              Historik ({pastBookings.length})
              {showHistory ? (
                <ChevronUpIcon className="w-3 h-3" />
              ) : (
                <ChevronDownIcon className="w-3 h-3" />
              )}
            </button>
            {showHistory && pastBookings.map((b) => renderBookingRow(b, true))}
          </div>
        )}
      </div>
    </div>
  );
};
