import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "login"; // default till login

  const isLogin = mode === "login";

  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageLayout>
      <div className="bg-[#F8F8F8] text-black p-8 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-h3 font-heading mb-6 text-center text-secondary">
          {isLogin ? "Logga in" : "Registrera"}
        </h1>
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      <p className="text-center mt-4 text-sm">
        {isLogin ? (
          <>
            Har du inget konto?{" "}
            <Link
              to="/auth?mode=register"
              className="text-secondary font-medium"
            >
              Registrera här
            </Link>
          </>
        ) : (
          <>
            Har du redan ett konto?{" "}
            <Link to="/auth?mode=login" className="text-secondary font-medium">
              Logga in här
            </Link>
          </>
        )}
      </p>
    </PageLayout>
  );
};

export default AuthPage;
