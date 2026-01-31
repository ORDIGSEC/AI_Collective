import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalendarEvent, GoogleCalendarEvent, GoogleCalendarResponse } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private http = inject(HttpClient);
  private baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';

  private transformEvent(event: GoogleCalendarEvent): CalendarEvent {
    const startDateTime = event.start.dateTime || event.start.date || '';
    const endDateTime = event.end.dateTime || event.end.date || '';

    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      location: event.location || '',
      start: new Date(startDateTime),
      end: new Date(endDateTime),
      htmlLink: event.htmlLink
    };
  }

  getEvents(): Observable<CalendarEvent[]> {
    const url = `${this.baseUrl}/${encodeURIComponent(environment.calendarId)}/events`;
    const params = {
      key: environment.googleApiKey,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50'
    };

    return this.http.get<GoogleCalendarResponse>(url, { params }).pipe(
      map(response => response.items.map(event => this.transformEvent(event))),
      catchError(error => {
        console.error('Failed to fetch calendar events:', error);
        return of([]);
      })
    );
  }

  getUpcomingEvents(): Observable<CalendarEvent[]> {
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
      map(response => response.items.map(event => this.transformEvent(event))),
      catchError(error => {
        console.error('Failed to fetch upcoming events:', error);
        return of([]);
      })
    );
  }

  getPastEvents(): Observable<CalendarEvent[]> {
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
      map(response => response.items.map(event => this.transformEvent(event)).reverse()),
      catchError(error => {
        console.error('Failed to fetch past events:', error);
        return of([]);
      })
    );
  }
}
