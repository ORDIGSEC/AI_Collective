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

  private get useMockData(): boolean {
    return environment.googleApiKey === 'YOUR_API_KEY' ||
           environment.calendarId === 'YOUR_CALENDAR_ID_HERE';
  }

  private getMockEvents(): CalendarEvent[] {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Helper to get 3rd Thursday of a month
    const getThirdThursday = (year: number, month: number): Date => {
      const date = new Date(year, month, 1);
      const dayOfWeek = date.getDay();
      const firstThursday = dayOfWeek <= 4 ? 5 - dayOfWeek : 12 - dayOfWeek;
      const thirdThursday = firstThursday + 14;
      return new Date(year, month, thirdThursday, 18, 0, 0);
    };

    const events: CalendarEvent[] = [
      {
        id: 'mock-1',
        title: 'Introduction to Large Language Models',
        description: 'A beginner-friendly exploration of how LLMs work, from tokenization to transformer architecture. Perfect for those new to AI or looking to deepen their understanding of the fundamentals.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 0), // January
        end: new Date(getThirdThursday(currentYear, 0).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-2',
        title: 'Hands-On: Building with Claude Code',
        description: 'Live demo and workshop using Claude Code CLI to build real applications. Bring your laptop and follow along as we create a project from scratch.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 1), // February
        end: new Date(getThirdThursday(currentYear, 1).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-3',
        title: 'Prompt Engineering Deep Dive',
        description: 'Advanced techniques for crafting effective prompts. Learn about chain-of-thought reasoning, few-shot learning, and how to get consistent results from AI models.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 2), // March
        end: new Date(getThirdThursday(currentYear, 2).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-4',
        title: 'RAG Systems: Connecting AI to Your Data',
        description: 'Retrieval-Augmented Generation explained. Learn how to build systems that combine LLMs with your own documents and databases for accurate, grounded responses.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 3), // April
        end: new Date(getThirdThursday(currentYear, 3).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-5',
        title: 'AI Ethics & Responsible Development',
        description: 'Discussion on bias, safety, and responsible AI practices. How do we build AI systems that are fair, transparent, and beneficial to society?',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 4), // May
        end: new Date(getThirdThursday(currentYear, 4).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-6',
        title: 'Community Showcase: Member Projects',
        description: 'Show and tell! Members present their AI projects, experiments, and use cases. A great opportunity to share what you\'ve been building and get feedback.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 5), // June
        end: new Date(getThirdThursday(currentYear, 5).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-7',
        title: 'AI for Local Business: Practical Applications',
        description: 'How Hood River businesses can leverage AI tools for marketing, customer service, and operations. Real examples from local entrepreneurs.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 6), // July
        end: new Date(getThirdThursday(currentYear, 6).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      },
      {
        id: 'mock-8',
        title: 'Fine-Tuning & Custom Models',
        description: 'When and how to fine-tune models for specific tasks. We\'ll cover the process, costs, and when it makes sense versus prompt engineering.',
        location: 'Hood River Library, 502 State St, Hood River, OR',
        start: getThirdThursday(currentYear, 7), // August
        end: new Date(getThirdThursday(currentYear, 7).getTime() + 2 * 60 * 60 * 1000),
        htmlLink: '#'
      }
    ];

    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

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
    if (this.useMockData) {
      return of(this.getMockEvents());
    }

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
        return of(this.getMockEvents());
      })
    );
  }

  getUpcomingEvents(): Observable<CalendarEvent[]> {
    if (this.useMockData) {
      const now = new Date();
      return of(this.getMockEvents().filter(e => e.start >= now));
    }

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
        const mockNow = new Date();
        return of(this.getMockEvents().filter(e => e.start >= mockNow));
      })
    );
  }

  getPastEvents(): Observable<CalendarEvent[]> {
    if (this.useMockData) {
      const now = new Date();
      return of(this.getMockEvents().filter(e => e.end < now).reverse());
    }

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
        const mockNow = new Date();
        return of(this.getMockEvents().filter(e => e.end < mockNow).reverse());
      })
    );
  }
}
