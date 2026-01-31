import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-inner">
        <span class="footer-brand">Hood River AI Collective</span>
        <span class="footer-text">A community meetup in the Columbia River Gorge</span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      padding: 2rem 0;
      border-top: 1px solid rgba(59, 47, 37, 0.08);
      text-align: center;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .footer-brand {
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--color-bark);
    }

    .footer-text {
      font-size: 0.85rem;
      color: var(--color-stone);
    }

    @media (max-width: 640px) {
      .footer-inner {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
