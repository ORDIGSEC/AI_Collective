import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer" role="contentinfo">
      <!-- Topo accent in footer -->
      <svg class="footer-topo" aria-hidden="true" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" stroke-linecap="round">
          <path d="M0,80 Q200,50 400,80 T800,70" stroke-width="1.2" opacity="0.08"/>
          <path d="M0,90 Q200,60 400,90 T800,80" stroke-width="1" opacity="0.06"/>
          <path d="M0,100 Q200,70 400,100 T800,90" stroke-width="1.2" opacity="0.08"/>
          <path d="M0,110 Q200,80 400,110 T800,100" stroke-width="1" opacity="0.06"/>
          <path d="M0,120 Q200,90 400,120 T800,110" stroke-width="1.2" opacity="0.08"/>
          <path d="M0,130 Q200,100 400,130 T800,120" stroke-width="1" opacity="0.06"/>
          <path d="M0,140 Q200,110 400,140 T800,130" stroke-width="0.8" opacity="0.05"/>
          <ellipse cx="600" cy="110" rx="100" ry="50" stroke-width="1" opacity="0.06"/>
          <ellipse cx="600" cy="110" rx="60" ry="30" stroke-width="1.2" opacity="0.08"/>
          <ellipse cx="600" cy="110" rx="25" ry="12" stroke-width="1.5" opacity="0.1"/>
        </g>
      </svg>
      <div class="footer-inner">
        <span class="footer-brand">Hood River AI Collective</span>
        <span class="footer-text">A community meetup in the Columbia River Gorge</span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      padding: 2.5rem 0;
      border-top: 1px solid rgba(59, 47, 37, 0.08);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    /* Bold wood grain top border */
    .site-footer::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      right: 0;
      height: 4px;
      background:
        repeating-linear-gradient(
          90deg,
          var(--color-bark) 0px,
          var(--color-bark-light) 1px,
          var(--color-bark) 3px,
          rgba(92, 74, 58, 0.3) 4px,
          var(--color-bark) 5px,
          transparent 5px,
          transparent 8px
        );
      opacity: 0.3;
    }

    .footer-topo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: var(--color-bark);
      pointer-events: none;
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
      position: relative;
      z-index: 1;
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
