import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-break',
  standalone: true,
  template: `
    <div class="image-break" [id]="sectionId || null">
      @if (videoSrc) {
        <video [src]="videoSrc" autoplay loop muted playsinline></video>
      } @else if (imageSrc) {
        <img [src]="imageSrc" [alt]="altText" loading="lazy" decoding="async" />
      }
      <div class="overlay"></div>
      <div class="content">
        <h2>{{ headline }}</h2>
        @if (subtext) {
          <p>{{ subtext }}</p>
        }
        @if (linkUrl) {
          <a [href]="linkUrl" target="_blank" rel="noopener noreferrer" class="break-link">
            {{ linkText }}
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .image-break {
      position: relative;
      height: clamp(280px, 40vh, 480px);
      overflow: hidden;
      background: linear-gradient(135deg, var(--color-midnight), var(--color-charcoal));
    }

    img, video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 2rem 1.5rem;
      text-align: center;
      box-sizing: border-box;
    }

    h2 {
      color: #fff;
      font-size: clamp(1.8rem, 4vw, 3rem);
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1rem, 2vw, 1.25rem);
      margin: 0;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    .break-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.6rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .break-link:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .image-break {
        height: clamp(220px, 35vh, 360px);
      }
    }

    @media (max-width: 640px) {
      .image-break {
        height: clamp(200px, 30vh, 300px);
      }
    }
  `]
})
export class ImageBreakComponent {
  @Input({ required: true }) headline = '';
  @Input() subtext = '';
  @Input() imageSrc = '';
  @Input() videoSrc = '';
  @Input() linkUrl = '';
  @Input() linkText = '';
  @Input() sectionId = '';
  @Input() altText = '';
}
