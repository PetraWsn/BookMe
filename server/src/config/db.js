import mongoose from "mongoose";
import { logger } from "../config/logger.js"; // Se till att sökvägen stämmer

const connectDB = async () => {
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  };

  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);

    logger.info("DATABASE_CONNECTED: MongoDB-anslutningen lyckades.");
  } catch (error) {
    logger.error(
      `DATABASE_ERROR: Kunde inte ansluta till MongoDB. Fel: ${error.message}`,
    );

    process.exit(1);
  }
};

export default connectDB;
