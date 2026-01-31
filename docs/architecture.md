# Architecture

## Overview

The Hood River AI Collective website is a client-side Angular application that fetches event data directly from Google Calendar API. There is no backend service - the entire application runs in the browser.

```text
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Angular Application                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │    │
│  │  │  Header  │  │EventList │  │EventCard │  │ Footer  │ │    │
│  │  └──────────┘  └────┬─────┘  └──────────┘  └─────────┘ │    │
│  │                     │                                    │    │
│  │              ┌──────┴──────┐                            │    │
│  │              │CalendarSvc  │                            │    │
│  │              └──────┬──────┘                            │    │
│  └─────────────────────┼───────────────────────────────────┘    │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTPS
                         ▼
          ┌──────────────────────────────┐
          │   Google Calendar API v3     │
          │   (Public Calendar + API Key)│
          └──────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Angular 19 | UI framework with standalone components |
| Styling | SCSS | Custom design system |
| HTTP | Angular HttpClient | API communication |
| State | Angular Signals | Reactive state management |
| Build | Angular CLI | Development and production builds |
| Server | nginx | Static file serving with SPA routing |
| Container | Docker | Containerization for deployment |
| Hosting | Google Cloud Run | Serverless container hosting |

## Component Architecture

### Core Components

```text
AppComponent (root)
├── HeaderComponent
│   └── Site branding and navigation
├── EventListComponent
│   ├── Filter buttons (Upcoming/Past/All)
│   ├── Loading state
│   ├── Error handling
│   └── EventCardComponent[] (repeated)
│       ├── Event date display
│       ├── Event details
│       └── Calendar link
└── FooterComponent
    └── Contact info and links
```

### Component Details

#### AppComponent

- Root component that composes the page layout
- Manages overall page structure (header, main, footer)
- Uses flexbox for sticky footer layout

#### HeaderComponent

- Displays site branding ("Hood River AI Collective")
- Shows tagline describing the meetup
- Responsive design for mobile/desktop

#### EventListComponent

- Fetches events from CalendarService
- Manages filter state (upcoming/past/all)
- Handles loading and error states
- Uses Angular signals for reactive updates

#### EventCardComponent

- Displays individual event information
- Shows date, time, location, description
- Links to Google Calendar event
- Applies "past" styling for completed events

#### FooterComponent

- Contact information
- GitHub repository link
- Copyright and attribution

## Service Architecture

### CalendarService

The CalendarService is responsible for all communication with Google Calendar API.

```typescript
@Injectable({ providedIn: 'root' })
export class CalendarService {
  // Fetches all events
  getEvents(): Observable<CalendarEvent[]>

  // Fetches only future events
  getUpcomingEvents(): Observable<CalendarEvent[]>

  // Fetches only past events
  getPastEvents(): Observable<CalendarEvent[]>
}
```

**Key Features:**

- Transforms Google Calendar API response to typed `CalendarEvent` objects
- Handles API errors gracefully
- Falls back to mock data when API is not configured
- Uses RxJS for reactive data flow

### Data Flow

```text
User clicks filter button
        │
        ▼
EventListComponent.filterEvents()
        │
        ▼
CalendarService.getUpcomingEvents()
        │
        ▼
HTTP GET to Google Calendar API
        │
        ▼
Transform response to CalendarEvent[]
        │
        ▼
Update component signal
        │
        ▼
Angular re-renders EventCardComponent[]
```

## Data Models

### CalendarEvent

```typescript
interface CalendarEvent {
  id: string;           // Unique event identifier
  title: string;        // Event title/summary
  description: string;  // Event description
  location: string;     // Event location
  start: Date;          // Start date/time
  end: Date;            // End date/time
  htmlLink: string;     // Link to Google Calendar
}
```

### Google Calendar API Response

The service transforms the Google Calendar API response format to our internal model:

```typescript
interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; };
  end: { dateTime?: string; date?: string; };
  htmlLink: string;
}
```

## Security Considerations

### API Key Exposure

The Google Calendar API key is exposed in the browser. This is acceptable because:

1. The calendar is public (anyone can view events)
2. The API key is restricted to Google Calendar API only
3. Google applies rate limiting to prevent abuse
4. No sensitive data is accessed

### Content Security Policy

The nginx configuration includes CSP headers:

```nginx
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://www.googleapis.com;
```

### Additional Security Headers

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`

## Performance Optimizations

### Build Optimizations

- Production build with `--configuration=production`
- Tree shaking removes unused code
- Minification reduces bundle size
- Content hashing enables aggressive caching

### Runtime Optimizations

- nginx gzip compression for text assets
- Long cache headers for static assets (1 year)
- Lazy loading ready (single route currently)
- OnPush change detection via signals

### Caching Strategy

```text
index.html          → no-cache (always fresh)
*.js, *.css         → 1 year cache (hashed filenames)
fonts               → 1 year cache
images              → 1 year cache
```

## Extensibility

### Adding a Backend

If server-side functionality is needed:

1. Create a backend service (Node.js, Python, Go)
2. Add to `docker-compose.yml` on internal network
3. Update `nginx.conf` to proxy `/api/*` to backend
4. Deploy as separate Cloud Run service
5. Update Angular environment to use backend URL

### Adding Features

The modular architecture supports easy additions:

- **New pages**: Add routes in `app.routes.ts`
- **New components**: Create in `components/` directory
- **New services**: Create in `services/` directory
- **New API integrations**: Follow CalendarService pattern

## Diagram: Deployment Architecture

```text
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │   Cloudflare   │  (Optional: DNS, CDN, DDoS)
              │   or Direct    │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │  Cloud Run     │
              │  ┌──────────┐  │
              │  │  nginx   │  │  Port 8080
              │  │ container│  │
              │  └────┬─────┘  │
              │       │        │
              │  Static files  │
              │  (Angular SPA) │
              └────────────────┘
                      │
                      │ (browser fetches)
                      ▼
              ┌────────────────┐
              │ Google Calendar│
              │     API        │
              └────────────────┘
```
