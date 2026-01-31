# Configuration Guide

## Environment Files

The application uses environment files to manage configuration across different deployments.

### File Locations

```text
src/environments/
├── environment.ts        # Development configuration
└── environment.prod.ts   # Production configuration
```

### Environment Structure

```typescript
export const environment = {
  production: boolean,      // true for production builds
  googleApiKey: string,     // Google Calendar API key
  calendarId: string        // Google Calendar ID
};
```

## Google Calendar Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Note your project ID

### Step 2: Enable the Calendar API

1. Navigate to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### Step 3: Create an API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated key

### Step 4: Restrict the API Key (Recommended)

1. Click on your API key to edit
2. Under **API restrictions**, select **Restrict key**
3. Choose **Google Calendar API** only
4. Under **Application restrictions**, optionally add:
   - HTTP referrers for production domain
   - IP addresses for server-side use

### Step 5: Get Your Calendar ID

1. Open [Google Calendar](https://calendar.google.com/)
2. Click the gear icon > **Settings**
3. Select your calendar from the left sidebar
4. Scroll to **Integrate calendar**
5. Copy the **Calendar ID** (format: `xxx@group.calendar.google.com`)

### Step 6: Make Calendar Public

1. In Calendar settings, go to **Access permissions**
2. Check **Make available to public**
3. Choose **See all event details**

## Configuration Examples

### Development Environment

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  googleApiKey: 'AIzaSyB1234567890abcdefghijklmnop',
  calendarId: 'hoodriverai@group.calendar.google.com'
};
```

### Production Environment

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  googleApiKey: 'AIzaSyB1234567890abcdefghijklmnop',
  calendarId: 'hoodriverai@group.calendar.google.com'
};
```

## Mock Data Mode

When the API key or calendar ID are not configured (left as placeholder values), the application automatically uses mock data for testing.

### Trigger Conditions

Mock data is used when:

```typescript
googleApiKey === 'YOUR_API_KEY'
// OR
calendarId === 'YOUR_CALENDAR_ID_HERE'
```

### Mock Events

The mock data includes 8 sample events following the 3rd Thursday pattern:

| Month | Topic |
|-------|-------|
| January | Introduction to Large Language Models |
| February | Hands-On: Building with Claude Code |
| March | Prompt Engineering Deep Dive |
| April | RAG Systems: Connecting AI to Your Data |
| May | AI Ethics & Responsible Development |
| June | Community Showcase: Member Projects |
| July | AI for Local Business: Practical Applications |
| August | Fine-Tuning & Custom Models |

## Build Configuration

### Angular Build Configurations

Defined in `angular.json`:

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "outputHashing": "all",
      "optimization": true
    },
    "development": {
      "optimization": false,
      "sourceMap": true
    }
  }
}
```

### Building for Production

```bash
npm run build:prod
```

This will:

1. Use `environment.prod.ts` configuration
2. Enable optimization and minification
3. Add content hashing to filenames
4. Output to `dist/ai-collective/browser/`

## nginx Configuration

The `nginx.conf` file controls the web server behavior:

### Key Settings

```nginx
server {
    listen 8080;                    # Cloud Run requires port 8080
    root /usr/share/nginx/html;     # Static file location
    index index.html;

    # SPA routing - fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        return 200 "OK";
    }
}
```

### Security Headers

```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "...";
```

### Gzip Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Docker Configuration

### Dockerfile Overview

```dockerfile
# Build stage - compile Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Production stage - serve with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ai-collective/browser /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### Building the Image

```bash
docker build -t ai-collective .
```

### Running Locally

```bash
docker run -p 8080:8080 ai-collective
```

## Troubleshooting

### API Key Not Working

1. Verify the API key is correct
2. Check that Calendar API is enabled
3. Verify API key restrictions allow your domain
4. Check browser console for CORS errors

### Calendar Not Loading

1. Verify calendar ID is correct
2. Ensure calendar is set to public
3. Check that events exist in the calendar
4. Verify date/time settings

### Mock Data Showing Instead of Real Data

1. Check `environment.ts` has real API key
2. Ensure calendar ID is not placeholder value
3. Check browser network tab for API errors
4. Verify API key has correct permissions

### CORS Errors

Google Calendar API supports CORS by default. If you see CORS errors:

1. Verify you're using the correct API endpoint
2. Check that API key is valid
3. Ensure you're using HTTPS in production
