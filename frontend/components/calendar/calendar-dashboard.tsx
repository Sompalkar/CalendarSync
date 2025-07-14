// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { CalendarHeader } from "./calendar-header";
// import { CalendarView } from "./calendar-view";
// import { EventModal } from "./event-modal";
// import { Sidebar } from "./sidebar";
// import { SyncStatus } from "./sync-status";
// import { ErrorBoundary } from "./error-boundary";
// import { useCalendarStore } from "@/store/calendar-store";
// import { Menu, X } from "lucide-react";

// export function CalendarDashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isEventModalOpen, setIsEventModalOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedEvent, setSelectedEvent] = useState<any>(null);
//   const [isUserActive, setIsUserActive] = useState(true);

//   const {
//     events,
//     fetchEvents,
//     isLoading,
//     setOnlineStatus,
//     pollInterval,
//     error,
//     resetError,
//   } = useCalendarStore();

//   // Track user activity for smart polling
//   const handleUserActivity = useCallback(() => {
//     setIsUserActive(true);
//   }, []);

//   useEffect(() => {
//     // Track online/offline status
//     const handleOnline = () => setOnlineStatus(true);
//     const handleOffline = () => setOnlineStatus(false);

//     // Track user activity
//     const activityEvents = [
//       "mousedown",
//       "mousemove",
//       "keypress",
//       "scroll",
//       "touchstart",
//     ];

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     activityEvents.forEach((event) => {
//       document.addEventListener(event, handleUserActivity, true);
//     });

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//       activityEvents.forEach((event) => {
//         document.removeEventListener(event, handleUserActivity, true);
//       });
//     };
//   }, [setOnlineStatus, handleUserActivity]);

//   // Smart polling based on visibility and activity
//   useEffect(() => {
//     let intervalRef: NodeJS.Timeout | null = null;
//     let activityTimeout: NodeJS.Timeout;

//     const getPollingInterval = () => {
//       if (document.visibilityState === "hidden") return 60000; // 1 minute when hidden
//       if (!isUserActive) return 30000; // 30 seconds when inactive
//       return pollInterval; // Dynamic interval based on success/failure
//     };

//     const poll = () => {
//       fetchEvents();
//       intervalRef && clearInterval(intervalRef);
//       intervalRef = setInterval(() => {
//         if (document.visibilityState === "visible" && isUserActive) {
//           fetchEvents();
//         }
//       }, getPollingInterval());
//     };

//     poll();

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         fetchEvents(); // Immediate sync when tab becomes visible
//         setIsUserActive(true);
//       }
//       poll();
//     };

//     // Set user as inactive after 5 minutes of no activity
//     const resetActivityTimeout = () => {
//       clearTimeout(activityTimeout);
//       activityTimeout = setTimeout(() => {
//         setIsUserActive(false);
//       }, 5 * 60 * 1000);
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     document.addEventListener("mousedown", resetActivityTimeout);
//     document.addEventListener("keypress", resetActivityTimeout);

//     return () => {
//       intervalRef && clearInterval(intervalRef);
//       clearTimeout(activityTimeout);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       document.removeEventListener("mousedown", resetActivityTimeout);
//       document.removeEventListener("keypress", resetActivityTimeout);
//     };
//   }, [fetchEvents, pollInterval, isUserActive]);

//   const handleDateClick = (date: string) => {
//     setSelectedDate(date);
//     setSelectedEvent(null);
//     setIsEventModalOpen(true);
//   };

//   const handleEventClick = (event: any) => {
//     setSelectedEvent(event);
//     setSelectedDate(null);
//     setIsEventModalOpen(true);
//   };

//   const handleCreateEvent = () => {
//     setSelectedDate(new Date().toISOString().split("T")[0]);
//     setSelectedEvent(null);
//     setIsEventModalOpen(true);
//   };

//   return (
//     <ErrorBoundary>
//       <div className="h-screen flex bg-gray-50 overflow-hidden">
//         {/* Mobile sidebar overlay */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar */}
//         <div
//           className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
//             isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <div className="flex h-full flex-col">
//             <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
//               <div className="flex items-center space-x-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
//                   <span className="text-white font-semibold text-sm">CS</span>
//                 </div>
//                 <span className="text-lg font-semibold text-gray-900">
//                   CalendarSync
//                 </span>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="lg:hidden"
//                 onClick={() => setIsSidebarOpen(false)}
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <Sidebar onCreateEvent={handleCreateEvent} />
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="flex-1 flex flex-col overflow-hidden lg:pl-0">
//           {/* Header */}
//           <div className="flex h-16 items-center justify-between border-b bg-white px-4 flex-shrink-0">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//             <CalendarHeader onCreateEvent={handleCreateEvent} />
//           </div>

//           {/* Sync Status Bar */}
//           <div className="bg-white border-b px-4 py-2 flex-shrink-0">
//             <SyncStatus />
//           </div>

//           {/* Calendar Content */}
//           <main className="flex-1 overflow-auto p-4">
//             <Card className="border-0 shadow-sm h-full">
//               <CalendarView
//                 events={events}
//                 onDateClick={handleDateClick}
//                 onEventClick={handleEventClick}
//                 isLoading={isLoading}
//               />
//             </Card>
//           </main>
//         </div>

//         {/* Event Modal */}
//         <EventModal
//           isOpen={isEventModalOpen}
//           onClose={() => setIsEventModalOpen(false)}
//           selectedDate={selectedDate}
//           selectedEvent={selectedEvent}
//         />

//         {/* Error Toast */}
//         {error && (
//           <div className="fixed bottom-4 right-4 z-50 max-w-sm">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
//               <div className="flex items-start space-x-3">
//                 <div className="flex-1">
//                   <h4 className="font-medium text-red-900">Sync Error</h4>
//                   <p className="text-sm text-red-600 mt-1">{error}</p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={resetError}
//                   className="text-red-600 hover:text-red-700"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// }















"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { CalendarHeader } from "./calendar-header"
import { CalendarView } from "./calendar-view"
import { EventModal } from "./event-modal"
import { Sidebar } from "./sidebar"
import { SyncStatus } from "./sync-status"
import { ErrorBoundary } from "./error-boundary"
import { useCalendarStore } from "@/store/calendar-store"
import { Menu, X } from "lucide-react"

export function CalendarDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isUserActive, setIsUserActive] = useState(true)

  const { events, fetchEvents, isLoading, setOnlineStatus, pollInterval, error, resetError } = useCalendarStore()

  // Track user activity for smart polling
  const handleUserActivity = useCallback(() => {
    setIsUserActive(true)
  }, [])

  useEffect(() => {
    // Track online/offline status
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    // Track user activity
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true)
    })

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [setOnlineStatus, handleUserActivity])

  // Smart polling based on visibility and activity
  useEffect(() => {
    let intervalRef: NodeJS.Timeout | null = null
    let activityTimeout: NodeJS.Timeout

    const getPollingInterval = () => {
      if (document.visibilityState === "hidden") return 60000
      if (!isUserActive) return 30000
      return pollInterval
    }

    const poll = () => {
      fetchEvents()
      intervalRef && clearInterval(intervalRef)
      intervalRef = setInterval(() => {
        if (document.visibilityState === "visible" && isUserActive) {
          fetchEvents()
        }
      }, getPollingInterval())
    }

    poll()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchEvents()
        setIsUserActive(true)
      }
      poll()
    }

    const resetActivityTimeout = () => {
      clearTimeout(activityTimeout)
      activityTimeout = setTimeout(
        () => {
          setIsUserActive(false)
        },
        5 * 60 * 1000,
      )
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("mousedown", resetActivityTimeout)
    document.addEventListener("keypress", resetActivityTimeout)

    return () => {
      intervalRef && clearInterval(intervalRef)
      clearTimeout(activityTimeout)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("mousedown", resetActivityTimeout)
      document.removeEventListener("keypress", resetActivityTimeout)
    }
  }, [fetchEvents, pollInterval, isUserActive])

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

  const handleCreateEvent = () => {
    setSelectedDate(new Date().toISOString().split("T")[0])
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex bg-neutral-50 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-white border-r border-neutral-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
                  <span className="text-white font-semibold text-sm">CS</span>
                </div>
                <span className="text-lg font-semibold text-neutral-900">CalendarSync</span>
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Sidebar onCreateEvent={handleCreateEvent} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6 flex-shrink-0">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <CalendarHeader onCreateEvent={handleCreateEvent} />
          </div>

          {/* Sync Status Bar */}
          <div className="bg-white border-b border-neutral-200 px-4 lg:px-6 py-3 flex-shrink-0">
            <SyncStatus />
          </div>

          {/* Calendar Content */}
          <main className="flex-1 overflow-hidden bg-white">
            <CalendarView
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              isLoading={isLoading}
            />
          </main>
        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
        />

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Sync Error</h4>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetError}
                  className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
