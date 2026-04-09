import { PageLayout } from "../components/layout/PageLayout";
import { DashboardContainer } from "../components/layout/DashboardContainer";
import { SettingNavigation } from "../features/settings/components/SettingNavigation";
import { SettingForm } from "../features/settings/components/SettingForm";
import { useAuth } from "../features/auth/hooks/useAuth";

export const SettingsPage = () => {
  const { user, loading } = useAuth();

  return (
    <PageLayout>
      <DashboardContainer>
        <SettingNavigation />
        <div className="p-8 bg-white rounded-b-lg shadow-sm min-h-[400px]">
          <div className="max-w-xl mx-auto">
            {loading ? (
              <p className="text-center py-10 text-gray-400">
                Laddar profil...
              </p>
            ) : user ? (
              // KEY-tricket: När user laddats får komponenten ett ID.
              // React ritar då upp komponenten på nytt med rätt initialvärden.
              <SettingForm key={user.id} />
            ) : (
              <p className="text-center py-10 text-red-500">
                Kunde inte ladda användare.
              </p>
            )}
          </div>
        </div>
      </DashboardContainer>
    </PageLayout>
  );
};
