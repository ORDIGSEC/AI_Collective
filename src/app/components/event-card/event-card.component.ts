import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article class="event-card" [class.past]="isPast">
      <div class="event-date">
        <span class="month">{{ event.start | date:'MMM' }}</span>
        <span class="day">{{ event.start | date:'d' }}</span>
        <span class="year">{{ event.start | date:'yyyy' }}</span>
      </div>
      <div class="event-details">
        <h3 class="event-title">{{ event.title }}</h3>
        <div class="event-meta">
          <span class="event-time">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ event.start | date:'shortTime' }} - {{ event.end | date:'shortTime' }}
          </span>
          @if (event.location) {
            <span class="event-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ event.location }}
            </span>
          }
        </div>
        @if (event.description) {
          <p class="event-description">{{ event.description }}</p>
        }
        <a [href]="event.htmlLink" target="_blank" rel="noopener noreferrer" class="event-link">
          View in Calendar
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </article>
  `,
  styles: [`
    .event-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .event-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .event-card.past {
      opacity: 0.7;
    }

    .event-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 70px;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 8px;
      text-align: center;
    }

    .event-date .month {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #e94560;
      letter-spacing: 0.05em;
    }

    .event-date .day {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.1;
    }

    .event-date .year {
      font-size: 0.75rem;
      color: #718096;
    }

    .event-details {
      flex: 1;
      min-width: 0;
    }

    .event-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a2e;
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .event-meta span {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .event-meta svg {
      color: #718096;
    }

    .event-description {
      margin: 0 0 1rem 0;
      font-size: 0.9375rem;
      color: #4a5568;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #e94560;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .event-link:hover {
      color: #d13652;
    }

    @media (max-width: 640px) {
      .event-card {
        flex-direction: column;
        gap: 1rem;
      }

      .event-date {
        flex-direction: row;
        gap: 0.5rem;
        justify-content: flex-start;
        padding: 0.5rem 0.75rem;
      }

      .event-date .day {
        font-size: 1.25rem;
      }
    }
  `]
})
export class EventCardComponent {
  @Input({ required: true }) event!: CalendarEvent;

  get isPast(): boolean {
    return this.event.end < new Date();
  }
}
