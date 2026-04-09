import { useState } from "react";
import { loginUser } from "../services/authServices";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth(); // Denna kräver nu (user, token)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);

      // SKICKA IN BÅDA ARGUMENTEN HÄR:
      // data.user och data.accessToken kommer från din loginService
      login(data.user, data.accessToken);

      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Något gick fel";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
