import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon" aria-hidden="true">&#9650;</span>
          <h1>Hood River AI Collective</h1>
        </div>
        <p class="tagline">Monthly meetup exploring artificial intelligence in the Columbia River Gorge</p>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 3rem 2rem;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .logo-icon {
      font-size: 2rem;
      color: #e94560;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .tagline {
      margin: 0;
      font-size: 1.125rem;
      color: #a0aec0;
      font-weight: 400;
    }

    @media (max-width: 640px) {
      .header {
        padding: 2rem 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .tagline {
        font-size: 1rem;
      }
    }
  `]
})
export class HeaderComponent {}
