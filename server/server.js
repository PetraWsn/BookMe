import dotenv from "dotenv";
dotenv.config();

import http from "http";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { logger } from "./src/config/logger.js";
import { connectRedis } from "./src/config/redis.js";
import { initSocket } from "./src/services/socketServices.js";

const PORT = process.env.PORT || 5000;

// Logga miljövariabler vid uppstart (bra för felsökning)
logger.info(
  `Konfiguration laddad: Port ${PORT}, Klient: ${process.env.CLIENT_URL}`,
);

const startServer = async () => {
  try {
    // 1. Anslut till MongoDB
    await connectDB();
    logger.info("MongoDB-anslutning lyckades");

    // 2. Anslut till Redis
    await connectRedis();
    logger.info("Redis-anslutning lyckades");

    // 3. Skapa servern
    const server = http.createServer(app);

    // 4. Starta Sockets
    initSocket(server);
    logger.info("Socket.io har initierats");

    // 5. Lyssna på porten
    server.listen(PORT, () => {
      logger.info(`Servern körs nu på http://localhost:${PORT}`);
      logger.info(`Miljö: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    logger.error(`KRITISKT FEL VID START: ${err.message}`);
    process.exit(1);
  }
};

startServer();
