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
    <section class="events-section" id="events" aria-labelledby="events-heading">
      <div class="section-header">
        <h2 id="events-heading">Upcoming Gatherings</h2>
        <p class="section-description">What's next on the schedule</p>
      </div>

      <div class="filter-tabs" role="tablist" aria-label="Event filters">
        <button
          role="tab"
          [attr.aria-selected]="activeFilter() === 'all'"
          [class.active]="activeFilter() === 'all'"
          (click)="filterEvents('all')">
          All Events
        </button>
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
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .section-header h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      color: var(--color-bark);
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .section-description {
      color: var(--color-stone);
      font-size: 1.05rem;
    }

    .filter-tabs {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    .filter-tabs button {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      padding: 0.6em 1.5em;
      border: 1.5px solid var(--color-cream-dark);
      border-radius: 100px;
      background: transparent;
      color: var(--color-bark-light);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .filter-tabs button:hover {
      border-color: var(--color-forest-light);
      color: var(--color-forest);
      background: rgba(45, 90, 61, 0.04);
    }

    .filter-tabs button:focus-visible {
      outline: 2px solid var(--color-amber);
      outline-offset: 2px;
    }

    .filter-tabs button.active {
      background: var(--color-forest);
      border-color: var(--color-forest);
      color: var(--color-cream);
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
      color: var(--color-stone);
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--color-cream-dark);
      border-top-color: var(--color-forest);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border: 1px solid rgba(59, 47, 37, 0.1);
      border-radius: 16px;
      color: var(--color-bark-light);
    }

    .retry-btn {
      margin-top: 1rem;
      padding: 0.6em 1.5em;
      background: var(--color-forest);
      color: var(--color-cream);
      border: none;
      border-radius: 100px;
      font-weight: 500;
      cursor: pointer;
      transition: background var(--transition-base);
    }

    .retry-btn:hover {
      background: var(--color-forest-deep);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--color-stone);
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.4;
    }

    @media (max-width: 480px) {
      .filter-tabs {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-tabs button {
        text-align: center;
      }
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
