# Stage 1: Base & Dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Development (Digunakan oleh docker-compose untuk local)
FROM base AS development
EXPOSE 5174
CMD ["npm", "run", "dev"]

# Stage 3: Build (Proses kompilasi file statis)
FROM base AS build-stage
RUN npm run build

# Stage 4: Production (Siap untuk Google Cloud Run)
FROM nginx:stable-alpine AS production
ENV API_UPSTREAM_URL=http://127.0.0.1:65535
ENV CHAT_RUN_ID=disabled
ENV CHAT_API_KEY=disabled
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
