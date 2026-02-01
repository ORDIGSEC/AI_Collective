import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventExtendedData } from '../../models/event.model';

@Component({
  selector: 'app-event-card-expanded',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card-expanded.component.html',
  styleUrl: './event-card-expanded.component.scss'
})
export class EventCardExpandedComponent {
  @Input() data?: EventExtendedData;

  getResourceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      slide: '📊',
      code: '💻',
      article: '📄',
      video: '🎥'
    };
    return icons[type] || '🔗';
  }
}
