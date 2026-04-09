import { request } from "../../../api/api";
import type { Room } from "../types/roomTypes";

export const getRooms = async (): Promise<Room[]> => {
  return request<Room[]>("/rooms");
};

export const getRoomById = async (id: string): Promise<Room> => {
  return request<Room>(`/rooms/${id}`);
};

export const createRoom = async (data: Partial<Room>): Promise<Room> => {
  return request<Room>("/rooms", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateRoom = async (
  id: string,
  data: Partial<Room>,
): Promise<Room> => {
  return request<Room>(`/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteRoom = async (id: string): Promise<void> => {
  return request<void>(`/rooms/${id}`, { method: "DELETE" });
};
