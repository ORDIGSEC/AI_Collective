export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  htmlLink: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink: string;
}

export interface GoogleCalendarResponse {
  kind: string;
  etag: string;
  summary: string;
  items: GoogleCalendarEvent[];
}
