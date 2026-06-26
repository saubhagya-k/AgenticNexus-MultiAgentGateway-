# frontend/Dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Nginx (or use `serve`)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# We'll rely on the main Nginx for routing, so this just serves static files.
# But this container will be on its own network, so the main Nginx will proxy_pass to this container.
EXPOSE 80