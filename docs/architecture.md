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

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| AppComponent | Root layout, composes page structure |
| HeaderComponent | Site branding, tagline |
| EventListComponent | Fetches events, manages filters, displays list |
| EventCardComponent | Displays individual event details |
| FooterComponent | Contact info, links, copyright |

## Service Architecture

### CalendarService

The CalendarService handles all communication with Google Calendar API.

```typescript
@Injectable({ providedIn: 'root' })
export class CalendarService {
  getEvents(): Observable<CalendarEvent[]>
  getUpcomingEvents(): Observable<CalendarEvent[]>
  getPastEvents(): Observable<CalendarEvent[]>
}
```

**Features:**

- Transforms Google Calendar API response to typed `CalendarEvent` objects
- Handles API errors gracefully
- Uses RxJS for reactive data flow

### Data Flow

```text
User Action → Component Method → Service Call → HTTP Request
                                                     ↓
UI Update ← Signal Update ← Transform Response ← API Response
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

## Security

### API Key Exposure

The Google Calendar API key is exposed in the browser. This is acceptable because:

1. The calendar is public (anyone can view events)
2. The API key is restricted to Google Calendar API only
3. Google applies rate limiting to prevent abuse

### Security Headers

nginx includes these security headers:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Content-Security-Policy` - Controls resource loading

## Performance

### Build Optimizations

- Tree shaking removes unused code
- Minification reduces bundle size
- Content hashing enables aggressive caching

### Runtime Optimizations

- Gzip compression for text assets
- Long cache headers for static assets (1 year)
- nginx serves static files efficiently

## Deployment Architecture

```text
                    Internet
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
```

## Extensibility

### Adding a Backend

If server-side functionality is needed:

1. Create backend service (Node.js, Python, Go)
2. Add to `docker-compose.yml` on internal network
3. Update `nginx.conf` to proxy `/api/*` to backend
4. Deploy as separate Cloud Run service
5. Update Angular to use backend URL
