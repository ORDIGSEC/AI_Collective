# Contributing to Hood River AI Collective

Thank you for your interest in contributing to the Hood River AI Collective website! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Protection Rules](#branch-protection-rules)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Code of Conduct

This project is intended for the Hood River, Oregon AI community. We expect all contributors to be respectful, collaborative, and constructive in their interactions.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git
- GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI_Collective.git
   cd AI_Collective
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORDIGSEC/AI_Collective.git
   ```

---

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your changes:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow the project's coding standards and make your changes. Test locally before committing.

### 3. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add event registration form"
```

See [Commit Message Guidelines](#commit-message-guidelines) below.

### 4. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to the repository on GitHub
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit for review

### 6. Address Review Comments

- Respond to reviewer feedback
- Make requested changes
- Push updates to your branch (PR updates automatically)

### 7. Merge

Once approved and CI passes, a maintainer will merge your PR.

---

## Branch Protection Rules

The `main` branch is protected with the following rules:

### 🛡️ Protection Enabled

- ✅ **Pull Requests Required** - Direct pushes to main are blocked
- ✅ **1 Approval Required** - At least one reviewer must approve
- ✅ **Status Checks Required** - CI must pass before merging
  - Frontend build must succeed
  - Backend build must succeed
- ✅ **Stale Review Dismissal** - New commits invalidate previous approvals
- ❌ **Force Pushes Blocked** - No `git push --force` to main
- ❌ **Deletions Blocked** - Cannot delete main branch

### What This Means

- You **cannot** push directly to main
- You **must** create a pull request
- Your PR **must** pass CI checks
- Your PR **must** be reviewed and approved
- After approval and passing checks, it can be merged

---

## Coding Standards

### Frontend (Angular)

- Use TypeScript strict mode
- Follow Angular style guide: https://angular.dev/style-guide
- Use standalone components (no NgModules)
- Write meaningful component and variable names
- Add JSDoc comments for public APIs

### Backend (Node.js)

- Use TypeScript
- Follow Express.js best practices
- Validate all user inputs
- Use environment variables for configuration
- Write meaningful function and variable names

### General Guidelines

- **No hardcoded secrets** - Use environment variables
- **Keep it simple** - Avoid over-engineering
- **Write tests** - For new features and bug fixes
- **Document** - Add comments for complex logic
- **Format** - Use consistent formatting (Prettier)

### Design System

The design system ("Clean Outdoor") is documented in `CLAUDE.md` under "Design System". Key points:
- Light mode only, flat design, no glassmorphism
- Colors via CSS variables — orange accent (`--color-ember`), no blue
- System font stack — no Google Fonts
- Pill-shaped buttons, subtle shadows, generous white space

---

## Commit Message Guidelines

We follow the Conventional Commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

### Examples

```bash
# Simple commit
git commit -m "feat: add newsletter signup form"

# With scope
git commit -m "fix(backend): resolve database connection timeout"

# With body
git commit -m "feat: add event filtering

Allow users to filter events by date range and category.
Includes both frontend UI and backend API changes."

# Breaking change
git commit -m "feat!: migrate to new Calendar API

BREAKING CHANGE: Requires new API key configuration.
See DEPLOYMENT.md for migration instructions."
```

---

## Pull Request Process

### Before Creating a PR

1. ✅ Test your changes locally
2. ✅ Run tests: `npm test`
3. ✅ Check for linting errors
4. ✅ Update documentation if needed
5. ✅ Rebase on latest main if needed

### PR Title

Use the same format as commit messages:

```
feat: add event filtering functionality
fix: resolve calendar loading issue
docs: update deployment instructions
```

### PR Description Template

```markdown
## Description
Brief description of your changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Changes Made
- List key changes
- Be specific about what was modified

## Testing
- Describe how you tested your changes
- Include screenshots if UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages follow conventions
```

### Review Process

1. **Automated Checks** - CI runs automatically
   - Frontend build
   - Backend build
   - Tests (when implemented)

2. **Code Review** - At least 1 approval required
   - Reviewer checks code quality
   - Reviewer tests functionality
   - Reviewer provides feedback

3. **Address Feedback** - Make requested changes
   - Push updates to your branch
   - Respond to comments

4. **Approval** - Once approved and CI passes
   - Maintainer will merge
   - Your branch can be deleted

---

## Development Setup

See **[docs/development.md](docs/development.md)** for complete development setup instructions including:
- Frontend and backend development servers
- Docker Compose local testing
- IDE configuration and debugging tips
- Creating new components and services

---

## Testing

### Run Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# End-to-end tests (if implemented)
npm run e2e
```

### Writing Tests

- Write unit tests for new functions
- Write integration tests for API endpoints
- Write E2E tests for critical user flows

---

## Deployment

This project uses automated CI/CD:

1. **Push to main** → GitHub Actions builds images
2. **Images pushed** → GitHub Container Registry (GHCR)
3. **Watchtower detects** → Auto-deploys within 3 minutes
4. **Live site updated** → https://hoodriveraicollective.com

**You don't need to manually deploy.** Just merge your PR!

See `DEPLOYMENT.md` for detailed deployment documentation.

---

## Getting Help

### Resources

- **Documentation**: See `README.md`, `CLAUDE.md`, `DEPLOYMENT.md`
- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions

### Contact

- **Project Maintainer**: @ORDIGSEC
- **Website**: https://hoodriveraicollective.com
- **GitHub**: https://github.com/ORDIGSEC/AI_Collective

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation (for significant contributions)

Thank you for contributing to the Hood River AI Collective! 🎉
