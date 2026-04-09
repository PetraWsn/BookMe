import React, { useState, useEffect } from "react";
import * as bookingService from "../services/bookingServices";
import * as roomService from "../../rooms/services/roomServices";
import type { Room } from "../../rooms/types/roomTypes";
import { TrashIcon } from "@heroicons/react/24/outline"; // Importera ikon för radering

type Props = {
  bookingId: string | null;
  onClose: () => void;
};

export const BookingModal: React.FC<Props> = ({ bookingId, onClose }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateStr: string | Date): string => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";

    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const initModal = async () => {
      try {
        setLoading(true);
        const roomsData = await roomService.getRooms();
        setRooms(roomsData || []);

        if (bookingId) {
          const b = await bookingService.getBookingById(bookingId);
          const roomIdStr =
            typeof b.roomId === "object" ? b.roomId._id : b.roomId;

          setSelectedRoom(roomIdStr || "");
          setStartTime(formatDateTime(b.startTime));
          setEndTime(formatDateTime(b.endTime));
        }
      } catch (err: unknown) {
        console.error("Kunde inte ladda bokning via ID:", err);
      } finally {
        setLoading(false);
      }
    };

    initModal();
  }, [bookingId]);

  const handleSave = async () => {
    if (!selectedRoom || !startTime || !endTime) {
      alert("Vänligen fyll i alla fält");
      return;
    }

    try {
      const payload = {
        roomId: selectedRoom,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };

      if (bookingId) {
        await bookingService.updateBooking(bookingId, payload);
      } else {
        await bookingService.createBooking(payload);
      }
      onClose();
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Kunde inte spara";
      alert(error);
    }
  };

  const handleDelete = async () => {
    if (!bookingId) return;

    if (window.confirm("Är du säker på att du vill radera denna bokning?")) {
      try {
        await bookingService.deleteBooking(bookingId);
        onClose(); // Stäng modalen och refresha (sköts i onClose i BookingPage)
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : "Kunde inte radera";
        alert(error);
      }
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {bookingId ? "Redigera bokning" : "Boka rum"}
          </h2>

          {/* NYTT: Papperskorg-knapp om vi redigerar */}
          {bookingId && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Radera bokning"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Välj rum
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Välj ett rum...</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Från
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Till
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            {bookingId ? "Spara ändringar" : "Skapa bokning"}
          </button>
        </div>
      </div>
    </div>
  );
};
