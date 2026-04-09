import React, { useState } from "react";
import { Button } from "../../../components/ui/Button.tsx";
import { useRegister } from "../hooks/useRegister.ts";

export const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { handleRegister, loading, error: apiError } = useRegister();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validera lösenord
    if (password !== confirmPassword) {
      setValidationError("Lösenorden matchar inte.");
      return;
    }

    // 2. Validera GDPR
    if (!acceptedTerms) {
      setValidationError(
        "Du måste godkänna att vi hanterar dina personuppgifter.",
      );
      return;
    }

    // 3. Slå ihop namn till formatet backend förväntar sig
    const fullName = `${firstName} ${lastName}`.trim();

    handleRegister({ name: fullName, email, password });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="flex flex-row gap-4">
        <input
          type="text"
          placeholder="Förnamn"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 rounded text-sm flex-1 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Efternamn"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 rounded text-sm flex-1 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <input
        type="email"
        placeholder="E-postadress"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Lösenord"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Upprepa lösenord"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-start gap-2 py-2">
        <input
          type="checkbox"
          id="gdpr"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="gdpr" className="text-xs text-gray-600 leading-tight">
          Jag godkänner att mina uppgifter lagras i enlighet med GDPR för att
          kunna hantera mina rumsbokningar.
        </label>
      </div>

      {(validationError || apiError) && (
        <p className="text-red-500 text-xs font-medium">
          {validationError || apiError}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Skapar konto..." : "Registrera"}
      </Button>
    </form>
  );
};
