import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalendarEvent, GoogleCalendarEvent, GoogleCalendarResponse, ExtendedEvent } from '../models/event.model';
import { EventDescriptionParser } from '../utils/event-parser';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private http = inject(HttpClient);
  private baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';

  private transformEvent(event: GoogleCalendarEvent): CalendarEvent {
    const startDateTime = event.start.dateTime || event.start.date || '';
    const endDateTime = event.end.dateTime || event.end.date || '';

    // Extract clean description (intro text before markdown sections)
    const cleanDescription = this.extractIntroText(event.description || '');

    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: cleanDescription,
      location: event.location || '',
      start: new Date(startDateTime),
      end: new Date(endDateTime),
      htmlLink: event.htmlLink
    };
  }

  /**
   * Extract intro text from description (text before first ## section)
   * and convert HTML to plain text
   */
  private extractIntroText(description: string): string {
    if (!description) return '';

    // Convert <br> tags to newlines
    let text = description.replace(/<br\s*\/?>/gi, '\n');

    // Remove all HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    text = text.replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, ' ');

    // Extract only text before first ## marker (markdown sections)
    const firstSection = text.indexOf('##');
    if (firstSection !== -1) {
      text = text.substring(0, firstSection);
    }

    // Clean up whitespace
    return text.trim();
  }

  /**
   * Extract Meetup URL from event description
   */
  private extractMeetupUrl(description: string): string | undefined {
    if (!description) return undefined;

    // Look for Meetup URL patterns:
    // - Direct URL: https://www.meetup.com/group-name/events/123456789
    // - Labeled: Meetup: https://www.meetup.com/...
    // - Markdown link: [RSVP on Meetup](url)
    const meetupRegex = /https?:\/\/(?:www\.)?meetup\.com\/[^\/\s]+\/events\/\d+/i;
    const match = description.match(meetupRegex);
    return match ? match[0] : undefined;
  }

  /**
   * Transform and parse Google Calendar event into ExtendedEvent
   */
  private transformAndParse(googleEvent: GoogleCalendarEvent): ExtendedEvent {
    const originalDescription = googleEvent.description || '';

    // Transform the event with cleaned description
    const calendarEvent = this.transformEvent(googleEvent);

    // Parse the original description for extended data
    const extendedData = EventDescriptionParser.parse(originalDescription);

    // Extract Meetup URL
    const meetupUrl = this.extractMeetupUrl(originalDescription);

    return {
      ...calendarEvent,
      meetupUrl,
      extendedData: extendedData || undefined,
      hasExtendedData: !!extendedData
    };
  }

  getEvents(): Observable<ExtendedEvent[]> {
    const url = `${this.baseUrl}/${encodeURIComponent(environment.calendarId)}/events`;
    const params = {
      key: environment.googleApiKey,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50'
    };

    return this.http.get<GoogleCalendarResponse>(url, { params }).pipe(
      map(response => response.items
        .map(event => this.transformAndParse(event))
      ),
      catchError(error => {
        console.error('Failed to fetch calendar events:', error);
        return of([]);
      })
    );
  }

  /**
   * Get upcoming events with enriched data from backend
   */
  getUpcomingEvents(): Observable<ExtendedEvent[]> {
    const url = `${this.baseUrl}/${encodeURIComponent(environment.calendarId)}/events`;
    const now = new Date().toISOString();
    const params = {
      key: environment.googleApiKey,
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: now,
      maxResults: '20'
    };

    return this.http.get<GoogleCalendarResponse>(url, { params }).pipe(
      map(response => response.items
        .map(event => this.transformAndParse(event))
      ),
      catchError(error => {
        console.error('Failed to fetch upcoming events:', error);
        return of([]);
      })
    );
  }

  getPastEvents(): Observable<ExtendedEvent[]> {
    const url = `${this.baseUrl}/${encodeURIComponent(environment.calendarId)}/events`;
    const now = new Date().toISOString();
    const params = {
      key: environment.googleApiKey,
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMax: now,
      maxResults: '20'
    };

    return this.http.get<GoogleCalendarResponse>(url, { params }).pipe(
      map(response => response.items
        .map(event => this.transformAndParse(event))
        .reverse()
      ),
      catchError(error => {
        console.error('Failed to fetch past events:', error);
        return of([]);
      })
    );
  }
}
