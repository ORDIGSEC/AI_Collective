# Documentation

Welcome to the Hood River AI Collective website documentation.

## Contents

- [Architecture](./architecture.md) - System design and component overview
- [Development](./development.md) - Local development setup and workflow
- [Configuration](./configuration.md) - Environment variables and settings
- [Deployment](./deployment.md) - Cloud Run deployment guide

## Quick Links

| Topic | Description |
|-------|-------------|
| [Getting Started](./development.md#quick-start) | Set up local development |
| [Environment Setup](./configuration.md#environment-files) | Configure API keys |
| [Deploy to Cloud Run](./deployment.md#deploying-to-cloud-run) | Production deployment |
| [Docker Build](./deployment.md#docker) | Container configuration |

## Project Overview

This is an Angular 19 single-page application that displays meetup events from Google Calendar. The app is designed to be:

- **Simple** - No backend required; calls Google Calendar API directly
- **Fast** - Static files served via nginx with aggressive caching
- **Scalable** - Deployed on Cloud Run with auto-scaling
- **Cost-effective** - Scales to zero when idle

## Support

For questions or issues, open an issue in the [GitHub repository](https://github.com/ORDIGSEC/AI_Collective).
