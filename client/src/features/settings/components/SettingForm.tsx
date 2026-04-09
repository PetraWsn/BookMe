import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import {
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const SettingForm: React.FC = () => {
  const { user } = useAuth();
  const {
    handleUpdateProfile,
    handleUpdatePassword,
    handleDeleteAccount,
    loading,
    error,
    success,
  } = useSettings();

  // 1. Packa upp namnet direkt i initial state
  const nameParts = user?.name ? user.name.split(" ") : ["", ""];

  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    handleUpdateProfile(fullName, email);
  };

  const onUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Nya lösenorden matchar inte.");
      return;
    }
    handleUpdatePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 2. Koppla på handleDeleteAccount
  const onDeleteAccount = () => {
    const confirmed = window.confirm(
      "Är du säker på att du vill radera ditt konto permanent?",
    );
    if (confirmed) {
      handleDeleteAccount();
    }
  };

  return (
    <div className="space-y-12">
      {/* SEKTION 1: PROFIL */}
      <form onSubmit={onUpdateProfile} className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">
            Profilinställningar
          </h2>
          {success && (
            <p className="text-green-600 text-xs font-bold uppercase mt-2">
              Sparat!
            </p>
          )}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
              Förnamn
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
              Efternamn
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            E-post
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Sparar..." : "Spara profil"}
        </button>
      </form>

      <hr className="border-gray-100" />

      {/* SEKTION 2: LÖSENORD - Nu används onUpdatePassword */}
      <form onSubmit={onUpdatePassword} className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Ändra lösenord</h2>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Nuvarande lösenord"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Nytt lösenord"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Bekräfta lösenord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition"
          >
            {loading ? "Uppdaterar..." : "Uppdatera lösenord"}
          </button>
        </div>
      </form>

      <hr className="border-gray-100" />

      {/* SEKTION 3: RADERA KONTO - Nu används handleDeleteAccount */}
      <div className="p-6 border border-red-100 bg-red-50 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 text-red-700">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <h3 className="font-bold">Varning: Radera konto</h3>
        </div>
        <p className="text-sm text-red-600 leading-relaxed">
          När du raderar ditt konto tas all data bort permanent.
        </p>
        <button
          type="button"
          onClick={onDeleteAccount}
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <TrashIcon className="w-4 h-4" />
          {loading ? "Raderar..." : "Radera mitt konto permanent"}
        </button>
      </div>
    </div>
  );
};
