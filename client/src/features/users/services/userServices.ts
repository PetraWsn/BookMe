import { request } from "../../../api/api";
import type { User } from "../types/userTypes";

export const getUsers = async (): Promise<User[]> => {
  return request<User[]>("/users");
};

export const deleteUser = async (id: string): Promise<void> => {
  return request<void>(`/users/${id}`, { method: "DELETE" });
};

export const updateUserRole = async (
  id: string,
  role: string,
): Promise<User> => {
  return request<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
};
