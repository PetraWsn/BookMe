import type { Room } from "../../rooms/types/roomTypes";

export type Booking = {
  _id: string;
  userId: string | { _id: string; name: string; email?: string };
  userName?: string;
  roomId: string | Room; // Här återanvänder vi Room-typen ovanför
  roomName?: string;
  startTime: string;
  endTime: string;
};
