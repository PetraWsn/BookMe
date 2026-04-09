import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import svLocale from "@fullcalendar/core/locales/sv";
import type { Booking } from "../types/bookingTypes";
import type { Room } from "../../rooms/types/roomTypes";
import type { User } from "../../users/types/userTypes";

type Props = {
  bookings: Booking[];
  rooms: Room[];
  onBookingClick: (id: string) => void;
  currentUser: User | null;
};

export const BookingCalendar: React.FC<Props> = ({
  bookings,
  rooms,
  onBookingClick,
  currentUser,
}) => {
  const isAdmin = currentUser?.role === "admin";
  const now = new Date().getTime();

  const events = bookings.map((b) => {
    const roomFromProps = rooms.find(
      (r) =>
        r._id === (typeof b.roomId === "string" ? b.roomId : b.roomId?._id),
    );

    const roomName =
      typeof b.roomId === "object"
        ? b.roomId?.name
        : roomFromProps?.name || "Okänt rum";
    const roomColor =
      typeof b.roomId === "object" ? b.roomId?.color : roomFromProps?.color;

    const isOwn =
      (typeof b.userId === "object" ? b.userId._id : b.userId) ===
      currentUser?.id;

    const bookerName = typeof b.userId === "object" ? b.userId.name : "Okänd";

    const isPast = new Date(b.endTime).getTime() < now;

    // NYTT: Om det inte är din bokning och du inte är admin, ska den tonas ner
    const shouldDim = !isOwn && !isAdmin;

    const canClick = (isOwn || isAdmin) && !isPast;

    return {
      id: b._id,
      start: b.startTime,
      end: b.endTime,
      allDay: false,

      // Justerad färg: Dov färg om isPast ELLER om det är någon annans bokning (shouldDim)
      backgroundColor:
        isPast || shouldDim
          ? `${roomColor || "#ccc"}60`
          : roomColor || "#3b82f6",
      borderColor:
        isPast || shouldDim
          ? `${roomColor || "#ccc"}80`
          : roomColor || "#3b82f6",

      classNames: [
        canClick ? "cursor-pointer" : "cursor-default",
        // Applicera dova effekter även på andras bokningar (shouldDim)
        isPast || shouldDim ? "opacity-75 saturate-[0.4] brightness-[0.8]" : "",
      ],

      extendedProps: {
        isOwn,
        isPast,
        shouldDim,
        canClick,
        roomName,
        bookerName,
        showDetails: isAdmin || isOwn,
      },
    };
  });

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locales={[svLocale]}
        locale="sv"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="auto"
        eventDisplay="block"
        eventContent={(eventInfo) => {
          const {
            roomName,
            bookerName,
            showDetails,
            isOwn,
            isPast,
            shouldDim,
          } = eventInfo.event.extendedProps;

          // Textfärg blir grå om boxen är tonad (historik eller andras bokningar)
          const textColorClass =
            isPast || shouldDim ? "text-gray-600" : "text-white";

          return (
            <div
              className={`p-1 overflow-hidden leading-tight h-full relative z-10 ${textColorClass}`}
            >
              <div className="text-[10px] opacity-90 font-medium mb-0.5">
                {eventInfo.timeText}
              </div>

              {showDetails ? (
                <>
                  <div className="font-bold text-xs truncate">
                    {roomName}{" "}
                    {isPast && (
                      <span className="font-normal italic text-[10px] ml-1">
                        (Avslutad)
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-80 italic truncate">
                    {isAdmin
                      ? `Bokat av: ${bookerName}`
                      : isOwn
                        ? "Min bokning"
                        : ""}
                  </div>
                </>
              ) : (
                <div className="text-xs italic opacity-70 mt-1">Upptaget</div>
              )}
            </div>
          );
        }}
        eventClick={(info) => {
          if (info.event.extendedProps.canClick) {
            onBookingClick(info.event.id);
          }
        }}
      />
    </div>
  );
};
