import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article class="event-card" [class.past]="isPast">
      <div class="event-date-badge">
        <span class="month">{{ event.start | date:'MMM' }}</span>
        <span class="day">{{ event.start | date:'d' }}</span>
      </div>
      <div class="event-details">
        <h3 class="event-title">{{ event.title }}</h3>
        <div class="event-meta">
          <span class="event-time">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ event.start | date:'shortTime' }} – {{ event.end | date:'shortTime' }}
          </span>
          @if (event.location) {
            <span class="event-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 1.5rem;
      padding: 2rem;
      background: white;
      border: 1px solid rgba(59, 47, 37, 0.08);
      border-left: 5px solid var(--color-bark);
      border-radius: 2px 12px 12px 2px;
      box-shadow: var(--shadow-card);
      transition: box-shadow var(--transition-base), transform var(--transition-base);
      align-items: start;
      position: relative;
    }

    /* Wood grain texture on left border */
    .event-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -5px;
      width: 5px;
      height: 100%;
      border-radius: 2px 0 0 2px;
      background:
        repeating-linear-gradient(
          180deg,
          var(--color-bark) 0px,
          var(--color-bark-light) 2px,
          var(--color-bark) 3px,
          rgba(59, 47, 37, 0.7) 5px,
          var(--color-bark) 6px,
          var(--color-bark-light) 8px,
          var(--color-bark) 10px
        );
    }

    .event-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }

    .event-card.past {
      opacity: 0.65;
    }

    .event-date-badge {
      background:
        repeating-linear-gradient(
          180deg,
          var(--color-forest-deep) 0px,
          var(--color-forest) 2px,
          var(--color-forest-deep) 3px,
          var(--color-forest-light) 5px,
          var(--color-forest-deep) 6px,
          var(--color-forest) 8px,
          var(--color-forest-deep) 10px,
          var(--color-forest-light) 12px,
          var(--color-forest-deep) 14px
        );
      color: var(--color-cream);
      border-radius: 4px;
      padding: 1rem 0.5rem;
      text-align: center;
      line-height: 1.2;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 0 rgba(0,0,0,0.15),
        0 2px 4px rgba(30, 63, 43, 0.2);
    }

    .event-date-badge .month {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.85;
      display: block;
      text-shadow: 0 1px 1px rgba(0,0,0,0.2);
    }

    .event-date-badge .day {
      font-family: var(--font-display);
      font-size: 1.8rem;
      display: block;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    .event-details {
      min-width: 0;
    }

    .event-title {
      font-size: 1.3rem;
      margin-bottom: 0.3em;
      color: var(--color-bark);
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      color: var(--color-stone);
    }

    .event-meta span {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .event-meta svg {
      color: var(--color-stone-light);
    }

    .event-description {
      font-size: 0.95rem;
      color: var(--color-bark-light);
      line-height: 1.6;
      margin-bottom: 1rem;
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
      color: var(--color-forest);
      text-decoration: none;
      transition: color var(--transition-base);
    }

    .event-link:hover {
      color: var(--color-amber);
    }

    @media (max-width: 640px) {
      .event-card {
        grid-template-columns: 1fr;
      }

      .event-card::before {
        top: -5px;
        left: 0;
        width: 100%;
        height: 5px;
        border-radius: 2px 2px 0 0;
        background:
          repeating-linear-gradient(
            90deg,
            var(--color-bark) 0px,
            var(--color-bark-light) 2px,
            var(--color-bark) 3px,
            rgba(59, 47, 37, 0.7) 5px,
            var(--color-bark) 6px,
            var(--color-bark-light) 8px,
            var(--color-bark) 10px
          );
      }

      .event-card {
        border-left: 1px solid rgba(59, 47, 37, 0.08);
        border-top: 5px solid var(--color-bark);
        border-radius: 2px 2px 12px 12px;
      }

      .event-date-badge {
        display: flex;
        gap: 0.4em;
        align-items: baseline;
        width: fit-content;
        padding: 0.4em 0.8em;
      }

      .event-date-badge .day {
        font-size: 1.2rem;
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
