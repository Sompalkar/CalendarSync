"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CalendarHeader } from "./calendar-header"
import { CalendarView } from "./calendar-view"
import { EventModal } from "./event-modal"
import { Sidebar } from "./sidebar"
import { useCalendarStore } from "@/store/calendar-store"
import { Menu, X } from "lucide-react"

export function CalendarDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const { events, fetchEvents, isLoading } = useCalendarStore()

  useEffect(() => {
    // Initial fetch
    fetchEvents()

    // Set up polling based on page visibility
    let interval: NodeJS.Timeout

    const handleVisibilityChange = () => {
      clearInterval(interval)
      const pollInterval = document.visibilityState === "visible" ? 5000 : 60000
      interval = setInterval(fetchEvents, pollInterval)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    handleVisibilityChange()

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchEvents])

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setIsEventModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-white font-semibold text-sm">CS</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">CalendarSync</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex h-16 items-center justify-between border-b bg-white px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <CalendarHeader />
        </div>

        <main className="p-4">
          <Card className="border-0 shadow-sm">
            <CalendarView
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              isLoading={isLoading}
            />
          </Card>
        </main>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
      />
    </div>
  )
}
