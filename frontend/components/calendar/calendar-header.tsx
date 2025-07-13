"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, Plus } from "lucide-react"
import { useCalendarStore } from "@/store/calendar-store"

export function CalendarHeader() {
  const { currentView, setCurrentView } = useCalendarStore()

  const handleLogout = () => {
    // Handle logout logic
    window.location.href = "/api/auth/logout"
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {["month", "week", "day"].map((view) => (
            <Button
              key={view}
              variant={currentView === view ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView(view)}
              className={`capitalize ${currentView === view ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            >
              {view}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">John Doe</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
