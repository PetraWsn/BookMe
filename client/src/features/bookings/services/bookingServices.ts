import { request } from "../../../api/api";
import type { Booking } from "../types/bookingTypes";

// --- BOOKINGS ---

export const getBookings = async (): Promise<Booking[]> => {
  // Returnerar arrayen direkt: [booking, booking, ...]
  return request<Booking[]>("/bookings");
};

export const getBookingById = async (id: string): Promise<Booking> => {
  // Returnerar objektet direkt: { id, userId, ... }
  return request<Booking>(`/bookings/${id}`);
};

export const createBooking = async (data: {
  roomId: string;
  startTime: string;
  endTime: string;
}): Promise<Booking> => {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateBooking = async (
  id: string,
  data: { startTime?: string; endTime?: string; roomId?: string },
): Promise<Booking> => {
  return request<Booking>(`/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteBooking = async (id: string): Promise<void> => {
  return request<void>(`/bookings/${id}`, { method: "DELETE" });
};
