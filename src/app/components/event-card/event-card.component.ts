import { Component, Input, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ExtendedEvent } from '../../models/event.model';
import { EventCardExpandedComponent } from '../event-card-expanded/event-card-expanded.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe, EventCardExpandedComponent],
  template: `
    <article class="event-card" [class.past]="isPast" [class.expanded]="expanded()"
             [class.expandable]="event.hasExtendedData"
             (click)="event.hasExtendedData && toggleExpand()"
             [attr.role]="event.hasExtendedData ? 'button' : null"
             [attr.aria-expanded]="event.hasExtendedData ? expanded() : null"
             [tabindex]="event.hasExtendedData ? 0 : null"
             (keydown.enter)="event.hasExtendedData && toggleExpand()"
             (keydown.space)="event.hasExtendedData && $event.preventDefault(); event.hasExtendedData && toggleExpand()">
      <div class="event-date-badge">
        <span class="month">{{ event.start | date:'MMM' }}</span>
        <span class="day">{{ event.start | date:'d' }}</span>
      </div>
      <div class="event-details">
        <div class="event-header">
          <h3 class="event-title">{{ event.title }}</h3>
          @if (event.hasExtendedData) {
            <button class="expand-btn" [attr.aria-label]="expanded() ? 'Collapse details' : 'Expand details'"
                    (click)="$event.stopPropagation(); toggleExpand()" tabindex="-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   [style.transform]="expanded() ? 'rotate(180deg)' : 'rotate(0deg)'">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          }
        </div>
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
        <div class="event-actions">
          <a [href]="event.htmlLink" target="_blank" rel="noopener noreferrer" class="event-link"
             (click)="$event.stopPropagation()">
            View in Calendar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          @if (event.meetupUrl) {
            <a [href]="event.meetupUrl" target="_blank" rel="noopener noreferrer" class="meetup-link"
               (click)="$event.stopPropagation()">
              <span class="meetup-icon">👥</span>
              RSVP on Meetup
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          }
          @if (event.hasExtendedData) {
            <span class="expandable-badge">+ More Details</span>
          }
        </div>

        @if (expanded() && event.extendedData) {
          <div class="expanded-content">
            <app-event-card-expanded [data]="event.extendedData" />
          </div>
        }
      </div>
    </article>
  `,
  styles: [`
    .event-card {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 1.5rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(74, 74, 74, 0.15);
      border-left: 1px solid rgba(74, 74, 74, 0.15);
      border-radius: var(--radius-md);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all var(--transition-base);
      align-items: start;
      position: relative;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .event-card:hover {
      box-shadow: 0 8px 24px rgba(255, 87, 34, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      border-color: rgba(255, 87, 34, 0.3);
      border-left-color: var(--color-ember);
      border-left-width: 4px;
      padding-left: calc(2rem - 3px);
    }

    .event-card.past {
      opacity: 0.65;
    }

    .event-date-badge {
      background: var(--color-ember);
      color: white;
      border-radius: var(--radius-tight);
      padding: 1rem 0.5rem;
      text-align: center;
      line-height: 1.2;
      box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
    }

    .event-date-badge .month {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.85;
      display: block;
    }

    .event-date-badge .day {
      font-family: var(--font-display);
      font-size: 1.8rem;
      display: block;
    }

    .event-details {
      min-width: 0;
    }

    .event-title {
      font-size: 1.3rem;
      margin-bottom: 0.3em;
      color: var(--color-light-text);
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      color: var(--color-light-text-muted);
    }

    .event-meta span {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .event-meta svg {
      color: var(--color-light-text-muted);
    }

    .event-description {
      font-size: 0.95rem;
      color: var(--color-light-text-muted);
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-link,
    .meetup-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-ember);
      text-decoration: none;
      transition: color var(--transition-base);
    }

    .event-link:hover,
    .meetup-link:hover {
      color: var(--color-rust);
    }

    .meetup-icon {
      font-size: 1rem;
      line-height: 1;
    }

    /* Expandable card styles */
    .event-card.expandable {
      cursor: pointer;
    }

    .event-card.expandable:hover {
      box-shadow: var(--shadow-ember-strong);
      transform: translateY(-4px);
    }

    .event-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.3em;
    }

    .expand-btn {
      background: none;
      border: none;
      padding: 0.25rem;
      color: var(--color-ember);
      cursor: pointer;
      transition: all var(--transition-base);
      border-radius: var(--radius-tight);
      flex-shrink: 0;
    }

    .expand-btn:hover {
      background: rgba(255, 87, 34, 0.1);
    }

    .expand-btn svg {
      transition: transform var(--transition-spring);
      display: block;
    }

    .event-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .expandable-badge {
      font-size: 0.75rem;
      font-weight: 600;
      font-family: var(--font-mono);
      color: var(--color-ember);
      background: rgba(255, 87, 34, 0.1);
      border: 1px solid rgba(255, 87, 34, 0.2);
      padding: 0.35em 0.8em;
      border-radius: 100px;
      letter-spacing: 0.02em;
    }

    .expanded-content {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(74, 74, 74, 0.15);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      .event-card {
        grid-template-columns: 1fr;
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
export class EventCardComponent implements OnInit {
  @Input({ required: true }) event!: ExtendedEvent;
  @Input() autoExpand = false;
  expanded = signal(false);

  ngOnInit(): void {
    if (this.autoExpand && this.event.hasExtendedData) {
      this.expanded.set(true);
    }
  }

  get isPast(): boolean {
    return this.event.end < new Date();
  }

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }
}
