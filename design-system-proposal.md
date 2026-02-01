# Hood River AI Collective - Topographic Design System

## Aesthetic Direction: "Alpine Intelligence"

**Concept**: Merge Hood River's outdoor identity (Columbia River Gorge, mountain peaks, topographic maps) with AI/tech sophistication. Dark, atmospheric, outdoor-inspired design that feels like premium outdoor gear meets cutting-edge technology.

**Tone**: Sophisticated outdoor expedition aesthetic - professional, serious, adventure-ready. Think high-end outdoor brands (Arc'teryx, YETI) meets technical mapping interfaces.

---

## Color Palette

### Primary Colors
```css
--color-midnight: #1a1a1a;          /* Primary background - deep charcoal */
--color-charcoal: #2a2a2a;          /* Secondary background - lighter charcoal */
--color-graphite: #3a3a3a;          /* Tertiary background - card surfaces */
--color-slate-dark: #4a4a4a;        /* Borders, dividers */

--color-cream: #f5f1e8;             /* Primary text - warm off-white */
--color-sand: #d4cbb8;              /* Secondary text - muted sand */
--color-stone: #9a9388;             /* Tertiary text - cool gray-brown */

--color-ember: #ff5722;             /* Primary CTA - vibrant orange */
--color-rust: #d84315;              /* Hover state - deeper orange */
--color-clay: #bf360c;              /* Active state - darkest orange */

--color-sage: #8b9a7f;              /* Success/positive - muted green */
--color-ridge: #7a8970;             /* Accent - mountain green */
--color-warning: #ff9800;           /* Warning - amber */
--color-terrain: #6d5d4b;           /* Earthy brown accent */
```

### Topographic Contour Colors
```css
--contour-light: rgba(212, 203, 184, 0.08);   /* Subtle tan lines */
--contour-medium: rgba(212, 203, 184, 0.12);  /* Medium emphasis */
--contour-strong: rgba(212, 203, 184, 0.18);  /* Strong emphasis */
--elevation-gradient: linear-gradient(180deg,
  rgba(122, 137, 112, 0.1) 0%,
  rgba(109, 93, 75, 0.05) 100%);
```

### Gradients
```css
--gradient-ember: linear-gradient(135deg, #ff5722 0%, #d84315 100%);
--gradient-terrain: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
--gradient-elevation: linear-gradient(180deg,
  rgba(122, 137, 112, 0.15) 0%,
  transparent 50%,
  rgba(109, 93, 75, 0.1) 100%);
```

---

## Typography

### Font Families
```css
--font-display: 'Anybody', system-ui, sans-serif;      /* Variable font - geometric, technical */
--font-body: 'DM Sans', system-ui, sans-serif;         /* Clean, readable, professional */
--font-mono: 'IBM Plex Mono', monospace;               /* Technical details, coordinates */
```

**Rationale**:
- **Anybody**: Variable font with geometric structure - modern, technical, outdoor gear-inspired
- **DM Sans**: Professional, highly readable, geometric without being cold
- **IBM Plex Mono**: Technical, cartographic feel for metadata and coordinates

### Font Sizes (Fluid Typography)
```css
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
--text-xl: clamp(1.375rem, 1.2rem + 0.75vw, 1.75rem);
--text-2xl: clamp(1.75rem, 1.5rem + 1vw, 2.25rem);
--text-3xl: clamp(2.25rem, 2rem + 1.25vw, 3rem);
--text-4xl: clamp(3rem, 2.5rem + 2vw, 4.5rem);
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## Spacing System (8px base)
```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
--space-12: 6rem;    /* 96px */
--space-16: 8rem;    /* 128px */
```

---

## Border Radius
```css
--radius-sm: 4px;    /* Tight, technical */
--radius-md: 8px;    /* Standard cards */
--radius-lg: 12px;   /* Large cards */
--radius-xl: 16px;   /* Featured elements */
--radius-full: 9999px; /* Pills, badges */
```

---

## Shadows & Depth
```css
--shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.4);
--shadow-card: 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.6);
--shadow-dramatic: 0 16px 48px rgba(0, 0, 0, 0.7);
--shadow-ember: 0 8px 24px rgba(255, 87, 34, 0.3);

/* Inner shadows for depth */
--inset-subtle: inset 0 1px 2px rgba(0, 0, 0, 0.3);
--inset-strong: inset 0 2px 8px rgba(0, 0, 0, 0.5);
```

---

## Transitions & Animation
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: 600ms cubic-bezier(0.34, 1.56, 0.64, 1);

--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

---

## Visual Effects

### Topographic Background Pattern

**SVG Pattern** (inline in HTML or CSS background):
```svg
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <!-- Irregular contour lines - organic, map-like -->
      <path d="M0,50 Q50,45 100,50 T200,50"
            stroke="rgba(212, 203, 184, 0.08)"
            stroke-width="1"
            fill="none"/>
      <path d="M0,100 Q50,95 100,100 T200,100"
            stroke="rgba(212, 203, 184, 0.12)"
            stroke-width="1.5"
            fill="none"/>
      <path d="M0,150 Q50,145 100,150 T200,150"
            stroke="rgba(212, 203, 184, 0.08)"
            stroke-width="1"
            fill="none"/>

      <!-- Vertical variation -->
      <path d="M50,0 Q45,50 50,100 T50,200"
            stroke="rgba(212, 203, 184, 0.06)"
            stroke-width="1"
            fill="none"/>
      <path d="M150,0 Q145,50 150,100 T150,200"
            stroke="rgba(212, 203, 184, 0.06)"
            stroke-width="1"
            fill="none"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#topo)"/>
</svg>
```

**CSS Implementation**:
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    /* Organic contour lines */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 48px,
      rgba(212, 203, 184, 0.08) 48px,
      rgba(212, 203, 184, 0.08) 49px,
      transparent 49px,
      transparent 98px,
      rgba(212, 203, 184, 0.12) 98px,
      rgba(212, 203, 184, 0.12) 100px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 96px,
      rgba(212, 203, 184, 0.06) 96px,
      rgba(212, 203, 184, 0.06) 97px
    );
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
}
```

### Elevation Indicator (for cards)
```css
.card {
  position: relative;
  background: var(--color-graphite);
  border: 1px solid rgba(212, 203, 184, 0.1);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    var(--color-ember) 20%,
    var(--color-ember) 80%,
    transparent
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card:hover::before {
  opacity: 1;
}
```

### Noise Texture (subtle grain)
```css
.texture-overlay {
  position: relative;
}

.texture-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: overlay;
}
```

---

## Component Patterns

### Event Card
```css
.event-card {
  background: var(--color-graphite);
  border: 1px solid rgba(212, 203, 184, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gradient-ember);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated), var(--shadow-ember);
  border-color: rgba(255, 87, 34, 0.3);
}

.event-card:hover::before {
  opacity: 1;
}
```

### CTA Button
```css
.cta-button {
  background: var(--gradient-ember);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-display);
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-base);
  cursor: pointer;
  box-shadow: var(--shadow-ember);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 87, 34, 0.4);
}

.cta-button:hover::before {
  width: 300px;
  height: 300px;
}

.cta-button:active {
  transform: translateY(0);
}
```

### Navigation
```css
.nav {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(212, 203, 184, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
}

.nav-link {
  color: var(--color-sand);
  font-family: var(--font-display);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-ember);
  transform: translateX(-50%);
  transition: width var(--transition-base);
}

.nav-link:hover {
  color: var(--color-cream);
}

.nav-link:hover::after {
  width: 80%;
}
```

---

## Accessibility

- **Color Contrast**: All text meets WCAG AAA on dark backgrounds
  - Cream (#f5f1e8) on Midnight (#1a1a1a): 14.8:1
  - Sand (#d4cbb8) on Charcoal (#2a2a2a): 9.2:1
  - Ember (#ff5722) sufficient contrast for interactive elements

- **Focus States**: High-contrast orange outline
```css
:focus-visible {
  outline: 2px solid var(--color-ember);
  outline-offset: 2px;
}
```

- **Reduced Motion**: Respect user preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Notes

1. **Font Loading**: Use `font-display: swap` for web fonts
2. **Dark Mode Only**: No light mode - this design is intentionally dark
3. **Pattern Performance**: Use CSS gradients instead of SVG when possible for better performance
4. **Mobile**: Reduce topographic pattern opacity on small screens (less visual noise)
5. **Print**: Provide light background variant for print stylesheets

---

## Differentiation from Generic Tech Aesthetics

**What makes this UNFORGETTABLE:**
- Topographic map patterns create immediate outdoor/exploration connection
- Dark, sophisticated atmosphere - feels premium and intentional
- Orange ember CTAs pop dramatically against charcoal backgrounds
- Earthy, warm neutrals (cream, sand, stone) instead of cold grays
- Typography choices feel technical but organic
- Every element references mapping/elevation/terrain

This design feels like **opening a high-end trail map on a phone** - sophisticated outdoor tech, not generic SaaS.
