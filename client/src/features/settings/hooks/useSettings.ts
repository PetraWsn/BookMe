import { useState } from "react";
import * as settingService from "../services/settingServices";
import { useAuth } from "../../auth/hooks/useAuth";

export const useSettings = () => {
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Helper för att extrahera felmeddelande från 'unknown'
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    return "Ett oväntat fel uppstod";
  };

  const handleUpdateProfile = async (name: string, email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedUser = await settingService.updateProfile({ name, email });
      const token = localStorage.getItem("accessToken") || "";
      login(updatedUser, token);
      setSuccess(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (current: string, next: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await settingService.updatePassword({ current, new: next });
      setSuccess(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await settingService.deleteAccount();
      logout();
      window.location.href = "/login?accountDeleted=true";
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return {
    handleUpdateProfile,
    handleUpdatePassword,
    handleDeleteAccount,
    loading,
    error,
    success,
    setSuccess,
  };
};
