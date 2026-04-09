import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { PageLayout } from "../components/layout/PageLayout";
import { DashboardContainer } from "../components/layout/DashboardContainer";
import { UserManager } from "../features/users/components/UserManager";
import { UserNavigation } from "../features/users/components/UserNavigation";

export const UserPage = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <div>Laddar...</div>;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <PageLayout>
      <DashboardContainer>
        <UserNavigation
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="p-6">
          <UserManager searchQuery={searchQuery} />
        </div>
      </DashboardContainer>
    </PageLayout>
  );
};
