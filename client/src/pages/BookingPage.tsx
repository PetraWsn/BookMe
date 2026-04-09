import { useState } from "react";
import { useBookings } from "../features/bookings/hooks/useBookings";
import { BookingCalendar } from "../features/bookings/components/BookingCalendar";
import { BookingList } from "../features/bookings/components/BookingList";
import { BookingModal } from "../features/bookings/components/BookingModal";
import { useAuth } from "../features/auth/hooks/useAuth";
import { PageLayout } from "../components/layout/PageLayout";
import { DashboardContainer } from "../components/layout/DashboardContainer";
import { BookingNavigation } from "../features/bookings/components/BookingNavigation";

export const BookingPage = () => {
  const { user } = useAuth();
  const { bookings, rooms, refreshBookings } = useBookings();

  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. ÅTERSTÄLLT: Vi sparar nu bara ID:t (en sträng) i state
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  // 2. ÅTERSTÄLLT: Funktionen tar nu emot ett ID (string)
  const handleOpenModal = (id: string | null = null) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  return (
    <PageLayout>
      <DashboardContainer>
        <BookingNavigation
          view={view}
          setView={setView}
          onOpenModal={() => handleOpenModal(null)} // Ny bokning = inget ID
        />

        <div className="p-6 bg-white rounded-lg mt-6 shadow-sm">
          {view === "calendar" ? (
            <BookingCalendar
              bookings={bookings}
              rooms={rooms}
              currentUser={user}
              onBookingClick={(id) => handleOpenModal(id)}
            />
          ) : (
            <BookingList
              bookings={bookings}
              rooms={rooms}
              currentUser={user}
              onBookingClick={(id) => handleOpenModal(id)}
              onRefresh={refreshBookings}
            />
          )}
        </div>

        {isModalOpen && (
          <BookingModal
            bookingId={selectedBookingId}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedBookingId(null);
              refreshBookings();
            }}
          />
        )}
      </DashboardContainer>
    </PageLayout>
  );
};
