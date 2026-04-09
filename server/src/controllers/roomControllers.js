import * as RoomService from "../services/roomServices.js";
import { logger } from "../config/logger.js";

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    // Vi skickar med req.user.name så att servicen kan logga VEM som skapade rummet
    const room = await RoomService.createRoom(req.body, req.user.name);

    logger.info(`CONTROLLER: Skapande av rum "${room.name}" slutfört.`);
    res.status(201).json(room);
  } catch (error) {
    logger.error(`CONTROLLER_ERROR: Kunde inte skapa rum - ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
export const getRooms = async (req, res) => {
  try {
    const rooms = await RoomService.getRooms();
    // Här behövs ingen logg egentligen, då Servicen loggar om det var en Redis HIT eller MISS
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY ID
export const getRoomById = async (req, res) => {
  try {
    const room = await RoomService.getRoomById(req.params.id);

    if (!room) {
      logger.warn(`CONTROLLER: Rum med ID ${req.params.id} hittades inte.`);
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await RoomService.updateRoom(
      req.params.id,
      req.body,
      req.user.username,
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    logger.info(`CONTROLLER: Uppdatering av rum ${req.params.id} slutförd.`);
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await RoomService.deleteRoom(
      req.params.id,
      req.user.username,
    );

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    logger.info(`CONTROLLER: Radering av rum ${req.params.id} slutförd.`);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
