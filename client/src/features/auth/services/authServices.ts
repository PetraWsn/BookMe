import { request } from "../../../api/api.ts";
import type { User } from "../../users/types/userTypes.ts";
import type { AuthResponse } from "../types/authTypes.ts";

type LoginResponse = {
  user: User;
  accessToken: string;
};

export const loginUser = (
  email: string,
  password: string,
): Promise<LoginResponse> =>
  request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const refreshAccessToken = async (): Promise<string> => {
  const data = await request<{ accessToken: string }>("/auth/refresh", {
    method: "POST",
  });
  return data.accessToken;
};

export const getMe = async (): Promise<User> => {
  const data = await request<{ user: User }>("/auth/me");
  return data.user;
};

export const logoutUser = async () => {
  await request("/auth/logout", {
    method: "POST",
  });
};

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> =>
  request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
