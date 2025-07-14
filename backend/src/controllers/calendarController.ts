import type { Response, Request } from "express";
import type { AuthRequest } from "../middleware/auth";
import {
  syncUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
} from "../services/calendarService";
import { ParamsDictionary } from "express-serve-static-core";

export class CalendarController {
  async getEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const events = await getUserEvents(req.user);

      // Format events for frontend
      const formattedEvents = events.map((event) => ({
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
    req: AuthRequest<ParamsDictionary, any, any>,
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
    req: AuthRequest<{ eventId: string }>,
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
    req: AuthRequest<{ eventId: string }>,
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

  async syncEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const events = await syncUserEvents(req.user);

      const formattedEvents = events.map((event) => ({
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
