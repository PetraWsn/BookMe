import React from "react";
import { PageLayout } from "../components/layout/PageLayout.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/bookings" replace />;
  }

  return (
    <PageLayout bgColor="bg-backgroundDark">
      {/* Logo / Bild */}
      <img
        src="src/assets/logo.svg" // Lägg din logga här
        alt="Logo"
        className="w-96 h-96 mb-12"
      />

      {/* Knappar */}
      <div className="flex flex-row gap-4 w-full justify-center">
        <Link to="/auth?mode=login">
          <Button variant="primary" className="min-w-[160px]">
            Ny bokning
          </Button>
        </Link>
        <Link to="/auth?mode=register">
          <Button variant="secondary" className="min-w-[160px]">
            Skapa Konto
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default HomePage;
