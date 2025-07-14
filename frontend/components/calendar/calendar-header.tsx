"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCalendarStore } from "@/store/calendar-store";
import { useUserStore } from "@/store/user-store";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface CalendarHeaderProps {
  onCreateEvent: () => void;
}

export function CalendarHeader({ onCreateEvent }: CalendarHeaderProps) {
  const { currentView, setCurrentView, currentDate, setCurrentDate } =
    useCalendarStore();
  const { user, logout } = useUserStore();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out", description: "You have been logged out." });
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Could not log out.",
        variant: "destructive",
      });
      window.location.href = "/";
    }
  };

  const navigateDate = (direction: "prev" | "next" | "today") => {
    const current = new Date(currentDate);

    if (direction === "today") {
      setCurrentDate(new Date().toISOString().split("T")[0]);
      return;
    }

    if (currentView === "month") {
      if (direction === "prev") {
        current.setMonth(current.getMonth() - 1);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    } else if (currentView === "week") {
      if (direction === "prev") {
        current.setDate(current.getDate() - 7);
      } else {
        current.setDate(current.getDate() + 7);
      }
    } else if (currentView === "day") {
      if (direction === "prev") {
        current.setDate(current.getDate() - 1);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    setCurrentDate(current.toISOString().split("T")[0]);
  };

  const formatCurrentDate = () => {
    const date = new Date(currentDate);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (currentView === "month") {
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (currentView === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "long",
        })} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}, ${endOfWeek.getFullYear()}`;
      }
    } else {
      return isToday
        ? "Today"
        : date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          {/* Current Date Display */}
          <h1 className="text-xl font-semibold text-neutral-900 min-w-0">
            {formatCurrentDate()}
          </h1>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-neutral-100"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-neutral-100"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium hover:bg-neutral-100 px-3"
              onClick={() => navigateDate("today")}
            >
              Today
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-neutral-100 rounded-lg p-1">
          {["month", "week", "day"].map((view) => (
            <Button
              key={view}
              variant={currentView === view ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView(view as "month" | "week" | "day")}
              className={`capitalize px-3 py-1.5 text-sm font-medium transition-all ${
                currentView === view
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
              }`}
            >
              {view}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={onCreateEvent}
          size="sm"
          className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 font-medium text-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">New</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 hover:bg-neutral-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:bg-neutral-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.picture || "/placeholder.svg?height=32&width=32"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-neutral-100 text-neutral-600 text-xs">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{user?.name || "User"}</p>
                <p className="w-[200px] truncate text-xs text-neutral-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <span className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </span>
              </Link>
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
  );
}
