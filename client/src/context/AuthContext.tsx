import { createContext, useEffect, useState } from "react";
import { setAccessToken } from "../api/api";
import type { User } from "../features/users/types/userTypes";
import * as authService from "../features/auth/services/authServices";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User, accessToken: string) => {
    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
    } catch (err: unknown) {
      // Vi loggar felet så att 'err' används
      console.error("Logout failed:", err instanceof Error ? err.message : err);
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = await authService.refreshAccessToken();
        setAccessToken(accessToken);

        const currentUser = await authService.getMe();
        setUser(currentUser);
      } catch {
        // Om vi inte behöver variabeln 'err' här, lämna catch tom
        // eller använd _ (underscore) för att tysta linter-regeln
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          Laddar...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
