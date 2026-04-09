import User from "../models/userModel.js";
import { logger } from "../config/logger.js";

// HÄMTA ALLA
export const getAllUsers = async (currentUser) => {
  logger.info(
    `ANVÄNDARLISTA_HÄMTAD: Admin "${currentUser.name}" hämtade listan.`,
  );
  return await User.find().select("-password");
};

// UPPDATERA (Endast Roll)
export const updateUser = async (userId, updateData, currentUser) => {
  // 1. Kontrollera att det är en Admin som gör detta
  if (currentUser.role.toLowerCase() !== "admin") {
    logger.warn(
      `SÄKERHET: "${currentUser.name}" försökte ändra roll utan behörighet.`,
    );
    throw new Error("Endast administratörer kan ändra roller.");
  }

  // 2. Begränsa så att man BARA kan ändra rollen, inget annat
  const allowedUpdates = { role: updateData.role };

  const updatedUser = await User.findByIdAndUpdate(userId, allowedUpdates, {
    new: true,
  }).select("-password");

  if (!updatedUser) throw new Error("Användaren hittades inte.");

  logger.info(
    `ROLL_ÄNDRAD: "${updatedUser.name}" är nu "${updateData.role}" (Ändrat av: ${currentUser.name})`,
  );

  return updatedUser;
};

// RADERA
export const deleteUser = async (userId, currentUser) => {
  if (currentUser.role.toLowerCase() !== "admin") {
    throw new Error("Endast administratörer kan radera användare.");
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) throw new Error("Användaren hittades inte.");

  logger.info(
    `ANVÄNDARE_RADERAD: "${deletedUser.name}" raderades av "${currentUser.name}".`,
  );

  return deletedUser;
};
