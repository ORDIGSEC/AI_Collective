# Development Guide

## Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| npm | 10+ | Included with Node.js |
| Git | 2+ | [git-scm.com](https://git-scm.com/) |
| Docker | 24+ | [docker.com](https://www.docker.com/) (optional) |

## Quick Start

```bash
# Clone repository
git clone https://github.com/ORDIGSEC/AI_Collective.git
cd AI_Collective

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:4200
```

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
│   ├── styles.scss               # Global styles
│   └── index.html                # Entry HTML
├── docs/                         # Documentation
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies
├── Dockerfile                    # Container config
└── nginx.conf                    # Web server config
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server at localhost:4200 |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `npm test` | Run unit tests |

## Development Workflow

### Making Changes

1. Edit files in `src/app/`
2. Save - browser auto-reloads
3. Test changes in browser
4. Commit when ready

### Creating a Component

```typescript
// src/app/components/my-component/my-component.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `<div>My Component</div>`,
  styles: [`div { padding: 1rem; }`]
})
export class MyComponentComponent {}
```

### Creating a Service

```typescript
// src/app/services/my.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MyService {
  private http = inject(HttpClient);
}
```

## Testing with Docker

```bash
# Build container
docker build -t ai-collective .

# Run locally
docker run -p 8080:8080 ai-collective

# Open http://localhost:8080
```

## Debugging

### Browser DevTools

- **Network tab**: Inspect API calls
- **Console**: View errors and logs
- **Elements**: Inspect DOM

### Common Issues

**Port in use:**

```bash
lsof -i :4200
kill -9 <PID>
```

**Node modules issues:**

```bash
rm -rf node_modules
npm install
```

**Build errors:**

```bash
rm -rf .angular
npm run build
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push -u origin feature/my-feature
```

## Code Style

- Use standalone components
- Use `inject()` for dependency injection
- Use signals for reactive state
- Keep components focused and small
- Use SCSS for styling
