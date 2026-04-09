import React, { useState } from "react";
import { Button } from "../../../components/ui/Button.tsx";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading, error } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded text-sm"
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded text-sm"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Loggar in..." : "Logga in"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};
