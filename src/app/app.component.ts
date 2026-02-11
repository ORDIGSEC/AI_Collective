import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { ImageBreakComponent } from './components/image-break/image-break.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, EventListComponent, ImageBreakComponent, FooterComponent],
  template: `
    <app-header />
    <main class="section-light">
      <app-event-list />
    </main>
    <app-image-break
      headline="Built by Curiosity"
      subtext="Real conversations about AI, right here in the Gorge"
      imageSrc="/images/break-community.png"
      altText="Community members at an AI Collective meetup" />
    <section class="about-section" id="about" aria-labelledby="about-heading">
      <div class="about-container">
        <div class="about-grid">
          <div class="about-text">
            <h2 id="about-heading">Where <em>curiosity</em> meets community</h2>
            <p>
              The Hood River AI Collective is a grassroots meetup for anyone
              interested in artificial intelligence &mdash; from seasoned engineers
              to complete beginners. We gather twice monthly to share ideas,
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
    <app-image-break
      headline="Where the River Meets the Ridge"
      subtext="Hood River, Oregon"
      imageSrc="/images/break-gorge.jpg"
      altText="Columbia River Gorge panorama" />
    <section class="location-section section-light" id="location" aria-labelledby="location-heading">
      <div class="location-container">
        <h2 id="location-heading">Join us in <em>Hood River</em></h2>
        <p class="location-details">
          We meet twice monthly on midweek days in Hood River, Oregon.
          Check the events above for specific venues and times.
        </p>
      </div>
    </section>
    <app-footer />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
    }

    /* About Section */
    .about-section {
      padding: 5rem 0;
      position: relative;
      overflow: hidden;
      background: #f9fafb;
    }

    .about-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 1;
    }

    .about-section * {
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
      color: var(--color-light-text);
    }

    .about-section h2 em {
      color: var(--color-ember);
      font-style: italic;
    }

    .about-text p {
      color: var(--color-light-text-muted);
      margin-bottom: 1.5rem;
      font-size: 1.05rem;
      line-height: 1.7;
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
      border-radius: var(--radius-sm);
      background: rgba(255, 105, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-ember);
    }

    .about-feature h3 {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.2em;
      color: var(--color-light-text);
    }

    .about-feature p {
      font-size: 0.9rem;
      color: var(--color-light-text-muted);
      line-height: 1.5;
      margin: 0;
    }

    /* Location Section */
    .location-section {
      padding: 5rem 0;
      text-align: center;
    }

    .location-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .location-section h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      margin-bottom: 1rem;
      color: var(--color-light-text);
    }

    .location-section h2 em {
      color: var(--color-ember);
      font-style: italic;
    }

    .location-details {
      color: var(--color-light-text-muted);
      font-size: 1.05rem;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.7;
    }

    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }
  `]
})
export class AppComponent {}
