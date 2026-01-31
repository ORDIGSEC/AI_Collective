# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build -- --configuration=production

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist/ai-collective/browser /usr/share/nginx/html

# Cloud Run uses port 8080
EXPOSE 8080

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
