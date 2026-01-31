import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <h3>Hood River AI Collective</h3>
          <p>A community of AI enthusiasts, developers, and curious minds in the Columbia River Gorge.</p>
        </div>
        <div class="footer-links">
          <h4>Connect</h4>
          <ul>
            <li>
              <a href="mailto:hello&#64;hoodriveraicollective.com">Contact Us</a>
            </li>
            <li>
              <a href="https://github.com/ORDIGSEC/AI_Collective" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
          </ul>
        </div>
        <div class="footer-location">
          <h4>Location</h4>
          <p>Hood River, Oregon</p>
          <p class="schedule">3rd Thursday of each month</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Hood River AI Collective. Built with Angular.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a2e;
      color: #a0aec0;
      padding: 3rem 2rem 1.5rem;
      margin-top: auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto 2rem;
    }

    .footer-info h3 {
      color: #fff;
      font-size: 1.125rem;
      margin: 0 0 0.75rem 0;
    }

    .footer-info p {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .footer-links h4,
    .footer-location h4 {
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 1rem 0;
    }

    .footer-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.5rem;
    }

    .footer-links a {
      color: #a0aec0;
      text-decoration: none;
      font-size: 0.9375rem;
      transition: color 0.2s ease;
    }

    .footer-links a:hover {
      color: #e94560;
    }

    .footer-location p {
      margin: 0 0 0.25rem 0;
      font-size: 0.9375rem;
    }

    .footer-location .schedule {
      color: #e94560;
      font-weight: 500;
    }

    .footer-bottom {
      border-top: 1px solid #2d3748;
      padding-top: 1.5rem;
      text-align: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-bottom p {
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 640px) {
      .footer {
        padding: 2rem 1rem 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
