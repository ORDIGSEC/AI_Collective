import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <nav class="site-nav" [class.scrolled]="isScrolled" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="Hood River AI Collective home">
          <span class="logo-text">HR AI Collective</span>
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
        <h1 id="hero-heading">
          Hood River<br>
          <em>AI Collective</em>
        </h1>
        <p class="hero-subtitle">
          A monthly gathering for builders, thinkers, and the curious
          exploring artificial intelligence in the Gorge.
        </p>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <span class="hero-meta-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <span>Twice monthly, midweek</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
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

    /* Navigation */
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      padding: 1rem 0;
      transition: all var(--transition-base);
    }

    .site-nav.scrolled {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: var(--shadow-md);
      border-bottom-color: rgba(0, 0, 0, 0.1);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--gutter);
    }

    .nav-logo {
      text-decoration: none;
      transition: transform var(--transition-base);
    }

    .nav-logo:hover {
      transform: translateY(-1px);
    }

    .logo-text {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: var(--font-weight-black);
      color: var(--color-light-text);
      letter-spacing: -0.02em;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-links a {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: var(--font-weight-bold);
      text-decoration: none;
      color: var(--color-light-text-muted);
      letter-spacing: 0.02em;
      text-transform: uppercase;
      padding: 0.5rem 0;
      position: relative;
      transition: color var(--transition-base);
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-ember);
      border-radius: 2px;
      transition: width var(--transition-spring);
    }

    .nav-links a:hover {
      color: var(--color-light-text);
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    /* Hero Section */
    .hero {
      padding: 8rem 0 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      background: url('/images/break-community.png') center/cover no-repeat;
    }

    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
    }

    .hero-inner {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 var(--gutter);
      position: relative;
      z-index: 1;
    }

    .hero h1 {
      font-size: clamp(3rem, 7vw, 5.5rem);
      color: #fff;
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
      font-weight: var(--font-weight-black);
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
      animation: fadeInUp 0.8s ease-out 0.1s both;
    }

    .hero h1 em {
      font-style: italic;
      color: var(--color-ember);
    }

    .hero-subtitle {
      font-size: clamp(1.1rem, 2vw, 1.35rem);
      color: rgba(255, 255, 255, 0.9);
      max-width: 640px;
      margin: 0 auto 3rem;
      font-weight: var(--font-weight-medium);
      line-height: 1.7;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .hero-meta {
      display: flex;
      justify-content: center;
      gap: 3rem;
      flex-wrap: wrap;
      animation: fadeInUp 0.8s ease-out 0.3s both;
    }

    .hero-meta-item {
      display: flex;
      align-items: center;
      gap: 0.6em;
      font-size: 0.95rem;
      font-weight: var(--font-weight-medium);
      color: rgba(255, 255, 255, 0.85);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-meta-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-ember);
    }

    /* Animations */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes float {
      0%, 100% { transform: translate(-50%, 0); }
      50% { transform: translate(-50%, -20px); }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .hero {
        padding: 6rem 0 4rem;
      }

      .hero-meta {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .nav-links a {
        font-size: 0.85rem;
      }
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
