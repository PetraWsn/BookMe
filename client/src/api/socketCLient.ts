import { io } from "socket.io-client";

// URL till din backend (samma som du använder för ditt API)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true, // 👈 Måste vara true
  transports: ["websocket", "polling"],
});
