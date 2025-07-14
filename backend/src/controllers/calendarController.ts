import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { IUser } from "../models/User";
import { IEvent } from "../models/Event";
import {
  syncUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
} from "../services/calendarService";

interface EventResponse {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  status: "confirmed" | "tentative" | "cancelled";
  extendedProps?: {
    description?: string;
    location?: string;
    attendees?: string[];
  };
}

export class CalendarController {
  async getEvents(req: AuthRequest<{}, any, any, any>, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const events = await getUserEvents(req.user);

      // Format events for frontend
      const formattedEvents: EventResponse[] = events.map((event: IEvent) => ({
        id: event.googleEventId,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        description: event.description,
        location: event.location,
        status: event.status,
        extendedProps: {
          description: event.description,
          location: event.location,
          attendees: event.attendees,
        },
      }));

      res.json(formattedEvents);
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ error: "Failed to get events" });
    }
  }

  async createEvent(
    req: AuthRequest<{}, any, { title: string; start: Date; end: Date; description?: string; location?: string; attendees?: string[] }, any>,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const event = await createEvent(req.user, req.body);

      res.status(201).json({
        id: event.googleEventId,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        description: event.description,
        location: event.location,
        status: event.status,
      });
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }

  async updateEvent(
    req: AuthRequest<{ eventId: string }, any, { title?: string; start?: Date; end?: Date; description?: string; location?: string; attendees?: string[] }, any>,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { eventId } = req.params;
      const event = await updateEvent(req.user, eventId, req.body);

      res.json({
        id: event.googleEventId,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        description: event.description,
        location: event.location,
        status: event.status,
      });
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  }

  async deleteEvent(
    req: AuthRequest<{ eventId: string }, any, any, any>,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { eventId } = req.params;
      await deleteEvent(req.user, eventId);

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  }

  async syncEvents(req: AuthRequest<{}, any, any, any>, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const events = await syncUserEvents(req.user);

      const formattedEvents: EventResponse[] = events.map((event: IEvent) => ({
        id: event.googleEventId,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        description: event.description,
        location: event.location,
        status: event.status,
      }));

      res.json(formattedEvents);
    } catch (error) {
      console.error("Sync events error:", error);
      res.status(500).json({ error: "Failed to sync events" });
    }
  }
}