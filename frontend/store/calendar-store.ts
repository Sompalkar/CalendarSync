import { create } from "zustand"

interface Event {
  id: string
  title: string
  start: string
  end: string
  description?: string
  location?: string
  status?: string
  extendedProps?: {
    description?: string
    location?: string
    attendees?: string[]
  }
}

interface CalendarState {
  events: Event[]
  currentView: "month" | "week" | "day"
  isLoading: boolean
  error: string | null
  lastSync: number
  fetchEvents: () => Promise<void>
  addEvent: (event: Omit<Event, "id">) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  setCurrentView: (view: "month" | "week" | "day") => void
  syncEvents: () => Promise<void>
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  currentView: "month",
  isLoading: false,
  error: null,
  lastSync: 0,

  fetchEvents: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/calendar/events", {
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/api/auth/google"
          return
        }
        throw new Error("Failed to fetch events")
      }

      const events = await response.json()
      set({ events, isLoading: false, lastSync: Date.now() })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false })
    }
  },

  addEvent: async (eventData) => {
    try {
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          start: eventData.start,
          end: eventData.end,
          location: eventData.location,
        }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      // Refresh events after adding
      await get().fetchEvents()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await fetch(`/api/calendar/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          start: eventData.start,
          end: eventData.end,
          location: eventData.location,
        }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      // Refresh events after updating
      await get().fetchEvents()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await fetch(`/api/calendar/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      // Refresh events after deleting
      await get().fetchEvents()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  },

  syncEvents: async () => {
    try {
      const response = await fetch("/api/calendar/sync", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to sync events")
      }

      // Refresh events after sync
      await get().fetchEvents()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  },

  setCurrentView: (view) => {
    set({ currentView: view })
  },
}))
