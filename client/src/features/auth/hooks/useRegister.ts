import { useState } from "react";
import { registerUser } from "../services/authServices";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initiera navigate
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(data);

      // 1. Uppdatera auth-state
      login(response.user, response.accessToken);

      // 2. Skicka användaren till bokningssidan
      navigate("/booking");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
