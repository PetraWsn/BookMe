import { Server } from "socket.io";
import { logger } from "../config/logger.js";
import { SOCKET_ROOMS } from "../constants/socketEvents.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    logger.info(`SOCKET_CONNECTED: Ny klient ansluten (ID: ${socket.id})`);

    // 1. Vanlig join för personliga notiser
    socket.on("join", (userId) => {
      socket.join(userId);
      logger.info(
        `SOCKET_JOIN: Användare ${userId} gick med i sitt personliga rum.`,
      );
    });

    // 2. Admin join
    socket.on("join-admin", () => {
      socket.join(SOCKET_ROOMS.ADMINS);
      logger.info(
        `SOCKET_ADMIN_JOIN: Klient ${socket.id} anslöt till admin-rummet.`,
      );
    });

    socket.on("disconnect", () => {
      logger.info(
        `SOCKET_DISCONNECTED: Klient ansluten (ID: ${socket.id}) kopplade ifrån.`,
      );
    });
  });
};

// --- EMIT-FUNKTIONER MED LOGGNING ---

export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
    logger.info(
      `SOCKET_EMIT: Riktad notis [${event}] skickad till användare ${userId}`,
    );
  }
};

export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    logger.info(
      `SOCKET_BROADCAST: Global notis [${event}] skickad till alla anslutna klienter.`,
    );
  }
};

export const emitToAdmins = (event, data) => {
  if (io) {
    io.to(SOCKET_ROOMS.ADMINS).emit(event, data);
    logger.info(
      `SOCKET_ADMIN_EMIT: Admin-notis [${event}] skickad till administratörer.`,
    );
  }
};
