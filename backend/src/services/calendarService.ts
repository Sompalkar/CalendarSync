import { calendar, oauth2Client } from "../config/google";
import type { IUser } from "../models/User";
import Event, { type IEvent } from "../models/Event";
import { createError } from "../middleware/errorHandler";
import { refreshAccessToken } from "./authService";

export const syncUserEvents = async (user: IUser): Promise<IEvent[]> => {
  try {
    // Set up OAuth client with user credentials
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    // Check if token needs refresh
    if (new Date() >= user.tokenExpiry) {
      await refreshAccessToken(user);
    }

    const params: any = {
      calendarId: "primary",
      maxResults: 2500,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      timeMax: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ahead
    };

    // Use sync token for incremental sync if available
    if (user.syncToken) {
      params.syncToken = user.syncToken;
      delete params.timeMin;
      delete params.timeMax;
      delete params.maxResults;
    }

    const response = await calendar.events.list(params);
    const events = response.data.items || [];

    // Process events
    const processedEvents: IEvent[] = [];

    for (const googleEvent of events) {
      if (googleEvent.status === "cancelled") {
        // Handle deleted events
        await Event.findOneAndUpdate(
          { userId: user._id, googleEventId: googleEvent.id },
          { isDeleted: true },
          { new: true }
        );
        continue;
      }

      const eventData = {
        googleEventId: googleEvent.id!,
        userId: user._id,
        title: googleEvent.summary || "Untitled Event",
        description: googleEvent.description || "",
        start: new Date(
          googleEvent.start?.dateTime || googleEvent.start?.date || ""
        ),
        end: new Date(googleEvent.end?.dateTime || googleEvent.end?.date || ""),
        location: googleEvent.location || "",
        attendees: googleEvent.attendees?.map((a) => a.email || "") || [],
        calendarId: "primary",
        status: googleEvent.status as "confirmed" | "tentative" | "cancelled",
        isDeleted: false,
        lastModified: new Date(googleEvent.updated || ""),
      };

      // Upsert event
      const event = await Event.findOneAndUpdate(
        { userId: user._id, googleEventId: googleEvent.id },
        eventData,
        {
          upsert: true,
          new: true,
        }
      );

      processedEvents.push(event);
    }

    // Update sync token
    if (response.data.nextSyncToken) {
      user.syncToken = response.data.nextSyncToken;
      await user.save();
    }

    return processedEvents;
  } catch (error: any) {
    console.error("Sync events error:", error);

    // Handle invalid sync token
    if (error.code === 410) {
      user.syncToken = undefined;
      await user.save();
      return syncUserEvents(user); // Retry with full sync
    }

    throw createError("Failed to sync events", 500);
  }
};

const formatDateTime = (dateTime: string) => {
  // If already has seconds and Z, return as is
  if (/\d{2}:\d{2}:\d{2}Z$/.test(dateTime)) return dateTime;
  // If missing seconds, add :00Z
  if (/\d{2}:\d{2}$/.test(dateTime)) return dateTime + ":00Z";
  return dateTime;
};

export const createEvent = async (
  user: IUser,
  eventData: any
): Promise<IEvent> => {
  try {
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    if (new Date() >= user.tokenExpiry) {
      await refreshAccessToken(user);
    }

    const googleEvent = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: formatDateTime(eventData.start),
        timeZone: "UTC",
      },
      end: {
        dateTime: formatDateTime(eventData.end),
        timeZone: "UTC",
      },
      location: eventData.location,
      attendees: eventData.attendees?.map((email: string) => ({ email })),
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: googleEvent,
    });

    const createdEvent = response.data;

    // Save to local database
    const event = new Event({
      googleEventId: createdEvent.id!,
      userId: user._id,
      title: createdEvent.summary || "Untitled Event",
      description: createdEvent.description || "",
      start: new Date(
        createdEvent.start?.dateTime || createdEvent.start?.date || ""
      ),
      end: new Date(createdEvent.end?.dateTime || createdEvent.end?.date || ""),
      location: createdEvent.location || "",
      attendees: createdEvent.attendees?.map((a) => a.email || "") || [],
      calendarId: "primary",
      status: createdEvent.status as "confirmed" | "tentative" | "cancelled",
      lastModified: new Date(createdEvent.updated || ""),
    });

    await event.save();
    return event;
  } catch (error) {
    console.error("Create event error:", error);
    throw createError("Failed to create event", 500);
  }
};

export const updateEvent = async (
  user: IUser,
  eventId: string,
  eventData: any
): Promise<IEvent> => {
  try {
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    if (new Date() >= user.tokenExpiry) {
      await refreshAccessToken(user);
    }

    const event = await Event.findOne({
      userId: user._id,
      googleEventId: eventId,
    });
    if (!event) {
      throw createError("Event not found", 404);
    }

    const googleEvent = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: formatDateTime(eventData.start),
        timeZone: "UTC",
      },
      end: {
        dateTime: formatDateTime(eventData.end),
        timeZone: "UTC",
      },
      location: eventData.location,
    };

    const response = await calendar.events.update({
      calendarId: "primary",
      eventId: eventId,
      requestBody: googleEvent,
    });

    const updatedEvent = response.data;

    // Update local database
    event.title = updatedEvent.summary || "Untitled Event";
    event.description = updatedEvent.description || "";
    event.start = new Date(
      updatedEvent.start?.dateTime || updatedEvent.start?.date || ""
    );
    event.end = new Date(
      updatedEvent.end?.dateTime || updatedEvent.end?.date || ""
    );
    event.location = updatedEvent.location || "";
    event.lastModified = new Date(updatedEvent.updated || "");

    await event.save();
    return event;
  } catch (error) {
    console.error("Update event error:", error);
    throw createError("Failed to update event", 500);
  }
};

export const deleteEvent = async (
  user: IUser,
  eventId: string
): Promise<void> => {
  try {
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    if (new Date() >= user.tokenExpiry) {
      await refreshAccessToken(user);
    }

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    });

    // Mark as deleted in local database
    await Event.findOneAndUpdate(
      { userId: user._id, googleEventId: eventId },
      { isDeleted: true },
      { new: true }
    );
  } catch (error) {
    console.error("Delete event error:", error);
    throw createError("Failed to delete event", 500);
  }
};

export const getUserEvents = async (user: IUser): Promise<IEvent[]> => {
  try {
    // Get events from local database (non-deleted)
    const events = await Event.find({
      userId: user._id,
      isDeleted: false,
      start: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    }).sort({ start: 1 });

    return events;
  } catch (error) {
    console.error("Get user events error:", error);
    throw createError("Failed to get events", 500);
  }
};
