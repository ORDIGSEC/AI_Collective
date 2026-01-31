# Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x or higher | JavaScript runtime |
| npm | 10.x or higher | Package manager |
| Git | 2.x or higher | Version control |
| Docker | 24.x or higher | Container testing (optional) |

### Verify Installation

```bash
node --version   # Should be v20.x.x or higher
npm --version    # Should be 10.x.x or higher
git --version    # Should be 2.x.x or higher
docker --version # Should be 24.x.x or higher (optional)
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ORDIGSEC/AI_Collective.git
cd AI_Collective
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`.

### 4. Open in Browser

Navigate to `http://localhost:4200`. The app will automatically reload when you make changes to source files.

## Project Structure

```text
AI_Collective/
├── src/
│   ├── app/
│   │   ├── components/           # UI components
│   │   │   ├── header/
│   │   │   ├── event-list/
│   │   │   ├── event-card/
│   │   │   └── footer/
│   │   ├── services/             # Business logic
│   │   │   └── calendar.service.ts
│   │   ├── models/               # TypeScript interfaces
│   │   │   └── event.model.ts
│   │   ├── app.component.ts      # Root component
│   │   └── app.config.ts         # App configuration
│   ├── environments/             # Environment configs
│   │   ├── environment.ts        # Development
│   │   └── environment.prod.ts   # Production
│   ├── styles.scss               # Global styles
│   ├── index.html                # Entry HTML
│   └── main.ts                   # Bootstrap
├── docs/                         # Documentation
├── public/                       # Static assets
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── Dockerfile                    # Container config
├── nginx.conf                    # Web server config
└── docker-compose.yml            # Local container orchestration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at localhost:4200 |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `npm test` | Run unit tests |
| `npm run watch` | Build and watch for changes |

## Development Workflow

### Making Changes

1. **Components**: Edit files in `src/app/components/`
2. **Services**: Edit files in `src/app/services/`
3. **Styles**: Global styles in `src/styles.scss`, component styles inline
4. **Configuration**: Environment files in `src/environments/`

### Hot Reload

The development server automatically reloads when you save changes:

- TypeScript changes → Full reload
- SCSS changes → Style injection (no reload)
- HTML template changes → Full reload

### Code Organization

#### Creating a New Component

```bash
# Angular CLI (if installed globally)
ng generate component components/my-component --standalone

# Or manually create files:
# src/app/components/my-component/my-component.component.ts
```

Component structure:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [],
  template: `
    <div class="my-component">
      <!-- Template here -->
    </div>
  `,
  styles: [`
    .my-component {
      /* Styles here */
    }
  `]
})
export class MyComponentComponent {}
```

#### Creating a New Service

```typescript
// src/app/services/my-service.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private http = inject(HttpClient);

  // Methods here
}
```

## Testing

### Unit Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch
```

### Manual Testing

1. Start the development server: `npm start`
2. Open `http://localhost:4200`
3. Test filter buttons (Upcoming/Past/All)
4. Verify events display correctly
5. Check responsive design at different screen sizes

### Testing with Docker

```bash
# Build the container
docker build -t ai-collective .

# Run locally
docker run -p 8080:8080 ai-collective

# Open http://localhost:8080
```

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Use the Network tab to inspect API calls
3. Use the Console for errors
4. Use the Elements tab for DOM inspection

### Angular DevTools

Install the [Angular DevTools](https://angular.io/guide/devtools) browser extension for:

- Component tree inspection
- Change detection profiling
- Dependency injection debugging

### Common Issues

#### Port Already in Use

```bash
# Find process using port 4200
lsof -i :4200

# Kill the process
kill -9 <PID>
```

#### Node Modules Issues

```bash
# Remove and reinstall
rm -rf node_modules
npm install
```

#### Build Errors

```bash
# Clear Angular cache
rm -rf .angular

# Rebuild
npm run build
```

## Code Style

### TypeScript

- Use strict mode (enabled in tsconfig.json)
- Prefer `const` over `let`
- Use explicit types for function parameters
- Use signals for reactive state

### SCSS

- Use component-scoped styles
- Follow BEM-like naming for complex components
- Use CSS custom properties for theming

### Component Guidelines

- Keep components focused and single-purpose
- Use standalone components (no NgModules)
- Inject dependencies with `inject()` function
- Use OnPush change detection when possible

## Git Workflow

### Branch Naming

```text
feature/description    # New features
fix/description        # Bug fixes
docs/description       # Documentation updates
refactor/description   # Code refactoring
```

### Commit Messages

Follow conventional commits:

```text
feat: add new event filter
fix: correct date formatting
docs: update deployment guide
refactor: simplify calendar service
```

### Pull Request Process

1. Create a feature branch
2. Make changes and commit
3. Push to remote
4. Create pull request
5. Address review feedback
6. Merge when approved

## IDE Setup

### VS Code Extensions

Recommended extensions:

- Angular Language Service
- ESLint
- Prettier
- SCSS IntelliSense

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```
