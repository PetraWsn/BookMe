import { createClient } from "redis";
import { logger } from "./logger.js";

let redisClient;

// Funktion för att ansluta till Redis, används i server.js innan servern startar
export const connectRedis = async () => {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",

    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          logger.error("Redis reconnect attempts exceeded");
          return new Error("Redis retry attempts exhausted");
        }

        return retries * 500;
      },
    },
  });

  redisClient.on("error", (err) => {
    logger.error("Redis error:", err.message);
  });

  try {
    await redisClient.connect();
    logger.info("Redis connected");
  } catch (err) {
    logger.warn("Redis unavailable, continuing without cache");
  }
};

// funktion för att få tillgång till Redis-klienten i controllers
export const getRedis = () => {
  if (!redisClient) {
    throw new Error("Redis not initialized!");
  }
  return redisClient;
};
