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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        events={events}
        dateClick={(info) => onDateClick(info.dateStr)}
        eventClick={(info) => onEventClick(info.event)}
        height="auto"
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventDisplay="block"
        eventBackgroundColor="#3b82f6"
        eventBorderColor="#3b82f6"
        eventTextColor="#ffffff"
        dayCellClassNames="hover:bg-gray-50 cursor-pointer transition-colors"
        eventClassNames="rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        dayHeaderClassNames="text-gray-600 font-medium py-3"
        viewClassNames="bg-white"
      />
    </div>
  )
}
