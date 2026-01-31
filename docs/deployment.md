# Deployment Guide

This guide covers deploying the Hood River AI Collective website to Google Cloud Run.

## Prerequisites

### Required Tools

| Tool | Installation |
|------|--------------|
| Google Cloud SDK | [Install gcloud](https://cloud.google.com/sdk/docs/install) |
| Docker | [Install Docker](https://docs.docker.com/get-docker/) |

### Required Access

- Google Cloud account with billing enabled
- Project with Cloud Run API enabled
- Permission to deploy to Cloud Run

### Verify Installation

```bash
gcloud --version
docker --version
```

## Google Cloud Setup

### Step 1: Create or Select Project

```bash
# Create new project
gcloud projects create my-project-id --name="My Project"

# Or select existing project
gcloud config set project my-project-id
```

### Step 2: Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com
```

### Step 3: Configure Docker for Artifact Registry

```bash
gcloud auth configure-docker gcr.io
```

## Docker

### Local Build and Test

Before deploying, test the Docker build locally:

```bash
# Build the image
docker build -t ai-collective .

# Run locally
docker run -p 8080:8080 ai-collective

# Test
curl http://localhost:8080
curl http://localhost:8080/health
```

### Docker Compose (Local Development)

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Dockerfile Breakdown

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Production
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/dist/ai-collective/browser /usr/share/nginx/html

# Cloud Run uses port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## Deploying to Cloud Run

### Method 1: Using Cloud Build (Recommended)

Cloud Build automatically builds and deploys in one step:

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-collective

# Deploy to Cloud Run
gcloud run deploy ai-collective \
  --image gcr.io/PROJECT_ID/ai-collective \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Method 2: Manual Docker Build

```bash
# Build locally
docker build -t gcr.io/PROJECT_ID/ai-collective .

# Push to Container Registry
docker push gcr.io/PROJECT_ID/ai-collective

# Deploy
gcloud run deploy ai-collective \
  --image gcr.io/PROJECT_ID/ai-collective \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080
```

### Deployment Options

| Option | Description | Recommended Value |
|--------|-------------|-------------------|
| `--region` | Deployment region | `us-west1` (closest to Hood River) |
| `--memory` | Memory allocation | `256Mi` (sufficient for nginx) |
| `--cpu` | CPU allocation | `1` |
| `--min-instances` | Minimum instances | `0` (scale to zero) |
| `--max-instances` | Maximum instances | `10` |
| `--port` | Container port | `8080` |
| `--allow-unauthenticated` | Public access | Required for website |

## Custom Domain Setup

### Option 1: Cloud Run Domain Mapping

```bash
# Verify domain ownership (one-time)
gcloud domains verify hoodriveraicollective.com

# Map domain to service
gcloud run domain-mappings create \
  --service ai-collective \
  --domain hoodriveraicollective.com \
  --region us-west1

# Also map www subdomain
gcloud run domain-mappings create \
  --service ai-collective \
  --domain www.hoodriveraicollective.com \
  --region us-west1
```

### Option 2: Using Cloudflare

1. Add site to Cloudflare
2. Update nameservers at registrar
3. Add DNS records:

```text
Type    Name    Content
CNAME   @       ai-collective-xxx.run.app
CNAME   www     ai-collective-xxx.run.app
```

4. Enable Cloudflare proxy for DDoS protection

### SSL/TLS Certificates

Cloud Run automatically provisions SSL certificates for:

- `*.run.app` domains (immediate)
- Custom domains (may take up to 24 hours)

## Continuous Deployment

### Using Cloud Build Triggers

1. Connect your GitHub repository to Cloud Build
2. Create a trigger:

```bash
gcloud builds triggers create github \
  --repo-name=AI_Collective \
  --repo-owner=ORDIGSEC \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

3. Create `cloudbuild.yaml`:

```yaml
steps:
  # Build the container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/ai-collective:$COMMIT_SHA', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/ai-collective:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'ai-collective'
      - '--image'
      - 'gcr.io/$PROJECT_ID/ai-collective:$COMMIT_SHA'
      - '--region'
      - 'us-west1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/ai-collective:$COMMIT_SHA'
```

### GitHub Actions Alternative

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker gcr.io

      - name: Build and Push
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/ai-collective:${{ github.sha }} .
          docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/ai-collective:${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ai-collective \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/ai-collective:${{ github.sha }} \
            --platform managed \
            --region us-west1 \
            --allow-unauthenticated
```

## Monitoring

### View Logs

```bash
# Stream logs
gcloud run services logs read ai-collective --region us-west1 --tail 100

# Or use Cloud Console
# https://console.cloud.google.com/run/detail/us-west1/ai-collective/logs
```

### View Metrics

Access metrics in Cloud Console:

- Request count
- Request latency
- Container instance count
- Memory utilization
- CPU utilization

### Health Checks

The nginx configuration includes a health endpoint:

```bash
curl https://hoodriveraicollective.com/health
# Returns: OK
```

## Rollback

### Rollback to Previous Revision

```bash
# List revisions
gcloud run revisions list --service ai-collective --region us-west1

# Route traffic to previous revision
gcloud run services update-traffic ai-collective \
  --region us-west1 \
  --to-revisions REVISION_NAME=100
```

## Cost Optimization

### Free Tier

Cloud Run offers a generous free tier:

- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

### Cost-Saving Tips

1. **Scale to zero**: Use `--min-instances 0`
2. **Right-size resources**: Start with `256Mi` memory
3. **Use caching**: Static assets have long cache headers
4. **Monitor usage**: Set up billing alerts

### Estimated Costs

For a low-traffic meetup website:

| Resource | Usage | Monthly Cost |
|----------|-------|--------------|
| Cloud Run | ~10,000 requests | Free |
| Container Registry | ~100 MB storage | Free |
| Cloud Build | ~10 builds | Free |
| **Total** | | **$0** |

## Troubleshooting

### Deployment Fails

```bash
# Check build logs
gcloud builds list --limit 5

# View specific build
gcloud builds log BUILD_ID
```

### Container Won't Start

1. Test locally first: `docker run -p 8080:8080 ai-collective`
2. Check nginx configuration syntax
3. Verify port 8080 is exposed

### 502 Bad Gateway

1. Check container logs for errors
2. Verify health check endpoint works
3. Increase memory if OOM errors

### Custom Domain Not Working

1. Verify DNS propagation: `dig hoodriveraicollective.com`
2. Check domain mapping status in Cloud Console
3. Wait up to 24 hours for SSL certificate provisioning

### Slow Cold Starts

1. Increase `--min-instances` to 1 for faster response
2. Optimize Docker image size
3. Use alpine-based images (already configured)
