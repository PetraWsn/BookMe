import React, { useEffect, useState, useMemo } from "react";
import * as roomService from "../services/roomServices";
import type { Room } from "../types/roomTypes";
import {
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onEditRoom: (room: Room) => void;
  refreshTrigger: number;
};

type SortKey = "name" | "capacity";

// --- HJÄLPKOMPONENT FÖR SORTERING ---
const SortIcon = ({
  name,
  sortConfig,
}: {
  name: SortKey;
  sortConfig: { key: SortKey; direction: "asc" | "desc" };
}) => {
  if (sortConfig.key !== name)
    return <ChevronUpIcon className="w-3 h-3 opacity-30" />;
  return sortConfig.direction === "asc" ? (
    <ChevronUpIcon className="w-3 h-3 text-purple-600" />
  ) : (
    <ChevronDownIcon className="w-3 h-3 text-purple-600" />
  );
};

export const RoomManager: React.FC<Props> = ({
  onEditRoom,
  refreshTrigger,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const data = await roomService.getRooms();
        if (isMounted) setRooms(data);
      } catch (error) {
        if (isMounted) console.error("Kunde inte hämta rum:", error);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  // --- SORTERINGSLOGIK ---
  const sortedRooms = useMemo(() => {
    const sortable = [...rooms];
    sortable.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [rooms, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Är du säker på att du vill ta bort detta rum?")) {
      try {
        await roomService.deleteRoom(id);
        setRooms((prev) => prev.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Kunde inte ta bort rummet:", error);
      }
    }
  };

  return (
    <div className="w-full">
      {/* --- TABELLRUBRIKER --- */}
      <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
        <button
          onClick={() => requestSort("name")}
          className="col-span-6 flex items-center gap-1 hover:text-purple-600 transition outline-none"
        >
          Rumsnamn <SortIcon name="name" sortConfig={sortConfig} />
        </button>

        <button
          onClick={() => requestSort("capacity")}
          className="col-span-4 flex items-center gap-1 hover:text-purple-600 transition outline-none"
        >
          Kapacitet <SortIcon name="capacity" sortConfig={sortConfig} />
        </button>

        <div className="col-span-2 text-right italic opacity-50">Val</div>
      </div>

      {/* --- LISTAN --- */}
      <div className="grid gap-3 mt-3">
        {sortedRooms.map((room) => (
          <div
            key={room._id}
            style={{ backgroundColor: room.color + "15" }}
            className="grid grid-cols-12 items-center p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* KOLUMN 1: NAMN & FÄRG */}
            <div className="col-span-6 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: room.color }}
              />
              <span className="font-bold text-gray-800 truncate text-md">
                {room.name}
              </span>
            </div>

            {/* KOLUMN 2: KAPACITET */}
            <div className="col-span-4">
              <div className="flex items-center gap-1 text-gray-700 font-medium">
                <span className="text-md">👥</span>
                <span className="text-sm">{room.capacity} personer</span>
              </div>
            </div>

            {/* KOLUMN 3: VAL */}
            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => onEditRoom(room)}
                className="p-2 text-gray-600 hover:bg-white rounded-full transition shadow-sm"
                title="Redigera"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(room._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition shadow-sm"
                title="Ta bort"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
