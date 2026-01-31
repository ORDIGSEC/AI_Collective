import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, EventListComponent, FooterComponent],
  template: `
    <app-header />
    <main>
      <app-event-list />
    </main>
    <!-- Bold river wave divider -->
    <div class="river-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C180,65 360,15 540,40 C720,65 900,15 1080,40 C1260,65 1350,25 1440,40 L1440,80 L0,80 Z"
              fill="#1E3F2B" opacity="0.15"/>
        <path d="M0,50 C160,70 320,25 480,50 C640,75 800,30 960,50 C1120,70 1280,30 1440,50 L1440,80 L0,80 Z"
              fill="#5B8A9A" opacity="0.2"/>
        <path d="M0,58 C200,72 400,40 600,58 C800,76 1000,42 1200,58 C1320,68 1380,48 1440,58 L1440,80 L0,80 Z"
              fill="#1E3F2B" opacity="0.12"/>
      </svg>
    </div>
    <section class="about-section" id="about" aria-labelledby="about-heading">
      <!-- Bold topo accent in about section -->
      <svg class="about-topo" aria-hidden="true" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMid slice">
        <g fill="none" stroke="currentColor" stroke-linecap="round">
          <path d="M200,50 Q350,80 420,150 T500,320" stroke-width="1.5" opacity="0.12"/>
          <path d="M220,40 Q360,72 430,140 T510,310" stroke-width="1.2" opacity="0.1"/>
          <path d="M240,30 Q370,65 440,130 T520,300" stroke-width="1.5" opacity="0.12"/>
          <path d="M180,60 Q340,88 410,165 T490,330" stroke-width="1" opacity="0.08"/>
          <path d="M160,70 Q330,95 400,175 T480,340" stroke-width="1.5" opacity="0.1"/>
          <path d="M140,80 Q320,100 390,185 T470,350" stroke-width="1" opacity="0.08"/>
          <ellipse cx="420" cy="200" rx="150" ry="100" stroke-width="1.5" opacity="0.12"/>
          <ellipse cx="420" cy="200" rx="110" ry="70" stroke-width="1.2" opacity="0.1"/>
          <ellipse cx="420" cy="200" rx="70" ry="42" stroke-width="1.5" opacity="0.14"/>
          <ellipse cx="420" cy="200" rx="35" ry="20" stroke-width="1.8" opacity="0.16"/>
        </g>
      </svg>
      <div class="about-container">
        <div class="about-grid">
          <div class="about-text">
            <h2 id="about-heading">Where <em>curiosity</em> meets community</h2>
            <p>
              The Hood River AI Collective is a grassroots meetup for anyone
              interested in artificial intelligence &mdash; from seasoned engineers
              to complete beginners. We gather every third Thursday to share ideas,
              demo projects, and learn together.
            </p>
            <p>
              No corporate sponsors, no gatekeeping. Just good conversations
              about how AI is shaping our world, right here in the Gorge.
            </p>
          </div>
          <ul class="about-features">
            <li class="about-feature">
              <span class="about-feature-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <div>
                <h3>Open to All</h3>
                <p>Developers, designers, educators, business owners &mdash; everyone welcome regardless of experience level.</p>
              </div>
            </li>
            <li class="about-feature">
              <span class="about-feature-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <div>
                <h3>Show &amp; Tell</h3>
                <p>Bring a project, a question, or just your curiosity. We love live demos and hands-on exploration.</p>
              </div>
            </li>
            <li class="about-feature">
              <span class="about-feature-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              <div>
                <h3>Local &amp; Global</h3>
                <p>Rooted in Hood River, connected to the wider world of AI research and open-source communities.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="location-section" id="location" aria-labelledby="location-heading">
      <!-- Bold timber beam divider -->
      <div class="timber-beam" aria-hidden="true"></div>
      <div class="location-container">
        <h2 id="location-heading">Join us in <em>Hood River</em></h2>
        <p class="location-details">
          We meet on the third Thursday of every month in Hood River, Oregon.
          Check the events above for specific venues and times.
        </p>
      </div>
    </section>
    <!-- Big mountain + tree silhouette above footer -->
    <div class="footer-mountain" aria-hidden="true">
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Far mountains -->
        <path d="M0,160 L0,110 L120,90 L240,100 L360,65 L480,80 L600,40 L720,60 L840,30 L960,50 L1080,70 L1200,55 L1320,80 L1440,65 L1440,160 Z"
              fill="#2D5A3D" opacity="0.15"/>
        <!-- Near mountains -->
        <path d="M0,160 L0,120 L100,112 L200,100 L300,108 L400,85 L500,95 L600,68 L700,82 L800,55 L900,72 L1000,60 L1100,78 L1200,68 L1300,88 L1440,78 L1440,160 Z"
              fill="#1E3F2B" opacity="0.25"/>
        <!-- Tree line -->
        <path d="M0,160 L0,135 L15,133 L25,122 L35,133 L45,128 L55,118 L65,130 L75,135 L90,130 L100,120 L110,130 L120,125 L130,115 L140,128 L150,133 L165,128 L175,118 L185,130 L195,124 L205,114 L215,126 L225,132 L240,128 L250,116 L260,128 L270,122 L280,112 L290,125 L300,132 L315,126 L325,115 L335,128 L345,120 L355,110 L365,124 L375,130 L390,125 L400,114 L410,126 L420,120 L430,108 L440,122 L450,128 L465,124 L475,112 L485,125 L495,118 L505,106 L515,120 L525,128 L540,122 L550,110 L560,124 L570,116 L580,105 L590,118 L600,126 L615,120 L625,108 L635,122 L645,115 L655,104 L665,118 L675,125 L690,120 L700,108 L710,120 L720,114 L730,102 L740,116 L750,124 L765,118 L775,106 L785,120 L795,112 L805,100 L815,114 L825,122 L840,116 L850,105 L860,118 L870,110 L880,100 L890,114 L900,122 L915,116 L925,106 L935,118 L945,112 L955,102 L965,116 L975,122 L990,118 L1000,106 L1010,120 L1020,112 L1030,102 L1040,116 L1050,124 L1065,118 L1075,108 L1085,120 L1095,114 L1105,104 L1115,118 L1125,124 L1140,120 L1150,108 L1160,122 L1170,114 L1180,105 L1190,118 L1200,126 L1215,120 L1225,110 L1235,122 L1245,116 L1255,106 L1265,120 L1275,126 L1290,122 L1300,112 L1310,124 L1320,118 L1330,108 L1340,120 L1350,128 L1365,122 L1375,114 L1385,124 L1395,118 L1405,110 L1415,122 L1425,128 L1440,125 L1440,160 Z"
              fill="#3B2F25" opacity="0.35"/>
        <!-- Ground -->
        <path d="M0,160 L0,148 L200,144 L400,146 L600,142 L800,145 L1000,140 L1200,143 L1440,141 L1440,160 Z"
              fill="#F5F0E8"/>
      </svg>
    </div>
    <app-footer />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
      z-index: 2;
    }

    main {
      flex: 1;
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }

    /* Bold river wave divider */
    .river-wave {
      line-height: 0;
    }

    .river-wave svg {
      display: block;
      width: 100%;
      height: 50px;
    }

    /* About Section */
    .about-section {
      padding: 5rem 0;
      background: var(--color-forest-deep);
      color: var(--color-cream);
      position: relative;
      overflow: hidden;
    }

    .about-topo {
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 100%;
      color: var(--color-cream);
      pointer-events: none;
    }

    .about-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      border: 1px solid rgba(245, 240, 232, 0.06);
      pointer-events: none;
    }

    .about-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 1;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .about-section h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
      color: var(--color-cream);
    }

    .about-section h2 em {
      color: var(--color-amber-light);
      font-style: italic;
    }

    .about-text p {
      color: rgba(245, 240, 232, 0.8);
      margin-bottom: 1.5rem;
      font-size: 1.05rem;
    }

    .about-features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 1.5rem;
    }

    .about-feature {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .about-feature-icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 8px;
      background: rgba(245, 240, 232, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-amber-light);
    }

    .about-feature h3 {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.2em;
      color: var(--color-cream);
    }

    .about-feature p {
      font-size: 0.9rem;
      color: rgba(245, 240, 232, 0.6);
      line-height: 1.5;
    }

    /* Location Section */
    .location-section {
      padding: 5rem 0;
      text-align: center;
    }

    /* Bold timber beam */
    .timber-beam {
      height: 6px;
      max-width: 800px;
      margin: 0 auto 3rem;
      border-radius: 3px;
      background:
        linear-gradient(90deg,
          transparent 0%,
          var(--color-bark-light) 5%,
          var(--color-bark) 12%,
          var(--color-bark-light) 20%,
          var(--color-bark) 35%,
          var(--color-bark-light) 45%,
          var(--color-bark) 55%,
          var(--color-bark-light) 65%,
          var(--color-bark) 80%,
          var(--color-bark-light) 88%,
          var(--color-bark) 95%,
          transparent 100%
        );
      opacity: 0.25;
      position: relative;
    }

    .timber-beam::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 3px;
      background:
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          rgba(255,255,255,0.08) 1px,
          transparent 2px,
          transparent 6px
        );
    }

    .location-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .location-section h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      margin-bottom: 1rem;
    }

    .location-section h2 em {
      color: var(--color-forest);
      font-style: italic;
    }

    .location-details {
      color: var(--color-stone);
      font-size: 1.05rem;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.7;
    }

    /* Footer mountain */
    .footer-mountain {
      line-height: 0;
    }

    .footer-mountain svg {
      display: block;
      width: 100%;
      height: 100px;
    }

    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .river-wave svg {
        height: 35px;
      }

      .footer-mountain svg {
        height: 70px;
      }
    }
  `]
})
export class AppComponent {}
