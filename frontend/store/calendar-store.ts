import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  currentDate: string
  isLoading: boolean
  error: string | null
  lastSync: number
  isOnline: boolean
  syncRetryCount: number
  pollInterval: number
  fetchEvents: () => Promise<void>
  addEvent: (event: Omit<Event, "id">) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  setCurrentView: (view: "month" | "week" | "day") => void
  setCurrentDate: (date: string) => void
  syncEvents: () => Promise<void>
  setOnlineStatus: (status: boolean) => void
  resetError: () => void
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      currentView: "month",
      currentDate: new Date().toISOString().split("T")[0],
      isLoading: false,
      error: null,
      lastSync: 0,
      isOnline: true,
      syncRetryCount: 0,
      pollInterval: 60000,

      fetchEvents: async () => {
        const state = get()
        if (!state.isOnline && state.events.length > 0) {
          return
        }
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/calendar/events", {
            credentials: "include",
          })
          if (!response.ok) {
            if (response.status === 401) {
              set({ error: "Not authenticated", isLoading: false })
              return
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          const events = await response.json()
          const currentEvents = get().events
          const eventsChanged = JSON.stringify(events) !== JSON.stringify(currentEvents)
          set({
            ...(eventsChanged ? { events } : {}),
            isLoading: false,
            lastSync: Date.now(),
            syncRetryCount: 0,
          })
        } catch (error) {
          const currentState = get()
          const newRetryCount = currentState.syncRetryCount + 1
          const newPollInterval = Math.min(currentState.pollInterval * 1.5, 60000)
          set({
            error: error instanceof Error ? error.message : "Failed to fetch events",
            isLoading: false,
            syncRetryCount: newRetryCount,
            pollInterval: newPollInterval,
          })
          if (currentState.events.length > 0 && error instanceof Error && error.message.includes("fetch")) {
            set({ error: null })
          }
        }
      },

      addEvent: async (eventData) => {
        try {
          set({ isLoading: true, error: null })
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
            throw new Error(`Failed to create event: ${response.statusText}`)
          }
          const newEvent = await response.json()
          const currentEvents = get().events
          set({
            events: [...currentEvents, newEvent],
            isLoading: false,
          })
          setTimeout(() => get().fetchEvents(), 1000)
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create event",
            isLoading: false,
          })
        }
      },

      updateEvent: async (id, eventData) => {
        try {
          set({ isLoading: true, error: null })
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
            throw new Error(`Failed to update event: ${response.statusText}`)
          }
          const updatedEvent = await response.json()
          const currentEvents = get().events
          const updatedEvents = currentEvents.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event))
          set({
            events: updatedEvents,
            isLoading: false,
          })
          setTimeout(() => get().fetchEvents(), 1000)
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update event",
            isLoading: false,
          })
        }
      },

      deleteEvent: async (id) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch(`/api/calendar/events/${id}`, {
            method: "DELETE",
            credentials: "include",
          })
          if (!response.ok) {
            throw new Error(`Failed to delete event: ${response.statusText}`)
          }
          const currentEvents = get().events
          const filteredEvents = currentEvents.filter((event) => event.id !== id)
          set({
            events: filteredEvents,
            isLoading: false,
          })
          setTimeout(() => get().fetchEvents(), 1000)
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete event",
            isLoading: false,
          })
        }
      },

      syncEvents: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch("/api/calendar/sync", {
            method: "POST",
            credentials: "include",
          })
          if (!response.ok) {
            throw new Error(`Sync failed: ${response.statusText}`)
          }
          await get().fetchEvents()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Sync failed",
            isLoading: false,
          })
        }
      },

      setCurrentView: (view) => {
        set({ currentView: view })
      },

      setCurrentDate: (date) => {
        set({ currentDate: date })
      },

      setOnlineStatus: (status) => {
        set({ isOnline: status })
        if (status) {
          get().fetchEvents()
        }
      },

      resetError: () => {
        set({ error: null })
      },
    }),
    {
      name: "calendar-storage",
      partialize: (state) => ({
        events: state.events,
        currentView: state.currentView,
        currentDate: state.currentDate,
        lastSync: state.lastSync,
      }),
    },
  ),
)
