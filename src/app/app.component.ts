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
    <section class="about-section" id="about" aria-labelledby="about-heading">
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
      <div class="location-container">
        <h2 id="location-heading">Join us in <em>Hood River</em></h2>
        <p class="location-details">
          We meet on the third Thursday of every month in Hood River, Oregon.
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

    /* About Section */
    .about-section {
      padding: 5rem 0;
      background: var(--color-forest-deep);
      color: var(--color-cream);
      position: relative;
      overflow: hidden;
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

    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }
  `]
})
export class AppComponent {}
