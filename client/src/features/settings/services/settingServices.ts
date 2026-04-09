import { request } from "../../../api/api.ts";
import type { User } from "../../users/types/userTypes.ts";

export const updateProfile = (data: {
  name: string;
  email: string;
}): Promise<User> =>
  request<User>("/auth/update-profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const updatePassword = (data: {
  current: string;
  new: string;
}): Promise<{ message: string }> =>
  request<{ message: string }>("/auth/update-password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteAccount = (): Promise<{ message: string }> =>
  request<{ message: string }>("/auth/delete-account", {
    method: "DELETE",
  });
