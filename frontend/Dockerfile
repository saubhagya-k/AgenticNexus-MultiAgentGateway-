FROM node:18 AS build
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Remove lockfile and node_modules (to avoid stale deps)
RUN rm -rf node_modules package-lock.json

# Install dependencies with verbose logging and rebuild native modules
RUN npm install --foreground-scripts

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80