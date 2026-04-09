import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[]; // t.ex. ["admin"]
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/bookings" />;

  return <>{children}</>;
};
