import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NewsletterSubscription } from '../models/event.model';

interface NewsletterResponse {
  success: boolean;
  message: string;
  subscriber?: {
    id: number;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  /**
   * Subscribe to newsletter
   */
  subscribe(subscription: NewsletterSubscription): Observable<NewsletterResponse> {
    const url = `${this.baseUrl}/api/newsletter`;

    return this.http.post<NewsletterResponse>(url, subscription).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Newsletter subscription error:', error);
        return throwError(() => ({
          success: false,
          message: error.error?.error || 'Failed to subscribe to newsletter',
        }));
      })
    );
  }
}
