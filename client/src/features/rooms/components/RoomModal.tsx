import React, { useState } from "react";
import * as roomService from "../services/roomServices";
import type { Room } from "../types/roomTypes";

type Props = {
  room: Room | null;
  onClose: () => void;
};

export const RoomModal: React.FC<Props> = ({ room, onClose }) => {
  const [name, setName] = useState(room?.name || "");
  const [capacity, setCapacity] = useState(room?.capacity || 2);
  const [color, setColor] = useState(room?.color || "#3b82f6");

  const handleSave = async () => {
    const payload = { name, capacity, color };
    if (room) {
      await roomService.updateRoom(room._id, payload);
    } else {
      await roomService.createRoom(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {room ? "Redigera rum" : "Skapa nytt rum"}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Rumsnamn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="t.ex. Konferensrummet"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Max antal personer
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Välj färg
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
              />
              <span className="text-sm font-mono text-gray-500 uppercase">
                {color}
              </span>
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
            Spara
          </button>
        </div>
      </div>
    </div>
  );
};
