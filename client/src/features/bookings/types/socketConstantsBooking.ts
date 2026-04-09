export const SOCKET_EVENTS = {
  // Admin-specifika events
  ADMIN_UPDATE: "admin_calendar_update",
  ADMIN_DELETE: "admin_calendar_delete",

  // Publika events (för alla användare)
  PUBLIC_UPDATE: "public_calendar_update",
  PUBLIC_DELETE: "public_calendar_delete",

  // Användarspecifika events (Personlig feedback)
  USER_BOOKING_SUCCESS: "booking_success", // <--- LÄGG TILL DENNA
  USER_BOOKING_DELETED: "booking_deleted",
} as const;
