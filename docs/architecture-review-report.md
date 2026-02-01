# Architecture Review Report — Hood River AI Collective

**Date:** 2026-01-31
**Scope:** Full codebase review per `docs/architecture-review-prompt.md`

---

## Executive Summary

This is a small, well-structured Angular 19 SPA with ~1,200 lines of application code across 8 source files. The architecture is appropriate for the project's scope — a single-page event listing from Google Calendar. The main concerns are: **zero test coverage**, **no client-side caching** (each filter change triggers a new API call), **large inline templates/styles**, and **CSP uses `unsafe-inline`**. The codebase is clean, consistent, and would benefit from relatively minor changes to reach production maturity.

---

## 1. Repo Scan & Component Analysis

### Directory Structure

```
AI_Collective/
├── src/
│   ├── app/
│   │   ├── app.component.ts        (350 lines — 117 template, 228 styles, 1 class)
│   │   ├── app.config.ts           (9 lines)
│   │   ├── components/
│   │   │   ├── header/header.component.ts    (345 lines — 83 template, 257 styles, 0 logic)
│   │   │   ├── event-list/event-list.component.ts (247 lines — 54 template, 135 styles, 42 logic)
│   │   │   ├── event-card/event-card.component.ts (243 lines — 47 template, 185 styles, 7 logic)
│   │   │   └── footer/footer.component.ts    (103 lines — 27 template, 71 styles, 0 logic)
│   │   ├── services/
│   │   │   └── calendar.service.ts  (86 lines)
│   │   └── models/
│   │       └── event.model.ts       (34 lines)
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.scss                  (178 lines — global design tokens + resets)
│   ├── index.html
│   └── main.ts
├── nginx.conf
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/docker-build.yml
├── angular.json
└── package.json
```

### Component Responsibilities

| Component | Role | Lines | Concern |
|-----------|------|-------|---------|
| **AppComponent** | Layout shell + About/Location sections + decorative SVGs | 350 | **God component.** Contains ~117 lines of inline HTML with two content sections (about, location) and three decorative SVG dividers. ~228 lines of inline SCSS. Zero logic. |
| **HeaderComponent** | Nav bar + hero section + mountain SVG divider | 345 | Pure presentation, zero logic. ~83 lines template, ~257 lines styles. Contains extensive inline SVG (topographic contour art). |
| **EventListComponent** | Smart component: fetches events, manages filter state, renders grid | 247 | Core logic component. Properly uses Signals for state. Contains filtering/loading/error UI. |
| **EventCardComponent** | Presentational: renders a single CalendarEvent | 243 | Pure presentational with one computed property (`isPast`). Well-separated. |
| **FooterComponent** | Footer with branding | 103 | Pure presentation. |
| **CalendarService** | Google Calendar API integration + event transformation | 86 | Data layer. Three methods with duplicated URL/params construction. |
| **event.model.ts** | Type definitions | 34 | Clean interface definitions. |

### Findings

- **AppComponent is a god component by size** (350 lines) but not by logic — it has zero TypeScript. The issue is 345 lines of inline template + styles containing content sections (About, Location) that should be separate components.
- **Inline SVG art** accounts for ~40% of total template markup across components. These decorative SVGs are hardcoded rather than externalized.
- **No shared breakpoint system.** Each component defines its own media query breakpoints: 480px, 640px, 768px — inconsistent.

---

## 2. Key Entity & State Lifecycle (CalendarEvent)

### Lifecycle Diagram

```
Google Calendar API
        │
        ▼
  ┌─────────────┐   HTTP GET w/ params
  │ CalendarService │──────────────────► googleapis.com
  │  transformEvent │◄────────────────── JSON response
  └───────┬───────┘
          │  Observable<CalendarEvent[]>
          ▼
  ┌─────────────────┐
  │ EventListComponent│
  │                   │
  │  signals:         │
  │  - events[]       │ ◄── set on subscribe
  │  - loading        │ ◄── true before fetch, false after
  │  - error          │ ◄── true on failure
  │  - activeFilter   │ ◄── 'upcoming'|'past'|'all'
  └───────┬───────────┘
          │  @for loop
          ▼
  ┌─────────────────┐
  │ EventCardComponent│
  │   isPast getter   │ ◄── compares event.end < new Date()
  └─────────────────┘
```

### State Transitions

```
[Filter Click] → loading=true, error=false
     │
     ├── API Success → events=[...], loading=false
     │
     └── API Failure → error=true, loading=false
              │
              └── [Retry Click] → back to loading=true
```

### Issues

1. **No caching.** Every filter change (`all`→`upcoming`→`past`) triggers a fresh API call to Google. There's no `shareReplay`, `BehaviorSubject`, or any client-side cache. Switching between filters repeatedly will make redundant API calls.

2. **CalendarService swallows errors.** The `catchError` in each service method returns `of([])` (empty array) and logs to console. This means `EventListComponent.subscribe.error` callback **never fires** — errors look like "no events found" instead of showing the error UI. The error state in EventListComponent is dead code for service-level errors.

3. **Re-fetching is the only refresh mechanism.** No staleness detection, no periodic refresh, no `stale-while-revalidate`.

4. **Subscription leak.** `loadEvents()` calls `observable.subscribe()` without unsubscribing. Since HTTP observables complete after one emission, this is technically safe, but if the user rapidly clicks filters, multiple in-flight requests could race and the last to resolve wins regardless of order.

---

## 3. Critical Logic & Subsystem Audit (CalendarService)

### `calendar.service.ts` Analysis

**Transformation logic** (`transformEvent`, lines 14-27):
- Handles both `dateTime` and `date` formats (all-day events) via fallback: `event.start.dateTime || event.start.date || ''`
- Falls back to empty string → `new Date('')` produces `Invalid Date`. This is silently propagated and would cause broken rendering for events missing both fields.
- `event.summary || 'Untitled Event'` — good defensive default.
- `event.description || ''` and `event.location || ''` — appropriate.

**Edge cases not handled:**
- **Recurring events:** `singleEvents: 'true'` param expands recurring events, so this is handled at the API level. Correct.
- **All-day events:** `event.start.date` (no time component) is parsed but displayed with `shortTime` pipe in EventCardComponent, which would show `12:00 AM` for all-day events. No visual distinction.
- **Timezone:** `timeZone` field from Google API response is available but ignored. Dates are parsed with `new Date()` which uses the browser's local timezone. Could cause issues for events set in different timezones.
- **API rate limiting:** No handling. Would be caught by `catchError` but swallowed as empty array.
- **Malformed responses:** No runtime validation. If `response.items` is undefined/null, `response.items.map()` throws. The `GoogleCalendarResponse` type assumes `items` always exists.
- **`maxResults: '50'`** for `getEvents()` could miss events for an active calendar.

**Code duplication:** All three methods (`getEvents`, `getUpcomingEvents`, `getPastEvents`) construct the same base URL and share most params. Should be a single parameterized method.

### Date/Time Handling

- `new Date().toISOString()` for `timeMin`/`timeMax` — uses UTC. This is correct for the Google Calendar API.
- `isPast` getter in EventCardComponent: `this.event.end < new Date()` — compares Date objects directly. Correct but re-evaluates on every change detection cycle (no OnPush).
- DatePipe formatting uses browser locale. No explicit timezone or locale configuration.

---

## 4. Interface Layer Review

### Entry Points

| Entry Point | Type | Assessment |
|-------------|------|------------|
| Angular component templates (inline) | UI | Large but functional. EventListComponent handles filter logic that could live in a service. |
| CalendarService API calls | Data | Three near-identical methods with different params. |
| nginx `/health` | Ops | Returns 200 OK with plain text. Adequate for Cloud Run. |
| nginx SPA routing | Routing | `try_files $uri $uri/ /index.html` — correct for SPA. |

### Smart vs. Presentational Separation

- **EventListComponent (smart):** Correctly owns data fetching and state. However, filtering logic (choosing which service method to call) is embedded in the component. This should be a service method like `getEvents(filter: FilterType)`.
- **EventCardComponent (presentational):** Well-separated. Receives data via `@Input`. The `isPast` computed property is appropriate here.
- **HeaderComponent, FooterComponent:** Pure presentational. No issues.
- **AppComponent:** Should not contain the About and Location sections directly. These are content sections with distinct responsibilities.

### Template Complexity

Every component uses inline templates. At the current sizes (50-117 lines of HTML per component), maintainability is borderline. The SVG decorative elements inflate template sizes significantly.

---

## 5. Data & Model Review

### `event.model.ts`

```typescript
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;     // correctly optional
  location?: string;        // correctly optional
  start: { dateTime?: string; date?: string; timeZone?: string; };
  end: { dateTime?: string; date?: string; timeZone?: string; };
  htmlLink: string;
}

export interface GoogleCalendarResponse {
  kind: string;
  etag: string;
  summary: string;
  items: GoogleCalendarEvent[];  // NOT optional — will throw if missing
}
```

**Issues:**
- `items` should be `items?: GoogleCalendarEvent[]` or validated. An empty calendar or API error could return a response without `items`.
- Missing Google API fields that could be useful: `status` (confirmed/cancelled), `recurringEventId`, `creator`, `updated`.
- `CalendarEvent.start` and `CalendarEvent.end` are typed as `Date` but could hold `Invalid Date` if source data is malformed.

### Caching Opportunities

Currently zero caching. Recommended approach:
- Use `shareReplay(1)` on each service observable to cache within a session
- Or introduce a `BehaviorSubject<CalendarEvent[]>` as a simple store
- Google Calendar API supports `If-None-Match` with etag for conditional requests

---

## 6. Cross-Cutting Concerns

### Date/Time Handling
- **Inconsistent:** Service uses `new Date().toISOString()` (UTC) for API params, but `new Date(startDateTime)` for parsing (browser local timezone). The DatePipe in templates uses browser locale defaults.
- **No timezone configuration.** If the calendar is set to Pacific Time but a user views from Eastern Time, event times display in the viewer's timezone with no indication.
- **DST edge case:** `new Date()` comparison for upcoming/past is browser-local. Google API `timeMin`/`timeMax` use UTC. These should agree for all practical purposes, but there's no explicit handling.

### Error Handling
- **CalendarService silently swallows all errors** by returning `of([])`. The `EventListComponent.error` signal is set in the `subscribe.error` callback which never fires.
- Result: API failures show "No events found" instead of an error message with retry button.
- Console logging is the only error visibility.

### Accessibility
| Feature | Status |
|---------|--------|
| ARIA labels | Present on nav, sections, filter tabs, loading states |
| `role` attributes | `tablist`, `tab`, `tabpanel`, `status`, `alert`, `contentinfo` — good |
| `aria-hidden` on decorative SVGs | Yes, consistent |
| Focus styles (`:focus-visible`) | Global `outline: 2px solid amber` — good |
| Skip link | CSS class defined in `styles.scss` but **not present in any template** |
| `prefers-reduced-motion` | Handled in global styles — good |
| Keyboard navigation | Tab filter buttons are native `<button>` elements — accessible |
| Screen reader live regions | `aria-live="polite"` on loading state — good |
| Color contrast | Cream/bark palette appears sufficient, but no formal audit done |

**Issue:** The tablist/tab pattern is incomplete. Tab panels need `aria-labelledby` pointing to the active tab. `tabindex` management for arrow key navigation between tabs is missing.

### Security Headers (nginx.conf:39-43)

```
X-Frame-Options: DENY                    ✓ good
X-Content-Type-Options: nosniff          ✓ good
X-XSS-Protection: 1; mode=block         ⚠ deprecated (removed in modern browsers)
Referrer-Policy: strict-origin-when-cross-origin  ✓ good
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';    ✗ unsafe-inline should be replaced
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;  ✗ unsafe-inline
  font-src 'self' https://fonts.gstatic.com;    ✓ good
  connect-src 'self' https://www.googleapis.com; ✓ good
  img-src 'self' data:;                  ✓ good
```

**Issues:**
- `unsafe-inline` in `script-src` — Angular CLI production builds use file-based scripts, so this could be `'self'` only unless there are inline scripts.
- `unsafe-inline` in `style-src` — Required for Angular's inline component styles (ViewEncapsulation.Emulated adds `_ngcontent` attribute selectors, but the styles themselves are injected as `<style>` tags). Removing this requires switching to external stylesheets or using nonce-based CSP.
- Missing `Permissions-Policy` header.
- Missing `Strict-Transport-Security` (HSTS) header — should be added for HTTPS deployments.

### Responsive Breakpoints

| Component | Breakpoints Used |
|-----------|-----------------|
| EventListComponent | 480px |
| EventCardComponent | 640px |
| AppComponent | 768px |
| HeaderComponent | 640px |
| FooterComponent | 640px |

Three different breakpoints with no shared system. Should use CSS custom properties or a shared breakpoint mixin.

---

## 7. Resilience & Validation

### Failure Paths

| Scenario | Behavior | Severity |
|----------|----------|----------|
| Google API unreachable | `catchError` → returns `[]` → shows empty state, NOT error UI | **High** — user sees "no events" instead of error |
| API returns 403 (quota exceeded) | Same as above | **High** |
| API returns malformed JSON | HttpClient throws → caught → returns `[]` | Medium |
| `response.items` is undefined | `response.items.map()` throws TypeError → caught → returns `[]` | Medium |
| Both `start.dateTime` and `start.date` missing | `new Date('')` → Invalid Date → broken rendering | Medium |
| Rapid filter clicks | Multiple in-flight requests race; last to resolve wins | Low |

### Input Validation

- **None.** The Google API response is cast to `GoogleCalendarResponse` at the TypeScript level but has zero runtime validation.
- No schema validation library (Zod, io-ts, etc.) is used.
- The `transformEvent` method does minimal defensive coding (fallback to empty string) but doesn't validate the transformed output.

### Retry Mechanism

- User-triggered only via the "Retry" button in error state.
- Since errors are swallowed by the service, the retry button is effectively unreachable.
- No automatic retry with backoff.

---

## 8. Refactor & Roadmap

### Proposed Folder Structure

```
src/app/
├── components/
│   ├── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html      ← extract templates
│   │   └── header.component.scss      ← extract styles
│   ├── event-list/
│   ├── event-card/
│   ├── about/                         ← extract from AppComponent
│   ├── location/                      ← extract from AppComponent
│   └── footer/
├── services/
│   └── calendar.service.ts
├── models/
│   └── event.model.ts
├── shared/
│   ├── breakpoints.scss               ← shared breakpoint mixins
│   └── svg/                           ← externalized decorative SVGs
├── app.component.ts                   ← slim layout shell only
└── app.config.ts
```

### Refactor Roadmap

#### NOW (Critical)

1. **Fix error propagation.** Remove `catchError(of([]))` from CalendarService — let errors propagate to EventListComponent's `subscribe.error` handler so the error UI actually works.
2. **Add `items` null check.** Guard `response.items?.map(...)` or `(response.items || []).map(...)` to prevent TypeError on unexpected API responses.
3. **Add HSTS header** to nginx.conf.
4. **Add skip link** to `index.html` or AppComponent template (CSS is defined but unused).

#### SOON (Important)

5. **Add client-side caching.** Use `shareReplay(1)` or a BehaviorSubject to avoid redundant API calls on filter switches.
6. **Consolidate CalendarService methods** into a single parameterized `getEvents(filter?: FilterType)` method.
7. **Extract About and Location** into separate components from AppComponent.
8. **Standardize breakpoints** via shared SCSS variables or CSS custom properties.
9. **Add minimum viable test suite:** Unit tests for CalendarService transformation logic and EventListComponent state management (see Testing section below).
10. **Remove `X-XSS-Protection` header** (deprecated).

#### LATER (Nice to have)

11. **Extract inline templates/styles** to separate `.html` and `.scss` files for components over 200 lines.
12. **Add OnPush change detection** to presentational components (EventCardComponent, HeaderComponent, FooterComponent).
13. **Add runtime response validation** (Zod or type guards) for Google API responses.
14. **Replace `unsafe-inline` in CSP** — requires moving to external stylesheets or nonce-based CSP.
15. **Add Playwright E2E tests** for the critical path: page loads → events display → filter works.
16. **Externalize decorative SVGs** into asset files or a shared SVG component.
17. **Handle all-day events distinctly** in EventCardComponent (don't show "12:00 AM" times).

### Future Architecture Changes

**Adding a backend API:**
- Create `backend/` directory with Node/Express or Python/FastAPI service
- nginx proxy: add `location /api/ { proxy_pass http://backend:3000; }` to nginx.conf
- Move Google API key to backend (eliminates client-side key exposure)
- Angular calls `/api/events` instead of googleapis.com directly

**Supporting additional event sources:**
- Create an `EventSource` interface/adapter pattern in the service layer
- Each source (Google Calendar, Meetup.com, etc.) implements the adapter
- Service merges and deduplicates events from multiple sources

**Adding user authentication:**
- Firebase Auth or Auth0 — adds minimal backend requirements
- Protected routes for event management (create/edit/delete)
- Requires Angular Router (currently not used for routing)

**Test coverage from zero:**
- Priority 1: CalendarService.transformEvent (pure function, easy to test)
- Priority 2: EventListComponent state transitions (signal assertions)
- Priority 3: EventCardComponent rendering (isPast logic)
- Priority 4: E2E page load test

---

## Dependency / Data-Flow Diagram

```
┌─────────────┐
│   Browser    │
│  (User)      │
└──────┬───────┘
       │ HTTPS
       ▼
┌──────────────────┐     ┌─────────────────────────┐
│  Cloud Run       │     │  Google Calendar API     │
│  ┌────────────┐  │     │  googleapis.com/calendar │
│  │   nginx    │  │     └────────────▲────────────┘
│  │  :8080     │  │                  │
│  │            │  │                  │ HTTPS (client-side)
│  │ static SPA │──┼──────────────────┘
│  └────────────┘  │
└──────────────────┘

CI/CD Pipeline:
  GitHub (push to main)
    → GitHub Actions (docker-build.yml)
      → Docker Buildx (multi-arch: amd64, arm64)
        → GHCR (ghcr.io/ordigsec/ai_collective)
          → Cloud Run (pulls image)
```

---

## Best Practices Scorecard

| Category | Best Practice | Score | Notes |
|----------|--------------|-------|-------|
| **Architecture** | Standalone components with clear boundaries | 7/10 | Components are standalone but AppComponent is oversized |
| **Architecture** | Smart vs. presentational separation | 8/10 | EventList (smart) / EventCard (presentational) is clean |
| **State** | Centralized state for shared data | 4/10 | No caching, no store; events re-fetched on every filter change |
| **State** | Angular Signals used consistently | 7/10 | EventListComponent uses Signals well; service uses RxJS Observables (appropriate) |
| **Styling** | Extracted stylesheets vs. inline | 3/10 | All components use inline styles (100-257 lines each) |
| **Testing** | Unit tests for services/components | 0/10 | Zero test files in project source |
| **Testing** | E2E tests for critical flows | 0/10 | No E2E testing configured |
| **Performance** | Lazy loading / code splitting | 5/10 | Single-page app with no routes, so N/A. Bundle is small. |
| **Performance** | OnPush change detection | 3/10 | No component uses OnPush |
| **Security** | CSP without unsafe-inline | 4/10 | Has CSP but relies on `unsafe-inline` for scripts and styles |
| **Security** | API key exposure mitigation | 5/10 | Key is client-side (acceptable for public calendar) but no referrer restrictions documented |
| **Accessibility** | WCAG 2.1 AA compliance | 7/10 | Good ARIA, reduced-motion, focus styles. Missing skip link implementation and complete tablist pattern. |
| **DevOps** | Health checks and monitoring | 6/10 | Basic `/health` endpoint. No readiness probe, no structured logging. |
| **DevOps** | Environment configuration | 5/10 | Env files exist but identical API key in both dev/prod. No secrets management. |
| **Documentation** | Inline code documentation | 3/10 | No JSDoc/TSDoc comments. CLAUDE.md and README exist. |

**Overall Score: 4.8 / 10**

The project works well for its current scope but has significant gaps in testing, error handling, and some security hardening that should be addressed before scaling.
