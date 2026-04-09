import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { logout } = useAuth(); // Denna sköter nu både backend-anrop och rensning
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. Kör den centrala logout-funktionen i AuthContext
      await logout();

      // 2. Skicka användaren till startsidan
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return { handleLogout };
};
