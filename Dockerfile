# syntax=docker/dockerfile:1
# Builder stage
FROM node:20-bookworm AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --no-audit || npm install --legacy-peer-deps --no-audit
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
