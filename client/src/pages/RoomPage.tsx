import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { PageLayout } from "../components/layout/PageLayout";
import { DashboardContainer } from "../components/layout/DashboardContainer";
import { RoomManager } from "../features/rooms/components/RoomManager";
import { RoomNavigation } from "../features/rooms/components/RoomNavigation";
import { RoomModal } from "../features/rooms/components/RoomModal";
import type { Room } from "../features/rooms/types/roomTypes";

export const RoomPage = () => {
  const { user, loading } = useAuth();

  // Modal state lyfts upp hit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  // Vi skapar en trigger-state för att RoomManager ska veta när den ska ladda om
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) return <div>Laddar...</div>;
  if (user?.role !== "admin" && user?.role !== "editor")
    return <Navigate to="/dashboard" replace />;

  const handleOpenModal = (room: Room | null = null) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRefreshTrigger((prev) => prev + 1); // Trigga RoomManager att hämta listan på nytt
  };

  return (
    <PageLayout>
      <DashboardContainer>
        {/* Navigationen får bara funktionen för att skapa NYTT rum */}
        <RoomNavigation onOpenModal={() => handleOpenModal(null)} />

        <div className="p-6">
          {/* Managern får funktionen för att REDIGERA befintliga rum */}
          <RoomManager
            onEditRoom={handleOpenModal}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {isModalOpen && (
          <RoomModal room={selectedRoom} onClose={handleModalClose} />
        )}
      </DashboardContainer>
    </PageLayout>
  );
};
