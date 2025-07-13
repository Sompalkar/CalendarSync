"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Settings, Plus } from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const [selectedCalendar, setSelectedCalendar] = useState("primary")

  const calendars = [
    { id: "primary", name: "Personal", color: "bg-blue-500", count: 12 },
    { id: "work", name: "Work", color: "bg-green-500", count: 8 },
    { id: "family", name: "Family", color: "bg-purple-500", count: 5 },
  ]

  const upcomingEvents = [
    { id: 1, title: "Team Meeting", time: "2:00 PM", date: "Today" },
    { id: 2, title: "Project Review", time: "10:00 AM", date: "Tomorrow" },
    { id: 3, title: "Client Call", time: "3:30 PM", date: "Friday" },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Quick Actions */}
      <div className="space-y-2">
        <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Calendar className="mr-2 h-4 w-4" />
          Import Calendar
        </Button>
      </div>

      {/* My Calendars */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">My Calendars</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                selectedCalendar === calendar.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCalendar(calendar.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
                <span className="text-sm font-medium">{calendar.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {calendar.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{event.time}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="pt-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-gray-600">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
