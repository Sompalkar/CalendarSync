export interface GoogleCalendarEvent {
  id: string
  summary?: string
  description?: string
  start?: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end?: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  attendees?: Array<{
    email?: string
    displayName?: string
    responseStatus?: string
  }>
  status?: string
  updated?: string
}

export interface WebhookNotification {
  channelId: string
  resourceId: string
  resourceState: string
  resourceUri: string
  token?: string
}

export interface SyncResponse {
  events: GoogleCalendarEvent[]
  nextSyncToken?: string
  nextPageToken?: string
}
