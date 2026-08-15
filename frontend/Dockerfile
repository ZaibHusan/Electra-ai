# Stage 1: Build the Vite (React) app
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the project
COPY . .
RUN npm run build


# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built assets from the builder stage to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a custom Nginx configuration to handle React Router (Single Page App)
# This ensures refreshing the page on /login doesn't throw a 404 error
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]