import { Component, inject, signal } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../models/event.model';
import { EventCardComponent } from '../event-card/event-card.component';

type FilterType = 'all' | 'upcoming' | 'past';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCardComponent],
  template: `
    <section class="events-section" aria-labelledby="events-heading">
      <div class="section-header">
        <h2 id="events-heading">Meetup Events</h2>
        <p class="section-description">Join us on the 3rd Thursday of each month</p>
      </div>

      <div class="filter-buttons" role="tablist" aria-label="Event filters">
        <button
          role="tab"
          [attr.aria-selected]="activeFilter() === 'upcoming'"
          [class.active]="activeFilter() === 'upcoming'"
          (click)="filterEvents('upcoming')">
          Upcoming
        </button>
        <button
          role="tab"
          [attr.aria-selected]="activeFilter() === 'past'"
          [class.active]="activeFilter() === 'past'"
          (click)="filterEvents('past')">
          Past
        </button>
        <button
          role="tab"
          [attr.aria-selected]="activeFilter() === 'all'"
          [class.active]="activeFilter() === 'all'"
          (click)="filterEvents('all')">
          All Events
        </button>
      </div>

      @if (loading()) {
        <div class="loading" role="status" aria-live="polite">
          <div class="loading-spinner"></div>
          <span>Loading events...</span>
        </div>
      } @else if (error()) {
        <div class="error" role="alert">
          <p>Unable to load events. Please try again later.</p>
          <button (click)="retry()" class="retry-btn">Retry</button>
        </div>
      } @else if (events().length === 0) {
        <div class="empty-state">
          <p>No {{ activeFilter() === 'all' ? '' : activeFilter() }} events found.</p>
        </div>
      } @else {
        <div class="events-grid" role="tabpanel">
          @for (event of events(); track event.id) {
            <app-event-card [event]="event" />
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .events-section {
      padding: 2rem 0;
    }

    .section-header {
      margin-bottom: 2rem;
    }

    .section-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .section-description {
      margin: 0;
      color: #4a5568;
      font-size: 1rem;
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-buttons button {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid #e2e8f0;
      border-radius: 9999px;
      background: #fff;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-buttons button:hover {
      border-color: #cbd5e0;
      background: #f7fafc;
    }

    .filter-buttons button.active {
      background: #1a1a2e;
      border-color: #1a1a2e;
      color: #fff;
    }

    .filter-buttons button:focus-visible {
      outline: 2px solid #e94560;
      outline-offset: 2px;
    }

    .events-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: #4a5568;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #e94560;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error {
      text-align: center;
      padding: 3rem 2rem;
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 12px;
      color: #c53030;
    }

    .retry-btn {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      background: #c53030;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .retry-btn:hover {
      background: #9b2c2c;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #718096;
      background: #f7fafc;
      border-radius: 12px;
    }
  `]
})
export class EventListComponent {
  private calendarService = inject(CalendarService);

  events = signal<CalendarEvent[]>([]);
  loading = signal(true);
  error = signal(false);
  activeFilter = signal<FilterType>('upcoming');

  constructor() {
    this.loadEvents('upcoming');
  }

  filterEvents(filter: FilterType): void {
    this.activeFilter.set(filter);
    this.loadEvents(filter);
  }

  retry(): void {
    this.loadEvents(this.activeFilter());
  }

  private loadEvents(filter: FilterType): void {
    this.loading.set(true);
    this.error.set(false);

    const observable = filter === 'upcoming'
      ? this.calendarService.getUpcomingEvents()
      : filter === 'past'
        ? this.calendarService.getPastEvents()
        : this.calendarService.getEvents();

    observable.subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
