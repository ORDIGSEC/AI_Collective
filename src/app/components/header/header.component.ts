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
      <!-- Bold topographic contour background -->
      <svg class="topo-bg" aria-hidden="true" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" stroke-linecap="round">
          <!-- Outer contours -->
          <path d="M-50,250 Q100,150 200,200 T400,170 T600,220 T850,160" stroke-width="1.5" opacity="0.18"/>
          <path d="M-50,270 Q120,180 220,220 T420,190 T620,240 T850,180" stroke-width="1.2" opacity="0.15"/>
          <path d="M-50,290 Q80,210 200,240 T400,220 T600,260 T850,210" stroke-width="1.5" opacity="0.18"/>
          <path d="M-50,310 Q140,230 240,260 T440,240 T640,280 T850,230" stroke-width="1" opacity="0.13"/>
          <path d="M-50,330 Q100,260 200,290 T400,270 T600,310 T850,260" stroke-width="1.5" opacity="0.16"/>
          <path d="M-50,200 Q150,110 250,160 T450,130 T650,180 T850,120" stroke-width="1.2" opacity="0.14"/>
          <path d="M-50,170 Q120,80 240,130 T460,100 T660,150 T850,90" stroke-width="1" opacity="0.12"/>
          <path d="M-50,140 Q160,60 260,100 T480,70 T680,120 T850,60" stroke-width="0.8" opacity="0.1"/>
          <path d="M-50,350 Q130,280 230,310 T430,290 T630,330 T850,280" stroke-width="1.2" opacity="0.14"/>
          <path d="M-50,380 Q100,310 220,340 T420,310 T640,350 T850,310" stroke-width="1" opacity="0.12"/>
          <path d="M-50,400 Q140,340 240,360 T440,340 T640,380 T850,340" stroke-width="0.8" opacity="0.1"/>
          <!-- Topo summit rings -->
          <ellipse cx="400" cy="230" rx="300" ry="140" stroke-width="1.5" opacity="0.16"/>
          <ellipse cx="400" cy="230" rx="240" ry="110" stroke-width="1.2" opacity="0.14"/>
          <ellipse cx="400" cy="230" rx="180" ry="80" stroke-width="1.5" opacity="0.18"/>
          <ellipse cx="400" cy="230" rx="120" ry="52" stroke-width="1.2" opacity="0.15"/>
          <ellipse cx="400" cy="230" rx="65" ry="28" stroke-width="1.5" opacity="0.2"/>
          <ellipse cx="400" cy="230" rx="25" ry="10" stroke-width="1.8" opacity="0.22"/>
        </g>
      </svg>
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
    <!-- Bold mountain silhouette with tree line -->
    <div class="mountain-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Far range - lighter -->
        <path d="M0,200 L0,140 L80,120 L140,130 L220,90 L300,110 L380,60 L440,85 L520,40 L580,65 L660,25 L720,50 L800,15 L860,40 L940,55 L1020,35 L1100,60 L1180,45 L1260,75 L1340,55 L1440,80 L1440,200 Z"
              fill="#2D5A3D" opacity="0.2"/>
        <!-- Mid range -->
        <path d="M0,200 L0,155 L100,140 L180,150 L260,115 L340,130 L420,80 L500,105 L580,60 L660,85 L740,45 L800,65 L880,35 L960,60 L1040,75 L1120,55 L1200,80 L1280,65 L1360,95 L1440,80 L1440,200 Z"
              fill="#1E3F2B" opacity="0.35"/>
        <!-- Tree line silhouette -->
        <path d="M0,200 L0,170 L20,168 L30,155 L40,168 L50,160 L60,148 L70,162 L80,170 L100,165 L110,152 L120,164 L130,158 L140,145 L150,160 L160,168 L180,162 L190,148 L200,160 L210,155 L220,140 L230,158 L240,165 L260,160 L270,146 L280,162 L290,155 L300,142 L310,158 L320,165 L340,158 L350,145 L360,160 L370,152 L380,138 L390,155 L400,162 L420,156 L430,142 L440,158 L450,150 L460,136 L470,152 L480,160 L500,155 L510,140 L520,156 L530,148 L540,134 L550,150 L560,158 L580,152 L590,138 L600,154 L610,146 L620,132 L630,148 L640,156 L660,150 L670,135 L680,152 L690,144 L700,130 L710,146 L720,155 L740,148 L750,133 L760,150 L770,142 L780,128 L790,144 L800,152 L820,148 L830,134 L840,150 L850,142 L860,130 L870,146 L880,154 L900,148 L910,136 L920,152 L930,144 L940,132 L950,148 L960,156 L980,150 L990,138 L1000,154 L1010,146 L1020,135 L1030,150 L1040,158 L1060,152 L1070,140 L1080,155 L1090,148 L1100,136 L1110,152 L1120,160 L1140,154 L1150,142 L1160,156 L1170,148 L1180,138 L1190,152 L1200,160 L1220,155 L1230,144 L1240,158 L1250,150 L1260,140 L1270,155 L1280,162 L1300,156 L1310,145 L1320,158 L1330,152 L1340,142 L1350,156 L1360,163 L1380,158 L1390,148 L1400,160 L1410,155 L1420,145 L1430,158 L1440,165 L1440,200 Z"
              fill="#1E3F2B" opacity="0.55"/>
        <!-- Near ground -->
        <path d="M0,200 L0,180 L200,175 L400,178 L600,172 L800,176 L1000,170 L1200,174 L1440,172 L1440,200 Z"
              fill="#F5F0E8"/>
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .site-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(245, 240, 232, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(59, 47, 37, 0.08);
      padding: 1rem 0;
    }

    /* Bold wood grain accent on nav bottom */
    .site-nav::after {
      content: '';
      position: absolute;
      bottom: -1px;
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
      padding: 6rem 0 5rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      background: linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-dark) 100%);
    }

    .topo-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      color: var(--color-forest);
      pointer-events: none;
      z-index: 0;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 145, 59, 0.15) 0%, rgba(240, 200, 120, 0.08) 40%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .hero-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 1;
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
      background: rgba(45, 90, 61, 0.1);
      border: 1px solid rgba(45, 90, 61, 0.12);
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

    .mountain-divider {
      margin-top: -2px;
      line-height: 0;
      background: var(--color-cream-dark);
    }

    .mountain-divider svg {
      display: block;
      width: 100%;
      height: 120px;
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

      .mountain-divider svg {
        height: 80px;
      }
    }
  `]
})
export class HeaderComponent {}
