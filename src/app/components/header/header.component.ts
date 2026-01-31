import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <nav class="site-nav" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="Hood River AI Collective home">
          HR AI Collective
        </a>
        <ul class="nav-links">
          <li><a href="#events">Events</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#location">Location</a></li>
        </ul>
      </div>
    </nav>
    <header class="hero" aria-labelledby="hero-heading">
      <div class="hero-inner">
        <span class="hero-badge" aria-hidden="true">Hood River, Oregon</span>
        <h1 id="hero-heading">Hood River<br><em>AI Collective</em></h1>
        <p class="hero-subtitle">
          A monthly gathering for builders, thinkers, and the curious
          exploring artificial intelligence in the Gorge.
        </p>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <span class="hero-meta-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <span>3rd Thursday of each month</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span>Hood River, Oregon</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .site-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(245, 240, 232, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(59, 47, 37, 0.08);
      padding: 1rem 0;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .nav-logo {
      font-family: var(--font-display);
      font-size: 1.25rem;
      color: var(--color-bark);
      text-decoration: none;
      letter-spacing: -0.02em;
    }

    .nav-logo:hover {
      color: var(--color-forest);
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-links a {
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--color-bark-light);
      letter-spacing: 0.02em;
      text-transform: uppercase;
      padding: 0.5rem 0;
      position: relative;
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-amber);
      transition: width var(--transition-base);
    }

    .nav-links a:hover {
      color: var(--color-bark);
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    .hero {
      padding: 6rem 0 4rem;
      text-align: center;
      position: relative;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(240, 200, 120, 0.12) 0%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }

    .hero-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-forest);
      background: rgba(45, 90, 61, 0.08);
      padding: 0.5em 1.2em;
      border-radius: 100px;
      margin-bottom: 2.5rem;
      animation: fadeInDown 0.8s ease-out;
    }

    .hero-badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-forest-light);
      animation: pulse 2s ease-in-out infinite;
    }

    .hero h1 {
      font-size: clamp(3rem, 7vw, 5.5rem);
      color: var(--color-bark);
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
      animation: fadeInUp 0.8s ease-out 0.1s both;
    }

    .hero h1 em {
      font-style: italic;
      color: var(--color-forest);
    }

    .hero-subtitle {
      font-size: clamp(1.1rem, 2vw, 1.35rem);
      color: var(--color-stone);
      max-width: 580px;
      margin: 0 auto 2.5rem;
      font-weight: 300;
      line-height: 1.6;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .hero-meta {
      display: flex;
      justify-content: center;
      gap: 2.5rem;
      flex-wrap: wrap;
      animation: fadeInUp 0.8s ease-out 0.3s both;
    }

    .hero-meta-item {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-size: 0.95rem;
      color: var(--color-bark-light);
    }

    .hero-meta-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-amber);
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (max-width: 640px) {
      .hero {
        padding: 4rem 0 3rem;
      }

      .hero-meta {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class HeaderComponent {}
