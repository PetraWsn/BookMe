import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { getRedis } from "../config/redis.js";
import { emitToUser, emitToAdmins, emitToAll } from "./socketServices.js";
import { logger } from "../config/logger.js";
import { SOCKET_EVENTS } from "../constants/socketEvents.js";

/** HJÄLPFUNKTION: Kolla om användare är Admin **/
const isAdminUser = (role) => role?.toLowerCase() === "admin";

/** HÄMTA ALLA BOKNINGAR **/
export const getBookings = async (user) => {
  // FIX: Ändrat till user.name
  logger.info(
    `HÄMTAR_BOKNINGAR: Förfrågan från "${user.name}" (Roll: ${user.role})`,
  );

  const bookings = await Booking.find()
    .populate("userId", "username name")
    .populate("roomId", "name color");

  if (isAdminUser(user.role)) return bookings;

  return bookings.map((b) => {
    const isOwner = b.userId?._id?.toString() === user.id;
    if (isOwner) return b;

    return {
      _id: b._id,
      startTime: b.startTime,
      endTime: b.endTime,
      roomId: b.roomId,
      userId: { _id: "hidden", username: "Upptaget", name: "Upptaget" },
    };
  });
};

/** HÄMTA EN SPECIFIK BOKNING **/
export const getBookingById = async (user, bookingId) => {
  // FIX: Ändrat till user.name
  logger.info(
    `HÄMTAR_EN_BOKNING: ID ${bookingId} för användare "${user.name}"`,
  );

  const booking = await Booking.findById(bookingId)
    .populate("userId", "username name")
    .populate("roomId", "name color");

  if (!booking) {
    logger.warn(`BOKNING_SAKNAS: ID ${bookingId} hittades inte.`);
    throw new Error("Bokningen hittades inte.");
  }

  const isOwner = booking.userId?._id?.toString() === user.id;
  if (!isAdminUser(user.role) && !isOwner) {
    return {
      _id: booking._id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      roomId: booking.roomId,
      userId: { _id: "hidden", username: "Upptaget" },
      isLocked: true,
    };
  }

  return booking;
};

/** SKAPA NY BOKNING **/
export const createBooking = async ({
  userId,
  username, // Om inkommande objekt har username, behåll detta för logiken men använd name för loggen om möjligt
  name,
  roomId,
  roomName,
  start,
  end,
}) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const now = new Date();

  if (startTime < now) throw new Error("Starttiden kan inte vara i dåtid.");
  if (endTime <= startTime)
    throw new Error("Sluttiden måste vara efter starttiden.");

  let _roomId = roomId;
  if (!_roomId && roomName) {
    const room = await Room.findOne({ name: roomName });
    if (!room) throw new Error("Rummet hittades inte.");
    _roomId = room._id;
  }

  const conflict = await Booking.findOne({
    roomId: _roomId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (conflict) {
    logger.warn(
      `BOKNINGS_KONFLIKT: "${name || username}" försökte boka upptaget rum.`,
    );
    throw new Error("Rummet är redan bokat under denna tidsperiod.");
  }

  const booking = await Booking.create({
    userId,
    roomId: _roomId,
    startTime,
    endTime,
  });

  try {
    const redis = getRedis();
    await redis.del("rooms");
  } catch (err) {
    logger.error("REDIS_ERROR: Kunde inte rensa cache");
  }

  logger.info(`BOKNING_SKAPAD: "${name || username}" bokade rum ${_roomId}`);

  // Sockets - Konsekvent användning av SOCKET_EVENTS
  emitToUser(userId, SOCKET_EVENTS.USER_BOOKING_SUCCESS, {
    message: "Bekräftad!",
    booking,
  });

  emitToAdmins(SOCKET_EVENTS.ADMIN_UPDATE, {
    ...booking.toJSON(),
    userName: name || username,
  });

  emitToAll(SOCKET_EVENTS.PUBLIC_UPDATE, {
    _id: booking._id, // Viktigt: Använd _id
    roomId: _roomId,
    startTime,
    endTime,
    status: "occupied",
    userId: { _id: "hidden", username: "Upptaget" },
  });

  return booking;
};

/** UPPDATERA BOKNING **/
export const updateBooking = async (user, bookingId, updateData) => {
  const booking = await Booking.findById(bookingId).populate(
    "userId",
    "name username",
  );
  if (!booking) throw new Error("Booking not found");

  if (!isAdminUser(user.role) && booking.userId._id.toString() !== user.id) {
    logger.warn(`OBEHÖRIG_REDIGERING: "${user.name}" på ${bookingId}`);
    throw new Error("Unauthorized");
  }

  const newStart = updateData.startTime
    ? new Date(updateData.startTime)
    : booking.startTime;
  const newEnd = updateData.endTime
    ? new Date(updateData.endTime)
    : booking.endTime;
  const newRoomId = updateData.roomId || booking.roomId;

  const conflict = await Booking.findOne({
    _id: { $ne: bookingId },
    roomId: newRoomId,
    startTime: { $lt: newEnd },
    endTime: { $gt: newStart },
  });

  if (conflict) throw new Error("Den nya tiden krockar med en annan bokning.");

  booking.startTime = newStart;
  booking.endTime = newEnd;
  booking.roomId = newRoomId;
  await booking.save();

  try {
    await getRedis().del("rooms");
  } catch (err) {}

  logger.info(`BOKNING_UPPDATERAD: "${user.name}" ändrade ${bookingId}`);

  // Sockets
  emitToAdmins(SOCKET_EVENTS.ADMIN_UPDATE, {
    ...booking.toJSON(),
    userName: user.name,
  });

  emitToAll(SOCKET_EVENTS.PUBLIC_UPDATE, {
    _id: bookingId,
    roomId: newRoomId,
    startTime: newStart,
    endTime: newEnd,
    status: "occupied",
    userId: { _id: "hidden", username: "Upptaget" },
  });

  return booking;
};

/** RADERA BOKNING **/
export const deleteBooking = async (user, bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (!isAdminUser(user.role) && booking.userId.toString() !== user.id) {
    logger.warn(`OBEHÖRIG_RADERING: "${user.name}" på ${bookingId}`);
    throw new Error("Unauthorized");
  }

  await Booking.findByIdAndDelete(bookingId);

  try {
    await getRedis().del("rooms");
  } catch (err) {}

  logger.info(`BOKNING_RADERAD: "${user.name}" raderade ${bookingId}`);

  // Sockets
  emitToUser(user.id, SOCKET_EVENTS.USER_BOOKING_DELETED, { bookingId });
  emitToAdmins(SOCKET_EVENTS.ADMIN_DELETE, { bookingId });
  emitToAll(SOCKET_EVENTS.PUBLIC_DELETE, { bookingId, roomId: booking.roomId });
};
