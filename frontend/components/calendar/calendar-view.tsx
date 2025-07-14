// "use client";

// import { useEffect, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useCalendarStore } from "@/store/calendar-store";
// import { Loader2 } from "lucide-react";

// interface CalendarViewProps {
//   events: any[];
//   onDateClick: (date: string) => void;
//   onEventClick: (event: any) => void;
//   isLoading: boolean;
// }

// export function CalendarView({
//   events,
//   onDateClick,
//   onEventClick,
//   isLoading,
// }: CalendarViewProps) {
//   const calendarRef = useRef<FullCalendar>(null);
//   const { currentView } = useCalendarStore();

//   useEffect(() => {
//     if (calendarRef.current) {
//       const calendarApi = calendarRef.current.getApi();
//       calendarApi.changeView(
//         currentView === "month"
//           ? "dayGridMonth"
//           : currentView === "week"
//           ? "timeGridWeek"
//           : "timeGridDay"
//       );
//     }
//   }, [currentView]);

//   if (isLoading && events.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading your calendar...</p>
//         </div>
//       </div>
//     );
//   }

//   const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
//   const fixedHeight =
//     currentView === "month" ? undefined : isMobile ? 500 : 700;

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex-1 p-0 sm:p-4 overflow-hidden">
//         <div className="h-full">
//           <FullCalendar
//             ref={calendarRef}
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             headerToolbar={{
//               left: "prev,next today",
//               center: "title",
//               right: "",
//             }}
//             events={events}
//             dateClick={(info) => onDateClick(info.dateStr)}
//             eventClick={(info) => onEventClick(info.event)}
//             height={fixedHeight}
//             contentHeight={fixedHeight}
//             expandRows={true}
//             dayMaxEvents={3}
//             moreLinkClick="popover"
//             eventDisplay="block"
//             eventBackgroundColor="#3b82f6"
//             eventBorderColor="#3b82f6"
//             eventTextColor="#ffffff"
//             dayCellClassNames="hover:bg-gray-50 cursor-pointer transition-colors"
//             eventClassNames="rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//             dayHeaderClassNames="text-gray-600 font-medium py-3"
//             viewClassNames="bg-white"
//             aspectRatio={currentView === "month" ? 1.8 : 1.2}
//             slotMinTime="00:00:00"
//             slotMaxTime="24:00:00"
//             slotDuration="00:30:00"
//             scrollTime="08:00:00"
//             nowIndicator={true}
//             allDaySlot={true}
//             handleWindowResize={true}
//             weekends={true}
//             {...(currentView !== "month" && {
//               height: fixedHeight,
//               contentHeight: fixedHeight,
//               scrollTime: "08:00:00",
//               slotMinTime: "00:00:00",
//               slotMaxTime: "24:00:00",
//               slotDuration: "00:30:00",
//               nowIndicator: true,
//               allDaySlot: true,
//               handleWindowResize: true,
//               weekends: true,
//             })}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
























"use client"
import { useEffect, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useCalendarStore } from "@/store/calendar-store"
import { Loader2 } from "lucide-react"

interface CalendarViewProps {
  events: any[]
  onDateClick: (date: string) => void
  onEventClick: (event: any) => void
  isLoading: boolean
}

export function CalendarView({ events, onDateClick, onEventClick, isLoading }: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const { currentView } = useCalendarStore()

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(
        currentView === "month" ? "dayGridMonth" : currentView === "week" ? "timeGridWeek" : "timeGridDay",
      )
    }
  }, [currentView])

  if (isLoading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-600">Loading your calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="h-full calendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={events}
            dateClick={(info) => onDateClick(info.dateStr)}
            eventClick={(info) => onEventClick(info.event)}
            height="100%"
            expandRows={true}
            dayMaxEvents={currentView === "month" ? 3 : false}
            moreLinkClick="popover"
            eventDisplay="block"
            eventBackgroundColor="#171717"
            eventBorderColor="#171717"
            eventTextColor="#ffffff"
            dayCellClassNames="hover:bg-neutral-50 cursor-pointer transition-colors border-neutral-200"
            eventClassNames="rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer font-medium"
            dayHeaderClassNames="text-neutral-600 font-medium py-4 text-sm uppercase tracking-wide border-neutral-200"
            viewClassNames="bg-white"
            aspectRatio={currentView === "month" ? 1.6 : undefined}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:30:00"
            scrollTime="08:00:00"
            nowIndicator={true}
            allDaySlot={true}
            handleWindowResize={true}
            weekends={true}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
            dayHeaderFormat={
              currentView === "day"
                ? { weekday: "long", month: "long", day: "numeric" }
                : currentView === "week"
                  ? { weekday: "short", day: "numeric" }
                  : { weekday: "short" }
            }
            {...(currentView !== "month" && {
              scrollTime: "08:00:00",
              slotMinTime: "00:00:00",
              slotMaxTime: "24:00:00",
              slotDuration: "00:30:00",
              nowIndicator: true,
              allDaySlot: true,
              handleWindowResize: true,
              weekends: true,
              scrollTimeReset: false,
            })}
          />
        </div>
      </div>

      <style jsx global>{`
        .calendar-container .fc {
          font-family: inherit;
        }
        
        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: #e5e5e5;
        }
        
        .calendar-container .fc-col-header-cell {
          background-color: #fafafa;
          font-weight: 500;
          color: #525252;
        }
        
        .calendar-container .fc-daygrid-day-number {
          color: #171717;
          font-weight: 500;
          padding: 8px;
        }
        
        .calendar-container .fc-day-today {
          background-color: #fef3c7 !important;
        }
        
        .calendar-container .fc-day-today .fc-daygrid-day-number {
          color: #92400e;
          font-weight: 600;
        }
        
        .calendar-container .fc-timegrid-slot {
          height: 3rem;
        }
        
        .calendar-container .fc-timegrid-slot-label {
          color: #737373;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .calendar-container .fc-event {
          border-radius: 6px;
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 2px 6px;
        }
        
        .calendar-container .fc-event:hover {
          filter: brightness(0.9);
        }
        
        .calendar-container .fc-more-link {
          color: #525252;
          font-weight: 500;
          font-size: 0.75rem;
        }
        
        .calendar-container .fc-popover {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .calendar-container .fc-button {
          background: none;
          border: 1px solid #d4d4d4;
          color: #525252;
          font-weight: 500;
          border-radius: 6px;
          padding: 0.5rem 1rem;
        }
        
        .calendar-container .fc-button:hover {
          background-color: #f5f5f5;
          border-color: #a3a3a3;
        }
        
        .calendar-container .fc-button:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .calendar-container .fc-button-primary:disabled {
          background-color: #f5f5f5;
          border-color: #d4d4d4;
          color: #a3a3a3;
        }
        
        .calendar-container .fc-scrollgrid {
          border-radius: 8px;
          overflow: hidden;
        }
        
        @media (max-width: 640px) {
          .calendar-container .fc-toolbar {
            flex-direction: column;
            gap: 1rem;
          }
          
          .calendar-container .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
          
          .calendar-container .fc-daygrid-day-number {
            font-size: 0.875rem;
          }
          
          .calendar-container .fc-event {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  )
}
