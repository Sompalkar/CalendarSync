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
  const { currentView, currentDate } = useCalendarStore()

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(
        currentView === "month" ? "dayGridMonth" : currentView === "week" ? "timeGridWeek" : "timeGridDay",
      )

      // Navigate to the current date
      calendarApi.gotoDate(currentDate)
    }
  }, [currentView, currentDate])

  if (isLoading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-600 text-sm">Loading your calendar...</p>
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
            initialDate={currentDate}
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
            eventClassNames="rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer font-medium text-xs"
            dayHeaderClassNames="text-neutral-600 font-medium py-3 text-xs uppercase tracking-wide border-neutral-200"
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
        .calendar-container {
          /* Hide scrollbars while keeping functionality */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .calendar-container::-webkit-scrollbar {
          display: none;
        }
        
        .calendar-container .fc-scroller {
          /* Hide scrollbars in FullCalendar */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .calendar-container .fc-scroller::-webkit-scrollbar {
          display: none;
        }
        
        .calendar-container .fc {
          font-family: inherit;
        }
        
        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: #f5f5f5;
        }
        
        .calendar-container .fc-col-header-cell {
          background-color: #fafafa;
          font-weight: 500;
          color: #737373;
          padding: 12px 8px;
        }
        
        .calendar-container .fc-daygrid-day-number {
          color: #171717;
          font-weight: 500;
          padding: 8px;
          font-size: 0.875rem;
        }
        
        .calendar-container .fc-day-today {
          background-color: #fef3c7 !important;
        }
        
        .calendar-container .fc-day-today .fc-daygrid-day-number {
          color: #92400e;
          font-weight: 600;
        }
        
        .calendar-container .fc-timegrid-slot {
          height: 2.5rem;
        }
        
        .calendar-container .fc-timegrid-slot-label {
          color: #737373;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .calendar-container .fc-event {
          border-radius: 4px;
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 2px 6px;
          margin: 1px 0;
        }
        
        .calendar-container .fc-event:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
        }
        
        .calendar-container .fc-more-link {
          color: #737373;
          font-weight: 500;
          font-size: 0.75rem;
        }
        
        .calendar-container .fc-popover {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .calendar-container .fc-scrollgrid {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .calendar-container .fc-daygrid-day {
          min-height: 100px;
        }
        
        @media (max-width: 640px) {
          .calendar-container .fc-daygrid-day-number {
            font-size: 0.75rem;
            padding: 4px;
          }
          
          .calendar-container .fc-event {
            font-size: 0.625rem;
            padding: 1px 4px;
          }
          
          .calendar-container .fc-daygrid-day {
            min-height: 80px;
          }
          
          .calendar-container .fc-timegrid-slot {
            height: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
