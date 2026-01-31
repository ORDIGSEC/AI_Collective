# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for automated building and deployment.

## Workflows

### `docker-build.yml` - Docker Image Build and Push

Automatically builds the Docker image and pushes it to GitHub Container Registry (ghcr.io).

**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Manual workflow dispatch

**What it does:**
1. Checks out the repository
2. Sets up Docker Buildx for multi-platform builds
3. Logs into GitHub Container Registry (ghcr.io)
4. Builds the Docker image for linux/amd64 and linux/arm64
5. Pushes the image to `ghcr.io/ordigsec/hrmeetup-website`
6. Tags images with:
   - `latest` (for main branch)
   - `main` (branch name)
   - `main-<sha>` (commit SHA)

**Registry:** `ghcr.io/ordigsec/hrmeetup-website`

## Using the Built Image

### On Your Server

The docker-compose.yml is configured to pull from ghcr.io by default:

```bash
# Pull latest image and restart
docker compose pull
docker compose up -d
```

### Making the Image Public

By default, GitHub Container Registry images are private. To make the image public:

1. Go to https://github.com/orgs/ORDIGSEC/packages
2. Find `hrmeetup-website`
3. Click "Package settings"
4. Scroll to "Danger Zone"
5. Click "Change visibility" → "Public"

### Manual Workflow Run

To manually trigger a build:

1. Go to https://github.com/ORDIGSEC/hrmeetup-website/actions
2. Click "Build and Push Docker Image"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Deployment Workflow

```
Code Push → GitHub Actions → Build Image → Push to ghcr.io → Pull on Server → Deploy
```

## Local Development

To build locally (requires working Docker Hub access):

```bash
# Edit docker-compose.yml to use build instead of image
# Uncomment: build: .
# Comment: image: ghcr.io/ordigsec/hrmeetup-website:latest

docker compose build
docker compose up -d
```

## Troubleshooting

**"Error: resource not accessible by integration"**
- Check repository settings → Actions → General
- Ensure "Read and write permissions" is enabled for workflows

**"Error: denied: permission_denied"**
- The package might be private
- Make it public (see "Making the Image Public" above)
- Or configure GitHub token with package read permissions

**Image not updating**
- Check Actions tab for build status
- Verify the workflow completed successfully
- Force pull: `docker compose pull && docker compose up -d --force-recreate`
