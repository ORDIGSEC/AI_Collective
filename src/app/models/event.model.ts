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

// Extended event data from backend
export interface ExtendedEvent extends CalendarEvent {
  extendedData?: EventExtendedData;
  hasExtendedData: boolean;
}

export interface EventExtendedData {
  speakers: Speaker[];
  agenda: AgendaItem[];
  resources: Resource[];
  parking?: string;
  accessibility?: string;
}

export interface Speaker {
  name: string;
  bio: string;
  photo?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'slide' | 'code' | 'article' | 'video';
}

// Newsletter subscription
export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  source?: string;
}
