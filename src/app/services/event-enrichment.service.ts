import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { EventExtendedData } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventEnrichmentService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetch extended event data from backend
   * Returns null if backend is unavailable or event not found (graceful degradation)
   */
  getExtendedEventData(googleEventId: string): Observable<EventExtendedData | null> {
    const url = `${this.baseUrl}/api/events/${googleEventId}`;

    return this.http.get<EventExtendedData>(url).pipe(
      map(data => data),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Event not found in backend - this is normal for events without extended data
          console.log(`No extended data found for event: ${googleEventId}`);
        } else {
          // Backend unavailable or other error - fail gracefully
          console.warn(`Failed to fetch extended event data: ${error.message}`);
        }
        return of(null);
      })
    );
  }
}
