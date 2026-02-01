# Architecture Review Prompt — Hood River AI Collective

## Context

Deep architectural evaluation of the **Hood River AI Collective** project. This is a **single-page Angular 19 application** (standalone components, no NgModules) that displays events from a public Google Calendar. Built with **Angular 19 / TypeScript 5.6 / SCSS / nginx**, deployed on **Google Cloud Run** via Docker multi-stage builds.

## Goals

**Structure & Flow:** Understand the directory structure, data flow, and responsibilities across the **presentation layer** (components, templates, inline styles), **service layer** (CalendarService, HttpClient), and **deployment layer** (Docker, nginx, Cloud Run).

**Coupling & Cohesion:** Assess whether UI rendering, API integration, data transformation, and styling are properly separated. Identify if domain logic or presentation concerns leak across layers.

**Domain Logic:** Evaluate the implementation of the **Google Calendar API integration and event transformation pipeline** — how raw Google Calendar responses are mapped to internal models, filtered by time, and rendered.

**Lifecycle & State:** Review how **CalendarEvent entities** transition through their lifecycle: fetched → transformed → filtered (upcoming/past/all) → rendered. Evaluate use of Angular Signals and RxJS Observables for state management.

**Standardization:** Review **error handling, date/time formatting, responsive breakpoints, accessibility (ARIA), and security headers** for consistency across components.

**Scalability:** Identify technical debt or patterns that may limit future goals, specifically: **adding a backend API, supporting recurring event series, adding user authentication, or integrating additional data sources beyond Google Calendar.**

## Tasks

### 1. Repo Scan & Component Analysis

- Walk the directory structure to establish a mental map of the project.
- Summarize the major components (AppComponent, HeaderComponent, EventListComponent, EventCardComponent, FooterComponent, CalendarService) and their distinct responsibilities.
- Identify areas with unclear ownership, oversized components, or excessive inline styling. Flag any "god components" (files doing too much — e.g., AppComponent at ~350 lines with embedded template and ~228 lines of inline SCSS).

### 2. Key Entity & State Lifecycle Evaluation

- Focus on the lifecycle of **CalendarEvent** (the core entity): API response → transformation → filtering → rendering → staleness.
- Trace how state transitions occur via CalendarService methods (`getEvents`, `getUpcomingEvents`, `getPastEvents`) and EventListComponent signals (`events`, `loading`, `error`, `activeFilter`).
- Identify inconsistencies: Are events re-fetched on every filter change? Is there caching? What happens on API failure mid-session?
- Suggest improvements: client-side caching, stale-while-revalidate patterns, or a centralized event store.

### 3. Critical Logic & Subsystem Audit

- Locate the code responsible for **Google Calendar API integration and event data transformation** in `calendar.service.ts`.
- Evaluate if this logic is pure, cohesive, and testable. Can the transformation logic be unit-tested independently of HttpClient?
- Identify edge cases: recurring events, all-day events, events with no description, timezone mismatches, API rate limiting, malformed API responses.
- Audit the **date/time handling**: Is timezone management consistent? Are comparisons (upcoming vs. past) robust across DST transitions?

### 4. Interface Layer Review

- Review the entry points: **Angular component templates** (inline HTML), **CalendarService API calls**, and **nginx routing**.
- Check if components contain too much business logic. Does EventListComponent handle filtering logic that should live in a service?
- Evaluate the template complexity: Are inline templates maintainable at their current sizes? Should they be extracted to separate `.html` files?
- Recommend proper layering: Component (presentation) → Service (data fetching + transformation) → Model (type definitions).

### 5. Data & Model Review

- Review how data is defined in `event.model.ts` (CalendarEvent, GoogleCalendarEvent interfaces).
- Check for correct type definitions: Are all Google Calendar API response fields properly typed? Are optional fields handled?
- **Specific concern:** Are there any unnecessary re-fetches from the Google Calendar API? Is there potential for client-side caching via RxJS operators (shareReplay, BehaviorSubject) to reduce API calls?

### 6. Cross-Cutting Concerns (Consistency Check)

- **Date/time handling:** Review how dates are parsed, formatted (12hr display), and compared across all components. Check for timezone consistency.
- **Error handling:** Is error state management consistent? Does CalendarService silently swallow errors (returns empty array) or propagate them to the UI?
- **Accessibility:** Audit ARIA labels, role attributes, keyboard navigation, focus management, and `prefers-reduced-motion` support across all components.
- **Security headers:** Review nginx CSP policy. Is `unsafe-inline` necessary? Can it be replaced with nonce-based or hash-based CSP?
- **Responsive design:** Are breakpoints consistent across components or ad-hoc? Is there a shared breakpoint system?
- Suggest centralization strategies for any inconsistencies found.

### 7. Resilience & Validation

- Identify brittle failure paths: What happens when the Google Calendar API is unreachable, rate-limited, or returns unexpected data?
- Review input validation: Is the API response validated/typed before transformation? Could malformed data cause runtime errors?
- Evaluate the retry mechanism in EventListComponent: Is it user-triggered only, or is there automatic retry with backoff?
- Suggest where schema validation (e.g., Zod or runtime type guards) should enforce invariants on API responses.

### 8. Refactor & Roadmap

- Propose an ideal folder structure for long-term maintenance (considering potential backend addition).
- Create a "Refactor Roadmap": What should be fixed now vs. later.
- Suggest specific architectural changes to support:
  - **Adding a backend API** (Node/Python service behind nginx proxy)
  - **Supporting additional event sources** beyond Google Calendar
  - **Adding user authentication** for event management
  - **Improving test coverage** from zero to meaningful

## Best Practices Evaluation

Evaluate the project against these Angular and frontend best practices:

| Category | Best Practice | Evaluate |
|----------|--------------|----------|
| **Architecture** | Standalone components with clear boundaries | Are components truly standalone with single responsibilities? |
| **Architecture** | Smart vs. presentational component separation | Is EventListComponent (smart) properly separated from EventCardComponent (presentational)? |
| **State** | Centralized state management for shared data | Should events live in a shared store/signal rather than per-component? |
| **State** | Angular Signals used consistently | Are Signals and Observables mixed without clear rationale? |
| **Styling** | Extracted stylesheets vs. inline styles | At ~200+ lines of inline SCSS per component, should styles be in separate files? |
| **Testing** | Unit tests for services and components | Zero test files exist — what's the minimum viable test suite? |
| **Testing** | E2E tests for critical user flows | No E2E testing configured — is Playwright or Cypress warranted? |
| **Performance** | Lazy loading and code splitting | Is the bundle size appropriate? Are there optimization opportunities? |
| **Performance** | OnPush change detection | Are components using OnPush where appropriate? |
| **Security** | CSP without unsafe-inline | Can the nginx CSP be tightened? |
| **Security** | API key exposure mitigation | Are there rate-limiting or referrer restrictions on the Google API key? |
| **Accessibility** | WCAG 2.1 AA compliance | Full audit of contrast ratios, focus indicators, screen reader support |
| **DevOps** | Health checks and monitoring | Is the `/health` endpoint sufficient? Should there be readiness probes? |
| **DevOps** | Environment configuration | Are env files properly separated? Is there a secrets management strategy? |
| **Documentation** | Inline code documentation | Are complex transformations in CalendarService documented? |

## Deliverables

1. A detailed architecture report covering all 8 tasks above.
2. A dependency/data-flow diagram (text-based) showing: User → Angular Components → CalendarService → Google Calendar API, plus the deployment pipeline.
3. A state diagram for **CalendarEvent** showing its lifecycle from API fetch through rendering.
4. A prioritized refactor roadmap with Now / Soon / Later categories.
5. Actionable code quality recommendations with specific file references.
6. Best practices scorecard based on the evaluation table above.

**Begin by scanning the directory and summarizing the project at a high level.**
