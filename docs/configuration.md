# Configuration Guide

## Environment Files

```text
src/environments/
├── environment.ts        # Development
└── environment.prod.ts   # Production
```

### Structure

```typescript
export const environment = {
  production: boolean,      // true for production
  googleApiKey: string,     // Google Calendar API key
  calendarId: string        // Google Calendar ID
};
```

## Google Calendar Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Note your project ID

### 2. Enable Calendar API

1. Navigate to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### 3. Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the key

### 4. Restrict API Key (Recommended)

1. Click on your API key
2. Under **API restrictions**, select **Restrict key**
3. Choose **Google Calendar API** only

### 5. Get Calendar ID

1. Open [Google Calendar](https://calendar.google.com/)
2. Go to calendar settings
3. Find **Integrate calendar**
4. Copy the **Calendar ID**

### 6. Make Calendar Public

1. In calendar settings, go to **Access permissions**
2. Check **Make available to public**

## Example Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  googleApiKey: 'AIzaSyB1234567890abcdefghijklmnop',
  calendarId: 'hoodriverai@group.calendar.google.com'
};
```

## Mock Data Mode

When API credentials are not configured, the app uses mock data automatically.

**Trigger conditions:**

- `googleApiKey === 'YOUR_API_KEY'`
- `calendarId === 'YOUR_CALENDAR_ID_HERE'`

## nginx Configuration

Key settings in `nginx.conf`:

```nginx
server {
    listen 8080;
    root /usr/share/nginx/html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        return 200 "OK";
    }
}
```

## Docker Configuration

### Build

```dockerfile
FROM node:20-alpine AS build
# Build Angular app

FROM nginx:alpine
# Serve with nginx on port 8080
```

### Run

```bash
docker build -t ai-collective .
docker run -p 8080:8080 ai-collective
```

## Troubleshooting

### API Key Not Working

1. Verify key is correct
2. Check Calendar API is enabled
3. Verify API key restrictions

### Calendar Not Loading

1. Verify calendar ID
2. Ensure calendar is public
3. Check browser console for errors

### Mock Data Showing

1. Update `environment.ts` with real credentials
2. Verify values are not placeholder strings
