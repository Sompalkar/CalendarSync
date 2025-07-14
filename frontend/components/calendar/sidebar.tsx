"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Settings, Plus, MoreHorizontal, MapPin } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  onCreateEvent: () => void
}

export function Sidebar({ onCreateEvent }: SidebarProps) {
  const [selectedCalendar, setSelectedCalendar] = useState("primary")

  const calendars = [
    { id: "primary", name: "Personal", color: "bg-blue-500", count: 12 },
    { id: "work", name: "Work", color: "bg-emerald-500", count: 8 },
    { id: "family", name: "Family", color: "bg-purple-500", count: 5 },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      time: "2:00 PM",
      date: "Today",
      color: "bg-emerald-500",
      location: "Conference Room A",
    },
    { id: 2, title: "Project Review", time: "10:00 AM", date: "Tomorrow", color: "bg-blue-500", location: "Zoom" },
    { id: 3, title: "Client Call", time: "3:30 PM", date: "Friday", color: "bg-purple-500", location: "Phone" },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Quick Actions */}
      <div className="space-y-3">
        <Button
          onClick={onCreateEvent}
          className="w-full justify-start bg-neutral-900 hover:bg-neutral-800 text-white font-medium"
        >
          <Plus className="mr-3 h-4 w-4" />
          Create Event
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start border-neutral-200 hover:bg-neutral-50 bg-transparent"
        >
          <Calendar className="mr-3 h-4 w-4" />
          Import Calendar
        </Button>
      </div>

      {/* My Calendars */}
      <Card className="border-neutral-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center justify-between">
            My Calendars
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                selectedCalendar === calendar.id ? "bg-neutral-100 border border-neutral-200" : "hover:bg-neutral-50"
              }`}
              onClick={() => setSelectedCalendar(calendar.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
                <span className="text-sm font-medium text-neutral-900">{calendar.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-600 hover:bg-neutral-100">
                {calendar.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-neutral-200 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-neutral-900">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors border border-transparent hover:border-neutral-200"
            >
              <div className={`flex-shrink-0 w-2 h-2 ${event.color} rounded-full mt-2`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{event.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-neutral-400" />
                  <span className="text-xs text-neutral-500">{event.time}</span>
                  <span className="text-xs text-neutral-300">•</span>
                  <span className="text-xs text-neutral-500">{event.date}</span>
                </div>
                {event.location && (
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-3 w-3 text-neutral-400" />
                    <span className="text-xs text-neutral-500 truncate">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-sm text-neutral-500 text-center py-4">No upcoming events</p>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="pt-4 border-t border-neutral-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
