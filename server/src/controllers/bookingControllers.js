import * as bookingService from "../services/bookingServices.js";
import { logger } from "../config/logger.js";

// Skapa bokning (POST /api/bookings)
export const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Användare ej identifierad" });
    }

    const booking = await bookingService.createBooking({
      userId: req.user.id,
      username: req.user.username,
      roomId: req.body.roomId,
      start: req.body.startTime,
      end: req.body.endTime,
    });

    // Bekräfta att controllern är klar
    logger.info(
      `CONTROLLER: Bokning ${booking._id} skapad för användare ${req.user.name}`,
    );
    res.status(201).json(booking);
  } catch (error) {
    logger.error(
      `CONTROLLER_ERROR: Kunde inte skapa bokning - ${error.message}`,
    );
    const statusCode = error.message.includes("bokat") ? 409 : 400;
    res.status(statusCode).json({ message: error.message });
  }
};

// Hämta bokningar (GET /api/bookings)
export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getBookings(req.user);
    // Vi loggar hur många bokningar som skickas tillbaka
    logger.info(
      `CONTROLLER: Returnerar ${bookings.length} bokningar till ${req.user.name}`,
    );
    res.status(200).json(bookings);
  } catch (error) {
    logger.error(
      `CONTROLLER_ERROR: Kunde inte hämta bokningar - ${error.message}`,
    );
    res.status(500).json({ message: "Kunde inte hämta bokningar" });
  }
};

// Hämta specifik bokning (GET /api/bookings/:id)
export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(
      req.user,
      req.params.id,
    );
    logger.info(`CONTROLLER: Detaljer för bokning ${req.params.id} skickade.`);
    res.status(200).json(booking);
  } catch (error) {
    logger.warn(
      `CONTROLLER_ERROR: Kunde inte hämta bokning ${req.params.id} - ${error.message}`,
    );
    const status = error.message === "Unauthorized" ? 403 : 404;
    res.status(status).json({ message: error.message });
  }
};

// Uppdatera bokning (PUT /api/bookings/:id)
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await bookingService.updateBooking(
      req.user,
      req.params.id,
      req.body,
    );
    logger.info(
      `CONTROLLER: Uppdatering av bokning ${req.params.id} lyckades.`,
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    logger.error(
      `CONTROLLER_ERROR: Kunde inte uppdatera bokning - ${error.message}`,
    );
    res.status(400).json({ message: error.message });
  }
};

// Ta bort bokning (DELETE /api/bookings/:id)
export const deleteBooking = async (req, res) => {
  try {
    await bookingService.deleteBooking(req.user, req.params.id);
    logger.info(
      `CONTROLLER: Bokning ${req.params.id} raderad av ${req.user.name}`,
    );
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    logger.error(
      `CONTROLLER_ERROR: Kunde inte radera bokning - ${error.message}`,
    );
    const status = error.message === "Unauthorized" ? 403 : 404;
    res.status(status).json({ message: error.message });
  }
};
