export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "editor";
  createdAt?: string; // Lägg till denna!
  [key: string]: string | undefined;
};
