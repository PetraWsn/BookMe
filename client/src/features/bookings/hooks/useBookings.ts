import { useState, useEffect } from "react";
import * as bookingService from "../services/bookingServices";
import * as roomService from "../../rooms/services/roomServices";
import type { Booking } from "../types/bookingTypes";
import type { Room } from "../../rooms/types/roomTypes";
import { socket } from "../../../api/socketCLient";
import { SOCKET_EVENTS } from "../types/socketConstantsBooking.ts";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchBookings = async () => {
    const data = await bookingService.getBookings();
    setBookings(data);
  };

  const fetchRooms = async () => {
    const data = await roomService.getRooms();
    setRooms(data);
  };

  const refreshBookings = async () => {
    await fetchBookings();
  };

  useEffect(() => {
    // 1. Admin: Hanterar både nya och ändrade bokningar
    socket.on(SOCKET_EVENTS.ADMIN_UPDATE, (newBooking: Booking) => {
      console.log("Socket: Admin-data mottagen", newBooking);
      setBookings((prev) => {
        const exists = prev.find((b) => b._id === newBooking._id);
        if (exists) {
          // FIX: Uppdatera den befintliga bokningen med ny data
          return prev.map((b) => (b._id === newBooking._id ? newBooking : b));
        }
        return [...prev, newBooking];
      });
    });

    // 2. User: Hanterar begränsad data för både nya och ändrade bokningar
    socket.on(
      SOCKET_EVENTS.PUBLIC_UPDATE,
      (limitedBooking: Partial<Booking>) => {
        console.log("Socket: Publik data mottagen", limitedBooking);

        setBookings((prev) => {
          const exists = prev.find((b) => b._id === limitedBooking._id);

          if (exists) {
            // FIX: Uppdatera tider/rum på den befintliga bokningen
            return prev.map((b) =>
              b._id === limitedBooking._id ? { ...b, ...limitedBooking } : b,
            );
          }

          const placeholder: Booking = {
            _id: limitedBooking._id || Math.random().toString(),
            roomId: limitedBooking.roomId || "",
            startTime: limitedBooking.startTime || "",
            endTime: limitedBooking.endTime || "",
            userId: "hidden",
          };

          return [...prev, placeholder];
        });
      },
    );

    // 3 & 4. Delete: Rensar bort bokningen
    socket.on(
      SOCKET_EVENTS.ADMIN_DELETE,
      ({ bookingId }: { bookingId: string }) => {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      },
    );

    socket.on(
      SOCKET_EVENTS.PUBLIC_DELETE,
      ({ bookingId }: { bookingId: string }) => {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      },
    );

    return () => {
      socket.off(SOCKET_EVENTS.ADMIN_UPDATE);
      socket.off(SOCKET_EVENTS.PUBLIC_UPDATE);
      socket.off(SOCKET_EVENTS.ADMIN_DELETE);
      socket.off(SOCKET_EVENTS.PUBLIC_DELETE);
    };
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchRooms();
      await fetchBookings();
    };
    fetchAll();
  }, []);

  return { bookings, rooms, refreshBookings };
};
