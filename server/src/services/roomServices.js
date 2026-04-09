import Room from "../models/roomModel.js";
import { logger } from "../config/logger.js"; // Se till att stigen stämmer

// CREATE ROOM
export const createRoom = async (roomData, adminName) => {
  // 1. Validera
  if (!roomData.name || !roomData.capacity) {
    logger.warn(
      `RUMS_FEL: Admin "${adminName}" försökte skapa rum utan namn/kapacitet.`,
    );
    throw new Error("Name and capacity are required");
  }

  // 2. Kolla dubbletter
  const existing = await Room.findOne({ name: roomData.name });
  if (existing) {
    logger.warn(
      `RUMS_FEL: Admin "${adminName}" försökte skapa rummet "${roomData.name}" som redan finns.`,
    );
    throw new Error("Room already exists");
  }

  // 3. Skapa rummet
  const room = await Room.create(roomData);

  logger.info(`RUM_SKAPAT: "${room.name}" skapat av Admin: ${adminName}`);
  return room;
};

// READ ALL
export const getRooms = async () => {
  // Loggas oftast i Controllern för att visa Redis-status (HIT/MISS)
  return await Room.find({});
};

// READ BY ID
export const getRoomById = async (id) => {
  return await Room.findById(id);
};

// UPDATE
export const updateRoom = async (id, roomData, adminName) => {
  const updatedRoom = await Room.findByIdAndUpdate(id, roomData, {
    new: true,
    runValidators: true,
  });

  if (updatedRoom) {
    logger.info(
      `RUM_UPPDATERAT: "${updatedRoom.name}" (ID: ${id}) ändrat av Admin: ${adminName}`,
    );
  }

  return updatedRoom;
};

// DELETE
export const deleteRoom = async (id, adminName) => {
  const deletedRoom = await Room.findByIdAndDelete(id);

  if (deletedRoom) {
    logger.info(
      `RUM_RADERAT: "${deletedRoom.name}" (ID: ${id}) borttaget av Admin: ${adminName}`,
    );
  } else {
    logger.warn(
      `RUMS_FEL: Försök att radera icke-existerande rum (ID: ${id}) av Admin: ${adminName}`,
    );
  }

  return deletedRoom;
};
