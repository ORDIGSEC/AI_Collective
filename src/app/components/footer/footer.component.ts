import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-text">Hood River AI Collective</span>
          <span class="footer-tagline">Building the future in the Gorge</span>
        </div>
        <div class="footer-links">
          <a href="mailto:matt@hoodriveraicollective.com" aria-label="Email us">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
          <a href="https://github.com/hood-river-ai" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="footer-credit">
        <span>© {{ currentYear }} Hood River AI Collective</span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      padding: 3rem 0 2rem;
      background: var(--color-midnight);
      color: var(--color-sand);
      border-top: 1px solid var(--contour-medium);
      position: relative;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: var(--max-width);
      margin: 0 auto 2rem;
      padding: 0 var(--gutter);
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .brand-text {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-cream);
    }

    .footer-tagline {
      font-size: 0.875rem;
      color: var(--color-stone);
      font-family: var(--font-mono);
      letter-spacing: 0.02em;
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .footer-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 87, 34, 0.1);
      border: 1px solid rgba(255, 87, 34, 0.2);
      color: var(--color-ember);
      transition: all var(--transition-spring);
      text-decoration: none;
    }

    .footer-links a:hover {
      background: var(--color-ember);
      color: var(--color-cream);
      transform: translateY(-3px) scale(1.05);
      box-shadow: var(--shadow-ember-glow);
    }

    .footer-credit {
      text-align: center;
      padding: 1.5rem var(--gutter) 0;
      border-top: 1px solid var(--contour-light);
      max-width: var(--max-width);
      margin: 0 auto;
      font-size: 0.8rem;
      color: var(--color-stone);
      font-family: var(--font-mono);
    }

    @media (max-width: 640px) {
      .footer-inner {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }

      .footer-brand {
        align-items: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
