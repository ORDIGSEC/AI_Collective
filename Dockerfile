# Build stage
FROM node:20-alpine AS build

# Set build arguments
ARG NODE_ENV=production
ARG BUILD_DATE
ARG VCS_REF

# Add labels for metadata
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.authors="Hood River AI Collective" \
      org.opencontainers.image.source="https://github.com/ORDIGSEC/hrmeetup-website" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.title="Hood River AI Collective Website" \
      org.opencontainers.image.description="Monthly AI Meetup in Hood River, Oregon"

WORKDIR /app

# Copy package files for better layer caching
# This layer will only rebuild when package files change
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit --no-fund --loglevel=error || npm install

# Copy source code
# This layer rebuilds when source changes
COPY . .

# Build the Angular app with production configuration
RUN npm run build:prod

# Verify build output exists
RUN test -d dist/ai-collective/browser || (echo "Build failed: dist directory not found" && exit 1)

# Production stage
FROM nginx:alpine

# Set labels
ARG BUILD_DATE
ARG VCS_REF
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}"

# Create nginx user for better security (nginx alpine already has this)
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage with proper permissions
COPY --from=build --chown=nginx:nginx /app/dist/ai-collective/browser /usr/share/nginx/html

# Verify the files were copied
RUN test -f /usr/share/nginx/html/index.html || (echo "Deployment failed: index.html not found" && exit 1)

# Create directories for nginx to write to (since we don't run as root)
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /var/cache/nginx /var/log/nginx

# Expose port 8080 (Cloud Run and Cloudflare Tunnel compatible)
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
