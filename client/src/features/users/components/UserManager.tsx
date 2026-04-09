import { useEffect, useState, useMemo } from "react";
import * as userService from "../services/userServices";
import type { User } from "../../users/types/userTypes";
import {
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// 1. Definiera SortKey högst upp i filen så att alla funktioner ser den
type SortKey = "name" | "email" | "role" | "createdAt";

// 2. Flytta ut SortIcon utanför för att undvika render-fel (precis som i BookingList)
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
    <ChevronUpIcon className="w-3 h-3 text-green-600" />
  ) : (
    <ChevronDownIcon className="w-3 h-3 text-green-600" />
  );
};

export const UserManager = ({ searchQuery }: { searchQuery: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Kunde inte hämta användare:", error);
      }
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await userService.updateUserRole(id, newRole);

      setUsers((prev) =>
        prev.map((u) =>
          // Vi mappar om rollen och talar om för TS att newRole är en UserRole
          u._id === id ? { ...u, role: newRole as User["role"] } : u,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kunde inte ändra roll.";
      alert(message);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Ta bort användaren permanent?")) {
      try {
        await userService.deleteUser(id);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const requestSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    return [...users]
      .filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        const key = sortConfig.key;
        const isAsc = sortConfig.direction === "asc";

        if (key === "createdAt") {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return isAsc ? dateA - dateB : dateB - dateA;
        }

        const valA = (a[key] ?? "").toString().toLowerCase();
        const valB = (b[key] ?? "").toString().toLowerCase();
        if (valA < valB) return isAsc ? -1 : 1;
        if (valA > valB) return isAsc ? 1 : -1;
        return 0;
      });
  }, [users, sortConfig, searchQuery]);

  return (
    <div className="w-full">
      {/* --- TABELLRUBRIKER --- */}
      <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
        <button
          onClick={() => requestSort("name")}
          className="col-span-3 flex items-center gap-1 hover:text-green-600 outline-none transition"
        >
          Namn <SortIcon name="name" sortConfig={sortConfig} />
        </button>
        <button
          onClick={() => requestSort("email")}
          className="col-span-4 flex items-center gap-1 hover:text-green-600 outline-none transition"
        >
          E-post <SortIcon name="email" sortConfig={sortConfig} />
        </button>
        <button
          onClick={() => requestSort("role")}
          className="col-span-2 flex items-center gap-1 hover:text-green-600 outline-none transition"
        >
          Roll <SortIcon name="role" sortConfig={sortConfig} />
        </button>
        <button
          onClick={() => requestSort("createdAt")}
          className="col-span-2 flex items-center gap-1 hover:text-green-600 outline-none transition"
        >
          Medlem <SortIcon name="createdAt" sortConfig={sortConfig} />
        </button>
        <div className="col-span-1 text-right italic opacity-50">Val</div>
      </div>

      {/* --- LISTAN --- */}
      <div className="grid gap-3 mt-3">
        {filteredAndSortedUsers.map((u) => (
          <div
            key={u._id}
            className="grid grid-cols-12 items-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all"
          >
            <div className="col-span-3 font-bold text-gray-800 truncate">
              {u.name}
            </div>
            <div className="col-span-4 text-sm text-gray-600 truncate">
              {u.email}
            </div>

            <div className="col-span-2">
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                className={`text-xs font-bold py-1 px-2 rounded-lg border outline-none transition ${
                  u.role === "admin"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : u.role === "editor"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="col-span-2 text-xs text-gray-500 italic">
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("sv-SE")
                : "-"}
            </div>

            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => handleDelete(u._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition shadow-sm"
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
