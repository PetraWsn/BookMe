import type { User } from "../../users/types/userTypes";

export type AuthResponse = {
  user: User;
  accessToken: string;
};
