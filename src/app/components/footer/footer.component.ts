import { Component, OnInit, OnDestroy, signal } from '@angular/core';

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
          <a href="https://www.meetup.com/hood-river-ai-meetup" target="_blank" rel="noopener noreferrer" aria-label="Join us on Meetup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </a>
          <a href="https://github.com/ORDIGSEC/AI_Collective" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-clawd">
          <img src="/images/clawd.png" alt="Clawd mascot" class="clawd-img" />
          <span class="clawd-text" [class.fade-out]="fading()">
            {{ currentWord() }} with
            <a href="https://claude.ai/claude-code" target="_blank" rel="noopener noreferrer">Claude Code</a>
          </span>
        </div>
        <span class="footer-credit">© {{ currentYear }} · <a href="mailto:matt&#64;hoodriveraicollective.com">matt&#64;hoodriveraicollective.com</a></span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      padding: 2rem 0 1.5rem;
      background: #f9fafb;
      color: var(--color-light-text-muted);
      border-top: 1px solid #e5e7eb;
      position: relative;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: var(--max-width);
      margin: 0 auto 1rem;
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
      color: var(--color-light-text);
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
      background: rgba(255, 105, 0, 0.08);
      border: 1px solid rgba(255, 105, 0, 0.15);
      color: var(--color-ember);
      transition: all var(--transition-spring);
      text-decoration: none;
    }

    .footer-links a:hover {
      background: var(--color-ember);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 1rem var(--gutter) 0;
      border-top: 1px solid #e5e7eb;
    }

    .footer-credit {
      font-size: 0.75rem;
      color: var(--color-stone);
      font-family: var(--font-mono);
    }

    .footer-credit a {
      color: var(--color-ember);
      text-decoration: none;
    }

    .footer-credit a:hover {
      text-decoration: underline;
    }

    .footer-clawd {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .clawd-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .clawd-text {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--color-stone);
      transition: opacity 0.3s ease;
      opacity: 1;
    }

    .clawd-text.fade-out {
      opacity: 0;
    }

    .clawd-text a {
      color: var(--color-ember);
      text-decoration: none;
    }

    .clawd-text a:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .footer-inner {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }

      .footer-brand {
        align-items: center;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  currentWord = signal('Cooked');
  fading = signal(false);

  private words = [
    'Accomplished', 'Actioned', 'Actualized', 'Baked', 'Brewed',
    'Calculated', 'Cerebrated', 'Churned', 'Clauded', 'Coalesced',
    'Cogitated', 'Computed', 'Conjured', 'Considered', 'Cooked',
    'Crafted', 'Created', 'Crunched', 'Deliberated', 'Determined',
    'Done', 'Effected', 'Finagled', 'Forged', 'Formed',
    'Generated', 'Hatched', 'Herded', 'Honked', 'Hustled',
    'Ideated', 'Inferred', 'Manifested', 'Marinated', 'Moseyed',
    'Mulled', 'Mustered', 'Mused', 'Noodled', 'Percolated',
    'Pondered', 'Processed', 'Puttered', 'Reticulated', 'Ruminated',
    'Schlepped', 'Shucked', 'Simmered', 'Smooshed', 'Spun',
    'Stewed', 'Synthesized', 'Thought', 'Transmuted', 'Vibed', 'Worked'
  ];
  private wordIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.shuffle();
    this.currentWord.set(this.words[0]);
    this.intervalId = setInterval(() => {
      this.fading.set(true);
      setTimeout(() => {
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        this.currentWord.set(this.words[this.wordIndex]);
        this.fading.set(false);
      }, 300);
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private shuffle() {
    for (let i = this.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
    }
  }
}
